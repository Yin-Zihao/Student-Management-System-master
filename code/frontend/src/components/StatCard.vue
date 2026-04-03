<template>
  <el-card class="stat-card">
    <div class="stat-body">
      <div>
        <div class="stat-title">{{ title }}</div>
        <div class="stat-value">{{ value }}</div>
      </div>
      <div class="stat-extra">
        <slot />
      </div>
    </div>
  </el-card>
</template>

<script setup>
defineProps({
  title: String,
  value: [Number, String]
})
</script>

<style scoped>
.stat-card { padding: 12px; }
.stat-body { display:flex; justify-content:space-between; align-items:center }
.stat-title { color: #666 }
.stat-value { font-size: 24px; font-weight:600 }
.stat-extra { font-size: 20px; color: #409EFF }
</style>
