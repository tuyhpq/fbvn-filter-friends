import Vue from "vue";
import _ from "lodash";

Object.defineProperty(Vue.prototype, "$_", {
  value: _
});

export default _;
