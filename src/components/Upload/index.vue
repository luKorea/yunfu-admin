<template>
<div>
  <el-upload
    class="filter-item"
    style="display: inline-block"
    :action="uploadUrl"
    :file-list="fileList"
    :on-error="uploadFalse"
    :on-success="uploadSuccess"
    :on-remove="handleRemove"
    ref="upload"
    :data='data'
    name="file"
    :limit="1"
  >
    <el-button  size="small" style="margin-left: 10px;" icon="el-icon-edit" type="primary">上传文件</el-button>
  </el-upload>
</div>
</template>
<script>
import {getImgUrl, IMG_URL, QUERY_DATA} from "@/util/url";

export default {
  props: {
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      uploadUrl: IMG_URL,
      data: QUERY_DATA,
      isPercentage: false, //是否显示进度条
      percentage: 0,
      fileName: ''
    };
  },
  methods: {
    uploadFalse(response, file, fileList) {
      this.$message({
        message: '文件上传失败！',
        type: 'error'
      });
    },
    uploadSuccess(response, file, fileList) {
      if (response.info==='success') {
        this.$message({
          message: '上传成功',
          type: 'success'
        });
        console.log(file);
        this.fileList.push({
          name: file.name,
          url: getImgUrl(response)
        });
        console.log(this.fileList);
        this.$emit('success', getImgUrl(response));
        this.$refs.upload.clearFiles(); //上传成功之后清除历史记录
      } else {
        this.$message({
          message: response.info,
          type: 'error'
        });
        this.$refs.upload.clearFiles(); //上传成功之后清除历史记录
      }
    },
    handleRemove(file, fileList) {
      this.fileList = [];
    },
  }
};
</script>

<style scoped>
</style>
