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
              Tìm kiếm bạn bè cần lọc (bạn có {{ friendList.length }} bạn bè)
            </h3>
          </div>
          <div class="card-body">
            <div class="form-group">
              <div class="custom-control custom-checkbox">
                <input class="custom-control-input" type="checkbox" id="checkboxGender" v-model="queries.gender" />
                <label for="checkboxGender" class="custom-control-label">Giới tính</label>
              </div>
              <div class="pl-3" v-show="queries.gender">
                <div class="custom-control custom-checkbox">
                  <input class="custom-control-input" type="checkbox" id="customMale" value="male" v-model="queries.genderValue" />
                  <label for="customMale" class="custom-control-label">Nam</label>
                </div>
                <div class="custom-control custom-checkbox">
                  <input class="custom-control-input" type="checkbox" id="customFemale" value="female" v-model="queries.genderValue" />
                  <label for="customFemale" class="custom-control-label">Nữ</label>
                </div>
                <div class="custom-control custom-checkbox">
                  <input class="custom-control-input" type="checkbox" id="customUnknownGender" value="unknown" v-model="queries.genderValue" />
                  <label for="customUnknownGender" class="custom-control-label">Không xác định</label>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="custom-control custom-checkbox">
                <input class="custom-control-input" type="checkbox" id="checkboxMutualFriend" v-model="queries.mutualFriend" :disabled="loadedMutualFriends !== 100" />
                <label for="checkboxMutualFriend" class="custom-control-label">
                  Số lượng bạn chung
                  <template v-if="loadedMutualFriends !== 100"> (<font-awesome-icon :icon="['fas', 'spinner']" spin /> {{ loadedMutualFriends }}%) </template>
                </label>
              </div>
              <div class="pl-3 mt-1" v-show="queries.mutualFriend">
                <label class="mr-1">Nhỏ hơn</label>
                <input type="text" class="form-control w-auto d-inline-block" v-model="queries.mutualFriendValue" @blur="blurMutualFriendValue" />
              </div>
            </div>
            <div class="form-group">
              <div class="custom-control custom-checkbox">
                <input class="custom-control-input" type="checkbox" id="checkboxNotCountryVi" v-model="queries.notCountryVi" />
                <label for="checkboxNotCountryVi" class="custom-control-label">Quốc gia không phải Việt Nam</label>
              </div>
            </div>
            <div class="form-group">
              <div class="custom-control custom-checkbox">
                <input class="custom-control-input" type="checkbox" id="checkboxNotAvatar" v-model="queries.notAvatar" />
                <label for="checkboxNotAvatar" class="custom-control-label">Không có ảnh đại diện</label>
              </div>
            </div>
            <div class="form-group">
              <div class="custom-control custom-checkbox">
                <input class="custom-control-input" type="checkbox" id="checkboxSpecialCharacters" v-model="queries.specialCharacters" />
                <label for="checkboxSpecialCharacters" class="custom-control-label">
                  Tên chứa kí tự đặc biệt
                </label>
              </div>
            </div>
            <div class="form-group">
              <div class="custom-control custom-checkbox">
                <input class="custom-control-input" type="checkbox" id="checkboxNotPosts" v-model="queries.notPosts" :disabled="loadedFriendsPost !== 100" />
                <label for="checkboxNotPosts" class="custom-control-label">
                  Không đăng bài trong một khoảng thời gian
                  <template v-if="loadedFriendsPost !== 100"> (<font-awesome-icon :icon="['fas', 'spinner']" spin /> {{ loadedFriendsPost }}%) </template>
                </label>
              </div>
              <div class="pl-3" v-show="queries.notPosts">
                <div class="custom-control custom-radio">
                  <input class="custom-control-input" type="radio" id="radioNotPosts1" name="radioNotPosts" value="3d" v-model="queries.notPostsValue" />
                  <label for="radioNotPosts1" class="custom-control-label">3 ngày gần đây</label>
                </div>
                <div class="custom-control custom-radio">
                  <input class="custom-control-input" type="radio" id="radioNotPosts2" name="radioNotPosts" value="1w" v-model="queries.notPostsValue" />
                  <label for="radioNotPosts2" class="custom-control-label">1 tuần gần đây</label>
                </div>
                <div class="custom-control custom-radio">
                  <input class="custom-control-input" type="radio" id="radioNotPosts3" name="radioNotPosts" value="1M" v-model="queries.notPostsValue" />
                  <label for="radioNotPosts3" class="custom-control-label">1 tháng gần đây</label>
                </div>
                <div class="custom-control custom-radio">
                  <input class="custom-control-input" type="radio" id="radioNotPosts4" name="radioNotPosts" value="1y" v-model="queries.notPostsValue" />
                  <label for="radioNotPosts4" class="custom-control-label">1 năm gần đây</label>
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
                  <th width="30%">ID</th>
                  <th width="60%">Tên</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="friend in filterFriendList" :key="friend.id">
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
      filterFriendList: [],
      loadedMutualFriends: 0,
      loadedFriendsPost: 0,
      queries: {
        gender: false,
        genderValue: ["male", "unknown"],
        mutualFriend: false,
        mutualFriendValue: "1",
        notCountryVi: false,
        notAvatar: false,
        specialCharacters: false,
        notPosts: false,
        notPostsValue: "1w"
      },
      selectedAllFriend: false,
      selectionMode: "CHECK",
      regexName: /^[\saAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ]*$/u,
      nowTime: this.$moment().unix(),
      threeDayAgo: this.$moment()
        .subtract(3, "d")
        .unix(),
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
    this.getFriendList(() => {
      this.loadMutualFriends();
      this.loadFriendsPost();
    });
    document.body.addEventListener("mouseup", this.selectionEventListener);
  },
  methods: {
    selectAllFriend() {
      this.filterFriendList.forEach(friend => {
        friend.selected = this.selectedAllFriend;
      });
    },
    selectFriend(selected) {
      this.$nextTick(() => {
        if (!selected) {
          this.selectedAllFriend = false;
        } else {
          for (let friend of this.filterFriendList) {
            if (!friend.selected) {
              return;
            }
          }
          this.selectedAllFriend = true;
        }
      });
    },
    async getFriendList(next) {
      if (this.$store.state.friends.length > 0) {
        this.friendList = this.$store.state.friends;
        return next && next();
      }

      let response = await this.$http.getFriendList(["name", "gender"]);
      if (response) {
        let responsePicture = await this.$http.getFriendList(["picture{is_silhouette,url}"]);
        if (responsePicture) {
          let responseCountry = await this.$http.getFriendList(["location{location{country,country_code}}", "hometown{location{country,country_code}}", "locale"]);
          if (responseCountry) {
            let friendList = response.data.data;
            let pictureFriendList = responsePicture.data.data;
            let countryFriendList = responseCountry.data.data;

            for (let friend of friendList) {
              friend.selected = false;
              if (friend.gender !== "male" && friend.gender !== "female") {
                friend.gender = "unknown";
              }
              let pictureFriend = pictureFriendList.find(x => x.id === friend.id);
              if (pictureFriend) {
                friend["picture"] = pictureFriend["picture"];
              }
              let countryFriend = countryFriendList.find(x => x.id === friend.id);
              if (countryFriend) {
                friend["location"] = countryFriend["location"];
                friend["hometown"] = countryFriend["hometown"];
                friend["locale"] = countryFriend["locale"];
              }
            }
            this.friendList = friendList;
            this.$store.commit("setFriends", { friends: this.friendList });
            return next && next();
          }
        }
      }
    },
    async loadMutualFriends() {
      let response = await this.$http.getMutualFriends();
      if (response) {
        let data = response.data[this.$store.state.user.id]["friends"];
        let mutualFriends = data.edges;
        while (response && data["page_info"]["has_next_page"] && this.$route.name === this.screenName) {
          response = await this.$http.getMutualFriends(data["page_info"]["end_cursor"]);
          if (response) {
            data = response.data[this.$store.state.user.id]["friends"];
            mutualFriends = mutualFriends.concat(data.edges);
          }
        }

        for (let friend of this.friendList) {
          let mutualFriend = mutualFriends.find(x => x["node"]["id"] === friend.id);
          if (mutualFriend) {
            friend["mutualFriend"] = mutualFriend["node"]["mutual_friends"]["count"];
          }
        }
        this.loadedMutualFriends = 100;
      }
    },
    async loadFriendsPost() {
      let response = await this.$http.getFriendList([`posts.since(${this.oneYearAgo}).limit(10){created_time}`], 25, true);
      if (response) {
        let postFriendList = response.data.data;
        while (response && response.data.paging.next && this.$route.name === this.screenName) {
          response = await this.$axios.get(response.data.paging.next, { notLoading: true });
          if (response) {
            postFriendList = postFriendList.concat(response.data.data);
          }
          this.loadedFriendsPost = Math.round((postFriendList.length * 100) / this.friendList.length);
        }

        for (let friend of this.friendList) {
          let postFriend = postFriendList.find(x => x.id === friend.id);
          if (postFriend) {
            friend["posts"] = postFriend["posts"];
          }
        }
        this.loadedFriendsPost = 100;
      }
    },
    async unfriends() {
      let unfriendList = this.filterFriendList.filter(x => x.selected);
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
            this.filterFriendList.remove(unfriend);
            this.friendList.remove(unfriend);
            this.$store.commit("setFriends", { friends: this.friendList });

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

      this.filterFriendList = this.friendList.filter(friend => {
        // Gender
        if (this.queries.gender && this.queries.genderValue.length > 0) {
          if (this.queries.genderValue.indexOf(friend.gender) < 0) {
            return false;
          }
        }
        // MutualFriend
        if (this.queries.mutualFriend) {
          if (friend.mutualFriend >= this.queries.mutualFriendValue) {
            return false;
          }
        }
        // Not CountryVi
        if (this.queries.notCountryVi) {
          if (
            friend.locale === "vi_VN" ||
            (friend.location && friend.location.location && friend.location.location["country_code"] === "VN") ||
            (friend.hometown && friend.hometown.location && friend.hometown.location["country_code"] === "VN")
          ) {
            return false;
          }
        }
        // Not Avatar
        if (this.queries.notAvatar) {
          if (friend.picture && friend.picture.data && friend.picture.data["is_silhouette"] === false) {
            return false;
          }
        }
        // Not SpecialCharacters
        if (this.queries.specialCharacters) {
          if (this.regexName.test(friend.name.normalize("NFC"))) {
            return false;
          }
        }
        // Not Posts
        if (this.queries.notPosts) {
          if (friend.posts && friend.posts.data && friend.posts.data.length > 0) {
            let recentPostTime = this.$moment(friend.posts.data[0].created_time).unix();
            let timeAgo =
              this.queries.notPostsValue === "3d" ? this.threeDayAgo : this.queries.notPostsValue === "1w" ? this.oneWeekAgo : this.queries.notPostsValue === "1M" ? this.oneMonthAgo : this.oneYearAgo;
            if (recentPostTime > timeAgo) {
              return false;
            }
          }
        }

        // reset friend handle
        friend.selected = false;

        return true;
      });

      // reset variable handle
      this.selectedAllFriend = false;

      await this.$common.sleep(500);
      await this.$nextTick();
      this.$loader.fadeOut();
    },
    selectionEventListener() {
      let selectionMode = this.selectionMode === "CHECK";
      let text = window.getSelection().toString();
      let ids = text.match(/[0-9]{5,}/g);
      if (ids) {
        ids.forEach(id => {
          let friend = this.filterFriendList.find(x => x.id === id);
          if (friend) {
            friend.selected = selectionMode;
          }
        });
        for (let friend of this.filterFriendList) {
          if (!friend.selected) {
            this.selectedAllFriend = false;
            return;
          }
        }
        this.selectedAllFriend = true;
      }
    },
    blurMutualFriendValue() {
      if (this.queries.mutualFriendValue.length === 0 || !isFinite(this.queries.mutualFriendValue) || parseInt(this.queries.mutualFriendValue) < 1) {
        this.queries.mutualFriendValue = "1";
      } else {
        this.queries.mutualFriendValue = parseInt(this.queries.mutualFriendValue).toString();
      }
    }
  },
  beforeDestroy() {
    document.body.removeEventListener("mouseup", this.selectionEventListener);
  }
};
</script>
