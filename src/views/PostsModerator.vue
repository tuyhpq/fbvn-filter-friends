<template>
  <div class="container-fluid">
    <!-- Row 1 -->
    <div class="row mb-3">
      <button type="button" class="btn btn-success mr-1" @click="approveAllPosts">
        Duyệt toàn bộ
      </button>
      <button type="button" class="btn btn-danger" @click="removeAllPosts">
        Xóa toàn bộ
      </button>
    </div>
    <!-- Row 2 -->
    <div class="row">
      <div class="col-6" v-for="post in posts" :key="post.id">
        <div class="card card-info card-outline">
          <div class="card-header">{{ $moment(post.timestamp).format("HH:mm DD/MM/YYYY") }} {{ post.actors }}</div>
          <div class="card-body">
            <div>{{ post.message }}</div>
            <img v-for="image in post.attachments" :key="image" :src="image" class="mw-100 mh-250" />
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
    <div class="row mt-3 mb-5">
      <button type="button" class="btn btn-success mr-1" @click="approveAllPosts">
        Duyệt toàn bộ
      </button>
      <button type="button" class="btn btn-danger" @click="removeAllPosts">
        Xóa toàn bộ
      </button>
    </div>
  </div>
</template>

<script>
const REJECTS = [
  " cc",
  " cl",
  " cm",
  "ai bán",
  "ai cần",
  "ai mua",
  "bán ac",
  "bán kim",
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
  "mua nick",
  "mua níck",
  "nghỉ game",
  "ngu",
  "nhận kim",
  "nhận quà",
  "nhận thẻ",
  "nhận ac",
  "óc chó",
  "sủa",
  "súc vật",
  "tặng quà",
  "tặng thẻ",
  "trẩu",
  "tuyển dụng",
  "uy tín 100%",
  "zalo"
];

export default {
  data() {
    return {
      groupId: "694039351025214",
      cursor: null,
      posts: []
    };
  },
  async created() {
    const availableEdges = await this.getFirstPendingPostsCursor();
    this.reloadPostList(availableEdges);
  },
  methods: {
    async getFirstPendingPostsCursor() {
      const response = await this.$http.getFirstPendingPostsData({ groupId: this.groupId });
      if (response) {
        this.cursor = response.data.data.group["pending_posts_section_stories"]["page_info"]["end_cursor"];
        return response.data.data.group["pending_posts_section_stories"]["edges"];
      }
      return [];
    },
    async reloadPostList(availableEdges = []) {
      const response = await this.$http.getNextPendingPostsData({ cursor: this.cursor, groupId: this.groupId });
      if (response) {
        this.posts = availableEdges
          .concat(response.data.data.node["pending_posts_section_stories"].edges)
          .map(edge => edge.node)
          .filter(node => {
            let approved =
              node["attached_story"] === null && // không phải bài chia sẻ
              node["comet_sections"]["content"] !== null &&
              node["comet_sections"]["content"]["story"]["comet_sections"]["message"] !== null &&
              node["comet_sections"]["content"]["story"]["attachments"] // không phải bài chia sẻ
                .map(attachment => attachment["style_list"])
                .reduce((styleList, style) => {
                  return styleList.concat(style);
                }, [])
                .indexOf("share") === -1;

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
            console.log(node);
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
                }, [])
            };
          });
        this.cursor = response.data.data.node["pending_posts_section_stories"]["page_info"]["end_cursor"];
      }
    },
    hasRejection(content) {
      var rejected = false;
      content = content.normalize("NFC").toLowerCase();
      for (let text of REJECTS) {
        if (content.indexOf(text) > -1) {
          rejected = true;
          break;
        }
      }
      return rejected;
    },
    removePost(id) {
      this.$http.removePost({ postId: id, groupId: this.groupId });
      this.posts = this.posts.filter(post => post.id !== id);
    },
    approveAllPosts() {
      for (let post of this.posts) {
        this.$http.aprovePost({ postId: post.id, groupId: this.groupId });
      }
      this.posts = [];
      setTimeout(this.reloadPostList, 1000);
    },
    removeAllPosts() {
      for (let post of this.posts) {
        this.$http.removePost({ postId: post.id, groupId: this.groupId });
      }
      this.posts = [];
      setTimeout(this.reloadPostList, 1000);
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
    }
  }
};
</script>

<style scoped>
.mh-250 {
  max-height: 250px;
}
</style>
