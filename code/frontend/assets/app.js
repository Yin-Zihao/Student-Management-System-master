// 简易前端数据层（优先请求后端，不可用时使用 localStorage 模拟）
const MOCK_STUDENTS = [
  {id:1,name:'张三',gender:'男',class:'计科一班',phone:'13800138000'},
  {id:2,name:'李四',gender:'女',class:'软工二班',phone:'13800138001'},
  {id:3,name:'王五',gender:'男',class:'计科一班',phone:'13800138002'}
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
    // 尝试后端登录
    try{
      const res = await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});
      if(res.ok){const d=await res.json(); localStorage.setItem('sm_token', d.token || 'mock'); location.href='dashboard.html'; return;}
    }catch(e){}
    // 使用模拟登录
    if(username==='admin' && password==='admin'){ localStorage.setItem('sm_token','mock'); location.href='dashboard.html'; } else { alert('登录失败，测试账号：admin / admin'); }
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
});
