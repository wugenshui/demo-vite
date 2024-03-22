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
    return {}
  },
  mounted() {
    // 柱状图 bar
    var chart1 = echarts.init(document.getElementById('chart1'))
    // 绘制图表
    chart1.setOption({
      title: {
        text: '柱状图 bar'
      },
      // 提示框
      tooltip: {},
      // 边距
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true
      },
      // x轴
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      // y轴
      yAxis: {},
      // 数据
      series: [
        {
          name: '产量',
          type: 'bar',
          data: [15, 40, 60, 20, 30, 110],
          label: {
            show: true,
            position: 'top'
          }
        },
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20],
          label: {
            show: true,
            position: 'top'
          }
        }
      ]
    })
    // 为窗口加上宽度变化事件，当宽高发生改变时，调用echarts的resize()方法，调整图表尺寸
    window.addEventListener('resize', function () {
      chart1.resize()
    })

    // 折线图 line
    var chart2 = echarts.init(document.getElementById('chart2'))
    // 绘制图表
    chart2.setOption({
      title: {
        text: '折线图 line'
      },
      // 边距
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true
      },
      tooltip: {},
      // 分类
      xAxis: {
        data: ['周一', '周二', '周三', '周四', '周五', '周六']
      },
      yAxis: {},
      // 数据
      series: [
        {
          name: '产量',
          type: 'line',
          data: [15, 40, 60, 20, 30, 110],
          label: {
            show: true
          }
        },
        {
          name: '销量',
          type: 'line',
          data: [5, 20, 36, 10, 10, 20],
          label: {
            show: true
          }
        }
      ]
    })

    // 饼图 pie
    var chart3 = echarts.init(document.getElementById('chart3'))
    // 绘制图表
    chart3.setOption({
      title: {
        text: '饼图 pie'
      },
      // 边距
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true
      },
      tooltip: {},
      // 数据
      series: [
        {
          name: '销量',
          type: 'pie',
          data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
            { value: 135, name: '视频广告' },
            { value: 1548, name: '搜索引擎' }
          ],
          top: 20
        }
      ]
    })

    // 散点图 scatter
    var chart4 = echarts.init(document.getElementById('chart4'))
    // 绘制图表
    chart4.setOption({
      title: {
        text: '散点图 scatter'
      },
      // 边距
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true
      },
      tooltip: {},
      xAxis: {},
      yAxis: {},
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
    })
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
