import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Demo from '../views/Demo.vue';
import Demo2 from '../views/Demo2.vue';
import Tarea1 from '../views/Tarea1.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/demo',
    name: 'demo',
    component: Demo,
  },
  {
    path: '/diferencias',
    name: 'differences',
    component: Demo2,
  },
  {
    path: '/inconsistencias',
    name: 'inconsistencias',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/tarea1',
    name: 'tarea1',
    component: Tarea1,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
