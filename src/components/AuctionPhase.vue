<template>
  <div>
    <h3>Auction Phase</h3>
    <input v-model="availablePlants" placeholder="e.g., 13, 14, 15" />
    <button @click="choosePlant">Choose Plant</button>
  </div>
</template>

<script>
export default {
  props: ['tiles', 'robotState'],
  data() {
    return { availablePlants: '' };
  },
  methods: {
    choosePlant() {
      const plants = this.availablePlants.split(',').map(Number);
      let choice = this.tiles.auction === 'cheapest' ? Math.min(...plants) : Math.max(...plants);
      alert(`Robot chooses plant ${choice}`);
      this.robotState.powerPlants.push(choice);
    }
  }
};
</script>