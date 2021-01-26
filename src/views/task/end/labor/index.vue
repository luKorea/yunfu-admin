<template>
  <basic-container>
    <i class="el-icon-close back" @click="goBack"></i>
    <div style="text-align: center;font-weight: bold; margin-bottom: 20px">云浮市中小学高级教师职称评审委员会</div>
    <el-alert title="评委会情况设置: " effect="dark" type='info' :closable="false" style="width: 200px; margin-bottom: 20px" center />
    <el-form>
     <el-row :gutter="12">
       <el-col :span="12">
         <el-form-item label="评委会是否设置分组" label-width="200px">
           <span v-if="infoData.setState == 0">是</span>
           <span v-if="infoData.setState == 1">否</span>
         </el-form-item>
       </el-col>
       <el-col :span="12">
         <el-form-item label="设置专家评委人数" label-width="200px">
           <span>{{infoData.judgesQuantity}}</span>
         </el-form-item>
       </el-col>
     </el-row>
   </el-form>
    <el-alert title="专家抽取: " effect="dark" type='info' :closable="false" style="width: 200px; margin-bottom: 20px" center />
  </basic-container>
</template>

<script>
import {getLabor, getTask} from "@/api/task/end";

export default {
  name: "index",
  props: {
    rtId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      infoData: {}
    }
  },
  created() {
    this.getTaskData(this.rtId);
    this.getData(this.rtId);
  },
  methods: {
    // 获取评审任务
    getTaskData(id) {
      getTask(id)
      .then(res => {
        if (res.data.code === 200) {
          this.infoData = res.data.data;
        }
      }).catch(err => this.$message.error(err))
    },
    getData(rtId) {
      getLabor(rtId)
      .then(res => {
        if (res.data.code === 200) {
          console.log(res);
          this.$message.success('操作成功')
        }
      }).catch(err => this.$message.error(err))
    },
    goBack() {
      this.$emit('back');
    }
  },
}
</script>

<style scoped>

</style>
