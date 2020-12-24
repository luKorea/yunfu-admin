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
          <el-radio-button label="0">专家申请</el-radio-button>
          <el-radio-button label="1">历史申请</el-radio-button>
        </el-radio-group>
      </template>
      <template slot-scope="scope" slot="menu" v-if="scope.row.verifyState === undefined">
        <el-button size="small" type="text" @click="openOpt(scope.row)">审核操作</el-button>
      </template>
      <template slot-scope="{row}"
                slot="aeFile">
        <a :href="row.aeFile" target="_blank">
          <el-tooltip class="item" effect="dark" content="点击在新页面查看" placement="right-start">
            <el-tag>查看</el-tag>
          </el-tooltip>
        </a>
      </template>
    </avue-crud>
    <el-dialog :modal="false" :close-on-click-modal="false" title="审核" :visible.sync="showViewDialog" width="30%">
      <el-form :model="form">
        <el-form-item label="审核意见" :label-width="formLabelWidth">
          <el-input v-model="form.verifyOpinion" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setState('2', form)">不通过</el-button>
        <el-button type="primary" @click="setState('1', form)">通过</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import {getHistoryList, getList, updateState} from "@/api/expert/expertapply";

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
            prop: 'aeId',
            width: 80,
          },
          {
            label: '姓名',
            prop: 'userName',
            width: 150,
          },
          {
            label: '性别',
            prop: 'sex',
            type: 'radio',
            width: 80,
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
            label: '申请评委会',
            prop: 'theJury'
          },
          {
            label: '照片',
            prop: 'picture',
            type:'upload',
            imgWidth: 200,
            imgHeight: 200,
            listType:'picture-img'
          },
          {
            label: '申请文档',
            prop: 'aeFile',
            slot: true
          },
          {
            label: '审核意见',
            prop: 'verifyOpinion'
          },
          {
            label: '状态',
            prop: 'verifyState',
            type: 'radio',
            dicData: [
              {
                label: '通过',
                value: '1'
              },
              {
                label: '不通过',
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
      if (this.mode === '0') {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.content;
          this.loading = false;
        });
      } else {
        this.loading = true;
        getHistoryList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.content;
          this.loading = false;
        });
      }
    },
    openOpt(data) {
      this.form = data;
      this.showViewDialog = true;
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
