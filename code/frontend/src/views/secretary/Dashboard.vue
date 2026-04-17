<template>
  <div>
    <h2>人事秘书数据看板</h2>
    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="6"><StatCard title="教职工总数" :value="stats.teachers" /></el-col>
      <el-col :span="6"><StatCard title="学生总数" :value="stats.students" /></el-col>
      <el-col :span="6"><StatCard title="党务文件数" :value="stats.partyDocs" /></el-col>
      <el-col :span="6"><StatCard title="科研论文数" :value="stats.papers" /></el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="12"><el-card><h4>各部门教职工分布</h4><EChartsChart :options="deptOptions" height="320px" /></el-card></el-col>
      <el-col :span="12"><el-card><h4>学历学位分布</h4><EChartsChart :options="eduOptions" height="320px" /></el-card></el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="12"><el-card><h4>年度考核结果分布</h4><EChartsChart :options="assessmentOptions" height="280px" /></el-card></el-col>
      <el-col :span="12"><el-card><h4>党务文件状态分布</h4><EChartsChart :options="partyDocOptions" height="280px" /></el-card></el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import StatCard from '../../components/StatCard.vue'
import EChartsChart from '../../components/EChartsChart.vue'

const stats = reactive({
  teachers: 89,
  students: 1250,
  partyDocs: 156,
  papers: 234
})

const deptOptions = {
  title: { text: '' },
  tooltip: { trigger: 'item' },
  legend: { top: '5%', left: 'center' },
  series: [{
    name: '部门',
    type: 'pie',
    radius: ['40%', '70%'],
    avoidLabelOverlap: false,
    label: { show: false, position: 'center' },
    emphasis: { label: { show: true, fontSize: '18', fontWeight: 'bold' } },
    labelLine: { show: false },
    data: [
      { value: 25, name: '计算机学院' },
      { value: 18, name: '电子工程学院' },
      { value: 15, name: '管理学院' },
      { value: 12, name: '外国语学院' },
      { value: 19, name: '其他部门' }
    ]
  }]
}

const eduOptions = {
  title: { text: '' },
  tooltip: { trigger: 'item' },
  legend: { top: '5%', left: 'center' },
  series: [{
    name: '学历',
    type: 'pie',
    radius: '60%',
    data: [
      { value: 45, name: '博士' },
      { value: 32, name: '硕士' },
      { value: 12, name: '本科' }
    ],
    emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
  }]
}

const assessmentOptions = {
  title: { text: '' },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['优秀', '良好', '合格', '不合格'] },
  yAxis: { type: 'value' },
  series: [{
    data: [25, 45, 15, 4],
    type: 'bar',
    showBackground: true,
    backgroundStyle: { color: 'rgba(180, 180, 180, 0.2)' }
  }]
}

const partyDocOptions = {
  title: { text: '' },
  tooltip: { trigger: 'item' },
  legend: { top: '5%', left: 'center' },
  series: [{
    name: '状态',
    type: 'pie',
    radius: '60%',
    data: [
      { value: 89, name: '已处理' },
      { value: 45, name: '处理中' },
      { value: 22, name: '未处理' }
    ]
  }]
}
</script>