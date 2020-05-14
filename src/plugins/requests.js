import Vue from "vue";

const axios = Vue.prototype.$axios;

const API_VERSION = "v7.0";

const http = {
  fetch() {
    return axios.get("https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed");
  },
  getFriendList(accessToken) {
    return axios.get(`https://graph.facebook.com/${API_VERSION}/me/friends`, {
      params: {
        access_token: accessToken,
        fields: "id,name,location{location{region_id,country}}",
        limit: 10000
      }
    });
  }
};

Object.defineProperty(Vue.prototype, "$http", {
  value: http
});
