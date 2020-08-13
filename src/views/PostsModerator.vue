<template>
  <div class="container-fluid">
    <!-- Row Search -->
    <div class="row border border-dark rounded pt-2 mb-3">
      <div class="col-12">
        <form class="form-inline" @submit.prevent="reload">
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
            <div class="custom-control custom-switch">
              <input type="checkbox" class="custom-control-input" id="autoApprove" v-model="query.autoApprove" />
              <label class="custom-control-label" for="autoApprove">Tự động phê duyệt bài viết</label>
            </div>
          </div>
          <button type="submit" class="btn btn-info mb-2">Cập nhật</button>
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
const REJECTS = [
  "tuyển nhân viên",
  "trẻ trâu",
  "lđ",
  "dịch vụ facebook",
  " cc",
  " cl ",
  " cm",
  " vl",
  "ai bán",
  "ai cần",
  "ai mua",
  "bán ac",
  "bán kim",
  "bán kc",
  "bán nick",
  "bán níck",
  "bốc phốt",
  "cày thuê",
  "cần acc",
  "cần bán",
  "cần đổi",
  "cần mua",
  "𝗖𝗹𝗶𝗽",
  "code",
  "cứt",
  "dcm",
  "dkm",
  "dm",
  "dâm",
  "đcm",
  "địt",
  "đkm",
  "đm",
  "vkl",
  "đổi ac",
  "đổi nick",
  "đổi níck",
  "event tặng",
  "gdtg",
  "giá chỉ",
  "giá học sinh",
  "hack",
  "http",
  "kc miễn phí",
  "kc giá rẻ",
  "kiếm thẻ",
  "kiếm tiền",
  "kim cương giá rẻ",
  "kim cương miễn phí",
  "liên hệ",
  "link",
  "loz",
  "lồn",
  "lừa",
  "miễn phí 100%",
  "mini game",
  "minigame",
  "mua ac",
  "mua ib",
  "mua kim",
  "mua kc",
  "mua nick",
  "mua níck",
  "nghỉ game",
  "nghĩ game",
  "ngu",
  "nhận kim",
  "nhận kc",
  "nhận quà",
  "nhận thẻ",
  "nhận ac",
  "nhận nạp k",
  "óc chó",
  "sủa",
  "súc vật",
  "tặng quà",
  "tặng thẻ",
  "tặng kim",
  "tặng kc",
  "tặng acc",
  "trẩu",
  "tuyển dụng",
  "uy tín 100%",
  "zalo",
  "lộ hàng",
  "thanh lý",
  "thanh lí"
];

const BLACK_LIST = [
  "xả hàng",
  "kb",
  "add",
  "kết bạn",
  "ib",
  "inb",
  "code",
  "free",
  "miễn phí",
  "uy tín",
  "link",
  "clip",
  "xoxo",
  "chấm",
  "dâm",
  "show",
  "tặng",
  "thẻ cào",
  "nhập mã",
  "giá cả"
];

const APPROVES = ["tuyển thành viên", "tuyển tv", "ttv"];

export default {
  data() {
    return {
      query: {
        groupId: "694039351025214",
        orderBy: "RECENT",
        autoApprove: true
      },
      groupId: null,
      orderBy: null,
      autoApprove: true,

      cursor: null,
      posts: []
    };
  },
  created() {
    this.reload();

    setInterval(() => {
      console.log("RELOAD!!!");
      this.reload();
    }, 30 * 1000);
  },
  methods: {
    async reload() {
      this.groupId = this.query.groupId;
      this.orderBy = this.query.orderBy;
      this.autoApprove = this.query.autoApprove;

      this.cursor = null;
      this.posts = [];
      this.getNextPostList(await this.getFirstPendingPostsCursor());
    },
    async getFirstPendingPostsCursor() {
      const response = await this.$http.getFirstPendingPostsData({ groupId: this.groupId, orderBy: this.orderBy });
      if (response) {
        this.cursor = response.data.data.group["pending_posts_section_stories"]["page_info"]["end_cursor"];
        return response.data.data.group["pending_posts_section_stories"]["edges"];
      }
      return [];
    },
    async getNextPostList(availableEdges = []) {
      const response = await this.$http.getNextPendingPostsData({
        cursor: this.cursor,
        groupId: this.groupId,
        orderBy: this.orderBy
      });
      if (response) {
        this.posts = availableEdges
          .concat(response.data.data.node["pending_posts_section_stories"].edges)
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
              approved = approved && rejected === false;
            }

            if (!approved) {
              this.$http.removePost({ postId: node["id"], groupId: this.groupId });
            }

            return approved;
          })
          .map(node => {
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
                    } else {
                      images.push(attachment["style_type_renderer"]["attachment"]["media"]["thumbnailImage"]["uri"]);
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
                }, []),
              countLoaded: 0
            };
          })
          .map(node => ({
            ...node,
            probablyApprovedImage: true,
            probablyApprovedContent: !this.hasWarning(node.message)
          }))
          .map(node => ({
            ...node,
            probablyApproved: (() => {
              if (node.attachments.length === 0 && node.probablyApprovedContent) {
                if (this.autoApprove) {
                  setTimeout(() => {
                    console.log("Tự động approve: " + node.id);
                    this.approvePost(node.id);
                  }, 3000);
                }
              }
              return node.probablyApprovedContent;
            })()
          }));
        this.cursor = response.data.data.node["pending_posts_section_stories"]["page_info"]["end_cursor"];
      }
    },
    hasRejection(content) {
      var rejected = false;
      content = content.normalize("NFC").toLowerCase();
      for (let text of APPROVES) {
        if (content.indexOf(text) > -1) {
          return false;
        }
      }
      for (let text of REJECTS) {
        if (content.indexOf(text) > -1) {
          rejected = true;
          break;
        }
      }
      return rejected;
    },
    hasWarning(content) {
      var rejected = false;
      var list = BLACK_LIST.concat(REJECTS);
      content = content.normalize("NFC").toLowerCase();
      for (let text of list) {
        if (content.indexOf(text) > -1) {
          rejected = true;
          break;
        }
      }
      return rejected;
    },
    approvePost(id) {
      this.$http.approvePost({ postId: id, groupId: this.groupId });
      this.posts = this.posts.filter(post => post.id !== id);
    },
    removePost(id) {
      this.$http.removePost({ postId: id, groupId: this.groupId });
      this.posts = this.posts.filter(post => post.id !== id);
    },
    approveAllPosts() {
      for (let post of this.posts) {
        this.$http.approvePost({ postId: post.id, groupId: this.groupId });
      }
      this.posts = [];
      setTimeout(this.getNextPostList, 1000);
    },
    removeAllPosts() {
      for (let post of this.posts) {
        this.$http.removePost({ postId: post.id, groupId: this.groupId });
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
            console.log("Tự động approve (có hình ảnh): " + post.id);
            this.approvePost(post.id);
          }, 1000);
        }
      }
    }
  }
};
</script>

<style scoped>
.mh-250 {
  max-height: 250px;
}
</style>
