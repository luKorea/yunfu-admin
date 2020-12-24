
<template>
  <div class="editor-wang">
    <div id="wangEditor"></div>
  </div>
</template>

<script>
// 引入 wangEditor
import wangEditor from "wangeditor";
import {getImgUrl, IMG_URL, QUERY_DATA} from "@/util/url";
export default {
  data() {
    return {
      editor: null,
      editorData: ``,
    };
  },
  props: {
    editorDetail: String,
  },
  mounted() {
    const editor = new wangEditor(`#wangEditor`);
    // 配置 onchange 回调函数，将数据同步到 vue 中
    editor.config.onchange = (newHtml) =>  this.editorData = newHtml;
    editor.config.uploadImgServer = IMG_URL;
    // 自定义参数
    editor.config.uploadImgParams = QUERY_DATA;
    editor.config.uploadFileName = "file";
    // editor.config.uploadImgMaxSize = 5 * 1024 * 1024; // 5M

    // 配置图片回显功能
    editor.config.uploadImgHooks = {
      customInsert: function (insertImg, result, editor) {
        let imgUrl = getImgUrl(result);
        insertImg(imgUrl); //插入图片，即回显
      }
    }
    // 创建编辑器
    editor.create();
    this.editor = editor;

    // setTimeout(()=>{
    //   this.editor.txt.html(this.editorDetail);
    // },1000)
  },
  methods: {
    getEditorData() {
      // 通过代码获取编辑器内容
      let data = this.editor.txt.html();
      return data;
    },
    setHtml (html) {
      console.log(html);
      this.editor.txt.html(html)
    },
    clearHtml () {
      this.editor.txt.clear()
    },
  },

  beforeDestroy() {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy();
    this.editor = null;
  },
};
</script>
