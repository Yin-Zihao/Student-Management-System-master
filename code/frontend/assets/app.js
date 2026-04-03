const MOCK_STUDENTS = [
  {id:1,name:'张三',gender:'男',class:'计科一班',phone:'13800138000'},
  {id:2,name:'李四',gender:'女',class:'软工二班',phone:'13800138001'},
  {id:3,name:'王五',gender:'男',class:'计科一班',phone:'13800138002'}
];

async function fetchJson(url, opts){
  try{
    const res = await fetch(url, opts);
    if(!res.ok) throw new Error('network');
    return await res.json();
  }catch(err){
    // 回退到本地模拟
    if(url.includes('/api/students')) return MOCK_STUDENTS;
    if(url.includes('/api/login')) return {ok:true, token:'mock-token', user:{name:'admin'}};
    return null;
  }
}

function initLogin(){
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const username = fd.get('username'), password = fd.get('password');
    const resp = await fetchJson('/api/login', {method:'POST', body:JSON.stringify({username,password}), headers:{'Content-Type':'application/json'}});
    if(resp && resp.ok){
      localStorage.setItem('sm_token', resp.token || 'mock');
      location.href = 'dashboard.html';
    }else{
      alert('登录失败（使用模拟登录请使用 admin / admin）');
    }
  });
}

async function initStudents(){
  const tbody = document.querySelector('#studentsTable tbody');
  const students = await fetchJson('/api/students');
  tbody.innerHTML = students.map(s=>`<tr><td>${s.id}</td><td>${s.name}</td><td>${s.gender}</td><td>${s.class}</td><td>${s.phone||''}</td></tr>`).join('');
}

async function initDashboard(){
  const statsEl = document.getElementById('stats');
  const recentEl = document.getElementById('recent');
  const students = await fetchJson('/api/students');
  const total = students.length;
  const male = students.filter(s=>s.gender==='男').length;
  statsEl.innerHTML = `<div class="stat"><div>总学生数</div><strong>${total}</strong></div><div class="stat"><div>男生</div><strong>${male}</strong></div><div class="stat"><div>女生</div><strong>${total-male}</strong></div>`;
  recentEl.innerHTML = `<ul>${students.slice(0,5).map(s=>`<li>${s.name} — ${s.class}</li>`).join('')}</ul>`;
}

document.addEventListener('DOMContentLoaded', ()=>{
  const path = location.pathname.split('/').pop();
  if(path === 'login.html' || path === '') initLogin();
  if(path === 'students.html') initStudents();
  if(path === 'dashboard.html') initDashboard();
});
