<template>
  <el-tabs value="barChart" type="card">
    <el-tab-pane label="条形统计图" name="barChart">
      <comp-bar-chart
      :data='data'
      :axis="axis"
      :barTitle="barTitle"
      :tip="tip"
      :color="barGraph.color"
      :animation="barGraph.animation"
      :width="barGraph.width"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import CompBarChart from '../package/components/BarChart'
export default {
  name: 'HelloD3',
  data () {
    return {
      data: [50, 43, 120, 87, 99, 167, 188, 123, 355],
      axis: {
        xLine: true,
        yLine: true,
        xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', '华为', '中兴', 'oppo']
      },
      barTitle: {
        left: 'right',
        text: '柱状统计图'
      },
      tip: {
        show: true,
        text: '今日用户'
      },
      barGraph: {
        width: 700,
        color: '#3398DB',
        animation: true
      }
    }
  },
  components: {
    CompBarChart
  }
}
</script>

<style scoped></style>
