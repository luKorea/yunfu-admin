import request from '@/router/axios';

export const getList = (pageNum, pageSize, params) => {
  return request({
    url: '/base/list',
    method: 'get',
    params: {
      parentId: 0,
      pageNum,
      pageSize
    }
  })
}



export const add = (row) => {
  return request({
    url: '/base/add',
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

export const update = (row) => {
  return request({
    url: '/sys-news/update',
    method: 'post',
    data: row
  })
}
