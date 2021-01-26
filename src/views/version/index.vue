<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :page.sync="page"
               :permission="permissionList"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
    </avue-crud>
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import {getList, add, update, remove} from '@/api/version/index';

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      formLabelWidth: '100px',
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
        selection: false,
        editBtn: true,
        addBtn: true,
        viewBtn: false,
        delBtn: true,
        dialogClickModal: false,
        labelWidth: 120,
        align: 'center',
        column: [
          {
            label: 'ID',
            prop: 'id',
            display: false
          },
          {
            label: '版本名称',
            prop: 'versionName',
            rules: [{
              required: true,
              message: "请输入版本名称",
              trigger: "blur"
            }],

          },
          {
            label: '版本号',
            prop: 'versionNum',
            rules: [{
              required: true,
              message: "请输入版本号",
              trigger: "blur"
            }],

          },
          {
            label: '版本备注',
            prop: 'versionRemark',
            type: 'textarea',
            rules: [{
              required: true,
              message: "请输入版本备注",
              trigger: "blur"
            }],

          },
          {
            label: 'URL',
            prop: 'versionUrl',
            rules: [{
              required: true,
              message: "请输入URL",
              trigger: "blur"
            }],

          },
          {
            label: '序号',
            prop: 'versionSort',
            rules: [{
              required: true,
              message: "请输入排序号",
              trigger: "blur"
            }],

          },
          {
            label: '链接类型',
            prop: 'urlType',
            type: 'radio',
            rules: [{
              required: true,
              message: "请输入链接类型",
              trigger: "blur"
            }],
            dicData: [
              {
                label: '安卓',
                value: 0
              },
              {
                label: 'iOS',
                value: 1
              }
            ]
          },
          {
            label: '上下架状态',
            prop: 'changeState',
            type: 'radio',
            rules: [{
              required: true,
              message: "请选择上下架状态",
              trigger: "blur"
            }],
            dicData: [
              {
                label: '禁用',
                value: 0
              },
              {
                label: '启用',
                value: 1
              }
            ]
          },
          {
            label: '是否强制更新',
            prop: 'isForce',
            type: 'radio',
            rules: [{
              required: true,
              message: "请选择是否强制更新",
              trigger: "blur"
            }],
            dicData: [
              {
                label: '否',
                value: 0
              },
              {
                label: '是',
                value: 1
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
        delBtn: this.vaildData(this.permission.flow_manager_remove, false),
      };
    }
  },
  methods: {
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
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
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
      delete row.createdTime
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
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    onLoad(page, params = {}) {
      this.loading = true;
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        this.data = data.content;
        this.page.total = data.count;
        this.loading = false;
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
