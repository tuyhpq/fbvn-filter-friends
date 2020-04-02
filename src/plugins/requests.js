import Vue from "vue";

const axios = Vue.prototype.$axios;

const http = {
  fetch() {
    return axios.get("/fetch");
  }
};

Object.defineProperty(Vue.prototype, "$http", {
  value: http
});
