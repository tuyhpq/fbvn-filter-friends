import Vue from "vue";

import "./plugins/lodash";
import "./plugins/moment";
import "./plugins/axios";
import "./plugins/bootstrap";
import "./plugins/vee-validate";

import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
