-- ========================================
-- 学生管理系统数据库脚本
-- 版本：V1.2.6
-- ========================================

-- 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 创建数据库
CREATE DATABASE IF NOT EXISTS student_management 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE student_management;

-- ========================================
-- 1. 用户表 (user)
-- ========================================
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '登录名（学号/工号）',
    `password` VARCHAR(100) NOT NULL COMMENT '加密后的密码',
    `real_name` VARCHAR(100) COMMENT '真实姓名',
    `role` VARCHAR(20) NOT NULL COMMENT '角色：admin/teacher/student/secretary',
    `class_id` BIGINT COMMENT '所属班级ID（学生必填，教师可为空）',
    `email` VARCHAR(100) COMMENT '邮箱',
    `phone` VARCHAR(20) COMMENT '电话',
    `status` TINYINT DEFAULT 1 COMMENT '状态：1正常，0禁用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ========================================
-- 2. 班级表 (class)
-- ========================================
DROP TABLE IF EXISTS `class`;
CREATE TABLE `class` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    `parent_id` BIGINT DEFAULT 0 COMMENT '父级 ID，0 表示根节点',
    `name` VARCHAR(200) NOT NULL COMMENT '学院 / 专业 / 班级名称',
    `level` TINYINT COMMENT '层级：1 学院 2 专业 3 班级',
    `order_num` INT DEFAULT 0 COMMENT '排序号'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='班级表';

-- ========================================
-- 3. 课程表 (course)
-- ========================================
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '课程 ID',
    `name` VARCHAR(200) NOT NULL COMMENT '课程名称',
    `code` VARCHAR(50) COMMENT '课程代码',
    `credit` DECIMAL(3,1) COMMENT '学分',
    `teacher_id` BIGINT COMMENT '授课教师 ID',
    `semester` VARCHAR(20) COMMENT '开课学期',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程表';

-- ========================================
-- 4. 成绩表 (score)
-- ========================================
DROP TABLE IF EXISTS `score`;
CREATE TABLE `score` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '成绩 ID',
    `student_id` BIGINT NOT NULL COMMENT '学生 ID',
    `course_id` BIGINT NOT NULL COMMENT '课程 ID',
    `score` DECIMAL(5,2) COMMENT '分数',
    `grade_point` DECIMAL(3,2) COMMENT '绩点',
    `exam_date` DATE COMMENT '考试日期',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '录入时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='成绩表';

-- ========================================
-- 5. 日志表 (log)
-- ========================================
DROP TABLE IF EXISTS `log`;
CREATE TABLE `log` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '日志 ID',
    `user_id` BIGINT COMMENT '操作用户 ID',
    `operation` VARCHAR(500) COMMENT '操作描述',
    `ip` VARCHAR(50) COMMENT '请求 IP',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='日志表';

-- ========================================
-- 6. 论文表 (paper)
-- ========================================
DROP TABLE IF EXISTS `paper`;
CREATE TABLE `paper` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '论文 ID',
    `teacher_id` BIGINT COMMENT '教师 ID',
    `title` VARCHAR(500) NOT NULL COMMENT '论文题目',
    `journal` VARCHAR(500) COMMENT '期刊 / 会议',
    `level` VARCHAR(50) COMMENT '级别',
    `publish_date` DATE COMMENT '发表日期',
    `is_qdu` TINYINT COMMENT '是否青大第一单位',
    `corresponding_author` VARCHAR(100) COMMENT '通讯作者',
    `ccf_level` VARCHAR(20) COMMENT 'CCF 等级',
    `score` INT COMMENT '积分',
    `belong` VARCHAR(100) COMMENT '论文归属',
    `remark` VARCHAR(1000) COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='论文表';

-- ========================================
-- 7. 教职工信息扩展表 (teacher_info)
-- ========================================
DROP TABLE IF EXISTS `teacher_info`;
CREATE TABLE `teacher_info` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
    `user_id` BIGINT UNIQUE COMMENT '关联用户表(user.id)，限定一条扩展记录',
    `first_degree` VARCHAR(100) COMMENT '第一学位',
    `highest_degree` VARCHAR(100) COMMENT '最高学位',
    `degree_date` DATE COMMENT '学位授予年月',
    `degree_school` VARCHAR(200) COMMENT '学位授予单位',
    `dept` VARCHAR(200) COMMENT '任职部门',
    `research_field` VARCHAR(500) COMMENT '研究方向',
    `professional_title` VARCHAR(100) COMMENT '专业技术职务',
    `title_date` DATE COMMENT '评审年份',
    `job_level` VARCHAR(100) COMMENT '兼聘 / 工勤岗位等级',
    `is_industry` TINYINT COMMENT '是否产业人员',
    `is_double` TINYINT COMMENT '是否双肩挑',
    `is_dual_teacher` TINYINT COMMENT '是否双师型',
    `is_teach` TINYINT COMMENT '是否为本科生上课',
    `counselor_type` VARCHAR(100) COMMENT '辅导员类别',
    `social_position` VARCHAR(500) COMMENT '社会兼职',
    `religion` VARCHAR(100) COMMENT '宗教信仰',
    `abroad_start` DATE COMMENT '访学开始日期',
    `abroad_end` DATE COMMENT '访学结束日期',
    `abroad_country` VARCHAR(200) COMMENT '访学国家',
    `recruit_level` VARCHAR(100) COMMENT '引进层次',
    `probation_start` DATE COMMENT '首聘期开始',
    `probation_end` DATE COMMENT '首聘期结束',
    `regular_date` DATE COMMENT '转正日期',
    `special_level` VARCHAR(100) COMMENT '特聘层次',
    `special_start` DATE COMMENT '特聘合同开始',
    `special_end` DATE COMMENT '特聘合同结束'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='教职工信息扩展表';

-- ========================================
-- 8. 创业信息表 (entrepreneurship)
-- ========================================
DROP TABLE IF EXISTS `entrepreneurship`;
CREATE TABLE `entrepreneurship` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    `user_id` BIGINT COMMENT '教师 ID',
    `company_name` VARCHAR(500) NOT NULL COMMENT '公司名称',
    `legal_representative` VARCHAR(200) COMMENT '法人',
    `establish_date` DATE COMMENT '成立日期'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='创业信息表';

-- ========================================
-- 9. 年度考核表 (assessment)
-- ========================================
DROP TABLE IF EXISTS `assessment`;
CREATE TABLE `assessment` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    `user_id` BIGINT COMMENT '用户 ID',
    `year` INT NOT NULL COMMENT '考核年份',
    `result` VARCHAR(100) NOT NULL COMMENT '考核结果'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='年度考核表';

-- ========================================
-- 10. 党务文件表 (party_document)
-- ========================================
DROP TABLE IF EXISTS `party_document`;
CREATE TABLE `party_document` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '文件 ID',
    `file_name` VARCHAR(500) NOT NULL COMMENT '文件名称',
    `doc_type` VARCHAR(100) NOT NULL COMMENT '类型：党字 / 院字 / 学字',
    `doc_number` VARCHAR(200) COMMENT '文号',
    `issue_date` DATE COMMENT '出台日期',
    `status` VARCHAR(50) DEFAULT '有效' COMMENT '有效 / 废止 / 修改中',
    `related_docs` VARCHAR(1000) COMMENT '关联文件',
    `interpreter_dept` VARCHAR(500) COMMENT '解释部门'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='党务文件表';

-- ========================================
-- 11. 学历学位表 (education)
-- ========================================
DROP TABLE IF EXISTS `education`;
CREATE TABLE `education` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    `user_id` BIGINT COMMENT '用户 ID',
    `school_name` VARCHAR(500) NOT NULL COMMENT '学校名称',
    `major` VARCHAR(500) COMMENT '专业',
    `degree` VARCHAR(200) COMMENT '学历学位',
    `start_date` DATE COMMENT '入学时间',
    `end_date` DATE COMMENT '毕业时间',
    `diploma_file` VARCHAR(500) COMMENT '毕业证路径',
    `degree_cert_file` VARCHAR(500) COMMENT '学位证路径'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学历学位表';

-- ========================================
-- 12. 子女信息表 (child)
-- ========================================
DROP TABLE IF EXISTS `child`;
CREATE TABLE `child` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    `user_id` BIGINT COMMENT '用户 ID',
    `child_name` VARCHAR(200) NOT NULL COMMENT '姓名',
    `child_birth_date` DATE NOT NULL COMMENT '出生日期',
    `remark` VARCHAR(500) COMMENT '服务备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='子女信息表';

-- ========================================
-- 13. 竞赛获奖表 (competition_award)
-- ========================================
DROP TABLE IF EXISTS `competition_award`;
CREATE TABLE `competition_award` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    `user_id` BIGINT COMMENT '用户 ID',
    `competition_name` VARCHAR(500) NOT NULL COMMENT '竞赛名称',
    `award_level` VARCHAR(100) COMMENT '级别',
    `award_rank` VARCHAR(100) COMMENT '等级',
    `award_date` DATE COMMENT '获奖日期',
    `advisor` VARCHAR(200) COMMENT '指导教师',
    `data_source` VARCHAR(100) COMMENT '学院统计 / 学校下发',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='竞赛获奖表';

-- ========================================
-- 14. 蓝桥杯专项表 (lanqiao_award)
-- ========================================
DROP TABLE IF EXISTS `lanqiao_award`;
CREATE TABLE `lanqiao_award` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    `user_id` BIGINT COMMENT '学生 ID',
    `session` VARCHAR(100) COMMENT '届次',
    `type` VARCHAR(100) COMMENT '组别',
    `national_award` VARCHAR(100) COMMENT '国赛奖项',
    `provincial_award` VARCHAR(100) COMMENT '省赛奖项',
    `award_year` INT COMMENT '年份',
    `certificate_file` VARCHAR(500) COMMENT '证书路径'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='蓝桥杯专项表';

-- ========================================
-- 15. 教研奖励表 (teaching_award)
-- ========================================
DROP TABLE IF EXISTS `teaching_award`;
CREATE TABLE `teaching_award` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    `award_name` VARCHAR(500) NOT NULL COMMENT '奖励名称',
    `result_name` VARCHAR(500) COMMENT '成果名称',
    `award_level` VARCHAR(100) COMMENT '级别',
    `award_date` DATE COMMENT '日期',
    `issuing_unit` VARCHAR(500) COMMENT '颁发单位',
    `unit_rank` INT COMMENT '单位排名',
    `certificate_no` VARCHAR(200) COMMENT '证书号'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='教研奖励表';

-- ========================================
-- 16. 科研奖励表 (research_award)
-- ========================================
DROP TABLE IF EXISTS `research_award`;
CREATE TABLE `research_award` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    `award_name` VARCHAR(500) NOT NULL COMMENT '奖励名称',
    `result_name` VARCHAR(500) COMMENT '成果名称',
    `award_level` VARCHAR(100) COMMENT '级别',
    `award_date` DATE COMMENT '日期',
    `issuing_unit` VARCHAR(500) COMMENT '颁发单位',
    `unit_rank` INT COMMENT '单位排名',
    `certificate_no` VARCHAR(200) COMMENT '证书号'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='科研奖励表';

-- ========================================
-- 17. 大创项目表 (innovation_project)
-- ========================================
DROP TABLE IF EXISTS `innovation_project`;
CREATE TABLE `innovation_project` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    `project_name` VARCHAR(500) NOT NULL COMMENT '项目名称',
    `project_level` VARCHAR(100) COMMENT '级别',
    `establish_year` INT COMMENT '立项年份',
    `leader_id` BIGINT COMMENT '负责人 ID',
    `members` VARCHAR(1000) COMMENT '成员',
    `advisor` VARCHAR(200) COMMENT '指导教师',
    `unit_rank` INT COMMENT '单位排名',
    `certificate_no` VARCHAR(200) COMMENT '证书号',
    `status` VARCHAR(50) COMMENT '状态'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='大创项目表';

-- ========================================
-- 18. 科研项目表 (research_project)
-- ========================================
DROP TABLE IF EXISTS `research_project`;
CREATE TABLE `research_project` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    `project_name` VARCHAR(500) NOT NULL COMMENT '项目名称',
    `project_level` VARCHAR(100) COMMENT '级别',
    `leader_id` BIGINT COMMENT '负责人 ID',
    `members` VARCHAR(1000) COMMENT '成员',
    `fund_amount` DECIMAL(10,2) COMMENT '经费',
    `status` VARCHAR(50) COMMENT '状态',
    `unit_rank` INT COMMENT '单位排名',
    `certificate_no` VARCHAR(200) COMMENT '证书号'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='科研项目表';

-- ========================================
-- 19. 个人荣誉称号表 (honor)
-- ========================================
DROP TABLE IF EXISTS `honor`;
CREATE TABLE `honor` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    `user_id` BIGINT COMMENT '用户 ID',
    `honor_name` VARCHAR(500) NOT NULL COMMENT '荣誉名称',
    `honor_level` VARCHAR(100) COMMENT '级别',
    `award_date` DATE COMMENT '授予日期',
    `issuing_unit` VARCHAR(500) COMMENT '授予单位'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='个人荣誉称号表';

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- 完整测试数据
-- ========================================

-- 1. 用户表（密码都是123456）
INSERT INTO `user` (`username`, `password`, `real_name`, `role`, `class_id`, `email`, `phone`, `status`) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIu', '张伟', 'admin', NULL, 'admin@qdu.edu.cn', '13800000001', 1),
('teacher01', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIu', '李明', 'teacher', NULL, 'liming@qdu.edu.cn', '13800000002', 1),
('teacher02', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIu', '王芳', 'teacher', NULL, 'wangfang@qdu.edu.cn', '13800000003', 1),
('teacher03', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIu', '陈阳', 'teacher', NULL, 'chenyang@qdu.edu.cn', '13800000004', 1),
('student01', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIu', '赵磊', 'student', 7, 'zhaolei@qdu.edu.cn', '13900000001', 1),
('student02', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIu', '钱多', 'student', 7, 'qianduo@qdu.edu.cn', '13900000002', 1),
('student03', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIu', '孙浩', 'student', 7, 'sunhao@qdu.edu.cn', '13900000003', 1),
('student04', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIu', '周静', 'student', 8, 'zhoujing@qdu.edu.cn', '13900000004', 1),
('student05', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIu', '吴雪', 'student', 8, 'wuxue@qdu.edu.cn', '13900000005', 1),
('student06', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIu', '郑毅', 'student', 11, 'zhengyi@qdu.edu.cn', '13900000006', 1),
('student07', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIu', '冯林', 'student', 11, 'fenglin@qdu.edu.cn', '13900000007', 1),
('secretary01', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIu', '朱莉', 'secretary', NULL, 'zhuli@qdu.edu.cn', '13800000005', 1);

-- 2. 班级/学院/专业表
INSERT INTO `class` (`parent_id`, `name`, `level`, `order_num`) VALUES
(0, '计算机科学与技术学院', 1, 1),
(0, '软件学院', 1, 2),
(1, '计算机科学与技术', 2, 1),
(1, '数据科学与大数据技术', 2, 2),
(2, '软件工程', 2, 1),
(2, '智能科学与技术', 2, 2),
(3, '计算机2021-1班', 3, 1),
(3, '计算机2021-2班', 3, 2),
(4, '大数据2021-1班', 3, 1),
(5, '软件工程2021-1班', 3, 1),
(5, '软件工程2021-2班', 3, 2),
(6, '智能科学2021-1班', 3, 1);

-- 3. 课程表
INSERT INTO `course` (`name`, `code`, `credit`, `teacher_id`, `semester`) VALUES
('高等数学', 'MATH101', 5.0, 2, '2024-1'),
('线性代数', 'MATH102', 3.0, 2, '2024-1'),
('程序设计基础', 'CS101', 4.0, 3, '2024-1'),
('数据结构', 'CS201', 4.0, 3, '2024-2'),
('数据库原理', 'CS301', 3.5, 4, '2024-2'),
('操作系统', 'CS302', 4.0, 4, '2024-2'),
('计算机网络', 'CS401', 3.0, 3, '2025-1'),
('软件工程', 'SE301', 3.5, 4, '2025-1'),
('人工智能', 'AI401', 3.0, 3, '2025-2'),
('机器学习', 'AI402', 3.5, 4, '2025-2');

-- 4. 成绩表
INSERT INTO `score` (`student_id`, `course_id`, `score`, `grade_point`, `exam_date`) VALUES
(5, 1, 92.5, 4.0, '2024-06-20'),
(5, 2, 88.0, 3.7, '2024-06-22'),
(5, 3, 95.0, 4.0, '2024-06-25'),
(6, 1, 78.5, 2.7, '2024-06-20'),
(6, 2, 82.0, 3.0, '2024-06-22'),
(6, 3, 85.5, 3.3, '2024-06-25'),
(7, 1, 86.0, 3.3, '2024-06-20'),
(7, 2, 90.5, 3.7, '2024-06-22'),
(7, 3, 88.0, 3.7, '2024-06-25'),
(8, 1, 72.0, 2.0, '2024-06-20'),
(8, 2, 68.5, 1.7, '2024-06-22'),
(8, 3, 75.0, 2.3, '2024-06-25'),
(9, 1, 94.0, 4.0, '2024-06-20'),
(9, 2, 91.5, 4.0, '2024-06-22'),
(9, 3, 96.0, 4.0, '2024-06-25');

-- 5. 日志表
INSERT INTO `log` (`user_id`, `operation`, `ip`) VALUES
(1, '用户登录成功', '192.168.1.100'),
(1, '新增用户：teacher03', '192.168.1.100'),
(2, '创建新课程：AI401', '192.168.1.101'),
(2, '更新学生CS101课程成绩', '192.168.1.101'),
(5, '查看个人成绩', '192.168.1.102'),
(5, '修改密码', '192.168.1.102');

-- 6. 论文表
INSERT INTO `paper` (`teacher_id`, `title`, `journal`, `level`, `publish_date`, `is_qdu`, `corresponding_author`, `ccf_level`, `score`, `belong`) VALUES
(2, '深度学习在图像识别中的应用', 'IEEE模式分析与机器智能汇刊', '顶级期刊', '2023-05-15', 1, '李明', 'A', 100, '计算机科学学院'),
(3, '高效数据处理算法研究', '计算机科学杂志', '核心期刊', '2023-08-20', 1, '王芳', 'B', 50, '软件学院'),
(4, '自然语言处理应用研究', 'ACL会议论文集', '会议', '2024-01-10', 1, '陈阳', 'A', 80, '计算机科学学院');

-- 7. 教职工信息扩展表
INSERT INTO `teacher_info` (`user_id`, `first_degree`, `highest_degree`, `degree_date`, `degree_school`, `dept`, `research_field`, `professional_title`, `title_date`, `is_teach`) VALUES
(2, '学士', '博士', '2015-06-01', '清华大学', '计算机科学系', '机器学习、计算机视觉', '教授', '2020-09-01', 1),
(3, '学士', '硕士', '2012-06-01', '北京大学', '软件工程系', '数据挖掘、大数据', '副教授', '2018-09-01', 1),
(4, '学士', '博士', '2018-06-01', '浙江大学', '智能科学系', '自然语言处理、知识图谱', '讲师', '2021-09-01', 1);

-- 8. 创业信息表
INSERT INTO `entrepreneurship` (`user_id`, `company_name`, `legal_representative`, `establish_date`) VALUES
(2, '青岛人工智能科技有限公司', '李明', '2022-03-15'),
(3, '数据智慧创新有限公司', '王芳', '2023-01-20');

-- 9. 年度考核表
INSERT INTO `assessment` (`user_id`, `year`, `result`) VALUES
(2, 2021, '优秀'),
(2, 2022, '优秀'),
(2, 2023, '良好'),
(3, 2021, '良好'),
(3, 2022, '优秀'),
(3, 2023, '良好'),
(4, 2021, '合格'),
(4, 2022, '良好'),
(4, 2023, '优秀');

-- 10. 党务文件表
INSERT INTO `party_document` (`file_name`, `doc_type`, `doc_number`, `issue_date`, `status`, `interpreter_dept`) VALUES
('关于加强党建工作的意见', '党字', '青大党[2023]1号', '2023-01-15', '有效', '党委办公室'),
('师德师风建设实施方案', '院字', '青大院[2023]5号', '2023-03-20', '有效', '人力资源部'),
('学生党员发展程序', '学字', '青大生[2023]10号', '2023-05-10', '有效', '学生工作处');

-- 11. 学历学位表
INSERT INTO `education` (`user_id`, `school_name`, `major`, `degree`, `start_date`, `end_date`) VALUES
(2, '山东大学', '计算机科学', '学士', '2005-09-01', '2009-06-30'),
(2, '清华大学', '计算机科学', '硕士', '2009-09-01', '2012-06-30'),
(2, '清华大学', '计算机科学', '博士', '2012-09-01', '2015-06-30'),
(3, '北京大学', '软件工程', '学士', '2006-09-01', '2010-06-30'),
(3, '北京大学', '软件工程', '硕士', '2010-09-01', '2012-06-30'),
(4, '浙江大学', '人工智能', '学士', '2009-09-01', '2013-06-30'),
(4, '浙江大学', '人工智能', '硕士', '2013-09-01', '2015-06-30'),
(4, '浙江大学', '人工智能', '博士', '2015-09-01', '2018-06-30');

-- 12. 子女信息表
INSERT INTO `child` (`user_id`, `child_name`, `child_birth_date`, `remark`) VALUES
(2, '李小明', '2016-05-20', '小学生'),
(3, '王雨', '2018-08-15', '幼儿园');

-- 13. 竞赛获奖表
INSERT INTO `competition_award` (`user_id`, `competition_name`, `award_level`, `award_rank`, `award_date`, `advisor`, `data_source`) VALUES
(5, '全国大学生数学建模竞赛', '国家级', '一等奖', '2023-09-20', '李明', '学院统计'),
(6, 'ACM-ICPC亚洲区域赛', '区域级', '二等奖', '2023-11-15', '王芳', '学校下发'),
(7, '蓝桥杯全国软件和信息技术专业人才大赛', '国家级', '一等奖', '2024-04-10', '陈阳', '学院统计'),
(8, '中国大学生计算机设计大赛', '省级', '一等奖', '2023-07-05', '李明', '学院统计'),
(9, '全国大学生智能汽车竞赛', '国家级', '二等奖', '2023-08-25', '陈阳', '学校下发');

-- 14. 蓝桥杯专项表
INSERT INTO `lanqiao_award` (`user_id`, `session`, `type`, `national_award`, `provincial_award`, `award_year`) VALUES
(7, '第15届', 'C/C++程序设计A组', '一等奖', '特等奖', 2024),
(5, '第14届', 'Java程序设计B组', '二等奖', '一等奖', 2023),
(6, '第14届', 'Python程序设计组', '三等奖', '二等奖', 2023);

-- 15. 教研奖励表
INSERT INTO `teaching_award` (`award_name`, `result_name`, `award_level`, `award_date`, `issuing_unit`, `unit_rank`, `certificate_no`) VALUES
('省级教学成果奖', '创新人才培养模式的研究与实践', '省级一等奖', '2022-09-10', '山东省教育厅', 1, 'SDJXA2022001'),
('校级教学成果奖', '计算机科学课程体系建设', '校级一等奖', '2023-09-10', '青岛大学', 1, 'QDJXA2023005'),
('优秀教材奖', '数据结构与算法', '省级二等奖', '2023-06-15', '山东省教育厅', 2, 'SDJC2023012');

-- 16. 科研奖励表
INSERT INTO `research_award` (`award_name`, `result_name`, `award_level`, `award_date`, `issuing_unit`, `unit_rank`, `certificate_no`) VALUES
('山东省科技进步奖', '智能图像识别关键技术及应用', '省级二等奖', '2023-12-20', '山东省人民政府', 1, 'SDKJJ2023025'),
('青岛市科技奖', '大数据分析平台研究', '市级一等奖', '2023-10-15', '青岛市人民政府', 1, 'QDKJJ2023008'),
('校级科研成果奖', '自然语言处理技术', '校级一等奖', '2024-01-20', '青岛大学', 1, 'QDKY2024003');

-- 17. 大创项目表
INSERT INTO `innovation_project` (`project_name`, `project_level`, `establish_year`, `leader_id`, `members`, `advisor`, `unit_rank`, `status`) VALUES
('智能校园导航系统', '国家级', 2023, 5, '赵磊, 钱多, 孙浩', '李明', 1, '已完成'),
('学生成绩大数据分析平台', '省级', 2023, 8, '周静, 吴雪', '王芳', 1, '进行中'),
('基于AI的英语学习助手', '校级', 2024, 11, '冯林, 郑毅', '陈阳', 1, '新立项');

-- 18. 科研项目表
INSERT INTO `research_project` (`project_name`, `project_level`, `leader_id`, `members`, `fund_amount`, `status`, `unit_rank`) VALUES
('基于深度学习的图像识别技术研究', '国家自然科学基金', 2, '李明, 王芳, 陈阳', 580000.00, '进行中', 1),
('大数据处理技术研究与应用', '山东省重点研发计划', 3, '王芳, 陈阳', 200000.00, '已完成', 1),
('自然语言理解与知识图谱构建', '青岛市科技发展计划', 4, '陈阳, 李明', 100000.00, '进行中', 1);

-- 19. 个人荣誉称号表
INSERT INTO `honor` (`user_id`, `honor_name`, `honor_level`, `award_date`, `issuing_unit`) VALUES
(2, '山东省泰山学者', '省级', '2022-05-01', '山东省人民政府'),
(2, '青岛大学优秀教师', '校级', '2023-09-10', '青岛大学'),
(3, '山东省有突出贡献的中青年专家', '省级', '2023-03-15', '山东省人力资源和社会保障厅'),
(4, '青岛大学优秀青年学者', '校级', '2022-12-20', '青岛大学'),
(5, '国家奖学金', '国家级', '2023-10-20', '教育部'),
(6, '山东省政府奖学金', '省级', '2023-11-05', '山东省教育厅');
