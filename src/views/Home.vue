<template>
  <div class="container-fluid">
    <!-- Row 1 -->
    <div class="row">
      <!-- Col 1 -->
      <div class="col-md-6">
        <div class="card card-info card-outline">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-edit"></i>
              Toasts Examples <small>built in AdminLTE</small>
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
              <i class="fas fa-edit"></i>
              SweetAlert2 Examples
            </h3>
          </div>
          <div class="card-body">
            <button type="button" class="btn btn-success swalDefaultSuccess">
              Launch Success Toast
            </button>
            <button type="button" class="btn btn-info swalDefaultInfo">
              Launch Info Toast
            </button>
            <div class="text-muted mt-3">
              For more examples look at
              <a href="https://sweetalert2.github.io/">https://sweetalert2.github.io/</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
