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
import {getList, add, update, remove} from '@/api/column/index';

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
            label: '基础配置',
            prop: 'columnName',
            rules: [{
              required: true,
              message: "请输入基础配置",
              trigger: "blur"
            }],
          },
          {
            label: '排序号',
            prop: 'columnOrderBy',
            type: 'number',
            rules: [{
              required: true,
              message: "请输入排序号",
              trigger: "blur"
            }],

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
                label: '下架',
                value: 0
              },
              {
                label: '上架',
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
      let data = {
        id: row.id,
        columnName: row.columnName,
        changeState: row.changeState,
        columnOrderBy: row.columnOrderBy
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
    setState(type, form) {
      let data = {
        data: {
          ...form,
          verifyState: type,
        },
        apisign: '',
      }
      updateState(data).then(res => {
        if (res.data.code === 200) {
          this.$message.success('操作成功')
          this.showViewDialog = false;
          this.mode = '0';
          this.onLoad(this.page)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
};
</script>

<style>
.none-border {
  border: 0;
  background-color: transparent !important;
}
</style>
