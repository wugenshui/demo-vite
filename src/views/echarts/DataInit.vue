import { id } from 'element-plus/es/locale';
<template>
  <div id="chart1" class="chart"></div>
  <div id="chart2" class="chart"></div>
  <div id="chart3" class="chart"></div>
  <div id="chart4" class="chart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'SimpleChart',
  data() {
    return {
      chart1: {
        title: '柱状图 bar',
        xAxis: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
        series: [
          {
            name: '产量',
            type: 'bar',
            data: [15, 40, 60, 20, 30, 110]
          },
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      },
      chart2: {
        title: '折线图 line',
        xAxis: ['周一', '周二', '周三', '周四', '周五', '周六'],
        series: [
          {
            name: '产量',
            type: 'line',
            data: [15, 40, 60, 20, 30, 110]
          },
          {
            name: '销量',
            type: 'line',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      },
      chart3: {
        title: '饼图 pie',
        xAxis: null,
        series: [
          {
            name: '产量',
            type: 'pie',
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ]
          }
        ]
      },
      chart4: {
        title: '散点图 scatter',
        series: [
          {
            symbolSize: 20,
            data: [
              [10.0, 8.04],
              [8.0, 6.95],
              [13.0, 7.58],
              [9.0, 8.81],
              [11.0, 8.33],
              [14.0, 9.96],
              [6.0, 7.24],
              [4.0, 4.26],
              [12.0, 10.84],
              [7.0, 4.82],
              [5.0, 5.68]
            ],
            type: 'scatter'
          }
        ]
      }
    }
  },
  mounted() {
    this.initChart('chart1', this.chart1)
    this.initChart('chart2', this.chart2)
    this.initChart('chart3', this.chart3)
    this.initChart('chart4', this.chart4)
  },
  methods: {
    initChart(id, data) {
      // 柱状图 bar
      var chart = echarts.init(document.getElementById(id))
      let options = {
        title: {
          text: data.title
        },
        // 提示框
        tooltip: {},
        // 数据
        series: data.series
      }
      if (data.series[0].type === 'pie') {
        options.series[0].top = 20
      } else if (data.series[0].type === 'scatter') {
        options.xAxis = {}
        options.yAxis = {}
      } else if (data.xAxis) {
        // x轴
        options.xAxis = {
          data: data.xAxis
        }
        // y轴
        options.yAxis = {}
      }
      // 绘制图表
      chart.setOption(options)

      // 为窗口加上宽度变化事件，当宽高发生改变时，调用echarts的resize()方法，调整图表尺寸
      window.addEventListener('resize', function () {
        chart.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.chart {
  width: 50%;
  height: 50%;
  float: left;
}
</style>
