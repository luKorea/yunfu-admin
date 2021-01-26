<template>
  <basic-container>
    <i class="el-icon-close back" @click="goBack"></i>
    评议组
  </basic-container>
</template>

<script>
export default {
  name: "index",
  props: {
    tjId: {
      type: String,
      default: ''
    },
    rtId: {
      type: String,
      default: ''
    }
  },
  created() {
    console.log(this.tjId, this.rtId);
  },
  methods: {
    goBack() {
      this.$emit('back');
    }
  },
}
</script>

<style scoped>

</style>
