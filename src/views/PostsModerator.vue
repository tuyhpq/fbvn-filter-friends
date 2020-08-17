<template>
  <div class="container-fluid">
    <!-- Row Search -->
    <div class="row border border-dark rounded pt-2 mb-3">
      <div class="col-12">
        <form class="form-inline" @submit.prevent="updateQuery">
          <div class="form-group mb-2 mr-3">
            <label for="groupId" class="mr-1">ID nhóm:</label>
            <input type="text" class="form-control" id="groupId" v-model="query.groupId" />
          </div>
          <div class="form-group mb-2 mr-3">
            <label for="orderBy" class="mr-1">Sắp xếp: </label>
            <select class="form-control" id="orderBy" v-model="query.orderBy">
              <option value="RECENT">Mới nhất</option>
              <option value="CHRONOLOGICAL">Cũ nhất</option>
            </select>
          </div>
          <div class="form-group mb-2 mr-3">
            <label for="roleId" class="mr-1">Role ID:</label>
            <input type="text" class="form-control" id="roleId" v-model="query.roleId" />
          </div>
          <div class="form-group mb-2 mr-3">
            <div class="custom-control custom-switch">
              <input type="checkbox" class="custom-control-input" id="autoApprove" v-model="query.autoApprove" />
              <label class="custom-control-label" for="autoApprove">Tự động phê duyệt</label>
            </div>
          </div>
          <div class="form-group mb-2 mr-3">
            <div class="custom-control custom-switch">
              <input type="checkbox" class="custom-control-input" id="autoReload" v-model="query.autoReload" />
              <label class="custom-control-label" for="autoReload">Tự động cập nhật</label>
            </div>
          </div>
          <button type="submit" class="btn btn-info mb-2 mr-2">Cập nhật</button>
          <button type="button" class="btn btn-secondary mb-2 mr-2" @click="getNextPostList()">Tải thêm</button>
          <button type="button" class="btn btn-danger mb-2 mr-2" @click="autoApproveForGroups">
            Kiểm duyệt nhiều nhóm
          </button>
        </form>
      </div>
    </div>
    <!-- Row 1 -->
    <div class="row mb-3">
      <div class="col-12">
        <button type="button" class="btn btn-success mr-1" @click="approveAllPosts">
          Duyệt toàn bộ
        </button>
        <button type="button" class="btn btn-danger" @click="removeAllPosts">
          Xóa toàn bộ
        </button>
      </div>
    </div>
    <!-- Row 2 -->
    <div class="row">
      <div class="col-6" v-for="post in posts" :key="post.id">
        <div class="card card-info card-outline">
          <div class="card-header">
            {{ $moment(post.timestamp).format("HH:mm DD/MM/YYYY") }} {{ post.actors }}
            {{ post.probablyApprovedContent ? "(Approved Content)" : "" }}
            <span v-if="post.probablyApproved" class="badge badge-primary">[Probably Approved]</span>
          </div>
          <div class="card-body">
            <div>{{ post.message }}</div>
            <img
              v-for="image in post.attachments"
              :key="image"
              :src="image"
              class="mw-100 mh-250"
              crossOrigin="anonymous"
              @load="imageLoaded(post, $event.target)"
            />
          </div>
          <div class="card-footer">
            <button type="button" class="btn btn-danger" @click="removePost(post.id)">
              Từ chối
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Row 3 -->
    <div class="row mt-3 pb-5">
      <div class="col-12">
        <button type="button" class="btn btn-success mr-1" @click="approveAllPosts">
          Duyệt toàn bộ
        </button>
        <button type="button" class="btn btn-danger" @click="removeAllPosts">
          Xóa toàn bộ
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import GroupList from "./GroupList";

let indexGroup = -1;
const getNextGroup = () => {
  if (++indexGroup === GroupList.length) {
    indexGroup = 0;
  }
  return GroupList[indexGroup];
};

export default {
  data() {
    return {
      query: {
        groupId: "694039351025214",
        orderBy: "RECENT",
        roleId: "116416613072624",
        autoApprove: false,
        autoReload: false
      },
      groupId: "",
      orderBy: "",
      roleId: "",
      autoApprove: false,
      autoReload: false,
      autoReloadInterval: null,

      cursor: null,
      posts: [],
      APPROVE_LIST: [],
      REJECT_LIST: [],
      BLACK_LIST: [],

      queues: null
    };
  },
  created() {
    this.queues = this.$common.useQueues();
    this.updateQuery();
  },
  watch: {
    autoReload() {
      if (this.autoReload) {
        this.autoReloadInterval = setInterval(() => {
          console.log("RELOAD...");
          this.reload();
        }, 30 * 1000);
      } else if (this.autoReloadInterval !== null) {
        clearInterval(this.autoReloadInterval);
      }
    }
  },
  methods: {
    updateQuery() {
      this.groupId = this.query.groupId;
      this.orderBy = this.query.orderBy;
      this.roleId = this.query.roleId;
      this.autoApprove = this.query.autoApprove;
      this.autoReload = this.query.autoReload;
      this.reload();
    },
    async reload() {
      this.cursor = null;
      this.posts = [];
      this.getNextPostList(await this.getFirstPendingPostsCursor());
    },
    async getFirstPendingPostsCursor() {
      const response = await this.$http.getFirstPendingPostsData({
        groupId: this.groupId,
        roleId: this.roleId,
        orderBy: this.orderBy
      });
      if (response) {
        this.cursor = response.data.data.group["pending_posts_section_stories"]["page_info"]["end_cursor"];
        return response.data.data.group["pending_posts_section_stories"]["edges"];
      }
      return [];
    },
    async getNextPostList(availableEdges = []) {
      const response = this.cursor
        ? await this.$http.getNextPendingPostsData({
            cursor: this.cursor,
            groupId: this.groupId,
            roleId: this.roleId,
            orderBy: this.orderBy
          })
        : null;

      let edges = [];
      if (response) {
        edges = response.data.data.node["pending_posts_section_stories"].edges;
        this.cursor = response.data.data.node["pending_posts_section_stories"]["page_info"]["end_cursor"];
      }
      this.posts = this.posts.concat(
        availableEdges
          .concat(edges)
          .map(edge => edge.node)
          .filter(node => {
            let approved =
              node["attached_story"] === null && // không phải bài chia sẻ
              node["comet_sections"]["content"] !== null &&
              node["comet_sections"]["content"]["story"]["comet_sections"]["message"] !== null &&
              (() => {
                // không phải bài chia sẻ hoặc unavailable
                const styleList = node["comet_sections"]["content"]["story"]["attachments"]
                  .map(attachment => attachment["style_list"])
                  .reduce((styleList, style) => {
                    return styleList.concat(style);
                  }, []);
                return styleList.indexOf("share") === -1 && styleList.indexOf("unavailable") === -1;
              })();

            if (approved) {
              const content = this.getContent(node);
              const rejected = this.hasRejection(content);
              if (rejected) {
                console.log("Has rejection: " + content);
                this.$store.commit("pushRejectedContent", { content });
              }
              approved = rejected === false;
            }

            if (!approved) {
              this.removePost(node["id"]);
            }

            return approved;
          })
          .map(node => {
            try {
              return {
                id: node["id"],
                timestamp: new Date(node["comet_sections"]["timestamp"]["story"]["creation_time"] * 1000),
                actors: node["actors"].map(actor => actor.name).join(", "),
                message: this.getContent(node),
                attachments: node["comet_sections"]["content"]["story"]["attachments"]
                  .map(attachment => {
                    let images = [];
                    if (attachment["style_type_renderer"]["attachment"]["media"]) {
                      if (attachment["style_type_renderer"]["attachment"]["media"]["photo_image"]) {
                        images.push(attachment["style_type_renderer"]["attachment"]["media"]["photo_image"]["uri"]);
                      } else if (attachment["style_type_renderer"]["attachment"]["media"]["thumbnailImage"]) {
                        images.push(attachment["style_type_renderer"]["attachment"]["media"]["thumbnailImage"]["uri"]);
                      } else {
                        images.push(attachment["style_type_renderer"]["attachment"]["media"]["image"]["uri"]);
                      }
                    }
                    if (attachment["style_type_renderer"]["attachment"]["all_subattachments"]) {
                      images = images.concat(
                        attachment["style_type_renderer"]["attachment"]["all_subattachments"]["nodes"].map(
                          node => node["media"]["image"]["uri"]
                        )
                      );
                    }
                    return images;
                  })
                  .reduce((images, attachments) => {
                    return images.concat(attachments);
                  }, [])
              };
            } catch (e) {
              console.log(node);
              console.log(e);
              return null;
            }
          })
          .filter(node => node !== null)
          .map(node => ({
            ...node,
            countLoaded: 0,
            probablyApprovedImage: true,
            probablyApprovedContent: !this.hasWarning(node.message)
          }))
          .map(node => ({
            ...node,
            probablyApproved: (() => {
              if (node.attachments.length === 0 && node.probablyApprovedContent) {
                if (this.autoApprove) {
                  setTimeout(() => {
                    console.log("Tự động phê duyệt: " + node.message);
                    this.approvePost(node.id);
                  }, 3000);
                }
              }
              return node.probablyApprovedContent;
            })()
          }))
      );
    },
    hasRejection(content) {
      content = content.normalize("NFC").toLowerCase();
      for (let text of this.APPROVE_LIST) {
        if (content.indexOf(text) > -1) {
          return false;
        }
      }
      for (let text of this.REJECT_LIST) {
        if (content.indexOf(text) > -1) {
          return true;
        }
      }
      return false;
    },
    hasWarning(content) {
      const LIST = this.BLACK_LIST.concat(this.REJECT_LIST);
      content = content.normalize("NFC").toLowerCase();
      for (let text of LIST) {
        if (content.indexOf(text) > -1) {
          return true;
        }
      }
      return false;
    },
    approvePost(id) {
      this.queues.push(this.$http.approvePost, { postId: id, groupId: this.groupId, roleId: this.roleId });
      this.posts = this.posts.filter(post => post.id !== id);
    },
    removePost(id) {
      this.queues.push(this.$http.removePost, { postId: id, groupId: this.groupId, roleId: this.roleId });
      this.posts = this.posts.filter(post => post.id !== id);
    },
    approveAllPosts() {
      for (let post of this.posts) {
        this.queues.push(this.$http.approvePost, { postId: post.id, groupId: this.groupId, roleId: this.roleId });
      }
      this.posts = [];
      setTimeout(this.getNextPostList, 1000);
    },
    removeAllPosts() {
      for (let post of this.posts) {
        this.queues.push(this.$http.removePost, { postId: post.id, groupId: this.groupId, roleId: this.roleId });
      }
      this.posts = [];
      setTimeout(this.getNextPostList, 1000);
    },
    getContent(node) {
      let contents = [];
      if (node["comet_sections"]["content"]["story"]["comet_sections"]["message"]["story"]) {
        contents.push(
          node["comet_sections"]["content"]["story"]["comet_sections"]["message"]["story"]["message"]["text"]
        );
      }
      if (node["comet_sections"]["content"]["story"]["comet_sections"]["message"]["rich_message"]) {
        contents.push(
          node["comet_sections"]["content"]["story"]["comet_sections"]["message"]["rich_message"]
            .map(rich => rich.text)
            .join(" ")
        );
      }
      return contents.join(" ");
    },
    imageLoaded(post, element) {
      if (element.width / element.height < 1.5 || element.width < 20 || element.height < 20) {
        post.probablyApprovedImage = false;
      }

      const rgb = this.$common.getAverageRGB(element);
      if (rgb.r > 100 || rgb.g > 100 || rgb.b > 100) {
        post.probablyApprovedImage = false;
      }
      if (rgb.g / rgb.b < 0.7 || rgb.g / rgb.b > 1.5) {
        post.probablyApprovedImage = false;
      }
      if (rgb.r / rgb.g < 0.7 || rgb.r / rgb.g > 1.5) {
        post.probablyApprovedImage = false;
      }

      if (++post.countLoaded === post.attachments.length) {
        post.probablyApproved = post.probablyApproved && post.probablyApprovedImage;
        if (this.autoApprove && post.probablyApproved) {
          setTimeout(() => {
            console.log("Tự động phê duyệt (có hình ảnh): " + post.message);
            this.approvePost(post.id);
          }, 1000);
        }
      }
    },
    autoApproveForGroups() {
      console.log("Bắt đầu duyệt...");
      setInterval(() => {
        const group = getNextGroup();
        console.log(`Group: ${group.name}`);
        this.query.groupId = group.id;
        this.REJECT_LIST = group.rejectList || [];
        this.APPROVE_LIST = group.approveList || [];
        this.BLACK_LIST = group.blackList || [];
        this.query.autoApprove = !!group.hasApprovePost;
        this.updateQuery();
      }, 30 * 1000);
    }
  }
};
</script>

<style scoped>
.mh-250 {
  max-height: 250px;
}
</style>
