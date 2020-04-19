import Vue from "vue";

Object.defineProperty(Vue.prototype, "$loader", {
  value: {
    count: 0,
    push() {
      this.count = this.count + 1;
      if (this.count !== 0) {
        this.fadeIn();
      }
    },
    pop() {
      this.count = this.count - 1;
      if (this.count === 0) {
        this.fadeOut();
      }
    },
    fadeIn() {
      // plugin function overridden
    },
    fadeOut() {
      // plugin function overridden
    }
  }
});
