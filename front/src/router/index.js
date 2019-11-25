import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Demo from '../views/Demo.vue';
import Tarea1 from '../views/Tarea1.vue'
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
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/tarea1',
    name: 'tarea1',
    component: Tarea1,
  }
];

const router = new VueRouter({
  routes,
});

export default router;
