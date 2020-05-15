import Vue from "vue";
import axios from "axios";

let config = {
  baseURL: process.env.VUE_APP_BASE_URL
};

const _axios = axios.create(config);

// Plugins
_axios.hookRequest = () => {
  // plugin function overridden
};
_axios.hookResponse = () => {
  // plugin function overridden
};

// Add a request interceptor
_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    _axios.hookRequest(config);
    return config;
  },
  function(error) {
    // Do something with request error
    _axios.hookResponse(error.config);
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    _axios.hookResponse(response.config);
    return response;
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    _axios.hookResponse(error.config);
    return Promise.reject(error);
  }
);

Object.defineProperty(Vue.prototype, "$axios", {
  value: _axios
});

export default _axios;
