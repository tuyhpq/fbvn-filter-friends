import Vue from "vue";

const axios = Vue.prototype.$axios;

const http = {
  fetch() {
    return axios.get("https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed");
  }
};

Object.defineProperty(Vue.prototype, "$http", {
  value: http
});
