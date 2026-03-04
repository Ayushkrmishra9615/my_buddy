// ===== AUTH =====
  const VALID_EMAIL = 'ayushkr1660@gmail.com';
  const VALID_PASS = 'Ayush123@';

  function validatePassword(p) {
    return /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p);
  }

  function doLogin() {
    const email = document.getElementById('email-input').value.trim();
    const pass = document.getElementById('pass-input').value;
    const errEl = document.getElementById('error-msg');

    if (!validatePassword(pass)) {
      errEl.textContent = '⚠️ Password must have uppercase, lowercase, number & special character.';
      errEl.style.display = 'block';
      return;
    }

    if (email === VALID_EMAIL && pass === VALID_PASS) {
      document.getElementById('login-page').style.display = 'none';
      document.getElementById('main-app').style.display = 'block';
      errEl.style.display = 'none';
      renderMaterials();
    } else {
      errEl.textContent = '⚠️ Invalid email or password. Please try again.';
      errEl.style.display = 'block';
      errEl.style.animation = 'none';
      setTimeout(() => errEl.style.animation = 'shake 0.3s ease', 10);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const passInput = document.getElementById('pass-input');
    if (passInput) passInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') doLogin();
    });
  });

  function doLogout() {
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('email-input').value = '';
    document.getElementById('pass-input').value = '';
    document.getElementById('error-msg').style.display = 'none';
  }

  // ===== NAVIGATION =====
  let currentPage = 'home';
  let prevPage = 'semesters';

  function showPage(name, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + name).classList.add('active');
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    currentPage = name;
    if (name === 'materials') renderMaterials();
  }

  function openSem(n) {
    prevPage = currentPage;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-sem-detail').classList.add('active');
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    renderSemDetail(n);
  }

  function goBack() {
    const targetPage = prevPage === 'home' ? 'home' : 'semesters';
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + targetPage).classList.add('active');
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    const tabs = document.querySelectorAll('.nav-tab');
    if (targetPage === 'home') tabs[0].classList.add('active');
    else tabs[1].classList.add('active');
    currentPage = targetPage;
  }

  // ===== DATA =====
  const semData = {
    1: { name: 'Semester 1', subjects: [
      { name: 'Engineering Mathematics I', files: [
        { name: 'Unit 1 - Matrices.pdf', type: 'pdf', size: '2.1 MB' },
        { name: 'Unit 2 - Calculus.pdf', type: 'pdf', size: '3.4 MB' },
        { name: 'Maths Formulas Sheet.pdf', type: 'pdf', size: '0.8 MB' }
      ]},
      { name: 'Engineering Physics', files: [
        { name: 'Physics Notes Complete.pdf', type: 'pdf', size: '5.2 MB' },
        { name: 'Lab Manual.pdf', type: 'pdf', size: '1.9 MB' }
      ]},
      { name: 'Computer Science Basics (CS101)', files: [
        { name: 'Intro to CS Slides.ppt', type: 'ppt', size: '4.5 MB' },
        { name: 'Programming Basics.pdf', type: 'pdf', size: '2.3 MB' }
      ]},
      { name: 'Communication Skills', files: [
        { name: 'Communication Notes.doc', type: 'doc', size: '1.1 MB' }
      ]}
    ]},
    2: { name: 'Semester 2', subjects: [
      { name: 'Data Structures', files: [
        { name: 'DS Complete Notes.pdf', type: 'pdf', size: '6.1 MB' },
        { name: 'DS Algorithms.ppt', type: 'ppt', size: '3.2 MB' }
      ]},
      { name: 'Engineering Mathematics II', files: [
        { name: 'Maths-2 Unit 1.pdf', type: 'pdf', size: '2.8 MB' },
        { name: 'Maths-2 Unit 2.pdf', type: 'pdf', size: '3.1 MB' }
      ]},
      { name: 'Engineering Chemistry', files: [
        { name: 'Chemistry Notes.pdf', type: 'pdf', size: '4.4 MB' }
      ]}
    ]},
    3: { name: 'Semester 3', subjects: [
      { name: 'Object Oriented Programming', files: [
        { name: 'OOPS Complete Notes.pdf', type: 'pdf', size: '5.5 MB' },
        { name: 'OOPS Lab Programs.doc', type: 'doc', size: '1.3 MB' }
      ]},
      { name: 'Design & Analysis of Algorithms', files: [
        { name: 'DAA Notes.pdf', type: 'pdf', size: '4.8 MB' },
        { name: 'Algorithm Slides.ppt', type: 'ppt', size: '6.2 MB' }
      ]},
      { name: 'Digital Electronics', files: [
        { name: 'Digital Electronics.pdf', type: 'pdf', size: '3.7 MB' }
      ]}
    ]},
    4: { name: 'Semester 4', subjects: [
      { name: 'Operating Systems', files: [
        { name: 'OS Notes Complete.pdf', type: 'pdf', size: '7.2 MB' },
        { name: 'OS Slides.ppt', type: 'ppt', size: '5.1 MB' }
      ]},
      { name: 'Database Management Systems', files: [
        { name: 'DBMS Notes.pdf', type: 'pdf', size: '4.9 MB' },
        { name: 'SQL Queries Reference.doc', type: 'doc', size: '0.9 MB' }
      ]},
      { name: 'Computer Networks', files: [
        { name: 'Networks Notes.pdf', type: 'pdf', size: '6.3 MB' }
      ]}
    ]},
    5: { name: 'Semester 5', subjects: [
      { name: 'Machine Learning', files: [
        { name: 'ML Notes.pdf', type: 'pdf', size: '8.1 MB' },
        { name: 'ML Algorithms.ppt', type: 'ppt', size: '7.2 MB' }
      ]},
      { name: 'Compiler Design', files: [
        { name: 'Compiler Design Notes.pdf', type: 'pdf', size: '5.6 MB' }
      ]}
    ]},
    6: { name: 'Semester 6', subjects: [
      { name: 'Artificial Intelligence', files: [
        { name: 'AI Notes.pdf', type: 'pdf', size: '6.8 MB' }
      ]},
      { name: 'Cloud Computing', files: [
        { name: 'Cloud Computing Notes.pdf', type: 'pdf', size: '4.2 MB' },
        { name: 'Cloud Slides.ppt', type: 'ppt', size: '5.5 MB' }
      ]}
    ]},
    7: { name: 'Semester 7', subjects: [
      { name: 'Major Project', files: [
        { name: 'Project Synopsis.doc', type: 'doc', size: '1.5 MB' }
      ]},
      { name: 'Elective Subject', files: [
        { name: 'Elective Notes.pdf', type: 'pdf', size: '3.8 MB' }
      ]}
    ]},
    8: { name: 'Semester 8', subjects: [
      { name: 'Thesis / Final Project', files: [
        { name: 'Thesis Template.doc', type: 'doc', size: '2.1 MB' }
      ]},
      { name: 'Seminar', files: [
        { name: 'Seminar Report.doc', type: 'doc', size: '1.8 MB' }
      ]}
    ]}
  };

  function renderSemDetail(n) {
    const sem = semData[n];
    document.getElementById('sem-detail-title').textContent = sem.name;
    const container = document.getElementById('subjects-container');
    container.innerHTML = sem.subjects.map((sub, si) => `
      <div class="subject-card">
        <div class="subject-name">
          <div class="dot"></div>
          ${sub.name}
        </div>
        <div class="materials-list">
          ${sub.files.map((f, fi) => `
            <div class="material-item" data-sem="${n}" data-si="${si}" data-fi="${fi}">
              <span class="material-icon">${f.type === 'pdf' ? '📄' : f.type === 'ppt' ? '📊' : '📝'}</span>
              <span class="material-name">${f.name}</span>
              <span class="material-badge">${f.size}</span>
            </div>
          `).join('')}
        </div>
        <div class="upload-area" data-upload="true">
          ➕ Upload Material
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.material-item').forEach(el => {
      el.addEventListener('click', () => {
        const sn = parseInt(el.dataset.sem);
        const si = parseInt(el.dataset.si);
        const fi = parseInt(el.dataset.fi);
        showToast('Opening: ' + semData[sn].subjects[si].files[fi].name);
      });
    });
    container.querySelectorAll('[data-upload]').forEach(el => {
      el.addEventListener('click', () => showToast('Upload feature coming soon!'));
    });
  }

  // ===== MATERIALS TABLE =====
  let allMaterials = [];
  let activeFilter = 'all';
  let searchQuery = '';

  function buildMaterialsList() {
    allMaterials = [];
    Object.entries(semData).forEach(([semNum, sem]) => {
      sem.subjects.forEach(sub => {
        sub.files.forEach(f => {
          allMaterials.push({ ...f, sem: sem.name, subject: sub.name });
        });
      });
    });
  }

  function renderMaterials() {
    buildMaterialsList();
    displayMaterials();
  }

  function displayMaterials() {
    let filtered = allMaterials.filter((m, i) => {
      const matchFilter = activeFilter === 'all' || m.type === activeFilter;
      const matchSearch = !searchQuery ||
        m.name.toLowerCase().includes(searchQuery) ||
        m.subject.toLowerCase().includes(searchQuery) ||
        m.sem.toLowerCase().includes(searchQuery);
      return matchFilter && matchSearch;
    });

    const icons = { pdf: '📄', ppt: '📊', doc: '📝' };
    const iconClasses = { pdf: 'pdf-icon', ppt: 'ppt-icon', doc: 'doc-icon' };
    const listEl = document.getElementById('materials-list');

    listEl.innerHTML = filtered.map((m, i) => `
      <div class="table-row" data-idx="${i}">
        <div class="file-name-cell">
          <div class="file-icon-box ${iconClasses[m.type]}">${icons[m.type]}</div>
          ${m.name}
        </div>
        <div class="table-cell">${m.sem}</div>
        <div class="table-cell">${m.subject}</div>
        <div class="table-cell">${m.size}</div>
        <div><button class="download-btn">↓ Save</button></div>
      </div>
    `).join('') || '<div style="padding:32px;text-align:center;color:var(--muted)">No files found</div>';

    // Attach click events safely
    listEl.querySelectorAll('.table-row').forEach((el, i) => {
      el.addEventListener('click', () => showToast('Downloading: ' + filtered[i].name));
    });
  }

  function setFilter(f, btn) {
    activeFilter = f;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    displayMaterials();
  }

  function filterMaterials(val) {
    searchQuery = val.toLowerCase();
    displayMaterials();
  }

  
  // ===== TOAST =====
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = '✅ ' + msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }