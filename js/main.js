// ===== mirAI Curriculum - Common Utilities =====

// Toast notification
window.toast = function (message, type = 'info') {
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = message;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.transition = 'all 0.3s';
    t.style.opacity = '0';
    t.style.transform = 'translateX(120%)';
    setTimeout(() => t.remove(), 300);
  }, 3000);
};

// URL query helpers
window.getQuery = function (key) {
  return new URLSearchParams(window.location.search).get(key);
};

// Format date
window.formatDate = function (iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
};

// Smooth scroll for anchor links
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (a) {
    const href = a.getAttribute('href');
    if (href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
});

// Helpers exposed globally
window.MIRAI_UTILS = {
  getIndustryById(id) {
    return (window.MIRAI_DATA?.industries || []).find(i => i.id === id);
  },
  getSubjectById(id) {
    return (window.MIRAI_DATA?.subjects || []).find(s => s.id === id);
  },
  getSchoolLevelById(id) {
    return (window.MIRAI_DATA?.schoolLevels || []).find(l => l.id === id);
  },
  truncate(str, n = 50) {
    if (!str) return '';
    return str.length > n ? str.slice(0, n) + '…' : str;
  },
  escape(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },
};
