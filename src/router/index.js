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
    path: "/friends-filter-interaction",
    name: "FriendsFilterInteraction",
    component: () => import("@/views/FriendsFilterInteraction.vue"),
    meta: {
      title: "Lọc bạn bè theo tương tác"
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
