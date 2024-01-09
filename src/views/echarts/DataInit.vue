<template>
  <v-chart v-for="(c, i) in charts" class="chart" :option="c" autoresize :key="i" />
</template>

<script>
import 'echarts'
import VChart from 'vue-echarts'
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
      },
      // 展示图表
      charts: []
    }
  },
  components: {
    VChart
  },
  mounted() {
    this.charts.push(this.initChartOption(this.chart1))
    this.charts.push(this.initChartOption(this.chart2))
    this.charts.push(this.initChartOption(this.chart3))
    this.charts.push(this.initChartOption(this.chart4))
  },
  methods: {
    // 初始化图表 option数据
    initChartOption(data) {
      let options = {
        title: {
          text: data.title
        },
        // 提示框
        tooltip: {},
        // 数据
        series: data.series
      }
      let type = data.series[0].type
      switch (type) {
        case 'pie':
          options.series[0].top = 20
          break
        case 'scatter':
          options.xAxis = {}
          options.yAxis = {}
          options.series[0].symbolSize = 20
          break
        case 'line':
        case 'bar':
          // 异常情况输出
          if (!data.xAxis) {
            console.error(type, 'xAxis is not null')
          }
          // x轴
          options.xAxis = {
            data: data.xAxis
          }
          // y轴
          options.yAxis = {}
          // 配置项
          for (let i = 0; i < options.series.length; i++) {
            options.series[i].label = {
              show: true,
              position: 'top'
            }
          }
          break
        default:
          console.error('type is not support')
          break
      }
      return options
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
