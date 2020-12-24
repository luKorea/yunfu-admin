<!-- TODO 专家库 -->
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
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot-scope="scope" slot="menu">
        <el-button size="small" type="text" v-if="scope.row.state === '1'" @click="setState(0, scope.row)">启用</el-button>
        <el-button size="small" type="text" v-if="scope.row.state === '0'" @click="setState(1, scope.row)">禁用</el-button>
      </template>
      <template slot-scope="{row}"
                slot="majorGroups">
        <div v-if="row.majorGroups.length > 0" v-for="(item, index) in row.majorGroups" :key="index">
          <span>{{item}}</span>
        </div>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {getList, remove, update, add} from "@/api/expert/expertdatabase";
import {mapGetters} from "vuex";

export default {
  data() {
    return {
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
        viewBtn: true,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        selection: false,
        excelBtn: true,
        dialogClickModal: false,
        align: 'center',
        column: [
          {
            width: 80,
            label: 'ID',
            prop: 'epId',
            display: false,
          },
          {
            label: '姓名',
            prop: 'userName',
            search: true
          },
          {
            label: '性别',
            prop: 'sex',
            type: 'radio',
            dicData:[
              {
                label: '男',
                value: '0'
              },
              {
                label: '女',
                value: '1'
              }
            ]
          },
          {
            label: '职称',
            prop: 'title'
          },
          {
            label: '专业组',
            slot: true,
            prop: 'majorGroups'
          },
          {
            label: '评审记录总数',
            prop: 'reviewRecordSum'
          },
          {
            label: '状态',
            prop: 'state',
            type: 'radio',
            dicData:[
              {
                label: '正常',
                value: '0'
              },
              {
                label: '禁用',
                value: '1'
              }
            ]
          },
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
    setState(type, data) {
      this.$message.info('等待接口确认')
      console.log(type, data);
    },
    rowSave(row, done, loading) {
      this.$message.info('等待接口确认')
      // add(row).then(() => {
      //   this.onLoad(this.page);
      //   this.$message({
      //     type: "success",
      //     message: "操作成功!"
      //   });
      //   done();
      // }, error => {
      //   window.console.log(error);
      //   loading();
      // });
    },
    rowUpdate(row, index, done, loading) {
      this.$message.info('等待接口确认')
      // update(row).then(() => {
      //   this.onLoad(this.page);
      //   this.$message({
      //     type: "success",
      //     message: "操作成功!"
      //   });
      //   done();
      // }, error => {
      //   window.console.log(error);
      //   loading();
      // });
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
      this.query = {
        searchValue: params.userName
      };
      this.page.currentPage = 1;
      this.onLoad(this.page, this.query);
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
        this.page.total = data.total;
        this.data = data.content;
        this.loading = false;
      });
    }
  }
};
</script>

<style>
</style>
