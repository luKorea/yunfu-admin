<template>
  <!-- 编辑   -->
  <el-dialog :modal="false" :close-on-click-modal="false"
             @close="resetForm"
             title="编辑"
             :visible.sync="showEditDialog" top="5vh">
    <el-form ref="form" :model="form" label-width="120px"
             style="margin-top: 20px">
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
      </div>
    </el-form>
    <el-button  @click="sumbit">提交</el-button>
  </el-dialog>
</template>

<script>
export default {
  name: "step"
}
</script>

<style scoped>

</style>
