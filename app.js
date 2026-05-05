// Simple SPA with 4 pages: login, dashboard, project list, labeling mock
const app = document.getElementById('app');
const state = {
  user: null,
  projects: [
    {id:1,name:'New Project #1',tasks:1800,completed:14},
    {id:2,name:'test3',tasks:1800,completed:0},
    {id:3,name:'New Project #2',tasks:0,completed:0}
  ]
};
function navigate(page, params){
  if(page==='dashboard' && !state.user){renderLogin();return}
  if(page==='project' && !state.user){renderLogin();return}
  if(page==='label' && !state.user){renderLogin();return}
  if(page==='login') renderLogin();
  if(page==='dashboard') renderDashboard();
  if(page==='project') renderProject(params?.id);
  if(page==='label') renderLabeling(params?.id);
}

/* Helpers */
function el(html){const div=document.createElement('div');div.innerHTML=html.trim();return div.firstChild}

/* Login */
function renderLogin(){
  app.innerHTML = `
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(90deg,#fff 55%, #fffaf8 45%);padding:24px;">
    <div class="login-card card" style="width:560px;padding:40px;border-radius:16px;">
      <h2 style="font-size:32px;text-align:center;margin-bottom:18px">Log in</h2>
      <div class="form-field">
        <label for="email">Email Address</label>
        <input id="email" type="text" />
      </div>
      <div class="form-field">
        <label for="pass">Password</label>
        <input id="pass" type="password" />
      </div>
      <div class="form-field row checkbox">
        <input id="remember" type="checkbox" />
        <label for="remember">Keep me logged in this browser</label>
      </div>
      <div style="text-align:center;margin-top:16px">
        <button id="loginBtn" class="btn">Log in</button>
      </div>
      <p style="text-align:center;margin-top:14px" class="small-muted">This test accepts any email or password</p>
    </div>
  </div>
  `;
  document.getElementById('loginBtn').addEventListener('click',()=>{
    const email = document.getElementById('email').value.trim();
    state.user = {email: email || 'tester@example.com'};
    navigate('dashboard');
  });
}

/* Dashboard (projects list) */
function renderDashboard(){
  app.innerHTML = `
  <div class="container">
    <div class="header">
      <h1>Welcome 👋</h1>
      <div class="actions">
        <button id="createBtn" class="btn secondary">Create Project</button>
        <button id="inviteBtn" class="btn secondary">Invite Members</button>
      </div>
    </div>
    <div class="layout">
      <div class="main">
        <div class="card">
          <h3>Recent Projects</h3>
          <div class="projects-list" id="projectsList"></div>
        </div>
      </div>
      <div class="sidebar">
        <div class="card">
          <h4>Resources</h4>
          <ul class="small-muted">
            <li>Documentation</li>
            <li>API Documentation</li>
            <li>Release Notes</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  `;
  const pl = document.getElementById('projectsList');
  state.projects.forEach(p=>{
    const div = el(`<div class="project-item"><div><strong>${p.name}</strong><div class="meta">${p.completed} of ${p.tasks} Tasks (${Math.floor((p.completed/p.tasks||0)*100)}%)</div></div><div><button data-id="${p.id}" class="btn">Open</button></div></div>`);
    pl.appendChild(div);
  });
  document.getElementById('createBtn').addEventListener('click',()=>{
    const name = prompt('Project name', 'New Project');if(!name) return; const id = Date.now(); state.projects.unshift({id,name,tasks:0,completed:0}); navigate('dashboard');
  });
  document.getElementById('inviteBtn').addEventListener('click',()=>alert('Invite members placeholder'));
  document.querySelectorAll('[data-id]').forEach(b=>b.addEventListener('click',e=>navigate('project',{id:+e.target.dataset.id})));
}

/* Project view - table of tasks */
function renderProject(id){
  const project = state.projects.find(p=>p.id===id);
  app.innerHTML = `
  <div class="container">
    <div class="header"><div><a class="link" id="back">← Projects</a> <strong style="margin-left:12px">${project.name}</strong></div><div></div></div>
    <div class="card">
      <h3>Tasks</h3>
      <div style="overflow:auto;max-height:540px;margin-top:12px">
        <table class="table">
          <thead><tr><th>ID</th><th>Completed</th><th>Annotated by</th><th>text</th><th>action</th></tr></thead>
          <tbody id="tasksBody"></tbody>
        </table>
      </div>
    </div>
  </div>
  `;
  document.getElementById('back').addEventListener('click',()=>navigate('dashboard'));
  const tb = document.getElementById('tasksBody');
  // mock rows
  for(let i=0;i<12;i++){
    const id = 15904+i;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${id}</td><td>${i%2}</td><td><span class="small-muted">User${i%3}</span></td><td>ตัวอย่างข้อความ ${i+1}</td><td><button class="btn" data-label="${id}">Label</button></td>`;
    tb.appendChild(tr);
  }
  document.querySelectorAll('[data-label]').forEach(b=>b.addEventListener('click',e=>navigate('label',{id:+e.target.dataset.label})));
}

/* Labeling mock */
function renderLabeling(taskId){
  app.innerHTML = `
  <div class="container">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px"><div><a class="link" id="back2">← Back</a></div><div><strong>Projects / Labeling</strong></div></div>
    <div class="labeling">
      <div class="left-pane">
        <div class="card"> 
          <h4>Tasks</h4>
          <div style="margin-top:10px">
            <div class="task-row">1 <div style="flex:1;margin-left:8px">ตัวอย่างข้อความ 1</div></div>
            <div class="task-row">2 <div style="flex:1;margin-left:8px">ตัวอย่างข้อความ 2</div></div>
            <div class="task-row">3 <div style="flex:1;margin-left:8px">ตัวอย่างข้อความ 3</div></div>
          </div>
        </div>
      </div>
      <div class="center-pane">
        <div class="card">
          <div class="audio-wave"></div>
          <h3 style="margin-top:18px">Transcription (Please correct if needed)</h3>
          <div class="transcript">ตัวอย่างข้อความที่ถอดเสียงได้ โปรดตรวจสอบและแก้ไข</div>
          <div style="margin-top:12px">
            <h4>Please select any that apply</h4>
            <div><label><input type="checkbox"/> มีเสียงพูดหลายคน</label></div>
            <div><label><input type="checkbox"/> ฟังไม่ออก</label></div>
            <div><label><input type="checkbox"/> มี noise</label></div>
          </div>
        </div>
      </div>
      <div class="right-pane">
        <div class="card">
          <h4>View region details</h4>
          <p class="small-muted">Select a region to view its properties, metadata and available actions</p>
        </div>
      </div>
    </div>
  </div>
  `;
  document.getElementById('back2').addEventListener('click',()=>navigate('project',{id:state.projects[0].id}));
}

// start
navigate('login');
