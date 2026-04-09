<template>
  <div class="class-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>班级管理</span>
          <el-button type="primary" @click="handleAdd(null)">新增根节点</el-button>
        </div>
      </template>

      <el-table :data="tableData" border row-key="id" v-loading="loading" default-expand-all>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="level" label="层级" width="100">
          <template #default="{ row }">
            <el-tag>{{ getLevelLabel(row.level) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序号" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleAdd(row)">新增子节点</el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="层级" prop="level">
          <el-select v-model="form.level" style="width: 100%">
            <el-option label="学院" :label="1" :value="1" />
            <el-option label="专业" :label="2" :value="2" />
            <el-option label="班级" :label="3" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序号" prop="orderNum">
          <el-input-number v-model="form.orderNum" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getClassList, addClass, updateClass, deleteClass } from '@/api'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formRef = ref(null)

const form = reactive({
  id: null,
  parentId: 0,
  name: '',
  level: 1,
  orderNum: 0
})

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  level: [{ required: true, message: '请选择层级', trigger: 'change' }]
}

const getLevelLabel = (level) => {
  const map = { 1: '学院', 2: '专业', 3: '班级' }
  return map[level] || level
}

const buildTree = (data, parentId = 0) => {
  const tree = []
  data.forEach(item => {
    if (item.parentId === parentId) {
      const children = buildTree(data, item.id)
      if (children.length) {
        item.children = children
      }
      tree.push(item)
    }
  })
  return tree
}

const loadData = async () => {
  loading.value = true
  try {
    const response = await getClassList()
    tableData.value = buildTree(response.data || [])
  } finally {
    loading.value = false
  }
}

const handleAdd = (row) => {
  dialogTitle.value = row ? '新增子节点' : '新增根节点'
  isEdit.value = false
  form.parentId = row ? row.id : 0
  form.level = row ? Math.min(row.level + 1, 3) : 1
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑'
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该节点吗？子节点也将被删除。', '提示', {
      type: 'warning'
    })
    await deleteClass(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch {
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (isEdit.value) {
        await updateClass(form.id, form)
      } else {
        await addClass(form)
      }
      ElMessage.success(isEdit.value ? '更新成功' : '新增成功')
      dialogVisible.value = false
      loadData()
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(form, {
    id: null,
    parentId: 0,
    name: '',
    level: 1,
    orderNum: 0
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
