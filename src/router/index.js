import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/ability',
      name: '能力测试',
      children: [
        {
          path: '/camera',
          name: '摄像头扫码',
          component: () => import('../views/camera/ScanCode.vue')
        }
      ]
    },
    {
      path: '/map',
      name: '地图',
      children: [
        {
          path: '/switchmaplayer',
          name: '切换地图图层',
          component: () => import('@/views/map/SwitchMapLayer.vue'),
        },
        {
          path: '/gaode',
          name: '高德地图',
          component: () => import('@/views/map/Gaode.vue'),
        },
        {
          path: '/gaodedark',
          name: '高德地图深色模式',
          component: () => import('@/views/map/GaodeDark.vue'),
        },
        {
          path: '/tianditudark',
          name: '天地图深色模式',
          component: () => import('@/views/map/TianDiTuDark.vue'),
        },
        {
          path: '/geoserver',
          name: 'GeoServer WMS',
          component: () => import('@/views/map/GeoServer.vue'),
        },
        {
          path: '/fence',
          name: '围栏',
          component: () => import('@/views/map/Fence.vue'),
        },
        {
          path: '/track',
          name: '轨迹',
          component: () => import('@/views/map/Track.vue'),
        },
        {
          path: '/popup',
          name: '弹框',
          component: () => import('@/views/map/Popup.vue'),
        },
        {
          path: '/kml',
          name: 'KML',
          component: () => import('@/views/map/KML.vue'),
        },
        {
          path: '/cluster',
          name: '聚合',
          component: () => import('@/views/map/Cluster.vue'),
        },
        {
          path: '/test',
          name: '测试界面',
          component: () => import('@/views/map/Test.vue'),
        }
      ]
    },
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
        },
        {
          path: '/img/runner',
          name: '图片动画',
          component: () => import('../views/file/ImgRunner.vue')
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
    },
    {
      path: '/echarts',
      name: 'Echarts',
      children: [
        {
          path: '/simple',
          name: '基础图表',
          component: () => import('../views/echarts/SimpleChart.vue')
        },
        {
          path: '/data-init',
          name: '数据集初始化',
          component: () => import('../views/echarts/DataInit.vue')
        }
      ]
    },
    {
      path: '/animation',
      name: 'Animation',
      children: [
        {
          path: '/loading',
          name: '加载动画',
          component: () => import('../views/animation/LoadingAnimation.vue')
        }
      ]
    },
  ]
})

export default router
