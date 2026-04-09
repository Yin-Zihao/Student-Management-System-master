<template>
  <div class="my-scores">
    <el-card>
      <template #header>
        <span>我的成绩</span>
      </template>

      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="courseId" label="课程ID" width="100" />
        <el-table-column prop="score" label="分数" width="100">
          <template #default="{ row }">
            <el-tag :type="getScoreType(row.score)">{{ row.score }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="gradePoint" label="绩点" width="100" />
        <el-table-column prop="examDate" label="考试日期" width="120" />
        <el-table-column prop="createTime" label="录入时间" width="180" />
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadData"
        @current-change="loadData"
        class="pagination"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getMyScores } from '@/api'

const loading = ref(false)
const tableData = ref([])

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const getScoreType = (score) => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 60) return 'warning'
  return 'danger'
}

const loadData = async () => {
  loading.value = true
  try {
    const response = await getMyScores({
      page: pagination.page,
      size: pagination.size
    })
    tableData.value = response.data.records
    pagination.total = response.data.total
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  justify-content: flex-end;
  display: flex;
}
</style>
