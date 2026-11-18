<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const BASE = '/digital-human'
const SCRIPTS = [
  'lib/pinyin-pro.js',
  'lib/live2dcubismcore.min.js',
  'lib/pixi.min.js',
  'lib/cubism4.min.js',
  'digital-human.js',
  'live2d.js'
]

const hostRef = ref(null)
const subtitleRef = ref(null)
const visemeRef = ref(null)
const pinyinRef = ref(null)

const text = ref('你好，我是数字人。在右边输入一段话，点开始讲话，我会按口型读出来。')
const rate = ref(1)
const voiceKey = ref('default')
const voices = ref([])
const status = ref('正在加载数字人…')
const speaking = ref(false)
const ready = ref(false)

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existed = document.querySelector(`script[data-dh-src="${src}"]`)
    if (existed) {
      if (existed.dataset.loaded === '1') resolve()
      else existed.addEventListener('load', () => resolve(), { once: true })
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = false
    script.dataset.dhSrc = src
    script.onload = () => {
      script.dataset.loaded = '1'
      resolve()
    }
    script.onerror = () => reject(new Error(`脚本加载失败：${src}`))
    document.body.appendChild(script)
  })
}

function refreshVoices() {
  const list = window.DigitalHuman?.voices?.() || []
  voices.value = list.map((voice, index) => ({
    key: String(index),
    label: `${voice.name}（${voice.lang}）`
  }))
}

async function speak() {
  const content = text.value.trim()
  const DH = window.DigitalHuman
  if (!content || !ready.value || !DH) return
  speaking.value = true
  status.value = '正在讲话'
  const voice =
    voiceKey.value === 'silent' || voiceKey.value === 'default'
      ? voiceKey.value
      : DH.voices()[+voiceKey.value] || 'default'
  try {
    const result = await DH.say(content, { voice, rate: rate.value })
    status.value = result === 'interrupted' ? '已停止' : '讲完了'
  } catch (error) {
    status.value = error?.message || '播报失败'
  } finally {
    speaking.value = false
  }
}

function stop() {
  window.DigitalHuman?.stop?.()
  speaking.value = false
  status.value = '已停止'
}

onMounted(async () => {
  try {
    for (const name of SCRIPTS) {
      await loadScript(`${BASE}/${name}`)
    }
    const DH = window.DigitalHuman
    if (!DH?.mount) throw new Error('数字人脚本未就绪')
    refreshVoices()
    DH.onVoicesChanged(refreshVoices)
    const kind = await DH.mount(hostRef.value, {
      subtitleEl: subtitleRef.value,
      visemeEl: visemeRef.value,
      pinyinEl: pinyinRef.value,
      avatar: 'live2d'
    })
    ready.value = true
    if (kind === 'live2d') status.value = '形象已就绪，输入文字即可讲话'
    else if (kind === 'svg') status.value = '已使用简笔形象'
    else status.value = '形象没有加载出来，仍然可以播报声音'
    if (!DH.hasPinyin()) status.value += '（拼音库未加载，口型是近似效果）'
  } catch (error) {
    status.value = error?.message || '加载失败'
  }
})

onBeforeUnmount(() => {
  window.DigitalHuman?.unmount?.()
})
</script>

<template>
  <div class="dh-page">
    <section class="stage">
      <div ref="hostRef" class="avatar-host"></div>
      <div ref="subtitleRef" class="subtitle" aria-live="polite"></div>
      <p class="meta">
        <span>口型 <b ref="visemeRef">闭嘴</b></span>
        <span>拼音 <b ref="pinyinRef">-</b></span>
        <span>{{ status }}</span>
      </p>
    </section>

    <section class="panel">
      <h2>让数字人讲话</h2>
      <p class="hint">使用浏览器自带的中文语音。Edge 里的「晓晓」听起来更自然。Ctrl + Enter 开始讲话。</p>
      <el-input
        v-model="text"
        type="textarea"
        :rows="8"
        maxlength="500"
        show-word-limit
        placeholder="输入要说的话"
        @keydown.ctrl.enter.prevent="speak"
      />
      <div class="row">
        <span class="label">声音</span>
        <el-select v-model="voiceKey">
          <el-option label="默认中文" value="default" />
          <el-option label="静音（只看口型）" value="silent" />
          <el-option v-for="item in voices" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
      </div>
      <div class="row">
        <span class="label">语速 {{ rate.toFixed(1) }}</span>
        <el-slider v-model="rate" :min="0.6" :max="1.6" :step="0.1" :show-tooltip="false" />
      </div>
      <div class="actions">
        <el-button type="primary" :disabled="!ready" :loading="speaking" @click="speak">开始讲话</el-button>
        <el-button :disabled="!speaking" @click="stop">停止</el-button>
      </div>
    </section>
  </div>
</template>

<style>
.dh-page {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(280px, 420px) minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.dh-page .avatar-host,
.dh-page .avatar-box {
  position: relative;
  width: 100%;
  height: min(62vh, 560px);
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(180deg, #fdeef4 0%, #dfe6ff 100%);
}

.dh-page #avatar,
.dh-page #live2dCanvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.dh-page #avatar[hidden],
.dh-page #live2dCanvas[hidden],
.dh-page .live2d-tip[hidden] {
  display: none;
}

.dh-page #live2dCanvas {
  cursor: pointer;
}

.dh-page .live2d-tip {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  z-index: 1;
  margin: 0;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(31, 42, 68, 0.85);
  color: #fff;
  font-size: 13px;
  line-height: 1.5;
}

.dh-page .subtitle {
  min-height: 56px;
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  background: #1f2a44;
  color: #c9d3ea;
  font-size: 18px;
  line-height: 1.5;
  letter-spacing: 1px;
}

.dh-page .subtitle .done {
  color: #fff;
}

.dh-page .subtitle .now {
  color: #ffd84d;
}

.dh-page .meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin: 10px 0 0;
  color: #5b6784;
  font-size: 13px;
}

.dh-page .panel h2 {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 600;
}

.dh-page .hint {
  margin: 0 0 14px;
  color: #6a7590;
  font-size: 14px;
}

.dh-page .row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
}

.dh-page .row .el-select,
.dh-page .row .el-slider {
  flex: 1;
}

.dh-page .label {
  flex: none;
  width: 72px;
  color: #3c4660;
  font-size: 14px;
}

.dh-page .actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

@media (max-width: 860px) {
  .dh-page {
    grid-template-columns: 1fr;
    height: auto;
  }

  .dh-page .avatar-host,
  .dh-page .avatar-box {
    height: 420px;
  }
}
</style>
