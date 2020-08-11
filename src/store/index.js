import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    rejectedContents: []
  },
  mutations: {
    login(state, { user }) {
      state.user = user;
    },
    pushRejectedContent(state, { content }) {
      state.rejectedContents.push(content);
    }
  },
  actions: {},
  modules: {},
  plugins: [
    createPersistedState({
      paths: ["rejectedContents"]
    })
  ]
});
