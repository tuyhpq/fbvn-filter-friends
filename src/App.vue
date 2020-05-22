<template>
  <div id="app" class="wrapper">
    <!-- Navbar -->
    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" data-widget="pushmenu" href="#" role="button">
            <font-awesome-icon :icon="['fas', 'bars']" />
          </a>
        </li>
      </ul>
    </nav>

    <!-- Main Sidebar Container -->
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
      <!-- Brand Logo -->
      <router-link :to="{ name: 'FriendsFilter' }" class="brand-link">
        <img src="@/assets/img/logo.png" class="brand-image img-circle elevation-3" />
        <span class="brand-text font-weight-light">FBVN</span>
      </router-link>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- User panel -->
        <div class="user-panel mt-3 pb-3 mb-3 d-flex">
          <div class="image">
            <img v-if="$store.state.user.avatarUrl" :src="$store.state.user.avatarUrl" class="img-circle elevation-2" />
          </div>
          <div class="info">
            <router-link :to="{ name: 'Profile' }" class="d-block">
              {{ $store.state.user.name }}
            </router-link>
          </div>
        </div>

        <!-- Sidebar Menu -->
        <nav class="mt-2">
          <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li class="nav-item">
              <router-link :to="{ name: 'FriendsFilter' }" class="nav-link" active-class="active">
                <font-awesome-icon :icon="['fas', 'filter']" class="mr-2" />
                <p>Lọc bạn bè</p>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'FriendsFilterInteraction' }" class="nav-link" active-class="active">
                <font-awesome-icon :icon="['fas', 'sort-amount-down']" class="mr-2" />
                <p>Lọc bạn bè theo tương tác</p>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <!-- Content Wrapper, Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark text-uppercase">{{ $route.meta.title }}</h1>
            </div>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <section class="content">
        <router-view v-if="$store.state.user.id"></router-view>
      </section>
    </div>

    <!-- Footer -->
    <footer class="main-footer">
      <strong>Tác giả: QUYHP</strong>
      (Số điện thoại: 0348403817, Email: tuyhpq@gmail.com)
      <div class="float-right d-none d-sm-inline-block">Phiên bản {{ version }}</div>
    </footer>

    <!-- Loading -->
    <transition name="fade">
      <div id="loading" v-if="showLoading"></div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      version: process.env.VUE_APP_VERSION,
      showLoading: false
    };
  },
  created() {
    this.fetch();

    // override plugin for $loader
    this.$loader.fadeIn = () => {
      this.showLoading = true;
    };
    this.$loader.fadeOut = () => {
      this.showLoading = false;
    };

    // override plugin for $axios loader
    this.$axios.hookRequest = config => {
      config && !config.notLoading && this.$loader.push();
    };
    this.$axios.hookResponse = config => {
      config && !config.notLoading && this.$loader.pop();
    };
  },
  methods: {
    async fetch() {
      let response = await this.$http.fetch();
      if (response) {
        let data = response.data;
        let user = {
          id: data.extract(/\\"USER_ID\\":\\"(.*?)\\"/),
          name: data.extract(/\\"NAME\\":\\"(.*?)\\"/).decodeUnicode(),
          accessToken: data.extract(/\\"accessToken\\":\\"(.*?)\\"/),
          dtsg: data.extract(/{\\"dtsg\\":{\\"token\\":\\"(.*?)\\"/)
        };
        user.avatarUrl = `https://graph.facebook.com/${user.id}/picture?type=large`;
        user.profileUrl = `https://www.facebook.com/profile.php?id=${user.id}`;
        this.$store.commit("login", { user });
      }
    }
  },
  watch: {
    $route() {
      this.$nextTick(() => {
        document.title = "FBVN | " + this.$route.meta.title;
      });
    }
  }
};
</script>

<style lang="scss">
@import "~@/assets/scss/common";

#loading {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1055;
}

#loading::after {
  content: "";
  display: inline-block;
  vertical-align: text-bottom;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
  color: #ffc107;
  width: 5rem;
  height: 5rem;
}

.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
