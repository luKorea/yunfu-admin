<!-- TODO 系统消息 -->
<template>
  <basic-container>
    <el-button type="primary" @click="setDialog('open')" style="margin-bottom: 20px">发布系统消息</el-button>
    <el-table border :data="data" style="width: 100%">
      <el-table-column prop="id" label="ID" align="center" width="80"/>
      <el-table-column prop="title" label="标题" align="center"/>
      <el-table-column prop="sendTime" label="发送时间" align="center"/>
      <el-table-column label="状态" prop="newsState" :formatter="stateFormat" align="center" width="120"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.newsState === 2" type="text" size="small" @click="setDialog('view', scope.row)">查看</el-button>
          <el-button v-if="scope.row.newsState === 1" type="text" size="small" @click="setDialog('edit', scope.row)">编辑</el-button>
          <el-button v-if="scope.row.newsState === 1" type="text" size="small" @click="sumbitDraft(2, scope.row)">发送</el-button>
<!--          <el-button type="text" size="small" @click="delRow(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="page.total" @sorter="currentChange"></pagination>

<!-- 编辑新增弹框  -->
    <el-dialog :modal="false" :close-on-click-modal="false" :title="type === 'open' ? '新增' : '编辑'" :visible.sync="showDialog" width="40%">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="关联政策" :label-width="formLabelWidth">
          <el-select v-model="form.policyId" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in treeData" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息内容" :label-width="formLabelWidth" prop="snContent">
          <el-input type="textarea" v-model="form.snContent" :rows="4"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sumbit(1)">存为草稿</el-button>
        <el-button type="primary" @click="sumbit(2)">发送</el-button>
      </div>
    </el-dialog>
<!--查看弹框 -->
    <el-dialog :modal="false" :close-on-click-modal="false" title="查看" :visible.sync="showViewDialog" width="30%">
      <el-form :model="form">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" disabled />
        </el-form-item>
        <el-form-item label="关联政策" :label-width="formLabelWidth">
          <el-input v-model="form.policy" disabled />
        </el-form-item>
        <el-form-item label="消息内容" :label-width="formLabelWidth">
          <el-input disabled type="textarea" v-model="form.snContent" :rows="4"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showViewDialog = false">确定</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  getPolicesTree,
  add,
  update,
  getDetail,
  remove
} from "@/api/content/message";
import Pagination from '@/components/Pagination/index';
import {mapGetters} from "vuex";
import {getStore} from "@/util/store";

export default {
  name: 'Message',
  components: {
    Pagination
  },
  data() {
    return {
      USER_ID: getStore({name: 'userInfo'}).user_id,
      showDialog: false,
      showViewDialog: false,
      type: 'edit',
      formLabelWidth: '100px',
      form: {},
      treeData: [],
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      data: [],
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        snContent: [
          { required: true, message: '请输入消息内容', trigger: 'blur' }
        ],
      }
    };
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
    // 根据状态显示不同的值
    stateFormat(row) {
      if (row.newsState === 1) {
        return '草稿'
      } else {
        return '已发送'
      }
    },
    // 弹框操作
    setDialog(type, data) {
      this.type = type;
      this.resetForm();
      this.getTreeData();
      if (type === 'open') {
        this.showDialog = true;
      } else if (type === 'edit') {
        this.showDialog = true;
        this.getDetailData(data.id);
      } else {
        this.getDetailData(data.id);
        this.showViewDialog = true;
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
          if (this.type === 'open') {
            add(this.form)
              .then(res => {
                if (res.data.code === 200) {
                  this.$message.success('操作成功')
                  this.showDialog = false;
                  this.resetForm();
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
                this.onLoad(this.page);
              }
            }).catch(err => {
              this.$message.error(err);
            })
          }
        } else {
          return false;
        }
      });
    },
    // 草稿发送
    sumbitDraft(type, data) {
      data['newsState'] = type;
      data['userId'] = this.USER_ID;
      update(data).then(res => {
        if (res.data.code === 200) {
          this.$message.success('操作成功')
          this.showDialog = false;
          this.resetForm();
          this.onLoad(this.page);
        }
      }).catch(err => {
        this.$message.error(err);
      })
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
        this.page.total = res.data.data.count;
      });
    },
  //  获取相关政策
    getTreeData() {
      getPolicesTree().then(res => {
        if (res.data.code === 200 && res.data.data.length > 0) {
          this.treeData = res.data.data;
        }
      }).catch(err => {
        this.$message.error(err);
      })
    },
  //  获取详情
    getDetailData(id) {
      getDetail(id)
      .then(res => {
        if (res.data.code === 200) {
          this.form = res.data.data;
          console.log(this.form);
        }
      }).catch(err => {
        this.$message.error(err);
      })
    },
  // 删除指定行
    delRow(id) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        remove(id)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('删除成功')
              this.onLoad(this.page);
            }
          }).catch(err => this.$message.error(err))
      })
    }
  }
}
</script>
