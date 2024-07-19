import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  // rules: [
  //   [/^m-(\d+)$/, ([, d]) => ({ margin: `${d / 4}rem` })],
  // ],
  presets: [
    presetUno(),
  ],
})
