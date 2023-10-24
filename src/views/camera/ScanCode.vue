<template>
  <!-- 摄像头扫码 -->
  <p class="error">{{ error }}</p>
  <div class="scan-box">
    <qrcode-stream @decode="onDecode" @init="onInit"></qrcode-stream>
  </div>
  <div v-if="result">
    <p>扫描结果: {{ result }}</p>
  </div>
  <!-- 选择图片 -->
  <p>
    Capture:
    <select v-model="selected">
      <option v-for="option in options" :key="option.text" :value="option">
        {{ option.text }}
      </option>
    </select>
  </p>
  <qrcode-capture @decode="onDecode" :capture="selected.value" />
</template>

<script>
import { QrcodeStream, QrcodeCapture } from 'vue-qrcode-reader';
export default {
  data() {
    const options = [
      { text: "rear camera (default)", value: "environment" },
      { text: "front camera", value: "user" },
      { text: "force file dialog", value: false },
    ]
    return {
      error: "",
      result: "",
      options,
      selected: options[0]
    };
  },
  components: { QrcodeStream, QrcodeCapture },
  methods: {
    onDecode(result) {
      this.result = result;
    },
    async onInit(promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = "ERROR: you need to grant camera access permission"
        } else if (error.name === 'NotFoundError') {
          this.error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          this.error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "ERROR: Stream API is not supported in this browser"
        } else if (error.name === 'InsecureContextError') {
          this.error = `ERROR: Camera access is only permitted in secure context. 
          Use HTTPS or localhost rather than HTTP.`;
        } else {
          this.error = `ERROR: Camera error (${error.name})`;
        }
      }
    }
  },
};
</script>

<style scoped>
.error {
  color: red;
}

.scan-box {
  width: 250px;
  height: 250px;
  margin: auto;
}
</style>
