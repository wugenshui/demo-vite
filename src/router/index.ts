import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
    }
  ]
})

export default router
