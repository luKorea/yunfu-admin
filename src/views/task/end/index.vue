<template>
<div>
  <basic-container v-if="showLabor && showComment">
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               ref="crud"
               @row-del="rowDel"
               v-model="form"
               :permission="permissionList"
               @row-update="rowUpdate"
               @row-save="rowSave"
               :before-open="beforeOpen"
               @search-change="searchChange"
               @search-reset="searchReset"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot-scope="{row}" slot="theJuryTaskTitleVoList">
        <div v-for="(item, index) in row.theJuryTaskTitleVoList" :key="index">
          <span>{{item.title}}</span> /
          <span v-for="(i, index) in item.titleGradeList" :key="index">
            <span>{{i.titleGrade}}</span>
          </span>
        </div>
      </template>
      <template slot="menu" slot-scope="{row}">
        <el-button type="primary" size="small" @click="goDetail(row.processState, row.id, row.tjId)">查看</el-button>
      </template>
    </avue-crud>
  </basic-container>
  <labor v-if="!showLabor" @back="goBack" :rtId="rtId"></labor>
  <comment v-if="!showComment" @back="goBack" :rtId="rtId" :tjId="tjId"></comment>
</div>
</template>

<script>
import {getList, update} from "@/api/task/end";
import {mapGetters} from "vuex";
import Labor from './labor/index';
import Comment from './comment/index';

export default {
  components: {
    Labor,
    Comment
  },
  data() {
    return {
      //显示分工组
      showLabor: true,
      // 显示评议组
      showComment: true,
      // 评委会任务id
      rtId: '',
      // 评审会ID
      tjId: '',
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: false,
        viewBtn: false,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        selection: false,
        excelBtn: false,
        dialogClickModal: false,
        align: 'center',
        labelWidth: 200,
        column: [
          {
            width: 80,
            label: 'ID',
            prop: 'id',
            display: false,
          },
          {
            label: '评委会',
            prop: 'theJuryName',
            search: true,
            row: 24,
            span: true,
            readonly: true
          },
          {
            label: '专业 / 等级',
            prop: 'theJuryTaskTitleVoList',
            display: false,
            slot: true
          },
          {
            label: '年度',
            prop: 'ppiYear',
            search: true,
            row: 24,
            readonly: true
          },
          {
            label: '申报人数',
            prop: 'declareCount',
          }
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.notice_add, false),
        viewBtn: this.vaildData(this.permission.notice_view, false),
        delBtn: this.vaildData(this.permission.notice_delete, false),
        editBtn: this.vaildData(this.permission.notice_edit, false)
      };
    }
  },
  methods: {
    goDetail(processState, rtId, tjId) {
      // 显示分工组
      if (processState === 5 || processState === 6) {
        this.showLabor = false;
        this.rtId = rtId;
      } else {
        // 显示评议组
        this.showComment = false;
        this.rtId = rtId;
        this.tjId = tjId;
      }
    },
    goBack() {
      this.showComment = true;
      this.showLabor = true;
    },
    rowSave(row, done, loading) {
      add(row).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowUpdate(row, index, done, loading) {
      let data = {
        id: row.id,
        updReviewStartTime: row.updReviewStartTime,
        updReviewEndTime: row.updReviewEndTime
      }
      update(data).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      let data = {
        keyword: params.theJuryName,
        year: params.ppiYear
      }
      this.page.currentPage = 1;
      this.onLoad(this.page, data);
      done();
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          // this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {

      }
      done();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        this.page.total = data.count;
        this.data = data.content;
        this.loading = false;
      });
    }
  }
};
</script>

<style>
</style>
