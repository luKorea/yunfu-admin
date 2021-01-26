<template>
  <basic-container>
    <i class="el-icon-close back" @click="goBack"></i>
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
        <el-button type="primary" size="small" @click.stop="pushLook(scope.row)">查看资料</el-button>
        <el-button type="primary" size="small" @click.stop="pushTask(scope.row)">移交到其他评委会</el-button>
      </template>
    </avue-crud>


    <!--  查看资料  -->
    <el-dialog width="50%" :modal="false" :close-on-click-modal="false" title="查看资料" :visible.sync="showFile">
      <div v-if="fileData.reviewTaskDeclareMaterialVoList && fileData.reviewTaskDeclareMaterialVoList.length > 0"
                v-for="(item, index) in fileData.reviewTaskDeclareMaterialVoList">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item :title="item.mname" :name="mid" :key="item.mid">
            <template v-if="item.reviewTaskDeclareContentVoList && item.reviewTaskDeclareContentVoList.length > 0"
                      v-for="(child, i) in item.reviewTaskDeclareContentVoList"
            >
              <el-collapse v-model="activeNames1" @change="handleChange1" style="margin-left: 20px">
                <el-collapse-item :title="child.mcName" :key="child.mcId" :name="mcId">
                 <div v-if="child.udmFileSrc && child.udmFileSrc.length > 0" class="img-list">
                  <template v-for="(res, number) in JSON.parse(child.udmFileSrc)">
                  <div :key="number">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="res"
                      :preview-src-list="[res]">
                    </el-image>
                  </div>
                  </template>
                 </div>
                </el-collapse-item>
              </el-collapse>
            </template>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-alert
        v-if="fileData.reviewTaskDeclareMaterialVoList && fileData.reviewTaskDeclareMaterialVoList.length === 0"
        title="暂无数据"
        type="error"
        effect="dark"
        center
        :closable="false">
      </el-alert>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="!fileData.reviewTaskDeclareMaterialVoList || fileData.reviewTaskDeclareMaterialVoList.length !== 0"
          @click="changeState(fileData)">确认接收</el-button>
        <el-button @click="handleShowTask">移交到其他评委会</el-button>
      </div>
    </el-dialog>


    <!--  移交到其他评委会  -->
    <el-dialog width="50%" :modal="false" :close-on-click-modal="false" title="移交到其他评委会" :visible.sync="showTask">
      <el-form :model="taskData" ref="ruleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="taskData.userName" disabled />
        </el-form-item>
        <el-form-item label="专业名称" :label-width="formLabelWidth">
          <el-input v-model="taskData.tmsName" disabled />
        </el-form-item>
        <el-form-item label="专业等级" :label-width="formLabelWidth">
          <el-input v-model="taskData.tgName" disabled />
        </el-form-item>
        <el-form-item label="工作单位" :label-width="formLabelWidth">
          <el-input v-model="taskData.workUnit" disabled />
        </el-form-item>
        <el-form-item label="等级类型" :label-width="formLabelWidth">
          <el-input v-model="taskData.titleGradeType" disabled />
        </el-form-item>
        <el-form-item label="当前评委会" :label-width="formLabelWidth">
          <el-input v-model="taskData.theJuryName" disabled />
        </el-form-item>
        <el-form-item label="移交评委会" :label-width="formLabelWidth">
          <el-select v-model="taskData.juryId" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in juryList" :key="item.id" :label="item.theJuryName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rowUpdate">确认移交</el-button>
      </div>
    </el-dialog>


  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import {
  changeState,
  getJuryList,
  getListDetail,
  update
} from "@/api/task/under";

export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeNames:[],
      activeNames1:[],
      showTask: false,
      showFile: false,
      taskData: {},
      fileData: {},
      juryList: [],
      formLabelWidth: '120px',
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
            prop: 'theJuryName'
          },
          {
            label: '姓名',
            prop: 'userName',
            search: true,
          },
          {
            label: '专业名称',
            prop: 'tmsName',
          },
          {
            label: '专业等级',
            prop: 'tgName',
          },
          {
            label: '等级类型',
            prop: 'titleGradeType'
          },
          {
            label: '工作单位',
            prop: 'workUnit',
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
    handleChange(val) {
      console.log(val);
    },
    handleChange1(val) {
      console.log(val);
    },
    goBack() {
      this.$emit('back')
    },

    // 查看资料
    handleShowTask() {
      this.showFile = false;
      this.showTask = true;
      this.taskData = this.fileData;
      this.getJuryData({
        tgId: this.fileData.tgId,
        tmsId: this.fileData.tmsId
      })
    },
    pushLook(row) {
      this.showFile = true;
      this.fileData = row;
    },
    // 确认接收
    changeState(res) {
      let data = {
        reportingState: 1,
        tdId: res.tgId
      }
      console.log(data);
      changeState(data)
      .then(res => {
        if (res.data.code === 200) {
          this.onLoad(this.page, this.query, this.id);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.fileData = {};
            this.showFile = false;
        }
      }).catch(err => this.$message.error(err))
    },

    // 移交到其他评委会
    pushTask(row) {
      this.showTask = true;
      this.taskData = row;
      this.getJuryData({
        tgId: row.tgId,
        tmsId: row.tmsId
      })
    },
    // 获取评审会列表
    getJuryData(row) {
      getJuryList(row)
      .then(res => {
        if (res.data.code === 200) {
          this.juryList = res.data.data;
        }
      }).catch(err => this.$message.error(err))
    },
    // 移交操作
    rowUpdate() {
      let data = {
        tdId: this.taskData.id,
        juryId: this.taskData.juryId
      }
      this.$confirm("确定移出到其他评委会吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          update(data).then(() => {
            this.onLoad(this.page, this.query, this.id);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.showTask = false;
            this.taskData = {};
          }, error => this.$message.error(error));
        }).catch(err => console.log(err))
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
        keyword: params.userName,
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
      this.onLoad(this.page, this.query, this.id);
    },
    onLoad(page, params = {}, id) {
      this.loading = true;
      getListDetail(page.currentPage, page.pageSize, Object.assign(params, this.query), this.id).then(res => {
        const data = res.data.data;
        this.page.total = data.count;
        this.data = data.content;
        this.loading = false;
      });
    }
  }
}
</script>

<style scoped>
.back {
  cursor: pointer;
  display: flex;
  flex-direction: row-reverse;
}
.img-list {
  display: flex;
  justify-content: space-between;
}
</style>
