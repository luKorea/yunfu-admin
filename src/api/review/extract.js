import request from '@/router/axios';


// 获取时间以及获取签到
export const getTimeOrNumber = (bcCode) => {
  return request({
    url: `/extract-config/get/${bcCode}`
  })
}

export const setTimeType = (row) => {
  return request({
    url: `/extract-config/update/${row.bcCode}`,
    method: 'get',
    params: {
      content: row.content
    }
  })
}
