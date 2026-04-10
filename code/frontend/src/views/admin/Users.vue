<template>
  <div>
    <h3>用户管理</h3>
    <el-row style="margin:12px 0">
      <el-col :span="18">
        <el-input v-model="filters.keyword" placeholder="用户名/姓名" clearable style="width:240px" />
        <el-select v-model="filters.role" placeholder="角色" clearable style="width:140px;margin-left:8px">
          <el-option label="管理员" value="admin" />
          <el-option label="教师" value="teacher" />
          <el-option label="学生" value="student" />
        </el-select>
        <el-button type="primary" @click="search" style="margin-left:8px">搜索</el-button>
      </el-col>
      <el-col :span="6" style="text-align:right">
        <el-button type="primary" @click="openAdd">新增用户</el-button>
      </el-col>
    </el-row>

    <el-table :data="users" stripe style="width:100%">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="role" label="角色" width="100" />
      <el-table-column prop="class" label="所属班级" width="140" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column prop="createdAt" label="创建时间" width="160" />
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button size="small" @click="edit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="remove(row)">删除</el-button>
          <el-switch v-model="row.enabled" active-text="启用" inactive-text="禁用" style="margin-left:8px" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增/编辑用户" :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="用户名"><el-input v-model="form.username" /></el-form-item>
        <el-form-item label="姓名"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role">
            <el-option label="管理员" value="admin" />
            <el-option label="教师" value="teacher" />
            <el-option label="学生" value="student" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const users = reactive([
  { id: 1, username: 'zhangsan', name: '张三', role: 'student', class: '软件1901', status: '正常', createdAt: '2026-01-12', enabled: true },
  { id: 2, username: 'lisi', name: '李四', role: 'teacher', class: '-', status: '正常', createdAt: '2025-09-01', enabled: true },
  { id: 3, username: 'admin', name: '系统管理员', role: 'admin', class: '-', status: '正常', createdAt: '2024-07-20', enabled: true }
])

const filters = reactive({ keyword: '', role: '' })
const dialogVisible = ref(false)
const form = reactive({ id: null, username: '', name: '', role: 'student' })

function search() {
  // placeholder: in future call API with filters
  console.log('search', filters)
}

function openAdd() {
  form.id = null; form.username = ''; form.name = ''; form.role = 'student'
  dialogVisible.value = true
}

function edit(row) {
  form.id = row.id; form.username = row.username; form.name = row.name; form.role = row.role
  dialogVisible.value = true
}

function remove(row) {
  const idx = users.findIndex(u=>u.id===row.id)
  if (idx>=0) users.splice(idx,1)
}

function save() {
  if (!form.username) return
  if (form.id) {
    const u = users.find(u=>u.id===form.id)
    Object.assign(u, { username: form.username, name: form.name, role: form.role })
  } else {
    users.push({ id: Date.now(), username: form.username, name: form.name, role: form.role, class: '-', status: '正常', createdAt: new Date().toISOString().slice(0,10), enabled: true })
  }
  dialogVisible.value = false
}
</script>
