<!-- TODO 政策法规 -->
<template>
  <basic-container>
    <div style="display: flex; justify-content: space-between">
      <el-button type="primary" @click="setDialog('open')"
                 style="margin-bottom: 20px; margin-right: 10px">发布政策
      </el-button>
      <el-input clearable placeholder="请输入内容" v-model="keyword"
                class="input-with-select" style="width: 300px">
        <el-button slot="append" style="background-color: #1e9fff; color: #fff"
                   icon="el-icon-search" @click="searchData"/>
      </el-input>
    </div>
    <el-table border :data="data" style="width: 100%">
      <el-table-column prop="id" label="ID" align="center" width="80"/>
      <el-table-column prop="title" label="标题" align="center"/>
      <!--      <el-table-column prop="nsource" label="来源" align="center"/>-->
      <el-table-column prop="psNumber" label="文件号" align="center"/>
      <el-table-column prop="columnLable" label="关键字" align="center"/>
      <el-table-column prop="columnVoList" label="栏目" align="center">
        <template slot-scope="scope">
          <div v-if='scope.row.columnVoList && scope.row.columnVoList.length > 0'>
<!--            <span v-if="scope.row.columnVoList.length > 1">/</span>-->
            <el-tag v-for="item in scope.row.columnVoList" :key="item.id" style="margin: 2px !important;">
              {{item.columnName}}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间" align="center"/>
      <el-table-column prop="updatedTime" label="最后修改时间" align="center"/>
      <el-table-column label="状态" prop="changeState" :formatter="stateFormat"
                       align="center" width="120"/>
<!--            <el-table-column label="是否置顶" prop="topState" :formatter="topStateFormat" align="center" width="120"/>-->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small"
                     @click="setDialog('edit', scope.row)">编辑
          </el-button>
          <el-button type="text" size="small" @click="deleteData(scope.row.id)">
            删除
          </el-button>
          <el-button type="text" v-if="scope.row.changeState === 1" size="small"
                     @click="setState(0, scope.row.id)">下架
          </el-button>
          <el-button type="text" v-if="scope.row.changeState === 0" size="small"
                     @click="setState(1, scope.row.id)">上架
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="page.total" @sorter="currentChange"></pagination>

    <!-- 编辑新增弹框  -->
    <el-dialog :modal="false"
               top="10vh"
               :close-on-click-modal="false"
               :title="type === 'open' ? '新增' : '编辑'" :visible.sync="showDialog"
               width="60%">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item label="文件号" :label-width="formLabelWidth" prop="psNumber">
          <el-input v-model="form.psNumber"/>
        </el-form-item>
        <el-form-item label="栏目" :label-width="formLabelWidth" prop="columnIds">
          <el-select v-model="form.columnIds" multiple clearable @change="$forceUpdate()"
                     placeholder="请选择" style="width: 100%">
            <el-option v-for="item in labelList"
                       :key="item.id" :label="item.columnName" :value="Number(item.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字" :label-width="formLabelWidth" prop="columnLable">
          <el-row>
            <el-col :span="12">
              <el-input v-model="form.columnLable"/>
            </el-col>
            <el-col :span="12"><span style="color: red; margin-left: 20px">* 多个请以英文逗号“,”分割</span></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="来源" :label-width="formLabelWidth"
                      v-if="form.releaseForm === 1">
          <el-input v-model="form.psSource"/>
        </el-form-item>
        <el-row :gutter="8">
          <el-col :span="10">
            <el-form-item label="上下架状态" :label-width="formLabelWidth"
                          prop="changeState">
              <el-radio-group v-model="form.changeState">
                <el-radio :label="1">上架</el-radio>
                <el-radio :label="0">下架</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="发布形式" :label-width="formLabelWidth"
                          prop="releaseForm">
              <el-radio-group v-model="form.releaseForm">
                <el-radio :label="0">图文详情</el-radio>
                <el-radio :label="1">文件上传</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="推荐状态" :label-width="formLabelWidth"
                          prop="recomState">
              <el-radio-group v-model="form.recomState">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否置顶" :label-width="formLabelWidth"
                          prop="topState">
              <el-radio-group v-model="form.topState">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="消息内容" :label-width="formLabelWidth"
                      v-if="form.releaseForm === 0">
          <editor :editorDetail="form.psContent" ref="editors"></editor>
        </el-form-item>
        <el-form-item label="选择文件" :label-width="formLabelWidth"
                      v-if="form.releaseForm === 1">
          <upload @success="getFileData" :file-list="fileList"></upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="sumbit">发送</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  add,
  update,
  getDetail,
  remove,
  updateState,
  getLabelData
} from "@/api/content/policies";
import Pagination from '@/components/Pagination/index';
import {mapGetters} from "vuex";
import Editor from '@/components/WangEditor/index';
import Upload from '@/components/Upload/index';
import {getStore} from "@/util/store";

export default {
  name: 'Message',
  components: {
    Pagination,
    Editor,
    Upload
  },
  data() {
    return {
      USER_ID: getStore({name: 'userInfo'}).user_id,
      showDialog: false,
      type: 'edit',
      formLabelWidth: '100px',
      form: {},
      fileList: [],
      treeData: [],
      labelList:[],
      query: {},
      keyword: '',
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      data: [],
      rules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        psNumber: [
          {required: true, message: '请输入文件号', trigger: 'blur'}
        ],
        changeState: [
          {required: true, message: '请选择上下架状态', trigger: 'blur'}
        ],
        topState: [
          {required: true, message: '请选择置顶状态', trigger: 'blur'}
        ],
        releaseForm: [
          {required: true, message: '请选择发布形式', trigger: 'blur'}
        ],
        recomState: [
          {required: true, message: '请选择推荐状态', trigger: 'blur'}
        ],
        columnLable: [
          {required: true, message: '请输入关键字', trigger: 'blur'}
        ],
        columnIds: [
          {required: true, message: '请选择栏目', trigger: 'blur'}
        ],
      }
    }
  },
  created() {
    this.onLoad(this.page);
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.role_add, false),
        viewBtn: this.vaildData(this.permission.role_view, false),
        delBtn: this.vaildData(this.permission.role_delete, false),
        editBtn: this.vaildData(this.permission.role_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);

      });
      return ids.join(",");
    },
    idsArray() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids;
    }
  },
  methods: {
    removeTag(item) {
      console.log(item);
    },
    setLabel(list) {
      console.log(list);
    },
    getFileData(file) {
      this.form.psContent = file;
    },
    // 根据状态显示不同的值
    stateFormat(row) {
      if (row.changeState === 1) {
        return '上架'
      } else {
        return '下架'
      }
    },
    topStateFormat(row) {
      if (row.topState === 1) {
        return '是'
      } else {
        return '否'
      }
    },
    // 弹框操作
    setDialog(type, data) {
      this.getLabelListData();
      this.type = type;
      this.resetForm();
      if (type === 'open') {
        this.fileList = [];
        this.showDialog = true;
        if (this.$refs.editors) {
          this.$refs.editors.clearHtml();
        }
      } else if (type === 'edit') {
        this.showDialog = true;
        this.getDetailData(data.id);
      }
    },
    resetForm() {
      this.form = {};
    },
    // 发送
    sumbit(type) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.form['newsState'] = type;
          this.form['userId'] = this.USER_ID;
          if (this.$refs.editors) {
            this.form.psContent = this.$refs.editors.getEditorData()
          }
          console.log(this.form);
          if (this.type === 'open') {
            add(this.form)
              .then(res => {
                if (res.data.code === 200) {
                  this.$message.success('操作成功')
                  this.showDialog = false;
                  this.resetForm();
                  this.fileList = [];
                  this.onLoad(this.page);
                }
              }).catch(err => {
              this.$message.error(err);
            })
          } else if (this.type === 'edit') {
            delete this.form.createdTime
            update(this.form).then(res => {
              if (res.data.code === 200) {
                this.$message.success('操作成功')
                this.showDialog = false;
                this.resetForm();
                this.fileList = [];
                this.onLoad(this.page);
              }
            }).catch(err => {
              this.$message.error(err);
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    deleteData(id) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        remove(id).then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.onLoad(this.page);
          }
        }).catch(err => {
          this.$message.error(err);
        })
      });

    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page);
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    // 获取表格数据
    onLoad(page, params = {}) {
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        this.data = res.data.data.content;
        this.page.total = res.data.data.total === 0 ? res.data.data.count : res.data.data.total;
      });
    },
    // 搜索数据
    searchData() {
      this.onLoad(this.page, {
        keyword: this.keyword
      })
    },
    // 获取栏目
    getLabelListData() {
      getLabelData()
      .then(res => {
        if (res.data.code === 200) {
          this.labelList = res.data.data;
        }
      }).catch(err => this.$message.error(err))
    },
    //  获取详情
    getDetailData(id) {
      this.fileList = [];
      getDetail(id)
        .then(res => {
          if (res.data.code === 200) {
            this.form = res.data.data;
            let result = [];
            res.data.data.columnVoList.forEach(item => {
              result.push(Number(item.id));
              this.form.columnIds = result;
            })
            this.$nextTick(() => {
              if (this.$refs['editors']) {
                this.$refs.editors.setHtml(this.form.psContent);
              }
            })
            this.fileList.push({
              name: res.data.data.psContent,
              url: res.data.data.psContent
            })
            console.log(this.form);
          }
        }).catch(err => {
        this.$message.error(err);
      })
    },
    //上下架修改
    setState(type, id) {
      console.log(id);
      let data = {
        changeState: type,
        id: id,
        userId: this.USER_ID
      };
      updateState(data)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.onLoad(this.page);
          }
        }).catch(err => this.$message.error(err))
    }
  }
};
</script>
