<template>
  <div class="page-scan">
    <div class="scan-box">
      <video ref="video" id="video" class="scan-video" autoplay></video>
      <div class="qr-scanner">
        <div class="box">
          <div class="line"></div>
          <div class="angle"></div>
        </div>
      </div>
      <div class="scan-tip">{{ scanTextData.tipMsg }}</div>
    </div>
  </div>
</template>

<script>
import { BrowserMultiFormatReader } from "@zxing/library";
export default {
  name: "scanCodePage",
  data() {
    return {
      scanTextData: {
        codeReader: null,
        tipMsg: "识别二维码",
        // 这个，就是当前调用的摄像头的索引，为什么是6，我会在后面说的 华为手机是鸿蒙系统有8个摄像头
        num: 5,
        // 这个就是扫描到的摄像头的数量
        videoLength: ""
      },
      hasBind: false
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.scanTextData.codeReader = new BrowserMultiFormatReader();
    this.openScan(); // 打开摄像头
  },
  watch: {
    show(val) {
      if (!val) {
        // 关闭摄像头
        if (!document.getElementById("video")) {
          alert("请授权");
          return;
        }
        let thisVideo = document.getElementById("video");
        thisVideo.srcObject.getTracks()[0].stop();
        this.scanTextData.codeReader.reset();
      } else {
        if (this.scanTextData.codeReader === null) {
          this.scanTextData.codeReader = new BrowserMultiFormatReader();
        }
        this.openScan();
      }
    }
  },
  methods: {
    async openScan() {
      this.scanTextData.codeReader
        .getVideoInputDevices()
        .then(videoInputDevices => {
          // 默认获取第一个摄像头设备id
          let firstDeviceId = videoInputDevices[0].deviceId;
          console.log(
            "手机摄像头的数量",
            videoInputDevices.length,
            videoInputDevices
          );
          // 获取第一个摄像头设备的名称
          const videoInputDeviceslablestr = JSON.stringify(
            videoInputDevices[0].label
          );
          if (videoInputDevices.length > 1) {
            // 华为手机有6个摄像头，前三个是前置，后三个是后置，第6个摄像头最清晰
            if (videoInputDevices.length > 5) {
              firstDeviceId = videoInputDevices[5].deviceId;
            } else {
              // 判断是否后置摄像头
              if (videoInputDeviceslablestr.indexOf("back") > -1) {
                firstDeviceId = videoInputDevices[0].deviceId;
              } else {
                firstDeviceId = videoInputDevices[1].deviceId;
              }
            }
          }
          this.decodeFromInputVideoFunc(firstDeviceId);
        })
        .catch(err => {
          console.error(err);
        });
    },

    decodeFromInputVideoFunc(firstDeviceId) {
      this.scanTextData.codeReader.reset();
      this.scanTextData.codeReader.decodeFromInputVideoDeviceContinuously(
        firstDeviceId,
        "video",
        (result, err) => {
          if (result && result.text) {
            this.handleResult(result.text);
          }
          if (err && !err) {
            console.log(err);
            this.$toast.fail(err);
          }
        }
      );
    },
    async handleResult(scanResult) {
      console.log(scanResult);
      // TODO 逻辑处理或直接返回扫码结果
      this.scanTextData.tipMsg = scanResult;
      this.$emit("getScanResult", scanResult);
    }
  },
  unmounted() {
    this.scanTextData.codeReader.reset(); // 重置摄像头
  }
};
</script>

<style lang="scss" scoped>
.scan-box {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100vw;
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
}

.scan-video {
  height: 100vh;
  width: 100vw;
  object-fit: cover;
}

.qr-scanner .box {
  width: 213px;
  height: 213px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  border: 0.1rem solid rgba(0, 255, 51, 0.2);
  /* background: url('http://resource.beige.world/imgs/gongconghao.png') no-repeat center center; */
}

.qr-scanner .line {
  height: calc(100% - 2px);
  width: 100%;
  background: linear-gradient(180deg, rgba(0, 255, 51, 0) 43%, #00ff33 211%);
  border-bottom: 3px solid #00ff33;
  transform: translateY(-100%);
  animation: radar-beam 2s infinite alternate;
  animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
  animation-delay: 1.4s;
}

.qr-scanner .box:after,
.qr-scanner .box:before,
.qr-scanner .angle:after,
.qr-scanner .angle:before {
  content: "";
  display: block;
  position: absolute;
  width: 3vw;
  height: 3vw;
  border: 0.2rem solid transparent;
}

.qr-scanner .box:after,
.qr-scanner .box:before {
  top: 0;
  border-top-color: #00ff33;
}

.qr-scanner .angle:after,
.qr-scanner .angle:before {
  bottom: 0;
  border-bottom-color: #00ff33;
}

.qr-scanner .box:before,
.qr-scanner .angle:before {
  left: 0;
  border-left-color: #00ff33;
}

.qr-scanner .box:after,
.qr-scanner .angle:after {
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

.scan-tip {
  width: 100vw;
  text-align: center;
  margin-bottom: 5vh;
  color: white;
  font-size: 5vw;
  position: absolute;
  bottom: 50px;
  left: 0;
  color: #fff;
}

.page-scan {
  overflow-y: hidden;
}
</style>
