import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    friends: []
  },
  mutations: {
    login(state, { user }) {
      state.user = user;
    },
    setFriends(state, { friends }) {
      state.friends = friends;
    }
  },
  actions: {},
  modules: {},
  plugins: [
    createPersistedState({
      paths: ["user", "friends"]
    })
  ]
});
