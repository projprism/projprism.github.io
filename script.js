const html = document.documentElement;
const icon = document.getElementById('toggle-icon');

// apply saved theme on page load
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

/**
 * apply the theme
 * @param {'light'|'dark'} theme
 */
function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', theme);
}

/**
 * toggle light/dark
 */
function toggleTheme() {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}