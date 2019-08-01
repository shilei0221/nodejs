<template>
  <div>
    <!-- 阿里云视频播放器样式 -->
    <link
      rel="stylesheet"
      href="https://g.alicdn.com/de/prismplayer/2.8.1/skins/default/aliplayer-min.css"
    />
    <!-- 阿里云视频播放器脚本 -->
    <script
      charset="utf-8"
      type="text/javascript"
      src="https://g.alicdn.com/de/prismplayer/2.8.1/aliplayer-min.js"
    />

    <!-- 定义播放器dom -->
    <div id="J_prismPlayer" class="prism-player" />
  </div>
</template>

<script>
import vod from "@/api/vod";

export default {
  layout: "video", //使用video自定义布局
  asyncData({ params, error }) {
    return vod.getPlayAuthVideo(params.vid).then(response => {
      return {
        vid: params.vid, // 视频id
        playAuth: response.data.data.playAuth //播放凭证
      };
    });
  },
  /**
   * 页面渲染完成时：此时js脚本已加载，Aliplayer已定义，可以使用
   * 如果在created生命周期函数中使用，Aliplayer is not defined错误
   */
  mounted() {
    /* eslint-disable no-undef */
    /*const player = */ new Aliplayer(
      {
        id: "J_prismPlayer",
        vid: this.vid, // 视频id
        playauth: this.playAuth, // 播放凭证
        encryptType: "1", // 如果播放加密视频，则需设置encryptType=1，非加密视频无需设置此项
        width: "100%",
        height: "500px",
        // 以下可选设置
        cover:
          "https://edu-file0221.oss-cn-beijing.aliyuncs.com/s4.jpg", // 封面
        qualitySort: "asc", // 清晰度排序

        //format: "m3u8", // 播放格式
        mediaType: "video", // 返回音频还是视频
        autoplay: false, // 自动播放
        isLive: false, // 直播
        rePlay: false, // 循环播放
        preload: true,
        controlBarVisibility: "hover", // 控制条的显示方式：鼠标悬停
        useH5Prism: true // 播放器类型：html5
      },
      function(player) {
        console.log("播放器创建成功");
      }
    );
  }
};
</script>
