import Vue from "vue";

import $axios from "./axios";
import $store from "@/store";
import qs from "qs";

const API_VERSION = process.env.VUE_APP_FACEBOOK_API_VERSION;
const USER = () => $store.state.user;

const http = {
  fetch() {
    return $axios.get("https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed");
  },
  getFriendList(fields = ["name", "picture{is_silhouette,url}", "gender"], limit = 5000, notLoading = false) {
    return $axios.get(`https://graph.facebook.com/${API_VERSION}/me/friends`, {
      params: {
        access_token: USER().accessToken,
        fields: ["id", ...fields].join(","),
        limit
      },
      notLoading
    });
  },
  getMutualFriends(next = "") {
    let data = {
      fb_dtsg: USER().dtsg,
      q: `node(${USER().id}){friends.first(500).after(${next}){page_info,edges{node{id,mutual_friends{count},name}}}}`
    };

    let formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }

    return $axios.post("https://www.facebook.com/api/graphql/", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      notLoading: true
    });
  },
  removeFriend(friendId) {
    let data = {
      __user: USER().id,
      __a: "1",
      dpr: "1",
      fb_dtsg: USER().dtsg,
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
  },
  profilePictureGuard(status) {
    let data = {
      fb_dtsg: USER().dtsg,
      variables: `{"0":{"is_shielded":${status},"actor_id":"${USER().id}","client_mutation_id":"FBVN"}}`,
      doc_id: "1477043292367183"
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
  },
  getInteraction(next = "") {
    let data = {
      fb_dtsg: USER().dtsg,
      q:
        `node(${USER().id}){timeline_feed_units.first(500).after(${next})` +
        `{page_info,edges{node{id,creation_time,feedback{reactors{nodes{id}},commenters{nodes{id}}}}}}}`
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
  },
  getFirstPendingPostsData({
    groupId,
    orderBy = "RECENT" // RECENT, CHRONOLOGICAL
  }) {
    var data = qs.stringify({
      doc_id: "3829723863714756",
      fb_api_req_friendly_name: "GroupsCometPendingPostsPostsSectionQuery",
      fb_dtsg: USER().dtsg,
      variables: JSON.stringify({
        groupID: groupId,
        pendingPostMetadataEnabled: true,
        displayCommentsFeedbackContext: null,
        displayCommentsContextEnableComment: null,
        displayCommentsContextIsAdPreview: null,
        displayCommentsContextIsAggregatedShare: null,
        displayCommentsContextIsStorySet: null,
        feedLocation: "GROUP_PENDING",
        feedbackSource: 0,
        focusCommentID: null,
        scale: 1,
        isComet: true,
        useDefaultActor: false,
        pendingStoriesOrderBy: orderBy,
        privacySelectorRenderLocation: "COMET_STREAM",
        renderLocation: "group_pending_queue",
        UFI2CommentsProvider_commentsKey: "GroupsCometPendingPostsContent"
      })
    });
    return $axios.post("https://www.facebook.com/api/graphql/?getFirstPendingPostsData", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      notLoading: true
    });
  },
  getNextPendingPostsData({
    cursor,
    groupId,
    orderBy = "RECENT" // RECENT, CHRONOLOGICAL
  }) {
    var data = qs.stringify({
      doc_id: "4586194724724815",
      fb_api_req_friendly_name: "GroupsCometPendingPostsFeedPaginationQuery",
      fb_dtsg: USER().dtsg,
      variables: JSON.stringify({
        UFI2CommentsProvider_commentsKey: "GroupsCometPendingPostsContent",
        count: 50,
        cursor: cursor,
        displayCommentsContextEnableComment: null,
        displayCommentsContextIsAdPreview: null,
        displayCommentsContextIsAggregatedShare: null,
        displayCommentsContextIsStorySet: null,
        displayCommentsFeedbackContext: null,
        feedLocation: "GROUP_PENDING",
        feedbackSource: 0,
        focusCommentID: null,
        isComet: true,
        pendingPostMetadataEnabled: true,
        pendingStoriesOrderBy: orderBy,
        privacySelectorRenderLocation: "COMET_STREAM",
        renderLocation: "group_pending_queue",
        scale: 1,
        useDefaultActor: false,
        id: groupId
      })
    });
    return $axios.post("https://www.facebook.com/api/graphql/?getNextPendingPostsData", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      notLoading: true
    });
  },
  removePost({ postId, groupId }) {
    var data = qs.stringify({
      doc_id: "3365842253444071",
      fb_api_req_friendly_name: "useGroupsCometDeclinePendingStoryMutation",
      fb_dtsg: USER().dtsg,
      variables: JSON.stringify({
        input: {
          group_id: groupId,
          source: "group_pending_posts",
          story_id: postId,
          actor_id: "116416613072624",
          client_mutation_id: "1"
        },
        memberID: "100049815155317"
      })
    });
    return $axios.post("https://www.facebook.com/api/graphql/?removePost", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      notLoading: true
    });
  },
  aprovePost({ postId, groupId }) {
    var data = qs.stringify({
      doc_id: "4092490014154806",
      fb_api_req_friendly_name: "useGroupsCometApprovePendingStoryMutation",
      fb_dtsg: USER().dtsg,
      variables: JSON.stringify({
        input: {
          group_id: groupId,
          story_id: postId,
          actor_id: "116416613072624",
          client_mutation_id: "1"
        },
        displayCommentsFeedbackContext: null,
        displayCommentsContextEnableComment: null,
        displayCommentsContextIsAdPreview: null,
        displayCommentsContextIsAggregatedShare: null,
        displayCommentsContextIsStorySet: null,
        feedLocation: "GROUP",
        feedbackSource: 0,
        focusCommentID: null,
        hoistStories: [],
        scale: 1,
        sortingSetting: null,
        isComet: true,
        useDefaultActor: false,
        privacySelectorRenderLocation: "COMET_STREAM",
        renderLocation: "group",
        UFI2CommentsProvider_commentsKey: "CometGroupDiscussionRootSuccessQuery"
      })
    });
    return $axios.post("https://www.facebook.com/api/graphql/?aprovePost", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      notLoading: true
    });
  }
};

Object.defineProperty(Vue.prototype, "$http", {
  value: http
});
