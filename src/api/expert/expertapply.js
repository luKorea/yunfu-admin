import request from '@/router/axios';


// 获取专家列表
export const getList = (pageNum, pageSize, params) => {
  return request({
    url: '/expert-apply/list',
    method: 'get',
    params: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

// 获取历史专家列表
export const getHistoryList = (pageNum, pageSize, params) => {
  return request({
    url: '/expert-apply/history/list',
    method: 'get',
    params: {
      ...params,
      pageNum,
      pageSize
    }
  })
}


export const add = (row) => {
  return request({
    url: '/notice/add',
    method: 'post',
    data: row
  })
}


export const getDetail = (id) => {
  return request({
    url: `/notice/${id}`,
    method: 'get'
  })
}

export const remove = (id) => {
  return request({
    url: `/notice/delete/${id}`,
    method: 'get'
  })
}

export const update = (row) => {
  return request({
    url: '/notice/update',
    method: 'post',
    data: row
  })
}


// 更改公告上下架
export const updateState = (row) => {
  return request({
    url: 'expert-apply/update/state',
    method: 'PUT',
    data: {
      ...row
    }
  })
}

