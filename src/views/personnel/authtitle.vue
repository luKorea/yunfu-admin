<!-- TODO 职称认证 -->
<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :page.sync="page"
               :permission="permissionList"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-radio-group v-model="mode" size="small">
          <el-radio-button label="0">职称认证</el-radio-button>
          <el-radio-button label="1">历史认证</el-radio-button>
        </el-radio-group>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button size="small" type="text"  @click="showDialog(scope.row)">详情</el-button>
        <el-button size="small" type="text" v-if="scope.row.verifyState === '0'"  @click="setState('1', scope.row)">通过</el-button>
        <el-button size="small" type="text" v-if="scope.row.verifyState === '0'" @click="setState('2', scope.row)">不通过</el-button>
      </template>
    </avue-crud>

    <el-dialog :modal="false" :close-on-click-modal="false" title="查看" :visible.sync="showViewDialog" width="30%">
      <el-form :model="form">
        <el-form-item label="职称证书" :label-width="formLabelWidth">
          <el-image
            style="width: 100px; height: 100px"
            :src="form.titleCertificate"
            :preview-src-list="[form.titleCertificate]"
          />
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.userName" disabled />
        </el-form-item>
        <el-form-item label="评审会" :label-width="formLabelWidth">
          <el-input v-model="form.reviewMeeting" disabled />
        </el-form-item>
        <el-form-item label="专业名称" :label-width="formLabelWidth">
          <el-input v-model="form.majorName" disabled />
        </el-form-item>
        <el-form-item label="取得方式" :label-width="formLabelWidth">
          <el-input v-model="form.contentName" disabled />
        </el-form-item>
        <el-form-item label="资格等级" :label-width="formLabelWidth">
          <el-input v-model="form.utLevel" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  v-if="this.form.verifyState === '1' || this.form.verifyState === '2'" type="primary" @click="showViewDialog = false">确定</el-button>
     <div v-if="this.form.verifyState === '0'">
       <el-button @click="setState('2', form)">不通过</el-button>
       <el-button type="primary" @click="setState('1', form)">通过</el-button>
     </div>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {mapGetters} from "vuex";
  import {getList, updateState} from "@/api/personnel/authtitle";

  export default {
    data() {
      return {
        form: {},
        mode: '0',
        showViewDialog: false,
        selectionId: '',
        selectionList: [],
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
          editBtn: false,
          addBtn: false,
          viewBtn: false,
          delBtn: false,
          dialogClickModal: false,
          align: 'center',
          column: [
            {
              label: 'ID',
              prop: 'autId',
            },
            {
              label: '姓名',
              prop: 'userName'
            },
            {
              label: '取得方式',
              prop: 'contentName'
            },
            {
              label: '评审会',
              prop: 'reviewMeeting'
            },
            {
              label: '专业名称',
              prop: 'majorName'
            },
            {
              label: '资格等级',
              prop: 'utLevel'
            },
            {
              label: '认证结果',
              prop: 'verifyState',
              type: 'radio',
              dicData: [
                {
                  label: '审核中',
                  value: '0'
                },
                {
                  label: '通过',
                  value: '1'
                },
                {
                  label: '拒绝',
                  value: '2'
                }
              ]
            }
          ]
        },
        data: []
      };
    },
    watch: {
      'mode'() {
        this.onLoad(this.page);
      }
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
      showDialog(data) {
        this.showViewDialog = true;
        this.form = data;
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
      onLoad(page, params = {}) {
        const values = {
          ...params,
          searchType: this.mode
        };
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(values, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.content;
          this.loading = false;
        });
      },
      setState(type, form) {
        delete form.verifyState
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
            this.onLoad(this.page, {
              searchType: this.mode
            })
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
