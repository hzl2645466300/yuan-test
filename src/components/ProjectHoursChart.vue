<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { WorkOrder } from '../types/workOrder'
import { aggregateHoursByProject } from '../utils/aggregateHours'

const props = defineProps<{
  orders: WorkOrder[]
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

function buildOption() {
  const rows = aggregateHoursByProject(props.orders)
  const categories = rows.map((r) => r.project)
  const values = rows.map((r) => r.hours)
  return {
    title: {
      text: 'Project Hours Distribution',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 600 },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      valueFormatter: (v: number) => `${v} 小时`,
    },
    grid: { left: 48, right: 24, bottom: 72, top: 56 },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { interval: 0, rotate: categories.some((c) => c.length > 14) ? 24 : 0 },
    },
    yAxis: {
      type: 'value',
      name: 'Hours',
      splitLine: { lineStyle: { type: 'dashed' } },
    },
    series: [
      {
        type: 'bar',
        data: values,
        barMaxWidth: 48,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#597ef7' },
            { offset: 1, color: '#85a5ff' },
          ]),
        },
      },
    ],
  }
}

function renderChart() {
  if (!chartRef.value) return
  if (!chart) {
    chart = echarts.init(chartRef.value)
  }
  chart.setOption(buildOption(), true)
}

function onResize() {
  chart?.resize()
}

onMounted(() => {
  renderChart()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  chart?.dispose()
  chart = null
})

watch(
  () => props.orders,
  () => renderChart(),
  { deep: true },
)
</script>

<template>
  <div ref="chartRef" class="chart-wrap" />
</template>

<style scoped lang="less">
.chart-wrap {
  width: 100%;
  height: 380px;
}
</style>
