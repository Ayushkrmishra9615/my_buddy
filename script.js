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
    errEl.style.display = 'block'; return;
  }
  if (email === VALID_EMAIL && pass === VALID_PASS) {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    errEl.style.display = 'none';
    initDB().then(() => renderMaterials());
  } else {
    errEl.textContent = '⚠️ Invalid email or password. Please try again.';
    errEl.style.display = 'block';
    errEl.style.animation = 'none';
    setTimeout(() => errEl.style.animation = 'shake 0.3s ease', 10);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const passInput = document.getElementById('pass-input');
  if (passInput) passInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  initDB();
});

function doLogout() {
  document.getElementById('main-app').style.display = 'none';
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('email-input').value = '';
  document.getElementById('pass-input').value = '';
  document.getElementById('error-msg').style.display = 'none';
}

// ===== INDEXEDDB =====
let db = null;

function initDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('MyBuddyDB', 2);
    req.onupgradeneeded = e => {
      const database = e.target.result;
      if (!database.objectStoreNames.contains('files')) {
        database.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = e => { db = e.target.result; resolve(db); };
    req.onerror = e => reject(e);
  });
}

function saveFileToDB(fileObj) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', 'readwrite');
    const req = tx.objectStore('files').add(fileObj);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function getFilesForSubject(sem, subject) {
  return new Promise((resolve) => {
    const tx = db.transaction('files', 'readonly');
    const all = [];
    tx.objectStore('files').openCursor().onsuccess = e => {
      const cursor = e.target.result;
      if (cursor) {
        if (cursor.value.sem === String(sem) && cursor.value.subject === subject) all.push(cursor.value);
        cursor.continue();
      } else resolve(all);
    };
  });
}

function getAllFilesFromDB() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', 'readonly');
    const req = tx.objectStore('files').getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function deleteFileFromDB(id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', 'readwrite');
    const req = tx.objectStore('files').delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function getFileFromDB(id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', 'readonly');
    const req = tx.objectStore('files').get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
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

// ===== SEMESTER DATA (from Parul University Booklet) =====
const semData = {
  1: {
    name: 'Semester 1', icon: '🌱',
    timetable: {
      times: ['9:30–10:25', '10:25–11:20', '11:20–12:20', '12:20–1:15', '1:15–2:10', '2:10–2:30', '2:30–3:25', '3:25–4:20'],
      days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      slots: [
        ['PPS','LIBRARY','PPS','POCS','FOC(A)\nPHY(B)\nPOCS(C)','FOC'],
        ['CAL','LIBRARY','CAL','—','FOC(A)\nPHY(B)\nPOCS(C)','CAL'],
        ['RECESS','RECESS','RECESS','RECESS','RECESS','RECESS'],
        ['LIBRARY','LIBRARY','PPS(A)\nPPS(B)\nPPS(C)','LIBRARY','CAL','CAL'],
        ['LIBRARY','LIBRARY','PPS(A)\nPPS(B)\nPPS(C)','LIBRARY','FOC','WD'],
        ['RECESS','RECESS','RECESS','RECESS','RECESS','RECESS'],
        ['WD','LIBRARY','LIBRARY','EEE','WD','FOC(PH)'],
        ['EEE','LIBRARY','LIBRARY','FOC(PH)','PPS','EEE'],
      ]
    },
    subjects: [
      { name: 'Web Designing (WD)', code: '03010501PC01', credits: 4, faculty: 'Mr. Aliasgar Jiwani' },
      { name: 'Calculus (CAL)', code: '03019101BS01', credits: 4, faculty: 'Ms. Khyati Singh / Dr. Mohamad Fareed' },
      { name: 'Fundamental of Computer Science (FOC)', code: '03010501ES03', credits: 3, faculty: 'Pedada Harika' },
      { name: 'Electrical & Electronics Engg (EEE)', code: '03010601ES02', credits: 4, faculty: 'Ravikumar Paliwal' },
      { name: 'Programming for Problem Solving (PPS)', code: '03010501ES01', credits: 4, faculty: 'Ms. Kiran Sharma' },
      { name: 'Principles of Communication Skills (POCS)', code: '03010001HM01', credits: 1, faculty: 'Dr. Dharma Bhatt' },
      { name: 'Physics of Semiconductors (PHY)', code: '03019201BS01', credits: 4, faculty: 'Ms. Sejal Patel' },
      { name: 'Student Induction Program (IKS)', code: '03010001MC01', credits: 0, faculty: 'Various' },
    ]
  },
  2: { name: 'Semester 2', icon: '🔥', timetable: null, subjects: [
    { name: 'Data Structures', code: 'CS201', credits: 4, faculty: '—' },
    { name: 'Engineering Mathematics II', code: 'MA201', credits: 4, faculty: '—' },
    { name: 'Engineering Chemistry', code: 'CH201', credits: 4, faculty: '—' },
    { name: 'Basic Electronics', code: 'EC201', credits: 4, faculty: '—' },
    { name: 'Environmental Science', code: 'ES201', credits: 2, faculty: '—' },
  ]},
  3: { name: 'Semester 3', icon: '⚡', timetable: null, subjects: [
    { name: 'Object Oriented Programming', code: 'CS301', credits: 4, faculty: '—' },
    { name: 'Design & Analysis of Algorithms', code: 'CS302', credits: 4, faculty: '—' },
    { name: 'Digital Electronics', code: 'EC301', credits: 4, faculty: '—' },
    { name: 'Discrete Mathematics', code: 'MA301', credits: 3, faculty: '—' },
    { name: 'Computer Organization', code: 'CS303', credits: 4, faculty: '—' },
  ]},
  4: { name: 'Semester 4', icon: '💡', timetable: null, subjects: [
    { name: 'Operating Systems', code: 'CS401', credits: 4, faculty: '—' },
    { name: 'Database Management Systems', code: 'CS402', credits: 4, faculty: '—' },
    { name: 'Computer Networks', code: 'CS403', credits: 4, faculty: '—' },
    { name: 'Theory of Computation', code: 'CS404', credits: 3, faculty: '—' },
    { name: 'Software Engineering', code: 'CS405', credits: 3, faculty: '—' },
  ]},
  5: { name: 'Semester 5', icon: '🚀', timetable: null, subjects: [
    { name: 'Machine Learning', code: 'CS501', credits: 4, faculty: '—' },
    { name: 'Compiler Design', code: 'CS502', credits: 4, faculty: '—' },
    { name: 'Web Technologies', code: 'CS503', credits: 4, faculty: '—' },
    { name: 'Computer Graphics', code: 'CS504', credits: 3, faculty: '—' },
    { name: 'Elective I', code: 'CS505', credits: 3, faculty: '—' },
  ]},
  6: { name: 'Semester 6', icon: '🎯', timetable: null, subjects: [
    { name: 'Artificial Intelligence', code: 'CS601', credits: 4, faculty: '—' },
    { name: 'Cloud Computing', code: 'CS602', credits: 4, faculty: '—' },
    { name: 'Information Security', code: 'CS603', credits: 3, faculty: '—' },
    { name: 'Mobile Computing', code: 'CS604', credits: 3, faculty: '—' },
    { name: 'Elective II', code: 'CS605', credits: 3, faculty: '—' },
  ]},
  7: { name: 'Semester 7', icon: '🌐', timetable: null, subjects: [
    { name: 'Major Project Phase I', code: 'CS701', credits: 6, faculty: '—' },
    { name: 'Internet of Things', code: 'CS702', credits: 4, faculty: '—' },
    { name: 'Big Data Analytics', code: 'CS703', credits: 4, faculty: '—' },
    { name: 'Elective III', code: 'CS704', credits: 3, faculty: '—' },
    { name: 'Industrial Training', code: 'CS705', credits: 2, faculty: '—' },
  ]},
  8: { name: 'Semester 8', icon: '🏆', timetable: null, subjects: [
    { name: 'Major Project Phase II', code: 'CS801', credits: 8, faculty: '—' },
    { name: 'Entrepreneurship & Management', code: 'CS802', credits: 3, faculty: '—' },
    { name: 'Seminar & Technical Writing', code: 'CS803', credits: 2, faculty: '—' },
    { name: 'Elective IV', code: 'CS804', credits: 3, faculty: '—' },
  ]}
};

// ===== FILE VIEWER MODAL =====
function openViewer(fileData, fileName, fileType) {
  // Remove existing modal
  const old = document.getElementById('file-viewer-modal');
  if (old) old.remove();

  const isImg = fileType && fileType.startsWith('image/');
  const isPdf = fileType && fileType.includes('pdf');

  const modal = document.createElement('div');
  modal.id = 'file-viewer-modal';
  modal.style.cssText = `position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.92);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:16px;`;

  const header = `
    <div style="width:100%;max-width:900px;display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-shrink:0">
      <span style="color:#e8e8f0;font-weight:700;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:70%">${fileName}</span>
      <div style="display:flex;gap:8px">
        <button onclick="document.getElementById('file-viewer-modal').remove()" 
          style="background:rgba(255,101,132,0.15);border:1px solid rgba(255,101,132,0.4);color:#ff6584;padding:6px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">✕ Close</button>
      </div>
    </div>`;

  let content = '';
  if (isPdf) {
    content = `<iframe src="${fileData}" style="width:100%;max-width:900px;flex:1;min-height:0;border:none;border-radius:10px;background:#fff" title="${fileName}"></iframe>`;
  } else if (isImg) {
    content = `<div style="flex:1;min-height:0;display:flex;align-items:center;justify-content:center;width:100%">
      <img src="${fileData}" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:10px;box-shadow:0 0 40px rgba(108,99,255,0.3)" alt="${fileName}">
    </div>`;
  } else {
    content = `<div style="color:#8888a0;text-align:center;padding:40px">Preview not available for this file type.<br>Please download to view.</div>`;
  }

  modal.innerHTML = header + content;
  document.body.appendChild(modal);

  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

async function viewFile(id) {
  if (!db) await initDB();
  const f = await getFileFromDB(id);
  if (!f) return;

  // Remove old modal
  const old = document.getElementById('file-viewer-modal');
  if (old) old.remove();

  const isImg = f.fileType && f.fileType.startsWith('image/');
  const isPdf = f.fileType && f.fileType.includes('pdf');

  // Build blob URL
  let blobUrl = f.data; // fallback to base64
  try {
    const parts = f.data.split(',');
    const byteStr = atob(parts[1] || parts[0]);
    const ab = new ArrayBuffer(byteStr.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteStr.length; i++) ia[i] = byteStr.charCodeAt(i);
    const blob = new Blob([ab], { type: f.fileType || 'application/octet-stream' });
    blobUrl = URL.createObjectURL(blob);
  } catch(e) {}

  const modal = document.createElement('div');
  modal.id = 'file-viewer-modal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.95);display:flex;flex-direction:column;align-items:center;padding:14px;gap:10px;';

  const header = document.createElement('div');
  header.style.cssText = 'width:100%;max-width:960px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;';
  header.innerHTML = `
    <span style="color:#e8e8f0;font-weight:700;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:65%">📄 ${f.name}</span>
    <div style="display:flex;gap:8px">
      <button id="dl-from-viewer" style="background:rgba(67,233,123,0.12);border:1px solid rgba(67,233,123,0.35);color:#43e97b;padding:6px 14px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">⬇ Download</button>
      <button id="close-viewer" style="background:rgba(255,101,132,0.15);border:1px solid rgba(255,101,132,0.4);color:#ff6584;padding:6px 14px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">✕ Close</button>
    </div>`;

  const content = document.createElement('div');
  content.style.cssText = 'width:100%;max-width:960px;flex:1;min-height:0;border-radius:10px;overflow:hidden;';

  if (isPdf) {
    const embed = document.createElement('embed');
    embed.src = blobUrl;
    embed.type = 'application/pdf';
    embed.style.cssText = 'width:100%;height:100%;min-height:75vh;border:none;';
    content.appendChild(embed);
  } else if (isImg) {
    content.style.cssText += 'display:flex;align-items:center;justify-content:center;';
    const img = document.createElement('img');
    img.src = blobUrl;
    img.style.cssText = 'max-width:100%;max-height:75vh;object-fit:contain;border-radius:8px;';
    content.appendChild(img);
  } else {
    content.innerHTML = `<div style="color:#8888a0;text-align:center;padding:60px;font-size:14px">Preview not available.<br><br>Please use Download button.</div>`;
  }

  modal.appendChild(header);
  modal.appendChild(content);
  document.body.appendChild(modal);

  document.getElementById('close-viewer').onclick = () => {
    modal.remove();
    URL.revokeObjectURL(blobUrl);
  };
  document.getElementById('dl-from-viewer').onclick = () => downloadFile(id);
  modal.addEventListener('click', e => { if (e.target === modal) { modal.remove(); URL.revokeObjectURL(blobUrl); } });

  showToast('👁 ' + f.name);
}

// ===== RENDER SEMESTER DETAIL =====
function renderSemDetail(n) {
  const sem = semData[n];
  document.getElementById('sem-detail-title').textContent = sem.icon + '  ' + sem.name;
  const container = document.getElementById('subjects-container');

  // TIMETABLE SECTION (only if data exists)
  let timetableHTML = '';
  if (sem.timetable) {
    const tt = sem.timetable;
    const dayHeaders = tt.days.map(d => `<th>${d}</th>`).join('');
    const rows = tt.times.map((time, ti) => {
      const cells = tt.slots[ti].map(cell => {
        const isRecess = cell === 'RECESS';
        const isLib = cell === 'LIBRARY';
        return `<td style="${isRecess ? 'background:rgba(255,101,132,0.08);color:#ff6584;font-size:11px' : isLib ? 'color:#8888a0;font-size:11px' : 'color:#e8e8f0;font-size:12px'};white-space:pre-line;text-align:center;padding:6px 4px">${cell}</td>`;
      }).join('');
      return `<tr><td style="color:#a78bfa;font-size:11px;padding:6px 8px;white-space:nowrap;font-weight:600">${time}</td>${cells}</tr>`;
    }).join('');

    timetableHTML = `
    <div class="subject-card" style="border:2px solid rgba(67,233,123,0.3);background:linear-gradient(135deg,rgba(67,233,123,0.05),rgba(108,99,255,0.05));margin-bottom:0">
      <div class="subject-name" style="color:#43e97b;font-size:16px;font-weight:700;margin-bottom:12px">
        <div class="dot" style="background:#43e97b"></div>
        🗓 Class Timetable — ${sem.name} (Effective: 04/08/25)
      </div>
      <div style="overflow-x:auto;border-radius:8px">
        <table style="width:100%;border-collapse:collapse;font-family:'DM Sans',sans-serif;min-width:600px">
          <thead>
            <tr style="background:rgba(67,233,123,0.1)">
              <th style="color:#43e97b;padding:8px;font-size:12px;text-align:left">Time</th>
              ${dayHeaders}
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div style="margin-top:10px;font-size:11px;color:#8888a0;line-height:1.8">
        <b style="color:#a78bfa">Subject Codes:</b> &nbsp;
        FOC = Fundamental of Computer Science &nbsp;|&nbsp; CAL = Calculus &nbsp;|&nbsp;
        WD = Web Designing &nbsp;|&nbsp; EEE = Electrical & Electronics &nbsp;|&nbsp;
        PPS = Programming for Problem Solving &nbsp;|&nbsp; POCS = Principles of Communication Skills
      </div>
    </div>`;
  }

  // SUBJECTS TABLE
  const subjectsHTML = `
    <div class="subject-card" style="border:2px solid rgba(108,99,255,0.3)">
      <div class="subject-name" style="color:#6c63ff;font-size:16px;font-weight:700;margin-bottom:12px">
        <div class="dot" style="background:#6c63ff"></div>
        📋 Subjects — ${sem.name}
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="background:rgba(108,99,255,0.1)">
              <th style="color:#a78bfa;padding:8px 10px;text-align:left;font-size:12px">#</th>
              <th style="color:#a78bfa;padding:8px 10px;text-align:left;font-size:12px">Subject</th>
              <th style="color:#a78bfa;padding:8px 10px;text-align:left;font-size:12px">Code</th>
              <th style="color:#a78bfa;padding:8px 10px;text-align:left;font-size:12px">Credits</th>
              <th style="color:#a78bfa;padding:8px 10px;text-align:left;font-size:12px">Faculty</th>
            </tr>
          </thead>
          <tbody>
            ${sem.subjects.map((sub, i) => `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
                <td style="padding:8px 10px;color:#8888a0">${i+1}</td>
                <td style="padding:8px 10px;color:#e8e8f0;font-weight:500">${sub.name}</td>
                <td style="padding:8px 10px;color:#6c63ff;font-size:11px">${sub.code}</td>
                <td style="padding:8px 10px;color:#43e97b;text-align:center">${sub.credits}</td>
                <td style="padding:8px 10px;color:#8888a0;font-size:12px">${sub.faculty}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  // BOOKLET CARD
  const bookletCard = `
    <div class="subject-card" id="booklet-card-${n}" style="border:2px solid rgba(167,139,250,0.4);background:linear-gradient(135deg,rgba(167,139,250,0.08),rgba(118,75,162,0.08))">
      <div class="subject-name" style="color:#a78bfa;font-size:16px;font-weight:700">
        <div class="dot" style="background:#a78bfa"></div>
        📚 Academic Booklet
      </div>
      <div class="materials-list" id="bookletlist-${n}">
        <div style="color:var(--muted);font-size:12px;padding:6px 0;font-style:italic">No booklet uploaded yet</div>
      </div>
      <label class="upload-area" style="cursor:pointer;display:block;border-color:rgba(167,139,250,0.4);color:#a78bfa">
        <input type="file" accept=".pdf" style="display:none" data-sem="${n}" data-type="booklet" data-subname="Academic Booklet">
        📖 Upload Semester Booklet (PDF only)
      </label>
    </div>`;

  // SUBJECT FILE CARDS
  const subjectCardsHTML = sem.subjects.map((sub, si) => `
    <div class="subject-card" id="subcard-${n}-${si}">
      <div class="subject-name">
        <div class="dot"></div>
        ${sub.name}
        <span style="margin-left:auto;font-size:11px;color:#6c63ff;font-weight:400">${sub.code}</span>
      </div>
      <div style="font-size:11px;color:#8888a0;margin:-8px 0 8px 20px">👨‍🏫 ${sub.faculty} &nbsp;|&nbsp; Credits: ${sub.credits}</div>
      <div class="materials-list" id="matlist-${n}-${si}">
        <div style="color:var(--muted);font-size:12px;padding:6px 0;font-style:italic">Loading...</div>
      </div>
      <label class="upload-area" style="cursor:pointer;display:block">
        <input type="file" multiple accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.zip"
          style="display:none" data-sem="${n}" data-si="${si}" data-subname="${sub.name.replace(/"/g,'&quot;')}">
        ➕ Upload Files (PDF, PPT, DOC, IMG — max 10)
      </label>
    </div>`).join('');

  container.innerHTML = timetableHTML + subjectsHTML + bookletCard + subjectCardsHTML;

  // Booklet input
  const bookletInput = container.querySelector('input[data-type="booklet"]');
  if (bookletInput) bookletInput.addEventListener('change', handleBookletUpload);

  // Subject file inputs
  container.querySelectorAll('input[type="file"]:not([data-type])').forEach(input => {
    input.addEventListener('change', handleUpload);
  });

  sem.subjects.forEach((sub, si) => loadSubjectFiles(n, sub.name, si));
  loadBooklet(n);
}

// ===== UPLOAD (max 10 files per subject) =====
async function handleUpload(e) {
  const input = e.target;
  const semNum = input.dataset.sem;
  const si = parseInt(input.dataset.si);
  const subName = input.dataset.subname;
  if (!db) await initDB();

  // Check existing count
  const existing = await getFilesForSubject(semNum, subName);
  const remaining = 10 - existing.length;
  if (remaining <= 0) {
    showToast('❌ Max 10 files allowed per subject!');
    input.value = '';
    return;
  }

  const files = Array.from(input.files).slice(0, remaining);
  if (input.files.length > remaining) {
    showToast(`⚠️ Only ${remaining} more files allowed. Uploading first ${remaining}.`);
  }

  showToast('⏳ Uploading ' + files.length + ' file(s)...');
  for (const file of files) {
    const data = await readFileAsBase64(file);
    await saveFileToDB({
      sem: String(semNum), subject: subName,
      name: file.name, fileType: file.type || getTypeFromName(file.name),
      size: file.size, data: data, uploadedAt: new Date().toISOString()
    });
  }

  showToast('✅ ' + files.length + ' file(s) uploaded!');
  input.value = '';
  await loadSubjectFiles(semNum, subName, si);
  if (currentPage === 'materials') renderMaterials();
}

async function loadSubjectFiles(semNum, subName, si) {
  if (!db) await initDB();
  const files = await getFilesForSubject(semNum, subName);
  const listEl = document.getElementById('matlist-' + semNum + '-' + si);
  if (!listEl) return;

  const count = files.length;
  const countColor = count >= 10 ? '#ff6584' : count >= 7 ? '#f59e0b' : '#43e97b';

  if (files.length === 0) {
    listEl.innerHTML = '<div style="color:var(--muted);font-size:12px;padding:6px 0;font-style:italic">No files yet — upload below (max 10)</div>';
    return;
  }

  listEl.innerHTML = `<div style="font-size:11px;color:${countColor};margin-bottom:6px;font-weight:600">${count}/10 files uploaded</div>` +
    files.map(f => `
    <div class="material-item" data-id="${f.id}">
      <span class="material-icon">${getFileIcon(f.fileType)}</span>
      <span class="material-name">${f.name}</span>
      <span class="material-badge">${formatSize(f.size)}</span>
      ${isViewable(f.fileType) ? `<button class="view-btn" data-id="${f.id}" title="View" style="background:rgba(108,99,255,0.12);border:1px solid rgba(108,99,255,0.35);color:#a78bfa;border-radius:6px;padding:3px 9px;cursor:pointer;font-size:12px;margin-left:4px">👁 View</button>` : ''}
      <button class="dl-btn" data-id="${f.id}" title="Download" style="background:rgba(67,233,123,0.12);border:1px solid rgba(67,233,123,0.3);color:#43e97b;border-radius:6px;padding:3px 9px;cursor:pointer;font-size:12px;margin-left:4px">⬇</button>
      <button class="del-btn" data-id="${f.id}" title="Delete" style="background:rgba(255,101,132,0.1);border:1px solid rgba(255,101,132,0.3);color:#ff6584;border-radius:6px;padding:3px 9px;cursor:pointer;font-size:12px;margin-left:2px">🗑</button>
    </div>`).join('');

  listEl.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); viewFile(parseInt(btn.dataset.id)); });
  });
  listEl.querySelectorAll('.dl-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); downloadFile(parseInt(btn.dataset.id)); });
  });
  listEl.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (!confirm('Delete this file?')) return;
      deleteFileFromDB(parseInt(btn.dataset.id)).then(() => {
        showToast('🗑 File deleted');
        loadSubjectFiles(semNum, subName, si);
        if (currentPage === 'materials') renderMaterials();
      });
    });
  });
}

function isViewable(fileType) {
  if (!fileType) return false;
  return fileType.includes('pdf') || fileType.startsWith('image/');
}

// ===== BOOKLET =====
async function handleBookletUpload(e) {
  const input = e.target;
  const semNum = input.dataset.sem;
  const file = input.files[0];
  if (!file) return;
  if (!file.name.toLowerCase().endsWith('.pdf')) { showToast('❌ Only PDF allowed for booklet!'); return; }
  if (!db) await initDB();

  showToast('⏳ Uploading booklet...');
  const all = await getAllFilesFromDB();
  for (const f of all) {
    if (f.sem === String(semNum) && f.subject === 'Academic Booklet') await deleteFileFromDB(f.id);
  }

  const data = await readFileAsBase64(file);
  await saveFileToDB({
    sem: String(semNum), subject: 'Academic Booklet',
    name: file.name, fileType: 'application/pdf',
    size: file.size, data: data, uploadedAt: new Date().toISOString()
  });

  showToast('✅ Booklet uploaded!');
  input.value = '';
  loadBooklet(semNum);
}

async function loadBooklet(semNum) {
  if (!db) await initDB();
  const all = await getAllFilesFromDB();
  const booklets = all.filter(f => f.sem === String(semNum) && f.subject === 'Academic Booklet');
  const listEl = document.getElementById('bookletlist-' + semNum);
  if (!listEl) return;

  if (booklets.length === 0) {
    listEl.innerHTML = '<div style="color:var(--muted);font-size:12px;padding:6px 0;font-style:italic">No booklet uploaded yet</div>';
    return;
  }

  const b = booklets[0];
  listEl.innerHTML = `
    <div class="material-item" style="background:rgba(167,139,250,0.08)">
      <span class="material-icon">📖</span>
      <span class="material-name" style="color:#a78bfa;font-weight:600">${b.name}</span>
      <span class="material-badge">${formatSize(b.size)}</span>
      <button class="view-btn" data-id="${b.id}" style="background:rgba(167,139,250,0.15);border:1px solid rgba(167,139,250,0.4);color:#a78bfa;border-radius:6px;padding:3px 9px;cursor:pointer;font-size:12px;margin-left:4px">👁 View</button>
      <button class="dl-btn" data-id="${b.id}" style="background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.3);color:#a78bfa;border-radius:6px;padding:3px 9px;cursor:pointer;font-size:12px;margin-left:4px">⬇ Download</button>
      <button class="del-btn" data-id="${b.id}" style="background:rgba(255,101,132,0.1);border:1px solid rgba(255,101,132,0.3);color:#ff6584;border-radius:6px;padding:3px 9px;cursor:pointer;font-size:12px;margin-left:2px">🗑</button>
    </div>`;

  listEl.querySelector('.view-btn').addEventListener('click', () => viewFile(b.id));
  listEl.querySelector('.dl-btn').addEventListener('click', () => downloadFile(b.id));
  listEl.querySelector('.del-btn').addEventListener('click', async () => {
    if (!confirm('Delete booklet?')) return;
    await deleteFileFromDB(b.id);
    showToast('🗑 Booklet deleted');
    loadBooklet(semNum);
  });
}

// ===== DOWNLOAD =====
async function downloadFile(id) {
  if (!db) await initDB();
  const f = await getFileFromDB(id);
  if (!f) return;
  try {
    const parts = f.data.split(',');
    const byteString = atob(parts[1] || parts[0]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    const blob = new Blob([ab], { type: f.fileType || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = f.name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('⬇ Downloading: ' + f.name);
  } catch(err) { showToast('❌ Download failed'); }
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ===== MATERIALS TABLE =====
let activeFilter = 'all';
let searchQuery = '';

async function renderMaterials() {
  if (!db) await initDB();
  const allFiles = await getAllFilesFromDB();

  let filtered = allFiles.filter(m => {
    if (m.subject === 'Academic Booklet') return false; // don't show booklets here
    const ext = getExtFromName(m.name);
    const matchFilter = activeFilter === 'all' ||
      (activeFilter === 'pdf' && ext === 'pdf') ||
      (activeFilter === 'ppt' && (ext === 'ppt' || ext === 'pptx')) ||
      (activeFilter === 'doc' && (ext === 'doc' || ext === 'docx')) ||
      (activeFilter === 'img' && ['jpg','jpeg','png','gif','webp'].includes(ext));
    const matchSearch = !searchQuery ||
      m.name.toLowerCase().includes(searchQuery) ||
      m.subject.toLowerCase().includes(searchQuery) ||
      (semData[m.sem] && semData[m.sem].name.toLowerCase().includes(searchQuery));
    return matchFilter && matchSearch;
  });

  const listEl = document.getElementById('materials-list');
  if (!listEl) return;

  if (filtered.length === 0) {
    listEl.innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted)">📂 No files found. Go to Semesters and upload!</div>';
    return;
  }

  listEl.innerHTML = filtered.map((m, i) => `
    <div class="table-row">
      <div class="file-name-cell">
        <div class="file-icon-box ${getIconClass(m.name)}">${getFileIcon(m.fileType)}</div>
        ${m.name}
      </div>
      <div class="table-cell">${semData[m.sem] ? semData[m.sem].name : 'Sem ' + m.sem}</div>
      <div class="table-cell" style="font-size:12px">${m.subject}</div>
      <div class="table-cell">${formatSize(m.size)}</div>
      <div style="display:flex;gap:6px;align-items:center">
        ${isViewable(m.fileType) ? `<button class="view-mat-btn download-btn" data-id="${m.id}" style="background:rgba(108,99,255,0.15);border-color:rgba(108,99,255,0.4);color:#a78bfa">👁 View</button>` : ''}
        <button class="dl-mat-btn download-btn" data-id="${m.id}">⬇ Save</button>
      </div>
    </div>`).join('');

  listEl.querySelectorAll('.view-mat-btn').forEach(btn => {
    btn.addEventListener('click', () => viewFile(parseInt(btn.dataset.id)));
  });
  listEl.querySelectorAll('.dl-mat-btn').forEach(btn => {
    btn.addEventListener('click', () => downloadFile(parseInt(btn.dataset.id)));
  });
}

function setFilter(f, btn) {
  activeFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMaterials();
}

function filterMaterials(val) {
  searchQuery = val.toLowerCase();
  renderMaterials();
}

// ===== HELPERS =====
function getFileIcon(type) {
  if (!type) return '📎';
  if (type.includes('pdf')) return '📄';
  if (type.includes('presentation') || type.includes('powerpoint') || type.includes('ppt')) return '📊';
  if (type.includes('word') || type.includes('document') || type.includes('doc')) return '📝';
  if (type.startsWith('image/')) return '🖼';
  if (type.includes('zip') || type.includes('rar')) return '📦';
  return '📎';
}

function getExtFromName(name) { return (name || '').split('.').pop().toLowerCase(); }

function getTypeFromName(name) {
  const ext = getExtFromName(name);
  const map = { pdf:'application/pdf', ppt:'application/vnd.ms-powerpoint', pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation', doc:'application/msword', docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document', jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', gif:'image/gif' };
  return map[ext] || 'application/octet-stream';
}

function getIconClass(name) {
  const ext = getExtFromName(name);
  if (ext === 'pdf') return 'pdf-icon';
  if (ext === 'ppt' || ext === 'pptx') return 'ppt-icon';
  if (['jpg','jpeg','png','gif'].includes(ext)) return 'ppt-icon';
  return 'doc-icon';
}

function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}