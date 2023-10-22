import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/file',
      name: '文件处理',
      children: [
        {
          path: '/dynamic',
          name: '动态加载js',
          component: () => import('../views/file/dynamicLoad/index.vue')
        },
        {
          path: '/img/zip',
          name: '图片压缩',
          component: () => import('../views/file/ImgZip.vue')
        }
      ]
    },
    {
      path: '/element',
      name: 'ElmentUI',
      children: [
        {
          path: '/form/valid',
          name: '表单验证',
          component: () => import('../views/elementui/FormValid.vue')
        }
      ]
    }
  ]
})

export default router
