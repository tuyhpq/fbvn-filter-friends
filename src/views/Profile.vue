<template>
  <div class="container-fluid">
    <!-- Row 1 -->
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="card card-primary card-outline">
          <div class="card-body box-profile">
            <ProfilePicture></ProfilePicture>

            <ul class="list-group list-group-unbordered mb-3">
              <li class="list-group-item">
                <label for="accessToken">ID</label>
                <p>{{ $store.state.user.id }}</p>
              </li>
            </ul>

            <ul class="list-group list-group-unbordered mb-3">
              <li class="list-group-item">
                <label for="accessToken">Access Token</label>
                <p>{{ $store.state.user.accessToken }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfilePicture from "@/components/ProfilePicture.vue";

export default {
  components: {
    ProfilePicture
  }
};
</script>
