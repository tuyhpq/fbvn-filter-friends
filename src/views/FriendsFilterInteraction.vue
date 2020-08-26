<template>
  <div class="container-fluid">
    <!-- Row 1 -->
    <div class="row">
      <!-- Col 1 -->
      <div class="col-12">
        <div class="card card-success card-outline">
          <div class="card-header">
            <h3 class="card-title">
              <font-awesome-icon :icon="['fas', 'sort-amount-down']" />
              Lọc bạn bè theo mức độ tương tác với bạn (bạn có {{ friendList.length }} bạn bè)
            </h3>
          </div>
          <div class="card-body">
            <button type="button" class="btn btn-danger" @click="unfriends">Hủy kết bạn</button>
          </div>
          <div class="card-body table-responsive p-0" style="height: 80vh;">
            <table class="table table-head-fixed">
              <thead>
                <tr>
                  <th width="10%">
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" id="checkboxAll" v-model="selectedAllFriend" @change="selectAllFriend" />
                      <label for="checkboxAll" class="custom-control-label"></label>
                    </div>
                  </th>
                  <th width="20%">ID</th>
                  <th width="30%">Tên</th>
                  <th width="20%">Lượt tương tác</th>
                  <th width="20%">Lượt bình luận</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="friend in friendList" :key="friend.id">
                  <td class="align-middle">
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" :id="`checkbox${friend.id}`" v-model="friend.selected" @change="selectFriend(friend.selected)" />
                      <label :for="`checkbox${friend.id}`" class="custom-control-label" v-once></label>
                    </div>
                  </td>
                  <td class="align-middle" v-once>{{ friend.id }}</td>
                  <td class="align-middle" v-once>
                    <div class="d-flex">
                      <div class="align-self-center mr-1">
                        <img :src="friend.picture.data.url" />
                      </div>
                      <div class="align-self-center text-break">
                        <span class="username">
                          <a target="_blank" :href="`https://www.facebook.com/profile.php?id=${friend.id}`">
                            {{ friend.name }}
                          </a>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle">{{ friend.reaction }}</td>
                  <td class="align-middle">{{ friend.comment }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer">
            <span class="badge badge-info mr-1">Mẹo</span>
            <label class="mr-3 mb-0">Bôi đen cột ID để</label>
            <div class="custom-control custom-radio custom-control-inline">
              <input class="custom-control-input" type="radio" id="radioSelection1" name="radioSelection" value="CHECK" v-model="selectionMode" />
              <label for="radioSelection1" class="custom-control-label">Chọn</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline">
              <input class="custom-control-input" type="radio" id="radioSelection2" name="radioSelection" value="UNCHECK" v-model="selectionMode" />
              <label for="radioSelection2" class="custom-control-label">Bỏ chọn</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      screenName: this.$route.name,
      friendList: [],
      selectedAllFriend: false,
      selectionMode: "CHECK"
    };
  },
  async created() {
    this.$loader.push();

    await this.getFriendList();
    await this.getFriendInteraction();
    document.body.addEventListener("mouseup", this.selectionEventListener);

    await this.$common.sleep(500);
    this.$loader.pop();
  },
  methods: {
    selectAllFriend() {
      this.friendList.forEach(friend => {
        friend.selected = this.selectedAllFriend;
      });
    },
    selectFriend(selected) {
      this.$nextTick(() => {
        if (!selected) {
          this.selectedAllFriend = false;
        } else {
          for (let friend of this.friendList) {
            if (!friend.selected) {
              return;
            }
          }
          this.selectedAllFriend = true;
        }
      });
    },
    async getFriendList() {
      let response = await this.$http.getFriendList(["name", "picture{url}"]);
      if (response) {
        let friendList = response.data.data;

        for (let friend of friendList) {
          friend.selected = false;
          friend.reaction = 0;
          friend.comment = 0;
        }
        this.friendList = friendList;
      }
    },
    async getFriendInteraction() {
      let response = await this.$http.getInteraction();
      if (response) {
        let data = response.data[this.$store.state.user.id]["timeline_feed_units"];
        let feeds = data.edges;
        while (response && data["page_info"]["has_next_page"] && this.$route.name === this.screenName) {
          response = await this.$http.getInteraction(data["page_info"]["end_cursor"]);
          if (response) {
            data = response.data[this.$store.state.user.id]["timeline_feed_units"];
            feeds = feeds.concat(data.edges);
          }
        }

        let objectFriendList = {};
        for (let friend of this.friendList) {
          objectFriendList[friend.id] = friend;
        }

        for (let feed of feeds) {
          if (feed["node"]["feedback"]) {
            if (feed["node"]["feedback"]["commenters"]) {
              for (let node of feed["node"]["feedback"]["commenters"]["nodes"]) {
                if (objectFriendList[node.id]) {
                  objectFriendList[node.id].comment++;
                }
              }
            }
            if (feed["node"]["feedback"]["reactors"]) {
              for (let node of feed["node"]["feedback"]["reactors"]["nodes"]) {
                if (objectFriendList[node.id]) {
                  objectFriendList[node.id].reaction++;
                }
              }
            }
          }
        }

        this.friendList = this.$_.reverse(this.$_.sortBy(this.friendList, ["reaction", "comment"]));
      }
    },
    async unfriends() {
      let unfriendList = this.friendList.filter(x => x.selected);
      if (unfriendList.length > 0) {
        let result = await this.$alert.confirm(`Bạn có chắc chắn muốn xóa ${unfriendList.length} người bạn không?`);
        if (result.value) {
          this.$loader.push();
          await this.$common.sleep(100);
          await this.$nextTick();

          while (unfriendList.length > 0) {
            let unfriend = unfriendList[0];
            let response = await this.$http.removeFriend(unfriend.id);
            if (response) {
              this.$alert.toastSuccess(`Hủy kết bạn với <a target="_blank" href="https://www.facebook.com/profile.php?id=${unfriend.id}">${unfriend.name}</a> thành công.`);
            } else {
              this.$alert.toastError(`Hủy kết bạn với <a target="_blank" href="https://www.facebook.com/profile.php?id=${unfriend.id}">${unfriend.name}</a> thất bại.`);
            }
            unfriendList.removeAt(0);
            this.friendList.remove(unfriend);

            await this.$common.sleep(3000);

            if (unfriendList.length === 0) {
              this.$alert.success("Hủy kết bạn thành công.");
            }
          }

          await this.$common.sleep(500);
          await this.$nextTick();
          this.$loader.pop();
        }
      }
    },
    selectionEventListener() {
      let selectionMode = this.selectionMode === "CHECK";
      let text = window.getSelection().toString();
      let ids = text.match(/[0-9]{5,}/g);
      if (ids) {
        ids.forEach(id => {
          let friend = this.friendList.find(x => x.id === id);
          if (friend) {
            friend.selected = selectionMode;
          }
        });
        for (let friend of this.friendList) {
          if (!friend.selected) {
            this.selectedAllFriend = false;
            return;
          }
        }
        this.selectedAllFriend = true;
      }
    }
  },
  beforeDestroy() {
    document.body.removeEventListener("mouseup", this.selectionEventListener);
  }
};
</script>
