<!-- TODO 评委会列表 -->
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

      <template slot-scope="{row}" slot="tgList">
        <div v-for="(item, index) in row.tgList" :key="index">
          <span>{{item}}</span>
        </div>
      </template>
      <template slot-scope="{row}" slot="tmsList">
        <div v-for="(item, index) in row.tmsList" :key="index">
          <span>{{item}}</span>
        </div>
      </template>

      <template slot="menuLeft">
        <!--        <el-button type="primary">下载模版</el-button>-->
        <!--        <el-button type="primary">导入评委会信息</el-button>-->
        <el-button type="primary" @click="showDialog(1)" size="small">新增
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button size="small" type="text"
                   @click="showDialog(2, scope.row.tjId)">编辑
        </el-button>
        <el-button size="small"
                   type="text" v-if="scope.row.changeState === '0'"
                   @click="setState(1, scope.row.tjId)">启用
        </el-button>
        <el-button size="small" type="text"
                   v-if="scope.row.changeState === '1'"
                   @click="setState(0, scope.row.tjId)">禁用
        </el-button>
      </template>
    </avue-crud>


    <!-- 新增编辑评委会 -->
    <el-dialog :modal="false"
               top="8vh"
               :close-on-click-modal="false" :title="type === 1 ? '新增' : '编辑'"
               :visible.sync="showViewDialog" width="50%">
      <el-form :model="form">
        <el-form-item label="评委会名称" :label-width="formLabelWidth">
          <el-input v-model="form.tjName"/>
        </el-form-item>
        <el-form-item label="评委会办公室" :label-width="formLabelWidth">
          <el-input v-model="form.tjOffice"/>
        </el-form-item>
        <el-form-item label="窗口地址" :label-width="formLabelWidth">
          <el-row :gutter="4">
            <el-col :span="7">
              <el-select v-model="form.province || form.provinceName"
                         placeholder="请选择" @change="setProvince">
                <el-option v-for="item in provinceList" :key="item.code"
                           :label="item.name" :value="item.code"/>
              </el-select>
            </el-col>
            <el-col :span="7">
              <el-select v-model="form.city || form.cityName" placeholder="请选择"
                         @change="setCity">
                <el-option v-for="item in cityList" :key="item.code"
                           :label="item.name" :value="item.code"/>
              </el-select>
            </el-col>
            <el-col :span="7">
              <el-select v-model="form.area || form.areaName" placeholder="请选择"
                         @change="setArea">
                <el-option v-for="item in areaList" :key="item.code"
                           :label="item.name" :value="item.code"/>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-input v-model="form.detailedAddress"
                        placeholder="请精确到门牌号"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="评审专业/级别" :label-width="formLabelWidth">
          <el-button @click="showMajorDialog = true">请选择</el-button>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="form.linkPhone" type="number"/>
        </el-form-item>
        <el-form-item label="邮编" :label-width="formLabelWidth">
          <el-input v-model="form.postcode"/>
        </el-form-item>
        <el-form-item label="受理范围" :label-width="formLabelWidth">
          <el-input v-model="form.accepScope" type="textarea" :rows="4"/>
        </el-form-item>
        <el-form-item label="所属地区" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择"
                     @change="setRegion">
            <el-option v-for="item in baseList" :key="item.bcCode"
                       :label="item.contentName" :value="item.bcCode"/>
          </el-select>
        </el-form-item>
        <el-form-item label="上下架状态" :label-width="formLabelWidth">
          <el-radio-group v-model="form.changeState">
            <el-radio :label="String(1)">启用</el-radio>
            <el-radio :label="String(0)">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
<!--TODO 新需求 文件上传，无字段-->
<!--        <el-form-item label="申请加入评委会模板" :label-width="formLabelWidth">-->
<!--          <upload @success="getFileData" :file-list="fileList"></upload>-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendData">确定</el-button>
      </div>
    </el-dialog>

    <!--等级专业 -->
    <el-dialog :modal="false"
               top="17vh"
               :close-on-click-modal="false" title="选择专业跟等级" width="40%"
               :visible.sync="showMajorDialog">
      <template v-if="majorList && majorList.length > 0">
        <div v-for="item in majorList" :key="item.tmsId">
          <el-checkbox :label="item.tmsId" v-model="tmsList"
                       style="display: block; margin-bottom: 10px"
                       @change="setMajor">
            <div>{{item.tmsName}}</div>
          </el-checkbox>
          <template v-if="item.tgList && item.tgList.length > 0">
            <el-checkbox border style="margin-left: 20px; margin-bottom: 10px"
                         v-model="tgList"
                         v-for="child in item.tgList" :key="child.tgId"
                         :label="child.tgId"
                         @change="setLevel"
            >
              <div>{{child.tgName}}</div>
            </el-checkbox>
          </template>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showMajorDialog = false">确定
        </el-button>
      </div>
    </el-dialog>

  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import {
  add,
  getArea, getBaseContent,
  getCity, getDetail,
  getList,
  getListTms,
  getListTmsTjId,
  getProvince, setStateOpt
} from "@/api/judges";
import Upload from '@/components/Upload/index';

export default {
  components: {
    Upload
  },
  data() {
    return {
      form: {},
      fileList: [],
      showViewDialog: false,
      showMajorDialog: false,
      majorList: [],
      baseList: [],
      provinceList: [],
      cityList: [],
      areaList: [],
      tmsList: [],
      tgList: [],
      type: 1,
      query: {},
      loading: true,
      formLabelWidth: '120px',
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
        excelBtn: true,
        column: [
          {
            label: 'ID',
            prop: 'tjId',
            width: 80
          },
          {
            label: '评委会名称',
            prop: 'tjName',
            width: 300
          },
          {
            label: '评审专业',
            prop: 'tmsList',
            slot: true
          },
          {
            label: '评审级别',
            prop: 'tgList',
            slot: true
          },
          {
            label: '所属地区',
            prop: 'region'
          },
          {
            label: '联系电话',
            prop: 'linkPhone'
          },
          {
            label: '管理账号',
            prop: 'utLevel',
            display: false,
            hide: true
          },
          {
            label: '状态',
            prop: 'changeState',
            type: 'radio',
            dicData: [
              {
                label: '禁用',
                value: '0'
              },
              {
                label: '启用',
                value: '1'
              }
            ]
          }
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
    // 获取上传附件
    getFileData(file) {
      console.log(file);
      this.form.fileUrl = file;
    },
    showDialog(type, id) {
      this.getProvinceData();
      this.getMajorData();
      this.getBaseData();
      this.form = {};
      if (type === 1) {
        this.showViewDialog = true;
      } else {
        this.type = 2;
        this.showViewDialog = true;
        this.getDetailData(id);
      }
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
    onLoad(page, params = '') {
      this.loading = true;
      getList(page.currentPage, page.pageSize, params).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.content;
        this.loading = false;
      });
    },
    // 获取详情
    getDetailData(id) {
      getDetail(id)
        .then(res => {
          if (res.data.code === 200) {
            this.form = res.data.data;
            this.form.getTmsListVOList.forEach(item => {
              item.tgList.forEach(child => {
                if (child.state == 1) {
                  this.tgList.push(child.tgId);
                }
              })
              if (item.tmsState == 1) {
                this.tmsList.push(item.tmsId);
              }
            })
          }
        }).catch(err => this.$message.error(err))
    },
    // 获取所属区域
    getBaseData() {
      getBaseContent()
        .then(res => {
          if (res.data.code === 200) {
            this.baseList = res.data.data;
          }
        }).catch(err => this.$message.error(err))
    },
    // 获取评审专业
    getMajorData() {
      getListTms()
        .then(res => {
          if (res.data.code === 200) {
            this.majorList = res.data.data;
            console.log(this.majorList);
          }
        }).catch(err => this.$message.error(err))
    },
    // 获取省列表
    getProvinceData() {
      getProvince()
        .then(res => {
          if (res.data.code === 200) {
            this.provinceList = res.data.data;
          }
        }).catch(err => this.$message.error(err));
    },
    // 获取市列表
    getCityData(code) {
      getCity(code)
        .then(res => {
          if (res.data.code === 200) {
            this.cityList = res.data.data;
          }
        }).catch(err => this.$message.error(err));
    },
    // 获取区列表
    getAreaData(code) {
      getArea(code)
        .then(res => {
          if (res.data.code === 200) {
            this.areaList = res.data.data;
          }
        }).catch(err => this.$message.error(err));
    },

    setRegion(data) {
      this.baseList.forEach(item => {
        if (item.bcCode === data) {
          this.form.region = item.contentName;
          this.form.regionId = item.bcCode;
        }
      })
    },

    // 设置用户选中的省数据
    setProvince(data) {
      this.provinceList.forEach(item => {
        if (item.code === data) {
          this.form.provinceName = item.name;
          this.form.provinceCode = item.code;
          this.getCityData(data);
        }
      })
    },
    // 设置用户选中的市数据
    setCity(data) {
      this.cityList.forEach(item => {
        if (item.code === data) {
          this.form.cityName = item.name;
          this.form.cityCode = item.code;
          this.getAreaData(data);
        }
      })
    },
    // 设置用户选中的区数据
    setArea(data) {
      this.areaList.forEach(item => {
        if (item.code === data) {
          this.form.areaName = item.name;
          this.form.areaCode = item.code;
        }
      })
    },
    // 设置用户选中的专业
    setMajor() {
      let res = [];
      this.tmsList.forEach(item => {
        res.push({
          tmsId: item
        })
      });
      this.form.tmsList = res;
    },
    // 设置用户选中的级别
    setLevel() {
      let res = [];
      this.majorList.forEach(item => {
        this.tmsList.forEach(tms => {
          if (item.tmsId === tms) {
            if (item.tgList.length > 0) {
              item.tgList.forEach(child => {
                this.tgList.forEach(sub => {
                  if (sub === child.tgId) {
                    res.push({
                      tgId: sub,
                      tmsId: tms
                    })
                  }
                })
              })
            }
          }
        })
      })
      this.form.tgList = res;
    },
    // 新增评委会
    sendData() {
      console.log(this.type);
      if (this.type === 1) {
        add(this.form)
          .then(res => {
            if (res.data.code === 200) {
              this.showMajorDialog = false;
              this.showViewDialog = false;
              this.$message.success('操作成功');
              this.onLoad(this.page);
              this.resetForm();
            }
          }).catch(err => this.$message.error(err));
      } else {
        let tgList = [],
          tmsList = [],
          data = {};
        this.form.getTmsListVOList.forEach(item => {
          console.log(item.tgList, 'tgList');
          item.tgList.forEach(child => {
            if (child.state == 1) {
              tgList.push({
                tgId: child.tgId,
                tmsId: item.tmsId
              });
            }
          })
          if (item.tmsState == 1) {
            tmsList.push({
              tmsId: item.tmsId
            });
          }
        })
        if (this.form.tgList) {
          // delete this.form.getTmsListVOList
          data = {
            ...this.form,
            tgList: this.form.tgList,
            tmsList: this.form.tmsList
          }
          console.log(data, 'tg');
        }
        if (this.form.tmsList) {
          // delete this.form.getTmsListVOList
          data = {
            ...this.form,
            tgList: this.form.tgList,
            tmsList: this.form.tmsList,
          }
          console.log(data, 'tms');
        } else {
          // delete this.form.getTmsListVOList
          data = {
            ...this.form,
            tgList,
            tmsList
          }
          console.log(data, 'edit');
        }
        add(data)
          .then(res => {
            if (res.data.code === 200) {
              this.showMajorDialog = false;
              this.showViewDialog = false;
              this.$message.success('操作成功');
              this.onLoad(this.page);
              this.resetForm();
            }
          }).catch(err => this.$message.error(err));
      }
    },
    setState(type, id) {
      let data = {
        changeState: type,
        tjId: id
      };
      setStateOpt(data)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功');
            this.onLoad(this.page);
          }
        }).catch(err => this.$message.error(err))
    },
    resetForm() {
      this.form = {};
      this.tmsList = [];
      this.tgList = [];
    }
  }
};
</script>

<style>
</style>
