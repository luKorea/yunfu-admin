<!-- TODO 职称管理列表 -->
<template>
  <basic-container>
    <div
      style="margin-bottom: 20px;display: flex; justify-content: space-between">
      <el-button type="primary" @click="setDialog('open')">新建职称</el-button>
      <el-input clearable placeholder="请输入内容" v-model="keyword"
                class="input-with-select" style="width: 300px">
        <el-button slot="append" style="background-color: #1e9fff; color: #fff"
                   icon="el-icon-search" @click="searchData"/>
      </el-input>
    </div>
    <el-table border :data="data" style="width: 100%">
      <el-table-column prop="id" label="ID" align="center"/>
      <el-table-column prop="typeName" label="类别" align="center"/>
      <el-table-column prop="majorSkill" label="专业" align="center"/>
      <el-table-column prop="titleGradeListVOList" label="职称" align="center">
        <template slot-scope="scope"
                  v-if="scope.row.titleGradeListVOList.length > 0">
          <div v-for="item in scope.row.titleGradeListVOList" :key="item.id">
            {{ item.gradeName }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="状态" prop="changeState" :formatter="stateFormat"
                       align="center" width="120"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="scope.row.changeState === 0"
                     @click="setState(1, scope.row.id)">启用
          </el-button>
          <el-button type="text" size="small" v-if="scope.row.changeState === 1"
                     @click="setState(0, scope.row.id)">禁用
          </el-button>
          <el-button type="text" size="small"
                     @click="setDialog('edit', scope.row.id)">编辑
          </el-button>
          <el-button type="text" size="small" @click="delRow(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.total" @sorter="currentChange"></pagination>

    <!-- 新增   -->
    <el-dialog :modal="false" :close-on-click-modal="false"
               @close="resetForm"
               title="新增"
               :visible.sync="showDialog" top="5vh">
      <el-steps :active="active" align-center>
        <el-step title="基础配置"></el-step>
        <el-step title="申报配置"></el-step>
      </el-steps>
      <el-form ref="form" :model="form" label-width="120px"
               style="margin-top: 20px">
        <template v-if="active === 1">
          <el-form-item label="关联政策">
            <el-select v-model="form.pid" placeholder="请选择" style="width: 100%">
              <el-option v-for="item in treeData" :key="item.id"
                         :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择状态">
            <el-radio-group v-model="form.changeState">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="类别">
            <el-select v-model="form.type" placeholder="请选择"
                       style="width: 100%">
              <el-option v-for="item in typeData" :key="item.bcCode"
                         :label="item.contentName"
                         :value="item.bcCode"></el-option>
            </el-select>
          </el-form-item>
          <!-- 专业技术 -->
          <el-form-item
            v-for="(major, index) in dynamicValidateForm.majorSkillListItem"
            label="专业技术"
            :key="major.key">
            <el-input v-model="major.value"
                      style="width: 200px; margin-right: 20px"></el-input>
            <el-button @click="addMajor">新增</el-button>
            <el-button @click.prevent="removeMajor(major)">删除</el-button>
          </el-form-item>
          <!-- 级别职称 -->
          <div v-for="(type, index) in dynamicValidateForm.typeListItem">
            <el-form-item label="级别">
              <el-select v-model="type.bcCode" placeholder="请选择"
                         style="margin-right: 20px">
                <el-option v-for="item in levelData" :key="item.bcCode"
                           :label="item.contentName"
                           :value="item.bcCode"></el-option>
              </el-select>
              <el-button @click="addType">新增级别</el-button>
              <el-button @click.prevent="removeType(type)">删除</el-button>
            </el-form-item>
            <el-form-item label="职称">
              <el-input v-model="type.grade"></el-input>
            </el-form-item>
          </div>
        </template>
        <template v-if="active === 2">
          <div>
            <el-form-item label="申报条件配置： "></el-form-item>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="最小年龄">
                  <el-input v-model="form.minAge" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="最大年龄">
                  <el-input v-model="form.maxAge" type="number"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8">
              <el-form-item label="前置职称条件">
                <el-col :span="16">
                  <el-select v-model="form.msId" placeholder="专业技术"
                             style="margin-right: 20px" @change="selectTitle">
                    <el-option v-for="item in titleData" :key="item.id"
                               :label="item.majorSkill"
                               :value="item.id"></el-option>
                  </el-select>
                  <el-select v-model="form.tgId" placeholder="级别"
                             style="margin-right: 20px">
                    <el-option v-for="item in titleAndData" :key="item.id"
                               :label="item.grade" :value="item.id"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-row :gutter="10">
                    <el-col :span="8">获取年限</el-col>
                    <el-col :span="10">
                      <el-input v-model="form.getYears" style="display: flex"
                                type="number"></el-input>
                    </el-col>
                    <el-col :span="6">年</el-col>
                  </el-row>
                </el-col>
              </el-form-item>
            </el-row>
          </div>
          <div>
            <el-form-item label="申报资料配置： ">
            </el-form-item>
            <div
              v-for="(type, index) in dynamicValidateForm.dmConfigAddDTOList">
              <el-form-item label="内容">
                <el-row>
                  <el-col :span="6">
                    <el-input v-model="type.materialTitle"
                              style="width: 200px;"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <span style="margin-left: 20px">*以下内容需满足其 </span>
                    <el-input v-model="type.satisfyQuantity"
                              style="width: 80px"></el-input>
                    <span> 即可</span>
                  </el-col>
                  <el-col :span="10">
                    <el-button @click="addFile(index)">新增</el-button>
                    <el-button @click="removeFile(type)">删除</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <div v-for="(item, i) in type.dmcConfigAddDTOList" :key="i">
                <el-form-item label="文件名称">
                  <el-input v-model="item.mcontentTitle"
                            style="width: 300px; margin-right: 20px"></el-input>
                  <el-button @click="addFileItem(index)">新增</el-button>
                  <el-button @click="removeFileItem(item, i)">删除</el-button>
                </el-form-item>
                <el-form-item label="填写说明">
                  <el-input v-model="item.mcontentDesc" type="textarea"
                            :rows="4"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
           <el-button style="margin-top: 12px;" @click="next" v-if="active<2">下一步
        </el-button>
        <el-button style="margin-top: 12px;" @click="pre" v-if="active>1">上一步
        </el-button>
        <el-button v-if="active>1" @click="sumbit">提交</el-button>
        </span>
    </el-dialog>
    <!-- 编辑   -->
    <el-dialog :modal="false" :close-on-click-modal="false"
               @close="resetForm"
               title="编辑"
               :visible.sync="showEditDialog" top="5vh">
      <el-steps :active="active" align-center>
        <el-step title="基础配置"></el-step>
        <el-step title="申报配置"></el-step>
      </el-steps>
      <el-form ref="form" :model="form" label-width="120px"
               style="margin-top: 20px">
        <template v-if="active === 1">
          <el-form-item label="关联政策">
            <el-select v-model="form.pid" placeholder="请选择" style="width: 100%">
              <el-option v-for="item in treeData" :key="item.id"
                         :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择状态">
            <el-radio-group v-model="form.changeState">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="类别">
            <el-select v-model="form.type" placeholder="请选择"
                       style="width: 100%">
              <el-option v-for="item in typeData" :key="item.bcCode"
                         :label="item.contentName"
                         :value="item.bcCode"></el-option>
            </el-select>
          </el-form-item>
          <!-- 专业技术 -->
          <el-form-item label="专业技术">
            <el-input v-model="form.majorSkill"></el-input>
          </el-form-item>
          <!-- 级别职称 -->
          <div v-for="(type, index) in dynamicValidateForm.typeListItem">
            <el-form-item label="级别">
              <el-select v-model="type.bcCode" placeholder="请选择"
                         style="margin-right: 20px">
                <el-option v-for="item in levelData" :key="item.bcCode"
                           :label="item.contentName"
                           :value="item.bcCode"></el-option>
              </el-select>
              <el-button @click="addType">新增级别</el-button>
              <el-button @click.prevent="removeType(type)">删除</el-button>
            </el-form-item>
            <el-form-item label="职称">
              <el-input v-model="type.grade"></el-input>
            </el-form-item>
          </div>
        </template>
        <template v-if="active === 2">
          <div>
            <el-form-item label="申报条件配置： "></el-form-item>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="最小年龄">
                  <el-input v-model="form.minAge" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="最大年龄">
                  <el-input v-model="form.maxAge" type="number"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8">
              <el-form-item label="前置职称条件">
                <el-col :span="16">
                  <el-select v-model="form.msId" placeholder="专业技术"
                             style="margin-right: 20px" @change="selectTitle">
                    <el-option v-for="item in titleData" :key="item.id"
                               :label="item.majorSkill"
                               :value="item.id"></el-option>
                  </el-select>
                  <el-select v-model="form.tgId" placeholder="级别"
                             style="margin-right: 20px">
                    <el-option v-for="item in titleAndData" :key="item.id"
                               :label="item.grade" :value="item.id"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-row :gutter="10">
                    <el-col :span="8">获取年限</el-col>
                    <el-col :span="10">
                      <el-input v-model="form.getYears" style="display: flex"
                                type="number"></el-input>
                    </el-col>
                    <el-col :span="6">年</el-col>
                  </el-row>
                </el-col>
              </el-form-item>
            </el-row>
          </div>
          <div>
            <el-form-item label="申报资料配置： ">
            </el-form-item>
            <div
              v-for="(type, index) in dynamicValidateForm.dmConfigAddDTOList">
              <el-form-item label="内容">
                <el-row>
                  <el-col :span="6">
                    <el-input v-model="type.materialTitle"
                              style="width: 200px;"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <span style="margin-left: 20px">*以下内容需满足其 </span>
                    <el-input v-model="type.satisfyQuantity"
                              style="width: 80px"></el-input>
                    <span> 即可</span>
                  </el-col>
                  <el-col :span="10">
                    <el-button @click="addFile(index)">新增</el-button>
                    <el-button @click="removeFile(type)">删除</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <div v-for="(item, i) in type.dmcConfigAddDTOList" :key="i">
                <el-form-item label="文件名称">
                  <el-input v-model="item.mcontentTitle"
                            style="width: 300px; margin-right: 20px"></el-input>
                  <el-button @click="addFileItem(i)">新增</el-button>
                  <el-button @click="removeFileItem(item)">删除</el-button>
                </el-form-item>
                <el-form-item label="填写说明">
                  <el-input v-model="item.mcontentDesc" type="textarea"
                            :rows="4"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
           <el-button style="margin-top: 12px;" @click="next" v-if="active<2">下一步
        </el-button>
        <el-button style="margin-top: 12px;" @click="pre" v-if="active>1">上一步
        </el-button>
        <el-button v-if="active>1" @click="sumbit">提交</el-button>
        </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import Pagination from "@/components/Pagination/index";
import {getStore} from "@/util/store";
import {
  getList,
  updateState,
  getPolicesTree,
  getTypeList,
  getLevelList,
  getTitleList,
  getTitleAndList,
  add,
  update,
  getDetail
} from "@/api/management/managelist";
import {remove} from "@/api/review/comments";

export default {
  name: "managelist",
  components: {
    Pagination
  },
  data() {
    return {
      dynamicValidateForm: {
        // 专业技术
        majorSkillListItem: [
          {
            value: ''
          }
        ],
        //  级别
        typeListItem: [
          {
            bcCode: '',
            grade: ''
          }
        ],
        // 申报资料配置
        dmConfigAddDTOList: [
          {
            dmcConfigAddDTOList: [
              {
                mcontentDesc: "",
                mcontentTitle: "",
                index: 0
              }
            ],
            materialTitle: "",
            satisfyQuantity: ''
          }
        ]
      },
      USER_ID: getStore({name: 'userInfo'}).user_id,
      showDialog: false,
      showEditDialog: false,
      type: 'edit',
      formLabelWidth: '100px',
      form: {},
      keyword: '',
      active: 1,
      treeData: [],
      typeData: [],
      levelData: [],
      titleData: [],
      titleAndData: [],
      selectIndex: 0,
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      data: [],
    };
  },
  created() {
    this.onLoad(this.page);
  },
  methods: {
    // 动态新增专业
    removeMajor(item) {
      let index = this.dynamicValidateForm.majorSkillListItem.indexOf(item)
      if (index !== 0) {
        this.dynamicValidateForm.majorSkillListItem.splice(index, 1)
      } else {
        this.$message.error('必须保留一项')
        return;
      }
    },
    addMajor() {
      this.dynamicValidateForm.majorSkillListItem.push({
        value: '',
        key: Date.now()
      });
    },
    // 动态新增级别职称
    removeType(item) {
      if (this.type === 'edit') {
        this.$message.info('删除操作')
      }
      let index = this.dynamicValidateForm.typeListItem.indexOf(item)
      if (index !== 0) {
        this.dynamicValidateForm.typeListItem.splice(index, 1)
      } else {
        this.$message.error('必须保留一项')
        return;
      }
    },
    addType() {
      this.dynamicValidateForm.typeListItem.push({
        bcCode: '',
        grade: '',
        key: Date.now()
      });
    },
    // 动态新增申报资料
    removeFile(item) {
      console.log(item);
      if (this.type === 'edit') {
        this.$message.info('删除操作')
      }
      let index = this.dynamicValidateForm.dmConfigAddDTOList.indexOf(item)
      if (index !== 0) {
        this.dynamicValidateForm.dmConfigAddDTOList.splice(index, 1)
      } else {
        this.$message.error('必须保留一项')
        return;
      }
    },
    addFile(index) {
      this.selectIndex = index;
      this.dynamicValidateForm.dmConfigAddDTOList.push(
        {
          dmcConfigAddDTOList: [
            {
              mcontentDesc: "",
              mcontentTitle: ""
            }
          ],
          materialTitle: "",
          satisfyQuantity: '',
          key: Date.now()
        });
    },
    // 动态新增申报资料
    removeFileItem(data, i) {
      const _that = this;
      if (this.type === 'edit') {
        this.$message.info('删除操作')
      }
      let selectItem = [];
      this.dynamicValidateForm.dmConfigAddDTOList.forEach((item, index) => {
        console.log(item.dmcConfigAddDTOList.length);
        if (item.dmcConfigAddDTOList.length === 1) {
          _that.$message.error('必须保留一项')
          return;
        } else {
          selectItem = item.dmcConfigAddDTOList;
          selectItem.splice(data, 1)
        }
      })
    },
    addFileItem(i) {
      let json = JSON.stringify(this.dynamicValidateForm.dmConfigAddDTOList);
      let str = JSON.parse(json);
      str.forEach((item, index) => {
        if (i === index) {
          item.dmcConfigAddDTOList.push({
            mcontentDesc: "",
            mcontentTitle: ""
          })
        }
      });
      this.dynamicValidateForm.dmConfigAddDTOList = str;
    },
    next() {
      if (this.active++ > 1) this.active = 1;
    },
    pre() {
      if (this.active-- < 2) this.active = 1;
    },
    // 根据状态显示不同的值
    stateFormat(row) {
      if (row.changeState === 1) {
        return '启用'
      } else {
        return '禁用'
      }
    },
    setDialog(type, id) {
      this.type = type;
      this.resetForm();
      this.getTreeData();
      this.getTypeData();
      this.getLevelData();
      this.getTitleData();
      if (type === 'open') {
        this.showDialog = true;
      } else if (type === 'edit') {
        this.showEditDialog = true;
        this.getDetailData(id);
      }
    },
    resetForm() {
      this.form = {};
      this.dynamicValidateForm = {
        // 专业技术
        majorSkillListItem: [
          {
            value: ''
          }
        ],
        //  级别
        typeListItem: [
          {
            bcCode: '',
            grade: ''
          }
        ],
        // 申报资料配置
        dmConfigAddDTOList: [
          {
            dmcConfigAddDTOList: [
              {
                mcontentDesc: "",
                mcontentTitle: "",
              }
            ],
            materialTitle: "",
            satisfyQuantity: ''
          }
        ]
      };
    },
    // 获取表格数据
    onLoad(page, params = {}) {
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        this.data = res.data.data.content;
        this.page.total = res.data.data.count;
      });
    },
    searchData() {
      this.onLoad(this.page, {
        keyword: this.keyword
      })
    },
    getDetailData(id) {
      getDetail(id)
        .then(res => {
          if (res.data.code === 200) {
            console.log(res);
            this.form = res.data.data;
            this.dynamicValidateForm.dmConfigAddDTOList = res.data.data.titleGradeVOList;
          }
        }).catch(err => this.$message.error(err))
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
    //  获取类别
    getTypeData() {
      getTypeList().then(res => {
        if (res.data.code === 200 && res.data.data.length > 0) {
          this.typeData = res.data.data;
        }
      }).catch(err => {
        this.$message.error(err);
      })
    },
    //  获取级别
    getLevelData() {
      getLevelList().then(res => {
        if (res.data.code === 200 && res.data.data.length > 0) {
          this.levelData = res.data.data;
        }
      }).catch(err => {
        this.$message.error(err);
      })
    },
    //  获取专业等级
    getTitleData() {
      getTitleList().then(res => {
        if (res.data.code === 200 && res.data.data.length > 0) {
          this.titleData = res.data.data;
        }
      }).catch(err => {
        this.$message.error(err);
      })
    },
    //  获取专业技术下的等级
    getTitleAndData(id) {
      getTitleAndList(id).then(res => {
        if (res.data.code === 200 && res.data.data.length > 0) {
          this.titleAndData = res.data.data;
        }
      }).catch(err => {
        this.$message.error(err);
      })
    },
    selectTitle(id) {
      this.getTitleAndData(id);
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page);
    },
    // 修改禁用状态
    setState(changeState, id) {
      updateState({
        changeState: changeState,
        id: id
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success('操作成功')
          this.onLoad(this.page);
        }
      }).catch(err => this.$message.error(err))
    },
    delRow(id) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        remove(id).then(res => {
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
    //  数据提交
    sumbit() {
      let majorSkillListItem = [],
        titleGradeAddDTOList = [],
        form = this.form;
      this.dynamicValidateForm.majorSkillListItem.forEach(item => {
        majorSkillListItem.push(item.value)
      });
      this.dynamicValidateForm.typeListItem.forEach(item => {
        titleGradeAddDTOList.push({
          grade: item.grade,
          gradeType: item.bcCode,
          getYears: form.getYears,
          maxAge: form.maxAge,
          minAge: form.minAge,
          msId: form.msId,
          tgId: form.tgId,
          dmConfigAddDTOList: this.dynamicValidateForm.dmConfigAddDTOList
        })
      })
      let data = {
        pid: form.pid,
        type: form.type,
        changeState: form.changeState,
        createdBy: this.USER_ID,
        majorSkillList: majorSkillListItem,
        titleGradeAddDTOList: titleGradeAddDTOList
      }
      if (this.type === 'open') {
        //  新增
        add(data)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('操作成功')
              this.showDialog = false;
              this.onLoad(this.page)
            }
          }).catch(err => this.$message.error(err))
      } else if (this.type === 'edit') {
        //  编辑
        update(data)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('操作成功')
              this.showEditDialog = false;
              this.onLoad(this.page)
            }
          }).catch(err => this.$message.error(err))
      }
      console.log(this.type);
    }
  },
}
</script>

<style scoped>

</style>
