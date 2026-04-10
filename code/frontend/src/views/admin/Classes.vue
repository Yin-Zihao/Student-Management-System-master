<template>
  <div>
    <h3>班级管理（树形结构）</h3>
    <el-row style="margin:12px 0">
      <el-col :span="18">
        <el-input v-model="filter" placeholder="搜索学院/专业/班级" clearable style="width:320px" />
      </el-col>
      <el-col :span="6" style="text-align:right">
        <el-button type="primary" @click="addRoot">新增学院</el-button>
      </el-col>
    </el-row>

    <el-card>
      <el-tree
        :data="treeData"
        node-key="id"
        :props="defaultProps"
        highlight-current
        show-checkbox="false"
        draggable
        @node-click="onNodeClick"
        @node-drop="onNodeDrop"
        >
        <template #default="{ node, data }">
          <span>{{ data.label }}</span>
          <span style="float:right">
            <el-button type="text" size="small" @click.stop="addChild(data)">新增下级</el-button>
            <el-button type="text" size="small" @click.stop="editNode(data)">编辑</el-button>
            <el-button type="text" size="small" @click.stop="deleteNode(data)">删除</el-button>
          </span>
        </template>
      </el-tree>
    </el-card>

    <el-dialog title="新增/编辑节点" :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="名称"><el-input v-model="form.label" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="saveNode">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const treeData = reactive([
  { id: 1, label: '学院 A', children: [ { id: 11, label: '专业 A1', children: [{ id:111, label: '软件1901' }] } ] },
  { id: 2, label: '学院 B', children: [ { id: 21, label: '专业 B1', children: [{ id:211, label: '网络1902' }] } ] }
])

const defaultProps = { children: 'children', label: 'label' }
const filter = ref('')
const dialogVisible = ref(false)
const form = reactive({ id: null, label: '', parentId: null })

function addRoot() {
  form.id = null; form.label = ''; form.parentId = null; dialogVisible.value = true
}
function addChild(node) {
  form.id = null; form.label = ''; form.parentId = node.id; dialogVisible.value = true
}
function editNode(node) {
  form.id = node.id; form.label = node.label; form.parentId = null; dialogVisible.value = true
}
function deleteNode(node) {
  // simple recursive delete
  function removeFrom(list, id) {
    const idx = list.findIndex(i=>i.id===id)
    if (idx>=0) return list.splice(idx,1)
    for (const item of list) if (item.children) removeFrom(item.children, id)
  }
  removeFrom(treeData, node.id)
}
function saveNode() {
  if (!form.label) return
  if (form.id) {
    // update
    function findAndUpdate(list,id){
      for (const it of list) {
        if (it.id===id) { it.label = form.label; return true }
        if (it.children && findAndUpdate(it.children,id)) return true
      }
    }
    findAndUpdate(treeData, form.id)
  } else {
    const newNode = { id: Date.now(), label: form.label }
    if (!form.parentId) treeData.push(newNode)
    else {
      function findAndPush(list,id){
        for (const it of list) {
          if (it.id===id) { it.children = it.children || []; it.children.push(newNode); return true }
          if (it.children && findAndPush(it.children,id)) return true
        }
      }
      findAndPush(treeData, form.parentId)
    }
  }
  dialogVisible.value = false
}

function onNodeClick(data) {
  // placeholder
}
function onNodeDrop(draggingNode, dropNode, type) {
  // placeholder: implement ordering if needed
}
</script>
