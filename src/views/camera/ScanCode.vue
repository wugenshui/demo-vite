<template>
  <view class="canvasBox">
    <template v-if="isUse">
      <!-- 扫描边框 -->
      <view class="box">
        <view class="line"></view>
        <view class="angle"></view>
      </view>
      <button class="save_img" @click="saveImg">{{ content }}</button>
    </template>
    <!-- 错误提示信息 -->
    <template v-else>
      <slot name="error">
        <view class="error">
          <view class="on1">相机权限被拒绝，请尝试如下操作：</view>
          <view>· 刷新页面后重试；</view>
          <view>· 在系统中检测当前App或浏览器的相机权限是否被禁用；</view>
        </view>
      </slot>
    </template>
    <image class="img" :src="imgSrc"></image>
  </view>
</template>

<script>
import * as jsQR from "./jsQR.js";

let canvas;
export default {
  props: {
    continue: {
      type: Boolean,
      default: true, // false 监听一次   true 持续监听
    },
    exact: {
      type: String,
      default: "environment", // environment 后摄像头  user 前摄像头
    },
    size: {
      type: String,
      default: "whole", // whole 全屏  half 半屏
    },
  },
  data() {
    return {
      windowWidth: 0,
      windowHeight: 0,
      video: null,
      canvas2d: null,
      inter: 0,

      isParse: false,
      isUse: true,

      imgSrc: null,
      content: "保存截图",
    };
  },
  mounted() {
    this.windowWidth =
      document.documentElement.clientWidth || document.body.clientWidth;
    this.windowHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    this.windowHeight =
      this.size === "whole" ? this.windowHeight : this.windowHeight / 2;
    this.isParse = true;

    this.$nextTick(() => {
      this.openScan();
    });
  },
  destroyed() {
    this.closeCamera();
  },
  methods: {
    openScan() {
      const width = this.transtion(this.windowHeight);
      const height = this.transtion(this.windowWidth);
      const videoParam = {
        audio: false,
        video: {
          facingMode: { exact: this.exact },
          width,
          height,
        },
      };
      navigator.mediaDevices
        .getUserMedia(videoParam)
        .then((stream) => {
          this.video = document.createElement("video");
          this.video.width = this.windowWidth;
          this.video.height = this.windowHeight;

          canvas = document.createElement("canvas");
          canvas.id = "canvas";
          canvas.width = this.windowWidth;
          canvas.height = this.windowHeight;
          canvas.style = "display:none;";
          this.canvas2d = canvas.getContext("2d");

          // 设置当前宽高 满屏
          const canvasBox = document.querySelector(".canvasBox");
          canvasBox.append(this.video);
          canvasBox.append(canvas);
          canvasBox.style = `width:${this.windowWidth}px;height:${this.windowHeight}px;`;

          this.video.srcObject = stream;
          this.video.setAttribute("playsinline", true);
          this.video.play();
          this.tick();
        })
        .catch((err) => {
          this.isUse = true;
          this.$emit("error", err);
        });
    },
    // 关闭摄像头
    closeCamera() {
      this.isParse = false;
    },
    // 扫码判断
    tick() {
      if (!this.isParse) return;
      if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
        // 绘图
        this.canvas2d.drawImage(
          this.video,
          0,
          0,
          this.windowWidth,
          this.windowHeight
        );
        // 获取图数据
        const imageData = this.canvas2d.getImageData(
          0,
          0,
          this.windowWidth,
          this.windowHeight
        );
        // 获取二维码
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          this.handleQRCode(code.data);
        }
      }
      requestAnimationFrame(this.tick);
    },
    // 二维码响应
    handleQRCode(data) {
      this.$emit("success", data);
      if (!this.continue) {
        this.closeCamera();
      }
    },
    // 越高越清晰
    transtion(number) {
      return number * 3;
    },
    saveImg() {
      let src = canvas.toDataURL("image/png");
      // alert(src)
      this.imgSrc = src;
    },
  },
};
</script>

<style scoped>
page {
  background-color: #333333;
}

.canvasBox {
  display: inline-block;
  width: 100vw;
  height: 100vh;
  position: relative;

  background-image: linear-gradient(0deg,
      transparent 24%,
      rgba(32, 255, 77, 0.1) 25%,
      rgba(32, 255, 77, 0.1) 26%,
      transparent 27%,
      transparent 74%,
      rgba(32, 255, 77, 0.1) 75%,
      rgba(32, 255, 77, 0.1) 76%,
      transparent 77%,
      transparent),
    linear-gradient(90deg,
      transparent 24%,
      rgba(32, 255, 77, 0.1) 25%,
      rgba(32, 255, 77, 0.1) 26%,
      transparent 27%,
      transparent 74%,
      rgba(32, 255, 77, 0.1) 75%,
      rgba(32, 255, 77, 0.1) 76%,
      transparent 77%,
      transparent);
  background-size: 3rem 3rem;
  background-position: -1rem -1rem;
  z-index: 10;
  background-color: #1110;
}

.box {
  width: 300px;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  border: 0.1rem solid rgba(0, 255, 51, 0.2);
  z-index: 11;
}

.line {
  height: calc(100% - 2px);
  width: 100%;
  background: linear-gradient(180deg, rgba(0, 255, 51, 0) 43%, #00ff33 211%);
  border-bottom: 3px solid #00ff33;
  transform: translateY(-100%);
  animation: radar-beam 2s infinite alternate;
  animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
  animation-delay: 1.4s;
}

.box:after,
.box:before,
.angle:after,
.angle:before {
  content: "";
  display: block;
  position: absolute;
  width: 3vw;
  height: 3vw;
  z-index: 12;
  border: 0.2rem solid transparent;
}

.box:after,
.box:before {
  top: 0;
  border-top-color: #00ff33;
}

.angle:after,
.angle:before {
  bottom: 0;
  border-bottom-color: #00ff33;
}

.box:before,
.angle:before {
  left: 0;
  border-left-color: #00ff33;
}

.box:after,
.angle:after {
  right: 0;
  border-right-color: #00ff33;
}

@keyframes radar-beam {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(0);
  }
}

.msg {
  text-align: center;
  padding: 20rpx 0;
}

.mask {
  position: absolute;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.55);
}

.mask1 {
  top: 0;
  left: 0;
  right: 0;
}

.mask2 {
  right: 0;
}

.mask3 {
  right: 0;
  left: 0;
  bottom: 0;
}

.mask4 {
  left: 0;
}

.error {
  color: #fff;
  padding: 40rpx;
  font-size: 24rpx;
  background-color: #333333;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 550rpx;
  border-radius: 20rpx;
}

.error .on1 {
  font-size: 30rpx;
}

.save_img {
  position: absolute;
  left: 50%;
  bottom: 46px;
  transform: translateX(-50%);
  z-index: 10;
}

.img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}
</style>
