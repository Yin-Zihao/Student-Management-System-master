<template>
  <el-container style="height:100vh">
    <el-aside width="220px">
      <el-menu default-active="1" class="el-menu-vertical-demo" router>
        <el-menu-item index="/admin/dashboard">数据看板</el-menu-item>
        <el-sub-menu index="1">
          <template #title>教学管理</template>
          <el-menu-item index="/admin/users">用户管理</el-menu-item>
          <el-menu-item index="/admin/classes">班级管理</el-menu-item>
          <el-menu-item index="/admin/courses">课程管理</el-menu-item>
          <el-menu-item index="/admin/scores">成绩管理</el-menu-item>
          <el-menu-item index="/admin/import-export">导入导出</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>数据管理</template>
          <el-menu-item index="/admin/papers">论文管理</el-menu-item>
          <el-menu-item index="/admin/research-projects">科研项目</el-menu-item>
          <el-menu-item index="/admin/research-awards">科研奖励</el-menu-item>
          <el-menu-item index="/admin/teaching-awards">教研奖励</el-menu-item>
          <el-menu-item index="/admin/innovation-projects">大创项目</el-menu-item>
          <el-menu-item index="/admin/competitions">竞赛管理</el-menu-item>
          <el-menu-item index="/admin/lanqiao">蓝桥杯</el-menu-item>
          <el-menu-item index="/admin/entrepreneurships">创业信息</el-menu-item>
          <el-menu-item index="/admin/honors">荣誉信息</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="background:#fff;padding:10px;display:flex;justify-content:flex-end;align-items:center">
        <div style="margin-right:16px">用户名（示例）</div>
        <el-button type="text">退出</el-button>
      </el-header>
      <el-main style="padding:16px">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
</script>
