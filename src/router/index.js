// src/main.js
import Vue from 'vue';
import App from './App.vue';
import router from './router'; // Import the router you just created

Vue.config.productionTip = false;

new Vue({
    router, // Add the router to your Vue instance
    render: h => h(App)
}).$mount('#app');