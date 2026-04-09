// 简易前端数据层（优先请求后端，不可用时使用 localStorage 模拟）
const MOCK_STUDENTS = [
  {id:1,name:'张三',gender:'男',class:'计科一班',phone:'13800138000'},
  {id:2,name:'李四',gender:'女',class:'软工二班',phone:'13800138001'},
  {id:3,name:'王五',gender:'男',class:'计科一班',phone:'13800138002'}
];

const MOCK_TEACHERS = [
  {id:1,account:'tzhang',name:'张老师',title:'讲师'},
  {id:2,account:'tli',name:'李老师',title:'副教授'}
];

const MOCK_USERS = [
  {id:1,account:'admin',name:'系统管理员',role:'admin'},
  {id:2,account:'tzhang',name:'张老师',role:'teacher'},
  {id:3,account:'szhang',name:'张三',role:'student'}
];

const LS_KEY = 'sm_students';
const LS_NEXT = 'sm_nextId';

function loadFromLocal(){
  const raw = localStorage.getItem(LS_KEY);
  if(raw) return JSON.parse(raw);
  localStorage.setItem(LS_KEY, JSON.stringify(MOCK_STUDENTS));
  localStorage.setItem(LS_NEXT, String(MOCK_STUDENTS.length + 1));
  return MOCK_STUDENTS.slice();
}

function loadTeachers(){
  const raw = localStorage.getItem('sm_teachers');
  if(raw) return JSON.parse(raw);
  localStorage.setItem('sm_teachers', JSON.stringify(MOCK_TEACHERS));
  return MOCK_TEACHERS.slice();
}

function loadUsers(){
  const raw = localStorage.getItem('sm_users');
  if(raw) return JSON.parse(raw);
  localStorage.setItem('sm_users', JSON.stringify(MOCK_USERS));
  return MOCK_USERS.slice();
}

async function getStudents(){
  try{
    const res = await fetch('/api/students');
    if(res.ok) return await res.json();
  }catch(e){}
  return loadFromLocal();
}

function saveStudents(list){
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

function nextId(){
  let n = Number(localStorage.getItem(LS_NEXT) || MOCK_STUDENTS.length + 1);
  localStorage.setItem(LS_NEXT, String(n+1));
  return n;
}

async function addStudent(data){
  // try backend
  try{const res = await fetch('/api/students',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); if(res.ok) return await res.json();}catch(e){}
  const list = loadFromLocal();
  const id = nextId();
  const s = {id, ...data};
  list.unshift(s);
  saveStudents(list);
  return s;
}

async function updateStudent(id, data){
  try{const res = await fetch(`/api/students/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); if(res.ok) return await res.json();}catch(e){}
  const list = loadFromLocal();
  const i = list.findIndex(x=>x.id===Number(id));
  if(i>-1){list[i] = {id: Number(id), ...data}; saveStudents(list); return list[i];}
  return null;
}

async function deleteStudent(id){
  try{const res = await fetch(`/api/students/${id}`,{method:'DELETE'}); if(res.ok) return true;}catch(e){}
  let list = loadFromLocal();
  list = list.filter(s=>s.id!==Number(id));
  saveStudents(list);
  return true;
}

async function getStudentById(id){
  try{const res = await fetch(`/api/students/${id}`); if(res.ok) return await res.json();}catch(e){}
  const list = loadFromLocal();
  return list.find(s=>s.id===Number(id))||null;
}

/* 教师/管理员数据接口（本地 mock） */
function getTeachers(){
  try{ /* try backend if exists */ }catch(e){}
  return loadTeachers();
}

function getUsers(){
  return loadUsers();
}

async function deleteUser(id){
  let users = loadUsers(); users = users.filter(u=>u.id!==Number(id)); localStorage.setItem('sm_users', JSON.stringify(users)); return true;
}

/* 页面初始化 */
function qParam(name){
  const s = new URLSearchParams(location.search);
  return s.get(name);
}

/* Login */
function initLogin(){
  const form = document.getElementById('loginForm');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const username = fd.get('username'), password = fd.get('password');
    const role = fd.get('role') || 'student';
    // 尝试后端登录
    try{
      const res = await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});
      if(res.ok){const d=await res.json(); localStorage.setItem('sm_token', d.token || 'mock'); location.href='dashboard.html'; return;}
    }catch(e){}

    // 使用本地 data/users.json 校验（密码以 Base64 存储）
    try{
      // 使用绝对路径以确保在子目录（如 login/）中也能正确读取
      const r = await fetch('/code/frontend/data/users.json');
      if(r.ok){
        const list = await r.json();
        const u = list.find(x=>x.username===username && x.role===role);
        if(u){
          const encoded = btoa(String(password));
          if(encoded === u.password){
            localStorage.setItem('sm_token','mock');
            localStorage.setItem('sm_user', JSON.stringify({account:username,name:u.name||username,role}));
            // 根据角色跳转
            if(role==='admin') location.href='admin/admin-dashboard.html';
            else if(role==='teacher') location.href='teacher/teacher-dashboard.html';
            else location.href='student/student-dashboard.html';
            return;
          }
        }
      }
    }catch(e){ console.error(e) }

    alert('登录失败：用户名或密码错误');
  });
}

/* Students list page */
async function initStudents(){
  const tbody = document.querySelector('#studentsTable tbody');
  if(!tbody) return;
  const students = await getStudents();
  tbody.innerHTML = students.map(s=>`<tr><td>${s.id}</td><td><a href="student-detail.html?id=${s.id}">${s.name}</a></td><td>${s.gender}</td><td>${s.class||''}</td><td>${s.phone||''}</td><td><a href="student-form.html?id=${s.id}">编辑</a> <a href="#" data-id="${s.id}" class="del">删除</a></td></tr>`).join('');
  tbody.querySelectorAll('.del').forEach(a=>a.addEventListener('click', async (e)=>{e.preventDefault(); const id=a.dataset.id; if(confirm('确定删除？')){ await deleteStudent(id); initStudents(); }}));
}

/* Student form (add/edit) */
async function initStudentForm(){
  const form = document.getElementById('studentForm');
  if(!form) return;
  const id = qParam('id');
  if(id){ document.getElementById('formTitle').textContent='编辑学生'; const s = await getStudentById(id); if(s){ form.name.value=s.name; form.gender.value=s.gender||'男'; form.class.value=s.class||''; form.phone.value=s.phone||''; }}
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(form); const data = { name: fd.get('name'), gender: fd.get('gender'), class: fd.get('class'), phone: fd.get('phone') };
    if(id){ await updateStudent(id,data); } else { await addStudent(data); }
    location.href='students.html';
  });
}

/* Student detail */
async function initStudentDetail(){
  const id = qParam('id');
  const el = document.getElementById('detail');
  if(!el) return;
  const s = await getStudentById(id);
  if(!s){ el.innerHTML = '<p>未找到学生</p>'; return; }
  el.innerHTML = `<p><strong>姓名：</strong>${s.name}</p><p><strong>性别：</strong>${s.gender}</p><p><strong>班级：</strong>${s.class||''}</p><p><strong>联系电话：</strong>${s.phone||''}</p>`;
  const edit = document.getElementById('editLink'); if(edit) edit.href = `student-form.html?id=${s.id}`;
}

/* Dashboard */
async function initDashboard(){
  const statsEl = document.getElementById('stats');
  const recentEl = document.getElementById('recent');
  if(!statsEl || !recentEl) return;
  const students = await getStudents();
  const total = students.length;
  const male = students.filter(s=>s.gender==='男').length;
  statsEl.innerHTML = `<div class="stat"><div>总学生数</div><strong>${total}</strong></div><div class="stat"><div>男生</div><strong>${male}</strong></div><div class="stat"><div>女生</div><strong>${total-male}</strong></div>`;
  recentEl.innerHTML = `<ul>${students.slice(0,5).map(s=>`<li>${s.name} — ${s.class||''}</li>`).join('')}</ul>`;
}

document.addEventListener('DOMContentLoaded', ()=>{
  const path = location.pathname.split('/').pop();
  if(path === 'login.html' || path === '') initLogin();
  if(path === 'students.html') initStudents();
  if(path === 'student-form.html') initStudentForm();
  if(path === 'student-detail.html') initStudentDetail();
  if(path === 'dashboard.html') initDashboard();
  if(path === 'teacher-dashboard.html') initTeacherDashboard();
  if(path === 'teacher-students.html') initTeacherStudents();
  if(path === 'admin-dashboard.html') initAdminDashboard();
  if(path === 'admin-users.html') initAdminUsers();
});

/* 教师页面初始化 */
function initTeacherDashboard(){
  const el = document.getElementById('t-stats'); if(!el) return; const teachers = getTeachers(); el.innerHTML = `<div class="stat"><div>教师数</div><strong>${teachers.length}</strong></div>`;
}

async function initTeacherStudents(){
  const tbody = document.querySelector('#t-students tbody'); if(!tbody) return; const students = await getStudents(); tbody.innerHTML = students.map(s=>`<tr><td>${s.id}</td><td>${s.name}</td><td>${s.gender}</td><td>${s.class||''}</td><td><a href="student-detail.html?id=${s.id}">详情</a></td></tr>`).join('');
}

/* 管理员页面初始化 */
function initAdminDashboard(){
  const el = document.getElementById('a-stats'); if(!el) return; const students = loadFromLocal(); const teachers = loadTeachers(); const users = loadUsers(); el.innerHTML = `<div class="stat"><div>学生</div><strong>${students.length}</strong></div><div class="stat"><div>教师</div><strong>${teachers.length}</strong></div><div class="stat"><div>用户</div><strong>${users.length}</strong></div>`;
}

function initAdminUsers(){
  const tbody = document.querySelector('#a-users tbody'); if(!tbody) return; const users = getUsers(); tbody.innerHTML = users.map(u=>`<tr><td>${u.id}</td><td>${u.account}</td><td>${u.name}</td><td>${u.role}</td><td><a href="#" data-id="${u.id}" class="a-del">删除</a></td></tr>`).join(''); tbody.querySelectorAll('.a-del').forEach(a=>a.addEventListener('click', async (e)=>{e.preventDefault(); const id=a.dataset.id; if(confirm('删除用户？')){ await deleteUser(id); initAdminUsers(); }}));
}

/* 顶部用户信息渲染与路由守卫 */
function renderTopUser(){
  const el = document.getElementById('topUser');
  if(!el) return;
  const u = JSON.parse(localStorage.getItem('sm_user')||'null');
  if(u){ el.innerHTML = `${u.name} （${u.role}） <a href=\"login.html\" style=\"margin-left:12px;color:#666;\" onclick=\"localStorage.removeItem('sm_token');localStorage.removeItem('sm_user')\">退出</a>`; }
}

function ensureRole(required){
  const u = JSON.parse(localStorage.getItem('sm_user')||'null');
  if(!u){ location.href='login.html'; return false; }
  if(required && u.role!==required){ /* not allowed */ alert('无权限访问此页面'); location.href='login.html'; return false; }
  renderTopUser();
  return true;
}

// 在页面加载时渲染顶部用户信息
document.addEventListener('DOMContentLoaded', ()=>{
  renderTopUser();
});
