// src/router/index.js
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue'; // Adjust path if Home.vue is elsewhere

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }
    // Add other routes as needed
];

const router = new VueRouter({
    mode: 'hash', // For GitHub Pages compatibility
    routes
});

export default router;