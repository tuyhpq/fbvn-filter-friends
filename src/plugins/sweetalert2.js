import Vue from "vue";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: toast => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  }
});

const _alert = {
  success(text) {
    return Swal.fire({
      icon: "success",
      title: "Thành Công",
      text: text
    });
  },
  toastSuccess(text) {
    return Toast.fire({
      icon: "success",
      html: text
    });
  },
  error(text) {
    return Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: text
    });
  },
  toastError(text) {
    return Toast.fire({
      icon: "error",
      html: text
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
};

Object.defineProperty(Vue.prototype, "$alert", {
  value: _alert
});

export default _alert;
