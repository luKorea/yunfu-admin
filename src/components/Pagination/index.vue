<template>
  <div class="pagination-container">
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props:{
    total:Number,
  },
  data(){
    return{
      currentPage:1
    }
  },
  methods:{
    handleCurrentChange(page) {
      this.$emit('sorter',page)
    }
  }
}
</script>

<style scoped>
.pagination-container{
  display: flex;
  flex-direction: row-reverse;
  margin-top: 20px;
}
</style>
