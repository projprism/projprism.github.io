// Build a folder tree from the flat FILES list
function buildTree(files) {
  const root = { name: "Resources", type: "folder", children: [] };

  files.forEach(filePath => {
    const parts = filePath.split("/");
    let node = root;

    parts.forEach((part, i) => {
      const isFile = i === parts.length - 1;

      if (isFile) {
        // Strip .pdf extension for display name
        const displayName = part.replace(/\.pdf$/i, "");
        node.children.push({
          name: displayName,
          type: "file",
          path: "Resources/" + filePath
        });
      } else {
        // Find or create the subfolder
        let folder = node.children.find(c => c.type === "folder" && c.name === part);
        if (!folder) {
          folder = { name: part, type: "folder", children: [] };
          node.children.push(folder);
        }
        node = folder;
      }
    });
  });

  return root;
}

const FILE_TREE = buildTree(FILES);

// Navigation stack (breadcrumb trail)
let navStack = [];

// ── Open modal ───────────────────────────────
function openBrowser() {
  navStack = [FILE_TREE];
  renderBrowser();
  document.getElementById('browser-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ── Close modal ──────────────────────────────
function closeBrowser() {
  document.getElementById('browser-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('browser-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeBrowser();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeBrowser();
});

// ── Navigation ───────────────────────────────
function enterFolder(node) {
  navStack.push(node);
  renderBrowser();
}

function goBack() {
  if (navStack.length > 1) {
    navStack.pop();
    renderBrowser();
  }
}

function goToBreadcrumb(index) {
  navStack = navStack.slice(0, index + 1);
  renderBrowser();
}

function openFile(path) {
  window.open(path, '_blank');
}

// ── Render ───────────────────────────────────
function renderBrowser() {
  const current = navStack[navStack.length - 1];

  // Breadcrumbs
  const breadcrumbEl = document.getElementById('browser-breadcrumb');
  breadcrumbEl.innerHTML = navStack.map((node, i) => {
    const isLast = i === navStack.length - 1;
    return isLast
      ? `<span class="crumb crumb-current">${node.name}</span>`
      : `<span class="crumb crumb-link" onclick="goToBreadcrumb(${i})">${node.name}</span>
         <span class="crumb-sep">›</span>`;
  }).join('');

  // Back button
  document.getElementById('browser-back').style.display =
    navStack.length > 1 ? 'flex' : 'none';

  // List
  const listEl = document.getElementById('browser-list');
  listEl.innerHTML = '';

  if (!current.children || current.children.length === 0) {
    listEl.innerHTML = '<div class="browser-empty">This folder is empty.</div>';
    return;
  }

  // Folders first, then files, both alphabetical
  const sorted = [...current.children].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'folder' ? -1 : 1;
  });

  sorted.forEach((node, i) => {
    const item = document.createElement('div');
    item.className = 'browser-item';
    item.style.animationDelay = `${i * 0.04}s`;

    if (node.type === 'folder') {
      const count = node.children.length;
      item.innerHTML = `
        <div class="browser-item-icon folder-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div class="browser-item-name">${node.name}</div>
        <div class="browser-item-meta">${count} item${count !== 1 ? 's' : ''}</div>
        <div class="browser-item-arrow">›</div>
      `;
      item.onclick = () => enterFolder(node);
    } else {
      item.innerHTML = `
        <div class="browser-item-icon file-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="17" x2="13" y2="17"/>
          </svg>
        </div>
        <div class="browser-item-name">${node.name}</div>
        <div class="browser-item-meta">PDF</div>
        <div class="browser-item-arrow">↗</div>
      `;
      item.onclick = () => openFile(node.path);
    }

    listEl.appendChild(item);
  });
}