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
      <a href="index3.html" class="brand-link">
        <img src="@/assets/img/logo.png" class="brand-image img-circle elevation-3" />
        <span class="brand-text font-weight-light">FBVN</span>
      </a>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- User panel -->
        <div class="user-panel mt-3 pb-3 mb-3 d-flex">
          <div class="image">
            <img
              v-if="$store.state.user.id"
              :src="`https://graph.facebook.com/${$store.state.user.id}/picture?type=large`"
              class="img-circle elevation-2"
              alt="Avatar"
            />
          </div>
          <div class="info">
            <a href="#" class="d-block">{{ $store.state.user.name }}</a>
          </div>
        </div>

        <!-- Sidebar Menu -->
        <nav class="mt-2">
          <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li class="nav-item">
              <a href="pages/gallery.html" class="nav-link active">
                <font-awesome-icon :icon="['fas', 'filter']" class="mr-2" />
                <p>Lọc bạn bè</p>
              </a>
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
              <h1 class="m-0 text-dark">Dashboard</h1>
            </div>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid"></div>
      </section>
    </div>

    <!-- Footer -->
    <footer class="main-footer">
      <strong>Copyright &copy; 2014-2019 <a href="http://adminlte.io">AdminLTE.io</a>.</strong>
      All rights reserved.
      <div class="float-right d-none d-sm-inline-block"><b>Version</b> 3.0.4</div>
    </footer>
  </div>
</template>

<script>
export default {
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      let response = await this.$http.fetch();
      let data = response.data;
      let user = {
        id: data.extract(/\\"USER_ID\\":\\"(.*?)\\"/),
        name: data.extract(/\\"NAME\\":\\"(.*?)\\"/).decodeUnicode(),
        accessToken: data.extract(/\\"accessToken\\":\\"(.*?)\\"/)
      };
      this.$store.commit("login", { user });
    }
  }
};
</script>

<style lang="scss">
@import "~@/assets/scss/common";
</style>
