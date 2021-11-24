import Vue from "vue";
import VueRouter from "vue-router";
import Exchanges from "../pages/Exchanges.vue";
import SuccessfullExchange from "../pages/SuccessfullyExchange";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Exchanges,
  },
  {
    path: "/success",
    name: "Success",
    component: SuccessfullExchange,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
