import Vue from "vue";
import moment from "moment";

Object.defineProperty(Vue.prototype, "$moment", {
  value: moment
});
