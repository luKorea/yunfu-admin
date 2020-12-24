import request from '@/router/axios';

export const getList = (pageNum, pageSize, params) => {
  return request({
    url: '/title/list',
    method: 'get',
    params: {
      juryId: '',
      keyword: params.keyword,
      pageNum,
      pageSize
    }
  })
}

// 更改禁用状态
export const updateState = (row) => {
  return request({
    url: '/title/update/state',
    method: 'post',
    params: row
  })
}


// 新增职称
export const add = (row) => {
  return request({
    url: `/title/add`,
    method: 'post',
    data: row
  })
}
// 修改职称
export const update = (row) => {
  return request({
    url: `/title/update`,
    method: 'post',
    data: row
  })
}

// 修改职称
export const getDetail = (id) => {
  return request({
    url: `/title/${id}`,
    method: 'get',
  })
}



// 删除职称
export const remove = (id) => {
  return request({
    url: `/title/delete/${id}`,
    method: 'post'
  })
}

// 获取相关政策
export const getPolicesTree = () => {
  return request({
    url: '/policy/pull/list',
    method: 'get'
  })
}


// 获取类别
export const getTypeList = () => {
  return request({
    url: '/base/list/ZCGL10001',
    method: 'get'
  })
}

// 获取类别
export const getLevelList = () => {
  return request({
    url: '/base/list/ZCGL10002',
    method: 'get'
  })
}

// 获取专业下拉列表
export const getTitleList = () => {
  return request({
    url: '/title/title/pull/list',
    method: 'get'
  })
}

// 获取等级下拉列表
export const getTitleAndList = (tmsId) => {
  return request({
    url: '/title/grade/pull/list',
    method: 'get',
    params: {
      tmsId
    }
  })
}
