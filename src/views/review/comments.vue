<!-- TODO 评审意见 -->
<template>
  <basic-container>
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
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot-scope="scope" slot="menu">
        <el-button size="small" type="text" v-if="scope.row.changeState === 1" @click="setState(0, scope.row.id)">启用</el-button>
        <el-button size="small" type="text" v-if="scope.row.changeState === 0" @click="setState(1, scope.row.id)">禁用</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {getList, remove, update, add} from "@/api/review/comments";
import {mapGetters} from "vuex";
import {getStore} from "@/util/store";

export default {
  data() {
    return {
      USER_ID: getStore({name: 'userInfo'}).user_id,
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        dialogWidth: 600,
        border: true,
        index: false,
        viewBtn: false,
        selection: false,
        dialogClickModal: false,
        align: 'center',
        column: [
          {
            label: '序号',
            prop: 'id',
            width: 80,
            display: false
          },
          {
            label: '使用角色',
            prop: 'roleMark',
            type: 'radio',
            row: true,
            span: 24,
            rules: [{
              required: true,
              message: "请选择使用角色",
              trigger: "blur"
            }],
            dicData: [
              {
                label: "普通",
                value: 0
              },
              {
                label: "专家",
                value: 1
              },
              {
                label: "小组长",
                value: 2
              },
              {
                label: '主任',
                value: 3
              }
            ],
          },
          {
            label: '使用条件',
            row: true,
            span: 24,
            prop: 'recommendMark',
            type: 'radio',
            rules: [{
              required: true,
              message: "请选择使用条件",
              trigger: "blur"
            }],
            dicData: [
              {
                label: "推荐",
                value: 0
              },
              {
                label: "不推荐",
                value: 1
              }
            ],
          },
          {
            label: "内容",
            row: true,
            span: 24,
            prop: "commonWords",
            rules: [{
              required: true,
              message: "请输入通知标题",
              trigger: "blur"
            }]
          },
          {
            label: '状态',
            prop: 'changeState',
            type: 'radio',
            row: true,
            span: 24,
            rules: [{
              required: true,
              message: "请选择状态",
              trigger: "blur"
            }],
            dicData: [
              {
                label: "启用",
                value: 0
              },
              {
                label: "禁用",
                value: 1
              }
            ],
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
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  methods: {
    rowSave(row, done, loading) {
      row['createdBy'] = this.USER_ID;
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
    // 设置状态
    setState(type, id) {
      let data = {
        createdBy: this.USER_ID,
        changeState: type,
        id: id
      }
      update(data).then((res) => {
       if (res.data.code === 200) {
         this.$message({
           type: "success",
           message: "操作成功!"
         });
         this.onLoad(this.page);
       }
      }, error => this.$message.error(error));
    },
    rowUpdate(row, index, done, loading) {
      row['createdBy'] = this.USER_ID;
      update(row).then(() => {
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
      }).then(() => {
        remove(row.id).then(res => {
          if (res.data.code === 200) {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          }
        }).catch(err => this.$message.error(err))
        });
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
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
      getList(page.currentPage, page.pageSize).then(res => {
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
