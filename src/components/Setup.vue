<template>
  <div>
    <h2>Configure Robot</h2>
    <select v-model="auctionTile">
      <option value="cheapest">Cheapest Power Plant</option>
      <option value="efficient">Most Efficient</option>
    </select>
    <!-- Add more tile selectors -->
    <button @click="startGame">Start</button>
  </div>
</template>

<script>
export default {
  data() {
    return { auctionTile: 'cheapest' /* , other tiles */ };
  },
  methods: {
    startGame() {
      this.$emit('select-tiles', { auction: this.auctionTile /* , other tiles */ });
    }
  }
};
</script>