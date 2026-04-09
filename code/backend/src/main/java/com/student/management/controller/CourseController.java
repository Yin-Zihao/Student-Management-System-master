package com.student.management.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.student.management.common.Result;
import com.student.management.entity.Course;
import com.student.management.mapper.CourseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseMapper courseMapper;

    @GetMapping
    public Result<Page<Course>> getCourseList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long teacherId) {
        Page<Course> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Course> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like(Course::getName, keyword)
                    .or().like(Course::getCode, keyword));
        }
        if (teacherId != null) {
            wrapper.eq(Course::getTeacherId, teacherId);
        }
        wrapper.orderByDesc(Course::getCreateTime);
        Page<Course> result = courseMapper.selectPage(pageParam, wrapper);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Course> getCourseById(@PathVariable Long id) {
        Course course = courseMapper.selectById(id);
        return Result.success(course);
    }

    @PostMapping
    public Result<Course> addCourse(@RequestBody Course course) {
        courseMapper.insert(course);
        return Result.success(course);
    }

    @PutMapping("/{id}")
    public Result<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        course.setId(id);
        courseMapper.updateById(course);
        return Result.success(course);
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteCourse(@PathVariable Long id) {
        courseMapper.deleteById(id);
        return Result.success();
    }
}
