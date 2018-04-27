<template>
  <div id="barGraph"></div>
</template>

<script>
import * as d3 from 'd3'
import Tools from '../lib/tool'
export default {
  name: 'bar-graph',
  props: {
    // svg元素宽度
    width: {
      type: Number,
      default: 400
    },
    // svg元素高度
    height: {
      type: Number,
      default: 400
    },
    // 统计图标题
    barTitle: {
      type: Object,
      left: {
        type: String,
        default: 'left'
      },
      text: {
        type: String,
        default: ''
      }
    },
    // 坐标轴
    axis: {
      // 是否显示横向分割线
      xLine: {
        type: Boolean,
        default: false
      },
      // 是否显示纵向向分割线
      yLine: {
        type: Boolean,
        default: false
      },
      // 横坐标参数
      xAxisData: {
        type: Array,
        required: true,
        default: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'new']
      }
    },
    // 单个矩形宽度
    barWidth: {
      type: [Number, String],
      default: '70'
    },
    // 矩形背景颜色
    color: {
      type: String,
      default: '#3398DB'
    },
    // 文本颜色
    textColor: {
      type: String,
      default: 'white'
    },
    // 间距
    padding: {
      type: Object,
      default: () => { return { top: 50, right: 50, bottom: 50, left: 50 } }
    },
    // 数据
    data: {
      type: Array,
      default: () => [10, 52, 200, 334, 390, 330, 220]
    },
    // 是否显示信息框
    tip: {
      // 提示信息框标题
      text: {
        type: String,
        default: '数据'
      },
      show: {
        type: Boolean,
        default: false
      }
    },
    // 是否开启动画
    animation: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    try {
      const {axis, data} = this.$props
      // 检测横坐标参数数量书否等于数据数量，保证正常显示
      if (axis.xAxisData.length !== data.length) {
        throw Error('xAxis.length !== data.length')
      }
      // 渲染图表
      this.render(this.data)
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    // 渲染图表总函数
    render (data) {
      const bar = this.createAllAttr()
      const { axis, height, padding, contentWidth, barTitle } = bar
      const svg = this.createSvg(data, bar)
      const { xScale, yScale } = this.addScale(svg, data, bar)
      this.addRect(svg, data, bar, xScale, yScale)
      if (axis.yLine) {
        this.addyLine(
          svg,
          xScale,
          data,
          height - padding.top - padding.bottom,
          padding)
      }
      if (axis.xLine) {
        this.addxLine(
          svg,
          yScale,
          data,
          contentWidth,
          padding)
      }
      if (barTitle.text !== '' &&
        barTitle.text !== null &&
        barTitle.text !== undefined &&
        typeof barTitle.text === 'string') {
        this.addTitle(svg, barTitle, padding, contentWidth)
      }
    },
    // 组织数据
    createAllAttr () {
      const { padding, axis, width, barWidth, ...otherParams } = this.$props
      const currentWidth = width - padding.left - padding.right
      const barStep = currentWidth / axis.xAxisData.length
      const myBarWidth = Tools.prototype.getTrueNum(barStep, barWidth)
      const spacing = (barStep - myBarWidth) / 2
      return {
        width,
        padding,
        axis,
        ...otherParams,
        contentWidth: currentWidth,
        barWidth: myBarWidth,
        spacing: spacing
      }
    },
    // 创建画布
    createSvg (data, bar) {
      const { width, height } = bar
      const svg = d3.select('#barGraph')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
      return svg
    },
    // 添加标题
    addTitle (svg, barTitle, padding, contentWidth) {
      const title = svg.append('text')
        .html(barTitle.text)
        .attr('font-size', '0.9rem')
        .attr('text-anchor', 'middle')
        .attr('font-weight', '600')
      switch (barTitle.left) {
        case 'left' : title.attr('transform', `translate(${padding.left},${padding.top / 2})`); break
        case 'center': title.attr('transform', `translate(${contentWidth / 2 + padding.left},${padding.top / 2})`); break
        case 'right': title.attr('transform', `translate(${contentWidth + padding.left},${padding.top / 2})`); break
        default : title.attr('transform', `translate(${padding.left},${padding.top / 2})`); break
      }
    },
    // 绘制矩形
    addRect (svg, data, bar, xScale, yScale) {
      const { animation, barWidth, height, axis, color, padding, spacing, tip } = bar
      const rect = svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('fill', color)
        .attr('class', 'my-rect')
        .attr('transform', `translate(${padding.left},${padding.top})`)
        .attr('x', (d, i) => { return xScale(axis.xAxisData[i]) + spacing })
        .attr('width', barWidth)
      if (animation) {
        rect.attr('y', yScale(0))
          .attr('height', 0)
          .transition()
          .delay((d, i) => { return i * 100 })
          .duration(500)
          .attr('y', d => { return yScale(d) })
          .attr('height', d => { return height - padding.top - padding.bottom - yScale(d) })
      } else {
        rect.attr('y', d => { return yScale(d) })
          .attr('height', d => { return height - padding.top - padding.bottom - yScale(d) })
      }
      if (tip.show) {
        this.addTip(svg, axis.xAxisData)
      }
    },
    // 添加文字说明
    addText (svg, data, bar, xScale, yScale) {
      const { barWidth, xAxis, textColor, padding, spacing } = bar
      svg.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('fill', textColor)
        .attr('font-size', '14px')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${padding.left},${padding.top})`)
        .attr('x', (d, i) => { return xScale(xAxis[i]) + spacing })
        .attr('y', d => { return yScale(d) })
        .attr('dx', barWidth / 2)
        .attr('dy', '1em')
        .text(d => d)
    },
    // 添加坐标轴
    addScale (svg, data, bar) {
      const {contentWidth, height, axis, padding} = bar
      const xScale = d3.scaleBand().range([0, contentWidth]).domain(axis.xAxisData)
      const xAxis = d3.axisBottom(xScale)
      const yScale = d3.scaleLinear().range([height - padding.top - padding.bottom, 0]).domain([0, d3.max(data)])
      const yAxis = d3.axisLeft(yScale)
      svg.append('g')
        .classed('axis-x', true)
        .attr('transform', `translate(${padding.left}, ${height - padding.bottom})`)
        .call(xAxis)
      svg.append('g')
        .classed('axis-y', true)
        .attr('transform', `translate(${padding.left}, ${padding.bottom})`)
        .call(yAxis)
      return {
        xScale,
        yScale
      }
    },
    // 添加提示框
    addTip (svg, xAxisData) {
      const { tip, color } = this.$props
      const toolTip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip') // 用于css设置类样式
        .attr('opacity', 0.0)
      svg.selectAll('rect').on('mouseover', (d, i) => {
        toolTip.html(`<div>${xAxisData[i]}</div><div><i style="color: ${color}" class="el-icon-tickets tip-icon"></i>${tip.text} : ${d}</div>`)
          .style('left', `${d3.event.pageX}px`)
          .style('top', `${d3.event.pageY + 20}px`)
          .style('opacity', 1.0)
      })
        .on('mousemove', (d, i) => {
          toolTip.style('left', `${d3.event.pageX}px`)
            .style('top', `${d3.event.pageY + 20}px`)
        })
        .on('mouseout', (d, i) => {
          toolTip.style('opacity', 0)
        })
    },
    // 添加纵向分割线
    addyLine (svg, xAxis, data, height, padding) {
      // 定义轴网格线
      const yInner = d3.axisBottom(xAxis)
        .tickSize(-height, 0, 0)
        .ticks(data.length)
      // 添加横轴网格线
      svg.select('.axis-x')
        .append('g')
        .attr('class', 'grid-x')
        .attr('transform', `translate(0,0)`)
        .call(yInner)
        .selectAll('text')
        .text('')
      svg.select('.grid-x').select('path').remove()
    },
    // 添加横向分割线
    addxLine (svg, yScale, data, contentWidth, padding) {
      const xInner = d3.axisLeft(yScale)
        .tickSize(-contentWidth, 0, 0)
        .ticks(6)
      svg.select('.axis-y')
        .append('g')
        .attr('class', 'grid-y')
        .attr('transform', `translate(0,0)`)
        .call(xInner)
        .selectAll('text')
        .text('')
      svg.select('.grid-y').select('g').remove()
      svg.select('.grid-y').select('path').remove()
    }
  }
}
</script>

<style lang="scss">
  .my-rect {
    cursor: pointer;
  }
  .tooltip{
    padding: 5px;
    position: absolute;
    border-style: solid;
    white-space: nowrap;
    z-index: 9999999;
    transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1), top 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    background-color: rgba(50, 50, 50, 0.7);
    border-width: 0px;
    border-color: rgb(51, 51, 51);
    border-radius: 4px;
    color: rgb(255, 255, 255);
    font-style: normal;
    font-variant: normal;
    font-weight: normal;
    font-stretch: normal;
    font-size: 14px;
    .tip-icon {
      margin-right: 5px;
    }
  }
  .grid-x .tick line, .grid-y .tick line{
    stroke: lightgrey;
    stroke-width:0.5
  }
</style>
