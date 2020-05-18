<template>
  <div class="container-fluid">
    <!-- Row 1 -->
    <div class="row">
      <!-- Col 1 -->
      <div class="col-md-6">
        <div class="card card-info card-outline">
          <div class="card-header">
            <h3 class="card-title">
              <font-awesome-icon :icon="['fas', 'search']" />
              Điều kiện lọc bạn bè (bạn có {{ friendList.length }} bạn bè)
            </h3>
          </div>
          <div class="card-body">
            <div class="form-group">
              <div class="custom-control custom-checkbox">
                <input
                  class="custom-control-input"
                  type="checkbox"
                  id="checkboxNotCountryVi"
                  v-model="queries.notCountryVi"
                />
                <label for="checkboxNotCountryVi" class="custom-control-label">Quốc gia không phải Việt Nam</label>
              </div>
            </div>
            <div class="form-group">
              <div class="custom-control custom-checkbox">
                <input
                  class="custom-control-input"
                  type="checkbox"
                  id="checkboxNotAvatar"
                  v-model="queries.notAvatar"
                />
                <label for="checkboxNotAvatar" class="custom-control-label">Không có ảnh đại diện</label>
              </div>
            </div>
            <div class="form-group">
              <div class="custom-control custom-checkbox">
                <input
                  class="custom-control-input"
                  type="checkbox"
                  id="checkboxJoinedTime"
                  v-model="queries.joinedTime"
                />
                <label for="checkboxJoinedTime" class="custom-control-label">Thời gian tham gia Facebook</label>
              </div>
            </div>
            <div class="form-group">
              <div class="custom-control custom-checkbox">
                <input class="custom-control-input" type="checkbox" id="checkboxNotPosts" v-model="queries.notPosts" />
                <label for="checkboxNotPosts" class="custom-control-label">
                  Không đăng bài trong một khoảng thời gian
                </label>
              </div>
              <div class="pl-3" v-show="queries.notPosts">
                <div class="custom-control custom-radio">
                  <input
                    class="custom-control-input"
                    type="radio"
                    id="radioNotPosts1"
                    name="radioNotPosts"
                    value="1w"
                    v-model="queries.notPostsValue"
                  />
                  <label for="radioNotPosts1" class="custom-control-label">1 tuần gần đây</label>
                </div>
                <div class="custom-control custom-radio">
                  <input
                    class="custom-control-input"
                    type="radio"
                    id="radioNotPosts2"
                    name="radioNotPosts"
                    value="1M"
                    v-model="queries.notPostsValue"
                  />
                  <label for="radioNotPosts2" class="custom-control-label">1 tháng gần đây</label>
                </div>
                <div class="custom-control custom-radio">
                  <input
                    class="custom-control-input"
                    type="radio"
                    id="radioNotPosts3"
                    name="radioNotPosts"
                    value="1y"
                    v-model="queries.notPostsValue"
                  />
                  <label for="radioNotPosts3" class="custom-control-label">1 năm gần đây</label>
                </div>
                <div class="custom-control custom-radio">
                  <input
                    class="custom-control-input"
                    type="radio"
                    id="radioNotPosts4"
                    name="radioNotPosts"
                    value=""
                    v-model="queries.notPostsValue"
                  />
                  <label for="radioNotPosts4" class="custom-control-label">Không đăng bài nào</label>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button type="button" class="btn btn-info" @click="filterFriends">
              Xem kết quả
              <font-awesome-icon :icon="['fas', 'arrow-right']" />
            </button>
          </div>
        </div>
      </div>
      <!-- Col 2 -->
      <div class="col-md-6">
        <div class="card card-success card-outline">
          <div class="card-header">
            <h3 class="card-title">
              <font-awesome-icon :icon="['fas', 'list']" />
              Danh sách bạn bè được chọn ({{ filterFriendList.length }})
            </h3>
          </div>
          <div class="card-body">
            <button type="button" class="btn btn-primary" @click="unfriends">Hủy kết bạn</button>
          </div>
          <div class="card-body table-responsive p-0" style="height: 80vh;">
            <table class="table table-head-fixed">
              <thead>
                <tr>
                  <th width="10%">
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" id="checkboxAll" />
                      <label for="checkboxAll" class="custom-control-label"></label>
                    </div>
                  </th>
                  <th width="30%">ID</th>
                  <th width="60%">Tên</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="friend in filterFriendList" :key="friend.id">
                  <td class="align-middle">
                    <div class="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        :id="`checkbox${friend.id}`"
                        v-model="friend.selected"
                      />
                      <label :for="`checkbox${friend.id}`" class="custom-control-label"></label>
                    </div>
                  </td>
                  <td class="align-middle">{{ friend.id }}</td>
                  <td class="align-middle">
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
                </tr>
              </tbody>
            </table>
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
      friendList: [],
      filterFriendList: [],
      queries: {
        notCountryVi: false,
        notAvatar: false,
        joinedTime: false,
        notPosts: false,
        notPostsValue: "1w"
      },
      nowTime: this.$moment().unix(),
      oneWeekAgo: this.$moment()
        .subtract(1, "w")
        .unix(),
      oneMonthAgo: this.$moment()
        .subtract(1, "M")
        .unix(),
      oneYearAgo: this.$moment()
        .subtract(1, "y")
        .unix()
    };
  },
  created() {
    this.getFriendList();
  },
  methods: {
    async getFriendList() {
      let response = await this.$http.getFriendList(this.$store.state.user.accessToken);
      for (let friend of response.data.data) {
        friend.selected = false;
      }
      this.friendList = response.data.data;
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
              this.$alert.toastSuccess(
                `Hủy kết bạn với <a target="_blank" href="https://www.facebook.com/profile.php?id=${unfriend.id}">${unfriend.name}</a> thành công.`
              );
            } else {
              this.$alert.toastError(
                `Hủy kết bạn với <a target="_blank" href="https://www.facebook.com/profile.php?id=${unfriend.id}">${unfriend.name}</a> thất bại.`
              );
            }
            unfriendList.removeAt(0);
            this.filterFriendList.remove(unfriend);
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
    async filterFriends() {
      this.$loader.fadeIn();
      await this.$common.sleep(100);
      await this.$nextTick();

      if (!this.queries.notCountryVi && !this.queries.notAvatar && !this.queries.notPosts) {
        this.filterFriendList = this.friendList;
      } else {
        this.filterFriendList = this.friendList.filter(friend => {
          // Not CountryVi
          if (this.queries.notCountryVi) {
            if (friend.location && friend.location.location) {
              if (friend.location.location["country_code"] !== "VN") {
                return true;
              }
            }
          }
          // Not Avatar
          if (this.queries.notAvatar) {
            if (friend.picture && friend.picture.data) {
              if (friend.picture.data["is_silhouette"] === true) {
                return true;
              }
            }
          }
          // Not Posts
          if (this.queries.notPosts) {
            if (friend.posts && friend.posts.data && friend.posts.data.length > 0) {
              let recentPostTime = this.$moment(friend.posts.data[0].created_time).unix();
              if (this.queries.notPostsValue === "1w") {
                return recentPostTime < this.oneWeekAgo;
              } else if (this.queries.notPostsValue === "1M") {
                return recentPostTime < this.oneMonthAgo;
              } else if (this.queries.notPostsValue === "1y") {
                return recentPostTime < this.oneYearAgo;
              }
            } else {
              return true;
            }
          }
          return false;
        });
      }

      await this.$common.sleep(500);
      await this.$nextTick();
      this.$loader.fadeOut();
    }
  }
};
</script>
