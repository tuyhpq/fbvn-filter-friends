import Vue from "vue";

import "./plugins/jquery";
import "./plugins/overlay-scrollbars";
import "./plugins/admin-lte";
import "./plugins/lodash";
import "./plugins/common";
import "./plugins/moment";
import "./plugins/axios";
import "./plugins/bootstrap";
import "./plugins/vee-validate";
import "./plugins/vue-fontawesome";
import "./plugins/sweetalert2";
import "./plugins/loader";
import "./plugins/requests";

import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
