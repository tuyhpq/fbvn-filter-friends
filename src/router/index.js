import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/Profile.vue"),
    meta: {
      title: "Thông tin người dùng"
    }
  },
  {
    path: "/friends-filter",
    name: "FriendsFilter",
    component: () => import("@/views/FriendsFilter.vue"),
    meta: {
      title: "Lọc bạn bè"
    }
  },
  {
    path: "*",
    redirect: { name: "Profile" }
  }
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

export default router;
