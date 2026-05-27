// ===== mirAI Curriculum - Shared Layout (Vibrant Edition) =====

window.MIRAI_LAYOUT = {
  render(opts) {
    if (!window.STORE.isLoggedIn() || window.STORE.getRole() !== opts.role) {
      window.location.href = `login.html?role=${opts.role}`;
      return;
    }

    const session = window.STORE.data.session;

    const navItems = opts.role === 'company' ? [
      { key: 'home', label: 'ダッシュボード', icon: '🏠', href: 'company-dashboard.html' },
      { key: 'create', label: 'カリキュラム作成', icon: '✨', href: 'industry-select.html' },
      { key: 'library', label: 'マイライブラリ', icon: '📚', href: 'company-library.html' },
      { key: 'feedback', label: 'フィードバック', icon: '📊', href: 'company-feedback.html' },
      { key: 'settings', label: '設定', icon: '⚙️', href: 'settings.html' },
    ] : [
      { key: 'home', label: 'ダッシュボード', icon: '🏠', href: 'teacher-dashboard.html' },
      { key: 'library', label: 'ライブラリ検索', icon: '🔍', href: 'library.html' },
      { key: 'my', label: 'マイカリキュラム', icon: '📂', href: 'teacher-my.html' },
      { key: 'dashboard', label: '評価ダッシュボード', icon: '📊', href: 'evaluation-dashboard.html' },
      { key: 'settings', label: '設定', icon: '⚙️', href: 'settings.html' },
    ];

    const brand = opts.role === 'company'
      ? { gradient: 'from-cyan-500 via-violet-600 to-pink-500', label: '企業ポータル', emoji: '🏢', shadow: 'shadow-violet-500/40' }
      : { gradient: 'from-violet-500 via-pink-500 to-coral-500', label: '教員ポータル', emoji: '🎓', shadow: 'shadow-pink-500/40' };

    const html = `
<!-- Sidebar -->
<aside class="fixed top-0 left-0 bottom-0 w-64 glass border-r border-violet-100/50 flex flex-col z-40">
  <div class="p-5 border-b border-violet-100/50">
    <a href="../index.html" class="flex items-center gap-2.5 group">
      <div class="w-10 h-10 rounded-2xl bg-gradient-to-br ${brand.gradient} flex items-center justify-center text-white font-black text-xl shadow-lg ${brand.shadow} group-hover:scale-110 transition">m</div>
      <div class="flex flex-col leading-none">
        <span class="font-black text-slate-900 text-base">mirAI <span class="gradient-text">Curriculum</span></span>
        <span class="text-[10px] text-slate-500 tracking-wider font-bold mt-1">${brand.emoji} ${brand.label}</span>
      </div>
    </a>
  </div>
  <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
    ${navItems.map(item => {
      const active = item.key === opts.activeKey;
      if (active) {
        return `<a href="${item.href}" class="sidebar-item-active flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold">
          <span class="text-lg">${item.icon}</span>
          <span>${item.label}</span>
        </a>`;
      }
      return `<a href="${item.href}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition">
        <span class="text-lg">${item.icon}</span>
        <span>${item.label}</span>
      </a>`;
    }).join('')}
  </nav>
  <div class="p-3 border-t border-violet-100/50">
    <div class="flex items-center gap-3 p-2 rounded-xl hover:bg-violet-50 transition">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br ${brand.gradient} flex items-center justify-center text-white text-sm font-black shadow-lg ${brand.shadow}">${(session.userId || 'U')[0]}</div>
      <div class="flex-1 min-w-0">
        <div class="text-xs font-black text-slate-900 truncate">${session.userId || 'ユーザー'}</div>
        <div class="text-[10px] text-slate-500 font-bold">${opts.role === 'company' ? '企業アカウント' : '教員アカウント'}</div>
      </div>
      <button onclick="MIRAI_LAYOUT.logout()" title="ログアウト" class="text-slate-400 hover:text-pink-500 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
      </button>
    </div>
  </div>
</aside>

<!-- Topbar -->
<header class="fixed top-0 left-64 right-0 h-16 glass border-b border-violet-100/50 z-30 flex items-center justify-between px-6">
  <div>
    <h1 class="font-black text-slate-900 text-lg leading-tight">${opts.title || ''}</h1>
    ${opts.subtitle ? `<p class="text-xs text-slate-500 mt-0.5 font-semibold">${opts.subtitle}</p>` : ''}
  </div>
  <div class="flex items-center gap-3">
    <button title="通知" class="w-10 h-10 rounded-xl hover:bg-violet-50 flex items-center justify-center text-slate-600 relative transition">
      🔔<span class="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
    </button>
    <a href="settings.html" title="設定" class="w-10 h-10 rounded-xl hover:bg-violet-50 flex items-center justify-center text-slate-600 transition">⚙️</a>
  </div>
</header>
`;

    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    while (wrap.firstChild) {
      document.body.insertBefore(wrap.firstChild, document.body.firstChild);
    }
    document.body.classList.add('with-sidebar');
  },

  logout() {
    if (confirm('ログアウトしますか？')) {
      window.STORE.logout();
      window.location.href = '../index.html';
    }
  },
};

const layoutStyle = document.createElement('style');
layoutStyle.textContent = `
  body.with-sidebar { padding-left: 16rem; padding-top: 4rem; }
  @media (max-width: 768px) {
    body.with-sidebar { padding-left: 0; }
  }
`;
document.head.appendChild(layoutStyle);
