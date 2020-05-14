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
                      <input type="checkbox" class="custom-control-input" :id="`checkbox${friend.id}`" />
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
                          <a :href="`https://www.facebook.com/profile.php?id=${friend.id}`">{{ friend.name }}</a>
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
      this.friendList = response.data.data;
    }
  }
};
</script>
