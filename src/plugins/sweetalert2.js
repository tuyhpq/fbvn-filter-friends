import Vue from "vue";
import Swal from "sweetalert2";

Object.defineProperty(Vue.prototype, "$alert", {
  value: {
    success(text) {
      return Swal.fire({
        icon: "success",
        title: "",
        text: text
      });
    },
    error(text) {
      return Swal.fire({
        icon: "error",
        title: "",
        text: text
      });
    }
  }
});
