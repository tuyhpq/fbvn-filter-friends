<template>
  <div>
    <div class="text-center">
      <img class="profile-user-img img-fluid img-circle" :src="$store.state.user.avatarUrl" />
    </div>

    <div class="form-group text-center mt-1">
      <div class="custom-control custom-switch">
        <input type="checkbox" class="custom-control-input" id="avatarGuard" v-model="hasAvatarGuard" />
        <label class="custom-control-label font-weight-normal font-italic" for="avatarGuard">
          {{ hasAvatarGuard ? "Đã bật khiên bảo vệ ảnh đại diện" : "Chưa bật khiên bảo vệ ảnh đại diện" }}
        </label>
      </div>
    </div>

    <h3 class="profile-username text-center">
      <a :href="$store.state.user.profileUrl" target="_blank">
        {{ $store.state.user.name }}
      </a>
    </h3>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasAvatarGuard: false
    };
  }
};
</script>
