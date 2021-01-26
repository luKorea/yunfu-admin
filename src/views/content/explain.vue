<template>
  <basic-container>
    <editor :editorDetail="content" ref="editor"></editor>
   <div class="btn">
     <el-button @click="setValue" size="medium">保存</el-button>
   </div>
  </basic-container>
</template>

<script>
import Editor from '@/components/WangEditor/index';

export default {
  name: "explain",
  components: {
    Editor
  },
  data() {
    return {
      content: ''
    }
  },
  methods: {
    setValue() {
      this.content = this.$refs.editor.getEditorData();
      console.log(this.content);
    }
  },
}
</script>

<style scoped>
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>
