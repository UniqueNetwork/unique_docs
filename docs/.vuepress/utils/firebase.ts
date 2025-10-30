import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  update,
  increment,
  get,
  onValue,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAGS5iMcYFSjGF5H6DcLiSCuyii7ghGbOY", // TODO: UPDATE TO USE SECRETS
  authDomain: "unique-docs-analytics.firebaseapp.com",
  databaseURL:
    "https://unique-docs-analytics-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "unique-docs-analytics",
  storageBucket: "unique-docs-analytics.firebasestorage.app",
  messagingSenderId: "326440290839",
  appId: "1:326440290839:web:cf2790f8eb6a1996a3ea52",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function recordClick(queryName: string): Promise<void> {
  const clickRef = ref(db, `clicks/${queryName}`);

  try {
    await update(clickRef, {
      count: increment(1),
      lastUpdated: Date.now(),
    });
  } catch (error) {
    console.error("Failed to record click:", error);
    throw error;
  }
}

export async function getClicks(): Promise<Record<string, number>> {
  const clicksRef = ref(db, "clicks");

  try {
    const snapshot = await get(clicksRef);
    if (!snapshot.exists()) {
      return {};
    }

    const data = snapshot.val();
    const clicks: Record<string, number> = {};

    Object.keys(data).forEach((key) => {
      clicks[key] = data[key].count || 0;
    });

    return clicks;
  } catch (error) {
    console.error("Failed to get clicks:", error);
    return {};
  }
}

export function onClicksChange(
  callback: (clicks: Record<string, number>) => void
): () => void {
  const clicksRef = ref(db, "clicks");

  const unsubscribe = onValue(clicksRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback({});
      return;
    }

    const data = snapshot.val();
    const clicks: Record<string, number> = {};

    Object.keys(data).forEach((key) => {
      clicks[key] = data[key].count || 0;
    });

    callback(clicks);
  });

  return unsubscribe;
}
