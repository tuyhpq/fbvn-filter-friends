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
              Điều kiện lọc bạn bè
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
                        <img :src="`https://graph.facebook.com/${friend.id}/picture?type=small`" />
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
        notCountryVi: false
      }
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
          let response = await this.$http.removeFriend(unfriendList[0].id);
          if (response) {
            this.$alert.success("Hủy kết bạn thành công.");
          }
        }
      }
    },
    filterFriends() {
      this.filterFriendList = this.friendList.filter(friend => {
        if (this.queries.notCountryVi) {
          if (friend.location && friend.location.location) {
            if (friend.location.location["country_code"] !== "VN") {
              return true;
            }
          }
        }
        return false;
      });
    }
  }
};
</script>
