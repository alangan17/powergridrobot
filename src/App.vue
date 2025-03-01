<template>
  <div id="app">
    <h1>Power Grid Robot Helper</h1>
    <Setup v-if="!tiles" @select-tiles="setTiles" />
    <div v-else>
      <h2>Robot State: {{ robotState.money }} Elektro</h2>
      <AuctionPhase :tiles="tiles" :robotState="robotState" />
      <ResourceBuyingPhase :tiles="tiles" :robotState="robotState" />
      <BuildingPhase :tiles="tiles" :robotState="robotState" />
      <BureaucracyPhase :robotState="robotState" />
    </div>
  </div>
</template>

<script>
import Setup from './components/Setup.vue';
import AuctionPhase from './components/AuctionPhase.vue';
import ResourceBuyingPhase from './components/ResourceBuyingPhase.vue';
import BuildingPhase from './components/BuildingPhase.vue';
import BureaucracyPhase from './components/BureaucracyPhase.vue';

export default {
  components: { Setup, AuctionPhase, ResourceBuyingPhase, BuildingPhase, BureaucracyPhase },
  data() {
    return {
      tiles: null,
      robotState: { money: 50, powerPlants: [], resources: {}, cities: [] }
    };
  },
  methods: {
    setTiles(selectedTiles) {
      this.tiles = selectedTiles;
    }
  }
};
</script>