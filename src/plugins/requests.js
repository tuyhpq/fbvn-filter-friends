import Vue from "vue";

import $axios from "./axios";
import $store from "@/store";

const API_VERSION = process.env.VUE_APP_FACEBOOK_API_VERSION;
const USER = $store.state.user;

const http = {
  fetch() {
    return $axios.get("https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed");
  },
  getFriendList(fields = ["name", "picture{is_silhouette,url}"], limit = 5000, notLoading = false) {
    return $axios.get(`https://graph.facebook.com/${API_VERSION}/me/friends`, {
      params: {
        access_token: USER.accessToken,
        fields: ["id", ...fields].join(","),
        limit
      },
      notLoading
    });
  },
  removeFriend(friendId) {
    let data = {
      __user: USER.id,
      __a: "1",
      dpr: "1",
      fb_dtsg: USER.dtsg,
      fb_api_caller_class: "RelayModern",
      fb_api_req_friendly_name: "FriendingCometUnfriendMutation",
      doc_id: "2316924651742928",
      variables: JSON.stringify({
        input: {
          source: "bd_profile_button",
          unfriended_user_id: btoa("restrictedUserNode" + friendId),
          actor_id: "806399409",
          client_mutation_id: "1"
        },
        scale: 1
      })
    };

    let formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }

    return $axios.post("https://www.facebook.com/api/graphql/", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
};

Object.defineProperty(Vue.prototype, "$http", {
  value: http
});
