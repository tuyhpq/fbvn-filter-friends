import Vue from "vue";

String.prototype.extract = function(regexp) {
  let arr = this.match(regexp);
  return arr[arr.length - 1];
};

String.prototype.decodeUnicode = function() {
  let text = this.replace(/\\\\/g, "\\");
  return decodeURIComponent(JSON.parse(`"${text}"`));
};

Array.prototype.remove = function(item) {
  let index = this.indexOf(item);
  if (index !== -1) {
    this.splice(index, 1);
  }
  return this;
};

Array.prototype.removeAt = function(index) {
  let item = this[index];
  this.splice(index, 1);
  return item;
};

Object.defineProperty(Vue.prototype, "$common", {
  value: {
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
});
