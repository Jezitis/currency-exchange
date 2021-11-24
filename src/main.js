import Vue from "vue";
import App from "./App.vue";
import store from "./store";

import "./assets/styles/main.scss";
import router from "./router";

Vue.config.productionTip = false;

Vue.directive("numonly", {
  bind: function (el) {
    el.handler = function () {
      let regex = new RegExp(/^[0-9]*\.?[0-9]*$/);
      if (!regex.test(el.value)) {
        el.value = "";
      }
    };
    el.addEventListener("input", el.handler);
  },
  unbind: function (el) {
    el.removeEventListener("input", el.handler);
  },
});

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
