import md5 from 'md5';
// 图片服务器地址
export const IMG_URL = 'http://file.gzbigbang.cn/rsyFile/upload/files';
// 自定义参数
let pTime = new Date().getTime(),
  code = 'H1',
  date = `code=${code}&time=${pTime}`;
export const QUERY_DATA = {
  code,
  time: pTime,
  apisign: md5(`qidian2020@wenjianfuwuqi!90sd36er?!d30RB${date}`)
}

  /**
   * @method getImgUrl
   * @description 封装获取服务器返回图片地址
   * @param result {Object}
   * @return string
   */
export const getImgUrl = result => {
  let url = result.data.httpHostPapers;//获取后台返回的url
  let address = result.data.papersUri[0],
    str = address.substr(1);
  return url + str;
}
