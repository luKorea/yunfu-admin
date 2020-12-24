<!-- TODO 人才库列表 -->
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
        <el-button size="small" type="text" v-if="scope.row.changeState === '1'" @click="setState(0, scope.row.id)">启用</el-button>
        <el-button size="small" type="text" v-if="scope.row.changeState === '0'" @click="setState(1, scope.row.id)">禁用</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {getList, remove, update, add} from "@/api/personnel/personnellist";
import {mapGetters} from "vuex";
import {getStore} from "@/util/store";

export default {
  data() {
    return {
      USER_ID: getStore({name: 'userInfo'}).user_id,
      form: {},
      query: {},
      searchValue: '',
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
        border: true,
        index: false,
        addBtn: false,
        viewBtn: true,
        editBtn: false,
        delBtn: false,
        selection: false,
        dialogClickModal: false,
        excelBtn: true,
        align: 'center',
        title: '人才库列表',
        column: [
          {
            label: '序号',
            prop: 'ptpId',
            width: 80
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
                value: 0
              },
              {
                label: '女',
                value: 1
              },
              {
                label: '未知',
                value: -1
              }
            ]
          },
          {
            label: '专业',
            prop: 'majorName'
          },
          {
            label: '资格',
            prop: 'utLevel'
          },
          {
            label: '工作单位',
            prop: 'workUnit'
          },
          {
            label: '状态',
            prop: 'changeState',
            type: 'radio',
            dicData:[
              {
                label: '启用',
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
      this.$message.info('接口暂未实现')
      console.log(data);
      // update(data).then((res) => {
      //   if (res.data.code === 200) {
      //     this.$message({
      //       type: "success",
      //       message: "操作成功!"
      //     });
      //     this.onLoad(this.page);
      //   }
      // }, error => this.$message.error(error));
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
      let data = {
        searchValue: params.userName
      }
      // this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, data);
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
