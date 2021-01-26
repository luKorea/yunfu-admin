<template>
  <basic-container>
    <el-alert title="人口普查时间设置" type="error" :closable="false" center style="margin-bottom: 20px" />
    <el-date-picker
      v-model="form.startTime"
      type="datetime"
      value-format="yyyy-MM-dd HH:mm:ss"
      style="margin-right: 20px"
      placeholder="选择日期时间">
    </el-date-picker>
    <el-date-picker
      v-model="form.endTime"
      type="datetime"
      value-format="yyyy-MM-dd HH:mm:ss"
      style="margin-right: 20px"
      placeholder="选择日期时间">
    </el-date-picker>
    <el-button type="danger" @click="setTime">设置时间</el-button>
  </basic-container>
</template>

<script>
import {getList, update} from '@/api/content/census';

export default {
  data() {
    return {
      form: {},
    };
  },
  mounted() {
    this.onLoad();
  },
  methods: {
    setTime() {
      update(this.form)
      .then(res => {
        if (res.data.code === 200) {
          this.$message.success('修改成功');
          this.onLoad();
        }
      }).catch(err => this.$message.error(err))
    },
    onLoad() {
      getList().then(res => {
       if (res.data.code === 200) {
         this.form = res.data.data;
         console.log(this.form);
       }
      });
    },
  }
};
</script>

<style>
.none-border {
  border: 0;
  background-color: transparent !important;
}
</style>
