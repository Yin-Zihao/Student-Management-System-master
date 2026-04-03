<template>
  <div>
    <h2>管理员数据看板</h2>
    <el-row :gutter="20" style="margin-top:12px">
      <el-col :span="6"><StatCard title="学生总数" :value="stats.students" /></el-col>
      <el-col :span="6"><StatCard title="教师总数" :value="stats.teachers" /></el-col>
      <el-col :span="6"><StatCard title="课程总数" :value="stats.courses" /></el-col>
      <el-col :span="6"><StatCard title="班级总数" :value="stats.classes" /></el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:18px">
      <el-col :span="12">
        <el-card>
          <h4>各班级平均分对比</h4>
          <EChartsChart :options="classAvgOptions" height="320px" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="margin-bottom:12px">
          <h4>不及格率分布</h4>
          <EChartsChart :options="failRateOptions" height="240px" />
        </el-card>
        <el-card>
          <h4>教职工学历分布</h4>
          <EChartsChart :options="eduOptions" height="240px" />
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top:18px">
      <h4>最新数据</h4>
      <el-list>
        <el-list-item v-for="(item, idx) in recent" :key="idx">{{ item }}</el-list-item>
      </el-list>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import StatCard from '../../components/StatCard.vue'
import EChartsChart from '../../components/EChartsChart.vue'

// sample/mock stats — will be replaced by API
const stats = reactive({ students: 1245, teachers: 89, courses: 238, classes: 34 })

const classNames = ['Class A','Class B','Class C','Class D','Class E']
const classAverages = [78.5, 82.1, 69.4, 74.2, 88.3]
const failRates = [12, 8, 25, 18, 6]

const classAvgOptions = computed(() => ({
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: classNames },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: classAverages, itemStyle: { color: '#409EFF' } }]
}))

const failRateOptions = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [{
    name: '不及格率', type: 'pie', radius: '55%', data: classNames.map((n,i)=>({ name:n, value: failRates[i] }))
  }]
}))

const eduOptions = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [{ name: '学历', type: 'pie', radius: '50%', data: [
    { name: '博士', value: 12 }, { name: '硕士', value: 54 }, { name: '本科', value: 23 }
  ] }]
}))

const recent = [
  '学生：张三 注册', '成绩：李四 语文 92', '教职工：王老师 信息录入'
]
</script>
