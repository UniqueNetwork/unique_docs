<!--
DEV PANEL: Set DEVMODE = true (line 73) to enable development controls.

DEPENDENCIES:
- D3.js (force simulation)
- Vue 3 Composition API

STRUCTURE:
- User Panel: Topic toggles, node visibility, opacity control
- Dev Panel: Physics parameters, debug tools (hidden in production)
- Arena: Canvas-based force-directed graph
- Note Panel: Usage instructions

KEY FEATURES:
- Dynamic node sizing based on click count
- Topic-based clustering with color coding
- SHIFT + hover: Highlight and enlarge closest node
- Click + drag: Move nodes
- Click: Navigate to URL, increment clicks
- Auto-adjusts max radius to maintain ~50% canvas coverage

CONFIGURATION:
- DEVMODE (line 73): Toggle dev panel visibility
- topicList (line 76): Define topics with colors
- defaultQueriesData (line 84): Default dataset
- Physics constants (lines 168-172): MIN_RADIUS, TARGET_COVERAGE, etc.

DATASET FORMAT:
Each node requires:
- text: Display label
- about: Short Description used in the tooltip
- url: Navigation target
- affinityList: Object mapping topics to values
- clicks: Integer for node sizing

Topic affinity rules:
- Max 2 topics per node
- One value must be 1.0 (primary topic)
- Secondary value range: 0.1-0.9
- Topics must exist in topicList

Topic limit: 10 topics maximum (arbitrary, set by D3 color scheme)

CSV IMPORT FORMAT:
text, about, url, topic1, value1, topic2, value2

Example:
Nesting, https://docs.example.com/nesting, Nesting, 1
Contracts, https://docs.example.com/contracts, EVM, 1, Metadata, 0.2

PERFORMANCE:
- Coverage check every 100 frames
- Adaptive MAX_RADIUS based on node density
- Conditional rendering based on topic visibility
-->
<template>
  <div class="bubble-arena-container">
    <!-- User Panel - Only visible when DEVMODE is true -->
    <div v-if="DEVMODE" class="user-panel" :class="{ collapsed: userPanelCollapsed }">
      <div class="panel-header" @click="userPanelCollapsed = !userPanelCollapsed">
        <span class="panel-title">User Controls</span>
        <span class="collapse-icon">{{ userPanelCollapsed ? "▼" : "▲" }}</span>
      </div>

      <div class="panel-content" v-show="!userPanelCollapsed">
        <!-- Topic Toggles Grid - First Block -->
        <div class="topic-toggles-grid">
          <div v-for="(topicData, topicName) in topicList" :key="topicName" class="topic-checkbox-item">
            <input type="checkbox" v-model="topicVisibility[topicName]" :id="`topic-${topicName}`"
              :disabled="!topicHasNodes[topicName]" class="topic-checkbox" :style="{
                accentColor: topicData.color,
              }" />
            <label :for="`topic-${topicName}`">
              {{ topicData.topicDescription }}
            </label>
          </div>
        </div>

        <!-- Nodes Visible and Opacity Controls - Second Block -->
        <div class="visibility-controls">
          <div class="checkbox-group-extended">
            <input type="checkbox" v-model="nodesVisible" id="nodes-visible" />
            <label for="nodes-visible">Nodes Visible</label>

            <div class="opacity-slider-inline" :class="{ disabled: !nodesVisible }">
              <label>Opacity: {{ nodeTransparency.toFixed(2) }}</label>
              <input type="range" v-model.number="nodeTransparency" min="0" max="1" step="0.05"
                :disabled="!nodesVisible" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dev Panel - Only visible when DEVMODE is true -->
    <div v-if="DEVMODE" class="dev-panel" :class="{ collapsed: devPanelCollapsed }">
      <div class="panel-header" @click="devPanelCollapsed = !devPanelCollapsed">
        <span class="panel-title">Development Controls</span>
        <span class="collapse-icon">{{ devPanelCollapsed ? "▼" : "▲" }}</span>
      </div>
      <div class="panel-content" v-show="!devPanelCollapsed">
        <button @click="addBubble" class="control-btn">Add Bubble</button>
        <button @click="clearBubbles" class="control-btn">Clear All</button>
        <button @click="loadDefaultQueries" class="control-btn">
          Load Default
        </button>
        <button @click="debugInfo" class="control-btn">Debug Info</button>
        <div class="slider-group">
          <label>Central Gravity: {{ gravity.toFixed(2) }}</label>
          <input type="range" v-model.number="gravity" min="0" max="2" step="0.1" />
        </div>
        <div class="slider-group">
          <label>Collision Strength: {{ collisionStrength.toFixed(2) }}</label>
          <input type="range" v-model.number="collisionStrength" min="0" max="2" step="0.1" />
        </div>
        <div class="slider-group">
          <label>Topic Attraction: {{ topicAttractionStrength.toFixed(2) }}</label>
          <input type="range" v-model.number="topicAttractionStrength" min="0" max="50" step="0.5" />
        </div>
        <div class="slider-group">
          <label>Font Size Ratio: {{ fontSizeRatio.toFixed(2) }}</label>
          <input type="range" v-model.number="fontSizeRatio" min="0.3" max="2.0" step="0.1" />
        </div>
        <div class="slider-group">
          <label>Central Attractor (small nodes):
            {{ centralAttractorStrength.toFixed(2) }}</label>
          <input type="range" v-model.number="centralAttractorStrength" min="0" max="2000" step="0.1" />
        </div>
        <div class="checkbox-group">
          <input type="checkbox" v-model="centralAttractorEnabled" id="central-attractor" />
          <label for="central-attractor">Enable Central Attractor</label>
        </div>
        <div class="slider-group">
          <label>Mouse Repel Strength: {{ mouseRepelStrength.toFixed(1) }}</label>
          <input type="range" v-model.number="mouseRepelStrength" min="0" max="1000" step="5" />
        </div>
        <div class="slider-group">
          <label>Mouse Repel Radius: {{ mouseRepelRadius.toFixed(0) }}</label>
          <input type="range" v-model.number="mouseRepelRadius" min="50" max="500" step="10" />
        </div>
        <div class="checkbox-group">
          <label>
            <input type="checkbox" v-model="showGlow" />
            Show Glow
          </label>
        </div>
        <div class="checkbox-group">
          <label>
            <input type="checkbox" v-model="lightMode" />
            Light Mode
          </label>
        </div>
        <div class="info-text">
          Queries: {{ queries.length }} | Nodes: {{ nodeCount }} | D3:
          {{ d3Loaded ? "✓" : "✗" }} | Coverage: {{ coverageRatio.toFixed(2) }}%
          | Max Radius: {{ currentMaxRadius.toFixed(1) }} | Transparency:
          {{ nodeTransparency.toFixed(2) }} | Shift:
          {{ shiftPressed ? "✓" : "✗" }}
        </div>
      </div>
    </div>

    <!-- Arena Canvas -->
    <div class="section-arena" ref="arenaContainer" :class="{ 'light-mode': lightMode }">
      <canvas ref="canvas"></canvas>
      <!-- Add this tooltip -->
      <div v-if="tooltipVisible" class="tooltip" :style="{
        left: tooltipX + 'px',
        top: tooltipY + 'px'
      }">
        {{ tooltipText }}
      </div>
      <div v-if="!d3Loaded" class="loading-message">
        Loading D3.js... Please make sure D3 is included in your project.
      </div>
    </div>

    <!-- Note Panel - Only visible when DEVMODE is true -->
    <div v-if="DEVMODE" class="note-panel">
      <div class="note-content">
        <strong>Usage:</strong><br />
        Clicking on the node will redirect you to the relevant docs page. You
        can click and drag nodes to move elements in the arena. Holding SHIFT
        highlights a node directly under the cursor. Useful for picking out a
        node in a crowded cluster. Use the topic toggles to de-populate the
        arena of topics. Have fun.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { recordClick, getClicks } from "../utils/firebase";

// ============================================
// DEVMODE - Set to false for production
// ============================================
const DEVMODE = false; // Change to true to show dev panel

// D3 schemeCategory10 color palette
const colorScheme = [
  "#1f77b4", // Blue
  "#ff7f0e", // Orange
  "#2ca02c", // Green
  "#d62728", // Red
  "#9467bd", // Purple
  "#8c564b", // Brown
  "#e377c2", // Pink
  "#7f7f7f", // Gray
  "#bcbd22", // Yellow-green
  "#17becf", // Cyan
];

// Topic list with assigned colors and descriptions
const topicList = {
  AdvancedNFT: {
    color: colorScheme[0],
    topicDescription: "Advanced NFT Features",
  },
  Tools: { color: colorScheme[1], topicDescription: "Dev Tools" },
  Metadata: { color: colorScheme[2], topicDescription: "Metadata" },
  EVM: { color: colorScheme[3], topicDescription: "EVM & Contracts" },
};

// Panel collapse states
const userPanelCollapsed = ref(true); // Start collapsed for clean UI
const devPanelCollapsed = ref(true);

// Refs with initial values
const canvas = ref(null);
const arenaContainer = ref(null);
const gravity = ref(1.2);
const collisionStrength = ref(0.8);
const topicAttractionStrength = ref(19.5);
const fontSizeRatio = ref(0.3); // Smaller font for larger bubbles
const mouseRepelStrength = ref(1000.0);
const mouseRepelRadius = ref(150);
const nodesVisible = ref(true);
const showGlow = ref(false);
const lightMode = ref(false);
const d3Loaded = ref(false);
const nodeCount = ref(0);
const centralAttractorEnabled = ref(true);
const centralAttractorStrength = ref(1000);
const coverageRatio = ref(0);
const currentMaxRadius = ref(80);
const nodeTransparency = ref(0.2);
const shiftPressed = ref(false);

// Topic visibility toggles
const topicVisibility = ref({
  AdvancedNFT: true,
  Tools: true,
  Metadata: true,
  EVM: true,
});

// Track which topics have nodes
const topicHasNodes = ref({
  AdvancedNFT: false,
  Tools: false,
  Metadata: false,
  EVM: false,
});

const hideCircles = computed(() => !nodesVisible.value);

// State
let ctx = null;
let animationId = null;
let simulation = null;
let nodes = [];
let queries = ref([]);
let canvasWidth = 800;
let canvasHeight = 600;
let colorIndex = 0;
let d3 = null;
let mouseX = null;
let mouseY = null;
let lockedNode = null;
let lockedNodeOriginalRadius = null;
let hoveredNode = null;

// Size calculation constants
const MIN_RADIUS = 40; // Larger default bubble size
const MIN_CLICKS_THRESHOLD = 0; // Every click counts!
const TARGET_COVERAGE = 50;
const COVERAGE_CHECK_INTERVAL = 100;
let frameCounter = 0;
let MAX_RADIUS = 120; // Larger maximum bubble size

//Tooltip
const tooltipVisible = ref(false);
const tooltipText = ref("");
const tooltipX = ref(0);
const tooltipY = ref(0);

// Query class
class Query {
  constructor(text, about, url, affinityList = {}, clicks = 0) {
    this.text = text;
    this.about = about;
    this.url = url;
    this.clicks = clicks;
    this.affinityList = affinityList;
  }
}

// ============================================
// CLICK STATE PERSISTENCE
// ============================================

// Save click state to localStorage (fallback)
const saveClickStateLocal = () => {
  const clickState = {};
  queries.value.forEach((q) => {
    clickState[q.text] = q.clicks;
  });
  localStorage.setItem("bubbleArenaClicks", JSON.stringify(clickState));
  console.log("✓ Click state saved to localStorage");
};

// Restore click state from localStorage (fallback)
const restoreClickStateLocal = () => {
  const saved = localStorage.getItem("bubbleArenaClicks");
  if (!saved) {
    console.log("No saved click state found in localStorage");
    return false;
  }

  try {
    const clickState = JSON.parse(saved);
    let restoredCount = 0;

    queries.value.forEach((q) => {
      if (clickState[q.text] !== undefined) {
        q.clicks = clickState[q.text];
        restoredCount++;
      }
    });

    console.log(`✓ Restored click state from localStorage for ${restoredCount} nodes`);
    return true;
  } catch (error) {
    console.error("Error restoring click state from localStorage:", error);
    return false;
  }
};

// Load click state from Firebase (primary) with localStorage fallback
const restoreClickState = async () => {
  try {
    console.log("Loading clicks from Firebase...");
    const firebaseClicks = await getClicks();

    if (Object.keys(firebaseClicks).length > 0) {
      let restoredCount = 0;
      queries.value.forEach((q) => {
        if (firebaseClicks[q.text] !== undefined) {
          q.clicks = firebaseClicks[q.text];
          restoredCount++;
        }
      });
      console.log(`✓ Restored click state from Firebase for ${restoredCount} nodes`);

      // Also save to localStorage for offline fallback
      saveClickStateLocal();
      return;
    }
  } catch (error) {
    console.error("Failed to load clicks from Firebase, falling back to localStorage:", error);
  }

  // Fallback to localStorage if Firebase fails
  restoreClickStateLocal();
};

// Watch queries for changes and save to localStorage only
// Firebase saves happen on individual click events
watch(
  queries,
  () => {
    saveClickStateLocal();
  },
  { deep: true }
);

// ============================================
// CSV LOADING
// ============================================

// Load queries from CSV file
const loadFromCSV = async () => {
  try {
    console.log("Loading queries from data/queries.csv...");
    const response = await fetch("/data/queries.csv");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    const newQueries = [];
    lines.forEach((line, index) => {
      const query = parseCSVLine(line);
      if (query) {
        newQueries.push(query);
      } else {
        console.error(`Failed to parse line ${index + 1}:`, line);
      }
    });

    if (newQueries.length > 0) {
      queries.value = newQueries;
      console.log("✓ Loaded", newQueries.length, "queries from CSV");

      // Restore click state after loading CSV (from Firebase or localStorage)
      await restoreClickState();

      updateTopicAvailability();
      regenerateNodes();
    } else {
      throw new Error("No valid queries found in CSV file");
    }
  } catch (error) {
    console.error("Error loading CSV file:", error);
    alert(
      `Failed to load queries.csv: ${error.message}\nLoading default queries instead.`
    );
    loadDefaultQueries();
  }
};

const updateCanvasDimensions = () => {
  if (!canvas.value || !arenaContainer.value) return;

  // Use the dynamic container height
  canvasWidth = arenaContainer.value.clientWidth;
  canvasHeight = 600; // Use computed height

  canvas.value.width = canvasWidth;
  canvas.value.height = canvasHeight;

  // Update simulation center
  if (simulation) {
    simulation.force("x", d3.forceX(canvasWidth / 2).strength(0.05));
    simulation.force("y", d3.forceY(canvasHeight / 2).strength(0.05));
    simulation.alpha(0.3).restart();
  }
};

// Parse CSV line
const parseCSVLine = (line) => {
  const parts = line.split(",").map((part) => part.trim());

  if (parts.length < 2) {
    console.error("Invalid CSV line format:", line);
    return null;
  }

  const text = parts[0];
  const about = parts[1];
  const url = parts[2];
  const affinityList = {};

  // Parse key-value pairs
  for (let i = 3; i < parts.length; i += 2) {
    if (i + 1 < parts.length) {
      const key = parts[i];
      const value = parseFloat(parts[i + 1]);

      if (!topicList.hasOwnProperty(key)) {
        console.warn(`Key "${key}" not found in topicList, skipping`);
        continue;
      }

      if (value < 0.1 || value > 1) {
        console.warn(`Value ${value} out of range [0.1, 1], skipping`);
        continue;
      }

      affinityList[key] = value;
    }
  }

  // Ensure at least one value is 1
  const values = Object.values(affinityList);
  if (values.length > 0 && !values.includes(1)) {
    const firstKey = Object.keys(affinityList)[0];
    affinityList[firstKey] = 1;
    console.log(
      `Assigned value 1 to first key "${firstKey}" for query "${text}"`
    );
  }

  // Check max 2 elements
  if (Object.keys(affinityList).length > 2) {
    console.warn(
      `More than 2 affinity pairs found for "${text}", keeping first 2`
    );
    const entries = Object.entries(affinityList).slice(0, 2);
    const limitedList = Object.fromEntries(entries);
    return new Query(text, about, url, limitedList, 0);
  }

  return new Query(text, about, url, affinityList, 0);
};

// Load default queries (fallback)
const loadDefaultQueries = async () => {
  const defaultQueriesData = [
    {
      text: "AdvancedNFT",
      url: "#",
      affinityList: { AdvancedNFT: 1 },
      clicks: 150,
    },
    {
      text: "NFT properties",
      url: "#",
      affinityList: { Metadata: 1 },
      clicks: 320,
    },
    {
      text: "Contracts",
      url: "#",
      affinityList: { EVM: 1, Metadata: 0.2 },
      clicks: 890,
    },
    {
      text: "Development Setup",
      url: "#",
      affinityList: { Tools: 1 },
      clicks: 45,
    },
    { text: "Audio", url: "#", affinityList: { Metadata: 1 }, clicks: 210 },
    {
      text: "Addressing objects",
      url: "#",
      affinityList: { EVM: 1 },
      clicks: 560,
    },
    { text: "Events", url: "#", affinityList: { Tools: 1 }, clicks: 78 },
    {
      text: "Attributes",
      url: "#",
      affinityList: { Metadata: 1 },
      clicks: 425,
    },
    {
      text: "Digital assets",
      url: "#",
      affinityList: { Metadata: 1 },
      clicks: 190,
    },
  ];

  queries.value = defaultQueriesData.map(
    (q) => new Query(q.text, q.url, q.affinityList, q.clicks)
  );
  console.log("✓ Loaded default queries:", queries.value.length);

  // Restore click state from Firebase/localStorage
  await restoreClickState();

  updateTopicAvailability();
  regenerateNodes();
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function updateTopicAvailability() {
  const availability = {
    AdvancedNFT: false,
    Tools: false,
    Metadata: false,
    EVM: false,
  };

  queries.value.forEach((query) => {
    if (query.affinityList) {
      Object.keys(query.affinityList).forEach((topic) => {
        if (availability.hasOwnProperty(topic)) {
          availability[topic] = true;
        }
      });
    }
  });

  topicHasNodes.value = availability;
  console.log("Topic availability updated:", topicHasNodes.value);
}

const hexToRgba = (hex, opacity) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const getTextColor = (topicColor) => {
  if (hideCircles.value) {
    return hexToRgba(topicColor, 0.8);
  } else {
    return lightMode.value ? "#000000" : "#ffffff";
  }
};

const findClosestNode = () => {
  if (mouseX === null || mouseY === null || nodes.length === 0) {
    return null;
  }

  let closestNode = null;
  let minDistance = Infinity;

  nodes.forEach((node) => {
    const dx = node.x - mouseX;
    const dy = node.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < minDistance) {
      minDistance = distance;
      closestNode = node;
    }
  });

  return closestNode;
};

const calculateCoverageRatio = () => {
  if (nodes.length === 0 || canvasWidth === 0 || canvasHeight === 0) {
    return 0;
  }

  const arenaArea = canvasWidth * canvasHeight;
  const nodesArea = nodes.reduce((sum, node) => {
    return sum + Math.PI * node.radius * node.radius;
  }, 0);

  return (nodesArea / arenaArea) * 100;
};

const adjustMaxRadius = () => {
  const coverage = calculateCoverageRatio();

  if (coverage > TARGET_COVERAGE) {
    const reductionFactor = TARGET_COVERAGE / coverage;
    MAX_RADIUS = Math.max(MIN_RADIUS, MAX_RADIUS * reductionFactor * 0.95);
    currentMaxRadius.value = MAX_RADIUS;

    nodes.forEach((node) => {
      if (lockedNode && node.id === lockedNode.id) {
        return;
      }
      node.radius = calculateRadius(node.query.clicks);
    });

    if (simulation) {
      simulation.force(
        "collision",
        d3
          .forceCollide()
          .radius((d) => d.radius + 5)
          .strength(collisionStrength.value)
      );
      simulation.alpha(0.3).restart();
    }

    console.log(
      `Coverage ${coverage.toFixed(
        2
      )}% > ${TARGET_COVERAGE}%, reduced MAX_RADIUS to ${MAX_RADIUS.toFixed(1)}`
    );
    return true;
  } else if (
    coverage < TARGET_COVERAGE * 0.8 &&
    MAX_RADIUS < canvasWidth * 0.15
  ) {
    const initialMaxRadius = canvasWidth * 0.15;
    MAX_RADIUS = Math.min(initialMaxRadius, MAX_RADIUS * 1.02);
    currentMaxRadius.value = MAX_RADIUS;

    nodes.forEach((node) => {
      if (lockedNode && node.id === lockedNode.id) {
        return;
      }
      node.radius = calculateRadius(node.query.clicks);
    });

    if (simulation) {
      simulation.force(
        "collision",
        d3
          .forceCollide()
          .radius((d) => d.radius + 5)
          .strength(collisionStrength.value)
      );
      simulation.alpha(0.3).restart();
    }

    console.log(
      `Coverage ${coverage.toFixed(2)}% < ${TARGET_COVERAGE * 0.8
      }%, increased MAX_RADIUS to ${MAX_RADIUS.toFixed(1)}`
    );
    return true;
  }

  return false;
};

const calculateRadius = (clicks) => {
  if (clicks <= MIN_CLICKS_THRESHOLD) {
    return MIN_RADIUS;
  }

  const maxClicks = Math.max(...queries.value.map((q) => q.clicks), 1);
  const normalizedClicks =
    (clicks - MIN_CLICKS_THRESHOLD) / (maxClicks - MIN_CLICKS_THRESHOLD);
  const radius = MIN_RADIUS + normalizedClicks * (MAX_RADIUS - MIN_RADIUS);

  return Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, radius));
};

const getPrimaryTopic = (affinityList) => {
  if (!affinityList || Object.keys(affinityList).length === 0) {
    return null;
  }

  const primaryKey = Object.keys(affinityList).find(
    (key) => affinityList[key] === 1
  );

  return primaryKey || Object.keys(affinityList)[0];
};

const findTopicAttractors = () => {
  const attractors = {};

  nodes.forEach((node) => {
    const topic = getPrimaryTopic(node.query.affinityList);
    if (!topic) return;

    if (
      !attractors[topic] ||
      node.query.clicks > attractors[topic].query.clicks
    ) {
      attractors[topic] = node;
    }
  });

  return attractors;
};

const getBubbleColor = (affinityList) => {
  if (!affinityList || Object.keys(affinityList).length === 0) {
    return colorScheme[0];
  }

  const primaryKey = Object.keys(affinityList).find(
    (key) => affinityList[key] === 1
  );

  if (primaryKey && topicList[primaryKey]) {
    return topicList[primaryKey].color;
  }

  const firstKey = Object.keys(affinityList)[0];
  return topicList[firstKey].color || colorScheme[0];
};

// ============================================
// D3 FORCE FUNCTIONS
// ============================================

const centralGravityForce = () => {
  return () => {
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    nodes.forEach((node) => {
      if (lockedNode && node.id === lockedNode.id) {
        return;
      }

      const dx = centerX - node.x;
      const dy = centerY - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const strength = gravity.value * 0.01;
        node.vx += dx * strength;
        node.vy += dy * strength;

        if (
          centralAttractorEnabled.value &&
          centralAttractorStrength.value > 0
        ) {
          const avgRadius =
            nodes.reduce((sum, n) => sum + n.radius, 0) / nodes.length;

          if (node.radius < avgRadius) {
            const sizeRatio = node.radius / avgRadius;
            const attractorStrength =
              centralAttractorStrength.value * (1 - sizeRatio) * 0.02;

            const forceX =
              (dx / distance) * attractorStrength * distance * 0.01;
            const forceY =
              (dy / distance) * attractorStrength * distance * 0.01;

            node.vx += forceX;
            node.vy += forceY;
          }
        }
      }
    });
  };
};

const topicAttractionForce = () => {
  return () => {
    const attractors = findTopicAttractors();

    nodes.forEach((node) => {
      if (lockedNode && node.id === lockedNode.id) {
        return;
      }

      const topic = getPrimaryTopic(node.query.affinityList);
      if (!topic) return;

      const attractor = attractors[topic];
      if (!attractor || attractor.id === node.id) {
        node.isAttractor = attractor && attractor.id === node.id;
        return;
      }

      node.isAttractor = false;

      const dx = attractor.x - node.x;
      const dy = attractor.y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const strength = (topicAttractionStrength.value * distance) / 1000;
        node.vx += (dx / distance) * strength;
        node.vy += (dy / distance) * strength;
      }
    });
  };
};

const mouseRepelForce = () => {
  return () => {
    if (
      !shiftPressed.value ||
      mouseX === null ||
      mouseY === null ||
      mouseRepelStrength.value === 0
    ) {
      return;
    }

    if (!lockedNode) {
      lockedNode = findClosestNode();
      if (lockedNode) {
        lockedNodeOriginalRadius = lockedNode.radius;
        lockedNode.radius = 100;
        lockedNode.fx = lockedNode.x;
        lockedNode.fy = lockedNode.y;
        console.log(
          `Locked node: ${lockedNode.label
          }, original radius: ${lockedNodeOriginalRadius.toFixed(
            1
          )}, new radius: 100`
        );
      }
    }

    nodes.forEach((node) => {
      if (lockedNode && node.id === lockedNode.id) {
        return;
      }

      const dx = node.x - mouseX;
      const dy = node.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseRepelRadius.value && distance > 0) {
        const normalizedDistance = distance / mouseRepelRadius.value;
        const falloff = 1 - normalizedDistance * normalizedDistance;
        const strength = mouseRepelStrength.value * falloff * 0.01;

        node.vx += (dx / distance) * strength;
        node.vy += (dy / distance) * strength;
      }
    });
  };
};

// ============================================
// NODE MANAGEMENT
// ============================================

const regenerateNodes = () => {
  console.log("Regenerating nodes from", queries.value.length, "queries");
  nodes.length = 0;
  lockedNode = null;
  lockedNodeOriginalRadius = null;

  queries.value.forEach((query, index) => {
    const radius = calculateRadius(query.clicks);
    const color = getBubbleColor(query.affinityList);
    const newNode = {
      id: Date.now() + index,
      x: canvasWidth / 2 + (Math.random() - 0.5) * 400,
      y: canvasHeight / 2 + (Math.random() - 0.5) * 400,
      vx: (Math.random() - 0.5) * 2,
      vy: 0,
      radius: radius,
      color: color,
      label: query.text,
      query: query,
      isAttractor: false,
    };
    nodes.push(newNode);
    console.log(
      `Created node ${index}:`,
      newNode.label,
      `${query.clicks} clicks, radius ${radius.toFixed(1)}`
    );
  });

  nodeCount.value = nodes.length;
  coverageRatio.value = calculateCoverageRatio();
  console.log("✓ Regenerated", nodes.length, "nodes");

  if (simulation) {
    simulation.nodes(nodes);
    simulation.alpha(1).restart();
    console.log("✓ Simulation restarted");
  } else {
    console.warn("⚠ Simulation not initialized yet");
  }
};

const updateNodeSizes = () => {
  nodes.forEach((node) => {
    if (lockedNode && node.id === lockedNode.id) {
      return;
    }
    node.radius = calculateRadius(node.query.clicks);
  });

  coverageRatio.value = calculateCoverageRatio();

  if (simulation) {
    simulation.force(
      "collision",
      d3
        .forceCollide()
        .radius((d) => d.radius + 5)
        .strength(collisionStrength.value)
    );
    simulation.alpha(0.3).restart();
  }
};

// ============================================
// RENDERING
// ============================================

const render = () => {
  if (!ctx) {
    console.warn("No canvas context");
    return;
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Update tooltip if shift is pressed
  if (shiftPressed.value && lockedNode && lockedNode.query) {
    tooltipVisible.value = true;
    tooltipText.value = lockedNode.query.about || "Not much to add here ¯\_(ツ)_/¯";
    tooltipX.value = lockedNode.x;
    tooltipY.value = lockedNode.y - lockedNode.radius - 20;
  } else {
    tooltipVisible.value = false;
  }

  nodes.forEach((node) => {
    let nodeVisible = false;
    if (node.query && node.query.affinityList) {
      const primaryTopic = getPrimaryTopic(node.query.affinityList);
      if (primaryTopic && topicVisibility.value[primaryTopic] === true) {
        nodeVisible = true;
      }
    } else {
      nodeVisible = true;
    }

    if (!nodeVisible) {
      return;
    }

    if (!lockedNode || node.id !== lockedNode.id) {
      node.x = Math.max(
        node.radius,
        Math.min(canvasWidth - node.radius, node.x)
      );
      node.y = Math.max(
        node.radius,
        Math.min(canvasHeight - node.radius, node.y)
      );
    }

    const isLocked = lockedNode && node.id === lockedNode.id;

    const isOtherNodeWhileLocked = lockedNode && !isLocked;
    const nodeOpacity = isOtherNodeWhileLocked ? 0.1 : nodeTransparency.value;
    const textOpacity = isOtherNodeWhileLocked ? 0.1 : 1.0;

    if (nodesVisible.value) {
      if ((isLocked || (node.isAttractor && showGlow.value))) {
        ctx.save();

        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          node.radius * 0.8,
          node.x,
          node.y,
          node.radius * 1.3
        );
        gradient.addColorStop(0, hexToRgba(node.color, 0));
        gradient.addColorStop(0.5, hexToRgba(node.color, 0.6));
        gradient.addColorStop(1, hexToRgba(node.color, 0));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Hover effect
      const isHovered = hoveredNode && hoveredNode.id === node.id;
      const displayRadius = isHovered ? node.radius * 1.1 : node.radius;

      if (isHovered) {
        // Add outer glow ring
        ctx.save();
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, displayRadius * 0.8,
          node.x, node.y, displayRadius * 1.3
        );
        glowGradient.addColorStop(0, hexToRgba(node.color, 0.4));
        glowGradient.addColorStop(0.5, hexToRgba(node.color, 0.2));
        glowGradient.addColorStop(1, hexToRgba(node.color, 0));

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, displayRadius * 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, displayRadius, 0, Math.PI * 2);
      const bubbleOpacity = isHovered ? Math.min(nodeOpacity + 0.2, 1) : nodeOpacity;
      ctx.fillStyle = hexToRgba(node.color, bubbleOpacity);
      ctx.fill();

      // Add bright border on hover
      if (isHovered) {
        ctx.strokeStyle = hexToRgba(node.color, 0.8);
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // if (isLocked) {
      //   ctx.strokeStyle = "#FFD700";
      //   ctx.lineWidth = 5;
      //   ctx.stroke();
      // }
    }

    const baseTextColor = getTextColor(node.color);

    // Parse the color and apply text opacity
    let textColor;
    if (baseTextColor.startsWith('rgba')) {
      // If already rgba, replace the alpha value
      textColor = baseTextColor.replace(/[\d.]+\)$/g, `${textOpacity})`);
    } else if (baseTextColor.startsWith('rgb')) {
      // If rgb, convert to rgba
      textColor = baseTextColor.replace('rgb', 'rgba').replace(')', `, ${textOpacity})`);
    } else if (baseTextColor.startsWith('#')) {
      // If hex, convert to rgba
      const r = parseInt(baseTextColor.slice(1, 3), 16);
      const g = parseInt(baseTextColor.slice(3, 5), 16);
      const b = parseInt(baseTextColor.slice(5, 7), 16);
      textColor = `rgba(${r}, ${g}, ${b}, ${textOpacity})`;
    } else {
      textColor = baseTextColor;
    }

    ctx.fillStyle = textColor;

    const fontSize = Math.max(10, node.radius * fontSizeRatio.value);
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const maxWidth = node.radius * 1.8;
    const words = node.label.split(" ");
    let line = "";
    let lines = [];

    words.forEach((word) => {
      const testLine = line + word + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== "") {
        lines.push(line);
        line = word + " ";
      } else {
        line = testLine;
      }
    });
    lines.push(line);

    const lineHeight = fontSize * 1.2;
    const startY = node.y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line.trim(), node.x, startY + i * lineHeight);
    });
  });

  frameCounter++;
  if (frameCounter >= COVERAGE_CHECK_INTERVAL) {
    frameCounter = 0;
    coverageRatio.value = calculateCoverageRatio();
    adjustMaxRadius();
  }
};

const animate = () => {
  render();
  animationId = requestAnimationFrame(animate);
};

// ============================================
// SIMULATION INITIALIZATION
// ============================================

const initSimulation = () => {
  if (!d3) {
    console.error("✗ D3 is not loaded");
    return;
  }

  console.log("Initializing simulation with", nodes.length, "nodes");

  simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-50))
    .force(
      "collision",
      d3
        .forceCollide()
        .radius((d) => d.radius + 5)
        .strength(collisionStrength.value)
    )
    .force("centralAttractor", centralGravityForce())
    .force("topicAttraction", topicAttractionForce())
    .force("mouseRepel", mouseRepelForce())
    .alphaDecay(0.05)
    .velocityDecay(0.9)
    .alphaMin(0.001)
    .on("tick", render);

  console.log("✓ Simulation initialized");
};

const initCanvas = () => {
  if (!canvas.value || !arenaContainer.value) {
    console.error("✗ Canvas or container not available");
    return;
  }

  const container = arenaContainer.value;
  canvasWidth = container.clientWidth;
  canvasHeight = 600;

  MAX_RADIUS = canvasWidth * 0.15; // Larger bubbles (was 0.1)
  currentMaxRadius.value = MAX_RADIUS;

  canvas.value.width = canvasWidth;
  canvas.value.height = canvasHeight;
  ctx = canvas.value.getContext("2d");

  console.log(
    "✓ Canvas initialized:",
    canvasWidth,
    "x",
    canvasHeight,
    "Max radius:",
    MAX_RADIUS
  );

  initSimulation();
  animate();
};

// ============================================
// DEV FUNCTIONS
// ============================================

const debugInfo = () => {
  console.log("=== DEBUG INFO ===");
  console.log("D3 loaded:", d3Loaded.value);
  console.log("Canvas:", canvas.value);
  console.log("Canvas context:", ctx);
  console.log("Canvas size:", canvasWidth, "x", canvasHeight);
  console.log("Max radius:", MAX_RADIUS);
  console.log("Queries:", queries.value.length);
  console.log("Nodes:", nodes.length);
  console.log("Simulation:", simulation);
  console.log("Coverage ratio:", coverageRatio.value.toFixed(2) + "%");
  console.log("Topic visibility:", topicVisibility.value);
  console.log("Topic has nodes:", topicHasNodes.value);

  let visibleCount = 0;
  nodes.forEach((node) => {
    let nodeVisible = false;
    if (node.query && node.query.affinityList) {
      const primaryTopic = getPrimaryTopic(node.query.affinityList);
      if (primaryTopic && topicVisibility.value[primaryTopic] === true) {
        nodeVisible = true;
      }
    } else {
      nodeVisible = true;
    }

    if (nodeVisible) visibleCount++;
  });
  console.log("Visible nodes:", visibleCount, "of", nodes.length);

  const attractors = findTopicAttractors();
  console.log("Topic attractors:", attractors);

  Object.keys(attractors).forEach((topic) => {
    const attractor = attractors[topic];
    const sameTopicNodes = nodes.filter(
      (n) => getPrimaryTopic(n.query.affinityList) === topic
    );
    console.log(
      `${topic}: ${sameTopicNodes.length} nodes, attractor: ${attractor.label} (${attractor.query.clicks} clicks), visible: ${topicVisibility.value[topic]}`
    );
  });

  const clicksInfo = queries.value
    .map((q) => `${q.text}: ${q.clicks} clicks`)
    .join("\n");

  alert(
    `D3: ${d3Loaded.value}\nQueries: ${queries.value.length}\nNodes: ${nodes.length
    }\nVisible Nodes: ${visibleCount}\nCanvas: ${canvasWidth}x${canvasHeight}\nCoverage: ${coverageRatio.value.toFixed(
      2
    )}%\n\nTopic Visibility:\nAdvancedNFT: ${topicVisibility.value.AdvancedNFT
    }\nTools: ${topicVisibility.value.Tools}\nMetadata: ${topicVisibility.value.Metadata
    }\nEVM: ${topicVisibility.value.EVM}\n\n${clicksInfo}`
  );
};

const addBubble = () => {
  const randomClicks = Math.floor(Math.random() * 2599) + 1;

  const topics = Object.keys(topicList);
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const affinityList = { [randomTopic]: 1 };

  const newQuery = new Query(
    `Bubble ${queries.value.length + 1}`,
    `Description for bubble ${queries.value.length + 1}`,
    "#",
    affinityList,
    randomClicks
  );
  queries.value.push(newQuery);

  updateTopicAvailability();

  const radius = calculateRadius(randomClicks);
  const color = getBubbleColor(affinityList);
  const newNode = {
    id: Date.now(),
    x: canvasWidth / 2 + (Math.random() - 0.5) * 100,
    y: 100,
    vx: (Math.random() - 0.5) * 2,
    vy: 0,
    radius: radius,
    color: color,
    label: newQuery.text,
    query: newQuery,
    isAttractor: false,
  };

  nodes.push(newNode);
  nodeCount.value = nodes.length;
  coverageRatio.value = calculateCoverageRatio();

  console.log(
    "Added bubble:",
    newNode.label,
    `${randomClicks} clicks, radius ${radius.toFixed(1)}, topic ${randomTopic}`
  );

  if (simulation) {
    simulation.nodes(nodes);
    simulation.alpha(1).restart();
  }

  adjustMaxRadius();
};

const clearBubbles = () => {
  nodes.length = 0;
  queries.value = [];
  colorIndex = 0;
  nodeCount.value = 0;
  coverageRatio.value = 0;
  lockedNode = null;
  lockedNodeOriginalRadius = null;

  MAX_RADIUS = canvasWidth * 0.15; // Larger bubbles (was 0.1)
  currentMaxRadius.value = MAX_RADIUS;

  topicHasNodes.value = {
    AdvancedNFT: false,
    Tools: false,
    Metadata: false,
    EVM: false,
  };

  if (simulation) {
    simulation.nodes(nodes);
    simulation.alpha(0);
  }
  console.log("Cleared all bubbles");
};

// ============================================
// EVENT HANDLERS
// ============================================

const handleKeyDown = (event) => {
  if (event.key === "Shift") {
    shiftPressed.value = true;
    if (!lockedNode && mouseX !== null && mouseY !== null) {
      lockedNode = findClosestNode();
      if (lockedNode) {
        lockedNodeOriginalRadius = lockedNode.radius;
        lockedNode.radius = 100;
        lockedNode.fx = lockedNode.x;
        lockedNode.fy = lockedNode.y;
        console.log(
          `Locked node on Shift press: ${lockedNode.label
          }, original radius: ${lockedNodeOriginalRadius.toFixed(
            1
          )}, new radius: 100`
        );
      }
    }
    if (simulation && mouseRepelStrength.value > 0) {
      simulation.alpha(0.1).restart();
    }
  }
};

const handleKeyUp = (event) => {
  if (event.key === "Shift") {
    shiftPressed.value = false;
    if (lockedNode) {
      if (lockedNodeOriginalRadius !== null) {
        lockedNode.radius = lockedNodeOriginalRadius;
        console.log(
          `Restored node radius: ${lockedNode.label
          }, radius: ${lockedNodeOriginalRadius.toFixed(1)}`
        );
      }
      lockedNode.fx = null;
      lockedNode.fy = null;
      console.log("Unlocked node:", lockedNode.label);
      lockedNode = null;
      lockedNodeOriginalRadius = null;
    }
  }
};

const handleMouseMove = (event) => {
  const rect = canvas.value.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;

  // Find hovered bubble
  hoveredNode = nodes.find((node) => {
    const dx = node.x - mouseX;
    const dy = node.y - mouseY;
    return Math.sqrt(dx * dx + dy * dy) < node.radius;
  }) || null;

  // Update cursor dynamically
  if (canvas.value) {
    canvas.value.style.cursor = hoveredNode ? 'pointer' : 'default';
  }

  if (shiftPressed.value && lockedNode) {
    lockedNode.fx = mouseX;
    lockedNode.fy = mouseY;
    lockedNode.x = mouseX;
    lockedNode.y = mouseY;
  }

  if (simulation && mouseRepelStrength.value > 0 && shiftPressed.value) {
    simulation.alpha(0.1).restart();
  }
};

const handleMouseLeave = () => {
  mouseX = null;
  mouseY = null;
  hoveredNode = null;

  // Reset cursor when leaving canvas
  if (canvas.value) {
    canvas.value.style.cursor = 'default';
  }
};

const handleMouseDown = (event) => {
  const rect = canvas.value.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  const clickedNode = nodes.find((node) => {
    const dx = node.x - clickX;
    const dy = node.y - clickY;
    return Math.sqrt(dx * dx + dy * dy) < node.radius;
  });

  if (clickedNode) {
    isDragging = false;
    dragStartTime = Date.now();

    clickedNode.fx = clickedNode.x;
    clickedNode.fy = clickedNode.y;

    const handleMouseMoveWhileDragging = (e) => {
      isDragging = true;
      const rect = canvas.value.getBoundingClientRect();
      clickedNode.fx = e.clientX - rect.left;
      clickedNode.fy = e.clientY - rect.top;

      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      simulation.alpha(0.3).restart();
    };

    const handleMouseUp = () => {
      clickedNode.fx = null;
      clickedNode.fy = null;

      const clickDuration = Date.now() - dragStartTime;
      if (!isDragging && clickDuration < 200) {
        if (clickedNode.query) {
          clickedNode.query.clicks++;
          console.log(
            `Clicked: ${clickedNode.query.text}, Total clicks: ${clickedNode.query.clicks}`
          );

          // Record click to Firebase (async, non-blocking)
          recordClick(clickedNode.query.text).catch((error) => {
            console.error("Failed to record click to Firebase:", error);
          });

          updateNodeSizes();
          adjustMaxRadius();

          if (clickedNode.query.url && clickedNode.query.url !== "#") {
            window.open(clickedNode.query.url, "_blank");
          }
        }
      }

      window.removeEventListener("mousemove", handleMouseMoveWhileDragging);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMoveWhileDragging);
    window.addEventListener("mouseup", handleMouseUp);
  }
};

const handleResize = () => {
  if (arenaContainer.value && canvas.value) {
    canvasWidth = arenaContainer.value.clientWidth;
    canvasHeight = 600;

    const initialMaxRadius = canvasWidth * 0.15; // Larger bubbles
    MAX_RADIUS = Math.min(initialMaxRadius, MAX_RADIUS);
    currentMaxRadius.value = MAX_RADIUS;

    canvas.value.width = canvasWidth;
    canvas.value.height = canvasHeight;

    console.log(
      "Canvas resized:",
      canvasWidth,
      "x",
      canvasHeight,
      "Max radius:",
      MAX_RADIUS
    );

    updateNodeSizes();

    if (simulation && d3) {
      simulation.alpha(0.3).restart();
    }

    adjustMaxRadius();
  }
};

// ============================================
// WATCHERS
// ============================================

watch(gravity, (newVal) => {
  if (simulation) {
    simulation.alpha(0.3).restart();
  }
});

watch(collisionStrength, (newVal) => {
  if (simulation) {
    simulation.force(
      "collision",
      d3
        .forceCollide()
        .radius((d) => d.radius + 5)
        .strength(newVal)
    );
    simulation.alpha(0.3).restart();
  }
});

watch(topicAttractionStrength, (newVal) => {
  if (simulation) {
    simulation.alpha(0.3).restart();
  }
});

watch(mouseRepelStrength, (newVal) => {
  if (simulation && shiftPressed.value) {
    simulation.alpha(0.3).restart();
  }
});

watch(mouseRepelRadius, (newVal) => {
  if (simulation && shiftPressed.value) {
    simulation.alpha(0.3).restart();
  }
});

watch(
  topicVisibility,
  () => {
    if (simulation) {
      simulation.alpha(0.1).restart();
    }
  },
  { deep: true }
);

// ============================================
// LIFECYCLE
// ============================================

let isDragging = false;
let dragStartTime = 0;

onMounted(() => {
  console.log("=== Component mounted ===");

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  if (window.d3) {
    d3 = window.d3;
    d3Loaded.value = true;
    console.log("✓ D3 already loaded");

    loadFromCSV();

    setTimeout(() => {
      initCanvas();
      canvas.value?.addEventListener("mousedown", handleMouseDown);
      canvas.value?.addEventListener("mousemove", handleMouseMove);
      canvas.value?.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("resize", handleResize);
    }, 100);
  } else {
    console.log("Waiting for D3 to load...");
    let attempts = 0;
    const checkD3 = setInterval(() => {
      attempts++;
      if (window.d3) {
        d3 = window.d3;
        d3Loaded.value = true;
        clearInterval(checkD3);
        console.log("✓ D3 loaded after", attempts, "attempts");

        loadFromCSV();

        setTimeout(() => {
          initCanvas();
          canvas.value?.addEventListener("mousedown", handleMouseDown);
          canvas.value?.addEventListener("mousemove", handleMouseMove);
          canvas.value?.addEventListener("mouseleave", handleMouseLeave);
          window.addEventListener("resize", handleResize);
        }, 100);
      } else if (attempts > 50) {
        clearInterval(checkD3);
        console.error("✗ D3 failed to load after 5 seconds");
        alert(
          "D3.js library not found. Please ensure D3 is included in your project."
        );
      }
    }, 100);
  }
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (simulation) {
    simulation.stop();
  }
  canvas.value?.removeEventListener("mousedown", handleMouseDown);
  canvas.value?.removeEventListener("mousemove", handleMouseMove);
  canvas.value?.removeEventListener("mouseleave", handleMouseLeave);
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
});
</script>

// ============================================= // STYLE SECTION //
=============================================
<style scoped>
.bubble-arena-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: transparent;
}

/* Panel Header Styles */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;
  background: #2a2a2a;
  /* Simple solid color instead of gradient */
}

.panel-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.collapse-icon {
  font-size: 12px;
  color: #a0a0a0;
  transition: transform 0.3s ease;
}

/* User Panel - Clean and minimal */
.user-panel {
  background: #2a2a2a;
  border-bottom: 1px solid #3a3a3a;
  transition: all 0.3s ease;
}

.user-panel.collapsed {
  background: #252525;
}

/* User Panel Content Layout */
.user-panel .panel-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Topic Toggles Grid - First Block */
.topic-toggles-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px 20px;
  width: 100%;
}

.topic-checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.topic-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
}

.topic-checkbox-item label {
  color: #e0e0e0;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

/* Visibility Controls - Second Block */
.visibility-controls {
  width: 100%;
}

.checkbox-group-extended {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 16px;
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  border-radius: 6px;
}

.checkbox-group-extended input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #e0e0e0;
  flex-shrink: 0;
}

.checkbox-group-extended>label {
  color: #e0e0e0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.opacity-slider-inline {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
  transition: opacity 0.3s ease;
}

.opacity-slider-inline.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.opacity-slider-inline label {
  color: #e0e0e0;
  font-size: 14px;
  font-weight: 400;
  white-space: nowrap;
  min-width: 100px;
}

.opacity-slider-inline input[type="range"] {
  width: 200px;
  height: 6px;
  background: #2a2a2a;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.opacity-slider-inline input[type="range"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.opacity-slider-inline input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #e0e0e0;
  border-radius: 50%;
  cursor: pointer;
}

.opacity-slider-inline input[type="range"]:disabled::-webkit-slider-thumb {
  cursor: not-allowed;
}

.opacity-slider-inline input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #e0e0e0;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.opacity-slider-inline input[type="range"]:disabled::-moz-range-thumb {
  cursor: not-allowed;
}

/* Dev Panel - Full controls */
.dev-panel {
  background: #1f1f1f;
  border-bottom: 1px solid #3a3a3a;
  transition: all 0.3s ease;
}

.dev-panel.collapsed {
  background: #1a1a1a;
}

.dev-panel .panel-content {
  padding: 20px;
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.control-btn {
  padding: 10px 20px;
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  border-radius: 6px;
  color: #e0e0e0;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #4a4a4a;
  border-color: #5a5a5a;
}

.control-btn:active {
  transform: translateY(1px);
}

.file-upload-btn {
  display: inline-block;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  transition: opacity 0.3s ease;
}

.slider-group.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.slider-group label {
  color: #e0e0e0;
  font-size: 14px;
  font-weight: 400;
}

.slider-group input[type="range"] {
  width: 150px;
  height: 6px;
  background: #2a2a2a;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.slider-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: #e0e0e0;
  border-radius: 50%;
  cursor: pointer;
}

.slider-group input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: #e0e0e0;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #e0e0e0;
}

.checkbox-group label {
  color: #e0e0e0;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.info-text {
  width: 100%;
  padding: 12px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  color: #a0a0a0;
  font-size: 13px;
  font-family: monospace;
}

/* Arena Canvas */
.section-arena {
  position: relative;
  background: transparent;
  overflow: hidden;
  height: 600px;
  width: 100%;
  flex-shrink: 0;
  /* Prevent shrinking in flex layout */
}

.section-arena.light-mode {
  background: transparent;
}

.section-arena canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: default;
}

.section-arena canvas:active {
  cursor: default;
}

.loading-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #e0e0e0;
  font-size: 18px;
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
}

/* Note Panel */
.note-panel {
  background: #2a2a2a;
  border-top: 1px solid #3a3a3a;
  padding: 20px;
}

.note-content {
  max-width: 1200px;
  margin: 0 auto;
  color: #e0e0e0;
  font-size: 14px;
  line-height: 1.6;
}

.note-content strong {
  color: #ffffff;
  font-weight: 600;
}

.bubble-arena-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  font-family: system-ui, -apple-system, sans-serif;
}

.arena-container {
  position: relative;
  width: 100%;
  background: #2a2a2a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin: 20px 0;
  transition: height 0.3s ease-in-out;
  /* Smooth height transition */
}

.bubble-canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: default;
}

.bubble-canvas:active {
  cursor: default;
}

.panel {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  margin: 15px 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #2a2a2a;
  color: white;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;
}

.panel-header:hover {
  background: #2a2a2a;
}

.panel-title {
  font-weight: 600;
  font-size: 14px;
}

.toggle-icon {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.panel-content {
  padding: 16px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tooltip */
.tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: #ffffff;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 13px;
  pointer-events: none;
  transform: translate(-50%, -100%);
  max-width: 300px;
  white-space: normal;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: tooltipFadeIn 0.2s ease;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -100%) translateY(5px);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -100%) translateY(0);
  }
}

.section-arena.light-mode .tooltip {
  background: rgba(255, 255, 255, 0.95);
  color: #000000;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
</style>
