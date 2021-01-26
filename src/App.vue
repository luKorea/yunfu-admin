<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },
  watch: {},
  created() {

  },
  methods: {},
  computed: {}
};
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.el-collapse {
  border: none !important;
}
.el-collapse-item__header {
  border: none !important;
}
.el-collapse-item__wrap {
  border: none !important;
}
.el-collapse-item__content {
  padding-bottom: 5px !important;
}
.back {
  cursor: pointer;
  display: flex;
  flex-direction: row-reverse;
}
</style>
