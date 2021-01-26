import request from '@/router/axios';

export const getList = (pageNum, pageSize, params) => {
  return request({
    url: '/the-jury/list',
    method: 'get',
    params: {
      searchValue: params,
      pageNum,
      pageSize
    }
  })
}

// 获取评审专业列表
export const getListTms = _ => {
  return request({
    url: '/the-jury/list/tms',
    method: 'get'
  })
}
// 获取评审等级列表
export const getListTmsTjId = tjId => {
  return request({
    url: `/the-jury/list/tms/${tjId}`,
    method: 'get'
  })
}

// 获取省下拉列表
export const getProvince = _ => {
  return request({
    url: `/the-jury/list/province/00`,
    method: 'get'
  })
}

// 获取市下拉列表
export const getCity = code => {
  return request({
    url: `/the-jury/list/city/${code}`,
    method: 'get'
  })
}

// 获取区下拉列表
export const getArea = code => {
  return request({
    url: `/the-jury/list/district/${code}`,
    method: 'get'
  })
}

// 获取基础内容下拉列表
export const getBaseContent = _ => {
  return request({
    url: `/base/list/GZDWDQ10001`,
    method: 'get'
  })
}


export const add = (row) => {
  return request({
    url: '/the-jury/addOrUpdate',
    method: 'post',
    data: {
      apisign: '',
      data: row
    }
  })
}

export const getDetail = id => {
  return request({
    url: `/the-jury/get?id=${id}`,
    method: 'get'
  })
}



export const update = (row) => {
  return request({
    url: '/the-jury/addOrUpdate',
    method: 'post',
    data: {
      apisign: '',
      data: row
    }
  })
}


export const remove = (id) => {
  return request({
    url: `/base/remove/{bcCode}`,
    method: 'delete'
  })
}

export const setStateOpt = (row) => {
  return request({
    url: `/the-jury/change`,
    method: 'patch',
    data: {
      apisign: '',
      data: row
    }
  })
}
