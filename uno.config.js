import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  // rules: [
  //   [/^m-(\d+)$/, ([, d]) => ({ margin: `${d / 4}rem` })],
  // ],
  presets: [
    presetUno(),
  ],
  shortcuts: {
    "h-btn": 'py-2 px-4 font-semibold rounded-lg shadow-md'
  }
})
