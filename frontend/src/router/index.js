import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import ItemDetail from '../pages/ItemDetail.vue';
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/item/:id', component: ItemDetail, props: true }
];
const router = createRouter({ history: createWebHistory(), routes });
export default router;
