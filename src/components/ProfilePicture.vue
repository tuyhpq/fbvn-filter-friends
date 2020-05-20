<template>
  <div>
    <div :class="{ 'avatar-guard': hasAvatarGuard }" class="text-center">
      <img class="profile-user-img img-fluid img-circle" :src="$store.state.user.avatarUrl" />
    </div>

    <div class="form-group text-center mt-1">
      <div class="custom-control custom-switch" v-if="hasAvatarGuard !== null">
        <input type="checkbox" class="custom-control-input" id="avatarGuard" v-model="hasAvatarGuard" />
        <label class="custom-control-label font-weight-normal font-italic" for="avatarGuard">
          {{ hasAvatarGuard ? "Đã bật khiên bảo vệ ảnh đại diện" : "Chưa bật khiên bảo vệ ảnh đại diện" }}
        </label>
      </div>
      <template v-else>
        <font-awesome-icon :icon="['fas', 'spinner']" spin />
      </template>
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
      hasAvatarGuard: null
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      let response = await this.$axios.get(`https://m.facebook.com/profile.php?id=${this.$store.state.user.id}`, {
        notLoading: true
      });
      this.hasAvatarGuard = response.data.includes("_4dc_ _4dd0");
    }
  },
  watch: {
    async hasAvatarGuard(newValue, oldValue) {
      if (oldValue !== null) {
        this.$loader.push();
        await this.$nextTick();

        await this.$http.profilePictureGuard(newValue);
        await this.fetch();

        await this.$nextTick();
        this.$loader.pop();
      }
    }
  }
};
</script>
