<template>
  <div>
    <h3>课程管理</h3>
    <el-row style="margin:12px 0">
      <el-col :span="18">
        <el-input v-model="filters.keyword" placeholder="课程代码" clearable style="width:280px" />
        <el-select v-model="filters.semester" placeholder="学期" clearable style="width:140px;margin-left:8px">
          <el-option label="2026春" value="2026S" />
          <el-option label="2025秋" value="2025A" />
        </el-select>
        <el-button type="primary" @click="search" style="margin-left:8px">搜索</el-button>
      </el-col>
      <el-col :span="6" style="text-align:right">
        <el-button type="primary" @click="openAdd">新增课程</el-button>
      </el-col>
    </el-row>

    <el-table :data="courses" stripe style="width:100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="课程名" />
      <el-table-column prop="code" label="课程代码" width="120" />
      <el-table-column prop="credit" label="学分" width="80" />
      <el-table-column prop="teacher" label="授课教师" width="160" />
      <el-table-column prop="semester" label="开课学期" width="120" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="edit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增/编辑课程" :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="课程名"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="课程代码"><el-input v-model="form.code" /></el-form-item>
        <el-form-item label="学分"><el-input v-model="form.credit" type="number" /></el-form-item>
        <el-form-item label="授课教师"><el-input v-model="form.teacher" /></el-form-item>
        <el-form-item label="学期"><el-input v-model="form.semester" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const courses = reactive([
  { id: 101, name: '高等数学', code: 'MATH101', credit: 4, teacher: '王老师', semester: '2026S' },
  { id: 102, name: '数据结构', code: 'CS102', credit: 3, teacher: '李老师', semester: '2025A' }
])

const filters = reactive({ keyword: '', semester: '' })
const dialogVisible = ref(false)
const form = reactive({ id: null, name: '', code: '', credit: 3, teacher: '', semester: '' })

function search() { console.log('search', filters) }
function openAdd() { form.id = null; form.name=''; form.code=''; form.credit=3; form.teacher=''; form.semester=''; dialogVisible.value = true }
function edit(row) { Object.assign(form, row); dialogVisible.value = true }
function remove(row) { const idx = courses.findIndex(c=>c.id===row.id); if (idx>=0) courses.splice(idx,1) }
function save() {
  if (!form.name) return
  if (form.id) {
    const c = courses.find(c=>c.id===form.id); Object.assign(c, form)
  } else {
    courses.push({ id: Date.now(), name: form.name, code: form.code, credit: form.credit, teacher: form.teacher, semester: form.semester })
  }
  dialogVisible.value = false
}
</script>
