<template>
  <div :style="{height: height}" ref="root"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
const props = defineProps({ options: Object, height: { type: String, default: '320px' } })
const root = ref(null)
let chart = null
onMounted(() => {
  chart = echarts.init(root.value)
  if (props.options) chart.setOption(props.options)
})
watch(() => props.options, (v) => { if (chart && v) chart.setOption(v) }, { deep: true })
onBeforeUnmount(() => { if (chart) chart.dispose() })
</script>
