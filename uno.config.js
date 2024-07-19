import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  // rules: [
  //   [/^m-(\d+)$/, ([, d]) => ({ margin: `${d / 4}rem` })],
  // ],
  presets: [
    presetUno(),
    presetAttributify(), 
    presetIcons()
  ],
  shortcuts: [
    {
      "h-btn": 'py-2 px-4 font-semibold rounded-lg shadow-md',
      "h-btn-blue": 'bg-blue w-80 h-10 ml-10 m-1'
    },
    [/^btn-(.*)$/, ([, c]) => `bg-${c}-400 text-${c}-100 py-2 px-4 rounded-lg`],
  ],
})
