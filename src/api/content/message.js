import request from '@/router/axios';

export const getList = (pageNum, pageSize, params) => {
  return request({
    url: '/sys-news/list',
    method: 'get',
    params: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

// 获取相关政策
export const getPolicesTree = () => {
  return request({
    url: '/policy/pull/list',
    method: 'get'
  })
}


export const add = (row) => {
  return request({
    url: '/sys-news/add',
    method: 'post',
    data: row
  })
}


export const getDetail = (id) => {
  return request({
    url: `/sys-news/get/${id}`,
    method: 'get'
  })
}

export const remove = (id) => {
  return request({
    url: `/sys-news/delete/${id}`,
    method: 'get'
  })
}

export const update = (row) => {
  return request({
    url: '/sys-news/update',
    method: 'post',
    data: row
  })
}
