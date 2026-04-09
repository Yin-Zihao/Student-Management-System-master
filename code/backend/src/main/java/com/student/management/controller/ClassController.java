package com.student.management.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.student.management.common.Result;
import com.student.management.entity.ClassInfo;
import com.student.management.mapper.ClassInfoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/classes")
public class ClassController {

    @Autowired
    private ClassInfoMapper classInfoMapper;

    @GetMapping
    public Result<List<ClassInfo>> getClassList() {
        LambdaQueryWrapper<ClassInfo> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(ClassInfo::getOrderNum);
        List<ClassInfo> list = classInfoMapper.selectList(wrapper);
        return Result.success(list);
    }

    @GetMapping("/{id}")
    public Result<ClassInfo> getClassById(@PathVariable Long id) {
        ClassInfo classInfo = classInfoMapper.selectById(id);
        return Result.success(classInfo);
    }

    @PostMapping
    public Result<ClassInfo> addClass(@RequestBody ClassInfo classInfo) {
        classInfoMapper.insert(classInfo);
        return Result.success(classInfo);
    }

    @PutMapping("/{id}")
    public Result<ClassInfo> updateClass(@PathVariable Long id, @RequestBody ClassInfo classInfo) {
        classInfo.setId(id);
        classInfoMapper.updateById(classInfo);
        return Result.success(classInfo);
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteClass(@PathVariable Long id) {
        classInfoMapper.deleteById(id);
        return Result.success();
    }
}
