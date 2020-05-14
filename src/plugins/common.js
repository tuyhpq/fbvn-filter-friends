import Vue from "vue";

String.prototype.extract = function(regexp) {
  let arr = this.match(regexp);
  return arr[arr.length - 1];
};

String.prototype.decodeUnicode = function() {
  let text = this.replace(/\\\\/g, "\\");
  return decodeURIComponent(JSON.parse(`"${text}"`));
};

Object.defineProperty(Vue.prototype, "$common", {
  value: {}
});
