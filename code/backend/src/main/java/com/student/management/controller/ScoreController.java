package com.student.management.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.student.management.common.Result;
import com.student.management.entity.Score;
import com.student.management.mapper.ScoreMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;

@RestController
@RequestMapping("/scores")
public class ScoreController {

    @Autowired
    private ScoreMapper scoreMapper;

    @GetMapping
    public Result<Page<Score>> getScoreList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long courseId) {
        Page<Score> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Score> wrapper = new LambdaQueryWrapper<>();
        if (studentId != null) {
            wrapper.eq(Score::getStudentId, studentId);
        }
        if (courseId != null) {
            wrapper.eq(Score::getCourseId, courseId);
        }
        wrapper.orderByDesc(Score::getCreateTime);
        Page<Score> result = scoreMapper.selectPage(pageParam, wrapper);
        return Result.success(result);
    }

    @GetMapping("/my")
    public Result<Page<Score>> getMyScores(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        Page<Score> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Score> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Score::getStudentId, userId);
        wrapper.orderByDesc(Score::getCreateTime);
        Page<Score> result = scoreMapper.selectPage(pageParam, wrapper);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Score> getScoreById(@PathVariable Long id) {
        Score score = scoreMapper.selectById(id);
        return Result.success(score);
    }

    @PostMapping
    public Result<Score> addScore(@RequestBody Score score) {
        if (score.getScore() != null) {
            score.setGradePoint(calculateGradePoint(score.getScore()));
        }
        scoreMapper.insert(score);
        return Result.success(score);
    }

    @PutMapping("/{id}")
    public Result<Score> updateScore(@PathVariable Long id, @RequestBody Score score) {
        score.setId(id);
        if (score.getScore() != null) {
            score.setGradePoint(calculateGradePoint(score.getScore()));
        }
        scoreMapper.updateById(score);
        return Result.success(score);
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteScore(@PathVariable Long id) {
        scoreMapper.deleteById(id);
        return Result.success();
    }

    private BigDecimal calculateGradePoint(BigDecimal score) {
        if (score == null) return null;
        double s = score.doubleValue();
        double gp;
        if (s >= 90) gp = 4.0;
        else if (s >= 85) gp = 3.7;
        else if (s >= 82) gp = 3.3;
        else if (s >= 78) gp = 3.0;
        else if (s >= 75) gp = 2.7;
        else if (s >= 72) gp = 2.3;
        else if (s >= 68) gp = 2.0;
        else if (s >= 64) gp = 1.5;
        else if (s >= 60) gp = 1.0;
        else gp = 0.0;
        return BigDecimal.valueOf(gp).setScale(2, BigDecimal.ROUND_HALF_UP);
    }
}
