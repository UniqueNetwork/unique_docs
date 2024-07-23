<template>
  <div :class="highlightClass">
    <div class="highlight-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ['warning', 'idea'].includes(value),
    },
  },
  computed: {
    highlightClass() {
      return {
        'highlight-warning': this.type === 'warning',
        'highlight-idea': this.type === 'idea',
      };
    },
  },
};
</script>

<style scoped>
.highlight-warning,
.highlight-idea {
  display: flex;
  align-items: center;
  padding: 15px;
  border-left: 8px solid; /* Add bold line on the left */
}

.highlight-warning {
  border-color: red;
}

.highlight-idea {
  border-color: green;
}

.highlight-content {
  flex-grow: 1;
  padding-left: 10px;
}
</style>
