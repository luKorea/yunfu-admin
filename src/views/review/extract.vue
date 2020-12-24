<!-- TODO 专家抽取 -->
<template>
  <basic-container>
    <div class="time-item">
      <span>不能连续</span>
      <el-input class='time-input' type="number" v-model="content"></el-input>
      <span>年参与评审</span>
      <el-button type="primary" @click="setInfo('XTPZ10001')">确定</el-button>
    </div>
    <div class="time-item">
      <span>未签到</span>
      <el-input class='time-input' type="number" v-model="content1"></el-input>
      <span>次将不再抽取评委</span>
      <el-button type="primary" @click="setInfo(' XTPZ10002')">确定</el-button>
    </div>
    <!--    <div class="time-item">-->
    <!--      <span>本年度通过率</span>-->
    <!--      <el-input class='time-input' type="number" v-model="content1"></el-input>-->
    <!--      <span>%</span>-->
    <!--      <el-button type="primary">确定</el-button>-->
    <!--    </div>-->
  </basic-container>
</template>

<script>
import {getTimeOrNumber, setTimeType} from "@/api/review/extract";

export default {
  data() {
    return {
      content: '',
      content1: ''
    }
  },
  created() {
    this.getTimeData();
    this.getNumberData();
  },
  methods: {
    // 获取评审时间
    getTimeData() {
      getTimeOrNumber('XTPZ10001').then(res => {
        if (res.data.code === 200) {
          let data = res.data.data;
          this.content = data.contentName;
        }
      }).catch(err => this.$message.error(err))
    },
    // 获取签到次数
    getNumberData() {
      getTimeOrNumber('XTPZ10002').then(res => {
        if (res.data.code === 200) {
          let data = res.data.data;
          this.content1 = data.contentName;
        }
      }).catch(err => this.$message.error(err))
    },
    // 修改评审
    setInfo(type) {
      let data = {
        bcCode: type.trim(),
        content: type === 'XTPZ10001' ? this.content : this.content1
      }
      setTimeType(data)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('修改成功');
            type === 'XTPZ10001' ? this.getTimeData() : this.getNumberData()
          }
        }).catch(err => this.$message.error(err))
    }
  }
}
</script>

<style scoped>
.time-item {
  display: flex;
  /*justify-content: center;*/
  align-items: center;
  margin: 0 10px 20px;
}

.time-item span {
  margin-right: 20px;
}

.time-input {
  width: 200px;
  margin-right: 20px;
}
</style>
