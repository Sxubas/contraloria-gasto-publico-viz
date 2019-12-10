import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Demo from '../views/Demo.vue';
import DifferencesViz from '../views/DifferencesViz.vue';
import RatioViz from '../views/RatioViz.vue';

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
    component: DifferencesViz,
  },
  {
    path: '/relacion-ingreso-gasto',
    name: 'ratio',
    component: RatioViz,
  },
  {
    path: '/inconsistencias',
    name: 'inconsistencias',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/InconsistenciesViz.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
