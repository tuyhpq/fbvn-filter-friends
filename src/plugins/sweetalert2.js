import Vue from "vue";
import Swal from "sweetalert2";

Object.defineProperty(Vue.prototype, "$alert", {
  value: {
    success(text) {
      return Swal.fire({
        icon: "success",
        title: "Thành Công",
        text: text
      });
    },
    error(text) {
      return Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: text
      });
    },
    confirm(text) {
      return Swal.fire({
        icon: "warning",
        title: "Xác Nhận",
        html: text,
        showCancelButton: true,
        cancelButtonText: "Hủy"
      });
    }
  }
});
