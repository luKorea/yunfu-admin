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
import {getList, add, update, remove} from '@/api/content/shield';

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
        dialogWidth: 600,
        labelWidth: 120,
        align: 'center',
        column: [
          {
            label: 'ID',
            prop: 'id',
            display: false
          },
          {
            label: '关键字',
            prop: 'name',
            row: true,
            span: 24,
          },
          {
            label: '脱敏长度（cm）',
            prop: 'hideLong',
            row: true,
            span: 24,
          },
          {
            label: '脱敏高度（cm）',
            prop: 'hideHigh',
            row: true,
            span: 24,
          },
          {
            label: '状态',
            prop: 'isDeleted',
            type: 'radio',
            row: true,
            span: 24,
            dicData:[
              {
                label: '启用',
                value: 0
              },
              {
                label: '禁用',
                value: 1
              }
            ]
          },
          {
            label: '脱敏类型',
            prop: 'around',
            type: 'radio',
            row: true,
            span: 24,
            dicData:[
              {
                label: '文字前脱敏',
                value: 0
              },
              {
                label: '文字后脱敏',
                value: 2
              }
            ]
          },
          {
            label: '登录用户标识 (开启不用填写关键字与字段前后标识)',
            prop: 'nameMark',
            rules: [{
              required: true,
              message: "请选择登录用户标识",
              trigger: "blur"
            }],
            type: 'radio',
            hide: true,
            row: true,
            span: 24,
            labelWidth: 350,
            dicData:[
              {
                label: '关闭',
                value: 0
              },
              {
                label: '开启',
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
        const data = res.data;
        this.data = data.data;
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
