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
            <button type="button" class="btn btn-default toastsDefaultDefault">
              Launch Default Toast
            </button>
            <div class="text-muted mt-3"></div>
          </div>
        </div>
      </div>
      <!-- Col 2 -->
      <div class="col-md-6">
        <div class="card card-success card-outline">
          <div class="card-header">
            <h3 class="card-title">
              <font-awesome-icon :icon="['fas', 'list']" />
              Danh sách bạn bè được chọn
            </h3>
          </div>
          <div class="card-body table-responsive p-0">
            <div class="m-2">
              <button type="button" class="btn btn-primary" @click="unfriends">Hủy kết bạn</button>
            </div>

            <table class="table table-head-fixed text-nowrap">
              <thead>
                <tr>
                  <th>
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" id="checkboxAll" />
                      <label for="checkboxAll" class="custom-control-label"></label>
                    </div>
                  </th>
                  <th>ID</th>
                  <th>TÊN</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="friend in friendList" :key="friend.id">
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
                      <div class="align-self-center">
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
      friendList: []
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
    }
  }
};
</script>
