<template>
  <div class="scan-box">
    <qrcode-stream @decode="onDecode"></qrcode-stream>
    <div v-if="scannedData">
      <p>扫描结果: {{ scannedData }}</p>
    </div>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader';
export default {
  data() {
    return {
      scannedData: "",
    };
  },
  components: { QrcodeStream },
  methods: {
    onDecode(scannedData) {
      this.scannedData = scannedData;
    }
  },
};
</script>

<style scoped>
.scan-box {
  width: 250px;
  height: 250px;
  margin: auto;
}
</style>
