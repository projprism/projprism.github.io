// theme toggle and save to local

const html = document.documentElement;
const icon = document.getElementById('toggle-icon');

// apply saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

/**
 * @param {'light'|'dark'} theme
 */

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}