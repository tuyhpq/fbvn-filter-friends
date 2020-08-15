import Vue from "vue";
import axios from "axios";

import $alert from "./sweetalert2";

let config = {
  baseURL: process.env.VUE_APP_BASE_URL
};

const handleError = () => {
  console.log("Lỗi gọi API...");
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
    handleError();
    _axios.hookResponse(error.config);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    _axios.hookResponse(response.config);

    let urlRequest = new URL(response.config.url);
    let urlResponse = new URL(response.request.responseURL);
    if (urlRequest.origin + urlRequest.pathname === urlResponse.origin + urlResponse.pathname) {
      return response;
    } else {
      let message = "Vui lòng đăng nhập vào tài khoản Facebook để sử dụng các dịch vụ của chúng tôi.";
      $alert.error(message).then(() => {
        window.location.replace("https://www.facebook.com/");
      });
    }
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    handleError();
    _axios.hookResponse(error.config);
  }
);

Object.defineProperty(Vue.prototype, "$axios", {
  value: _axios
});

export default _axios;
