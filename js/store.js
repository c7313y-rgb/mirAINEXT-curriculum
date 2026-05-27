// ===== mirAI Curriculum - LocalStorage Store =====
// シングルトンのデータストア。localStorageを抽象化。

const STORE_KEY = 'mirai_curriculum_v1';

class Store {
  constructor() {
    this.data = this.load();
  }

  // ===== Load / Save =====
  load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to load store:', e);
    }
    return this.getDefaultState();
  }

  save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save store:', e);
    }
  }

  getDefaultState() {
    // 初回ロード時にサンプルカリキュラムをプリロード
    const samples = window.MIRAI_DATA ? window.MIRAI_DATA.sampleCurricula : [];
    return {
      session: { role: null, userId: null, loggedInAt: null },
      curricula: [...samples],
      settings: {
        openaiKey: '',
        useApiMode: false,
      },
      evaluations: [], // { curriculumId, classId, studentId, scores: {...}, comment, date }
      drafts: [],
    };
  }

  reset() {
    this.data = this.getDefaultState();
    this.save();
  }

  // ===== Session =====
  login(role, userId) {
    this.data.session = { role, userId, loggedInAt: new Date().toISOString() };
    this.save();
  }
  logout() {
    this.data.session = { role: null, userId: null, loggedInAt: null };
    this.save();
  }
  isLoggedIn() {
    return !!this.data.session.role;
  }
  getRole() {
    return this.data.session.role;
  }
  requireLogin(redirectRole) {
    if (!this.isLoggedIn()) {
      window.location.href = `login.html?role=${redirectRole || 'company'}`;
      return false;
    }
    return true;
  }

  // ===== Settings =====
  getSettings() {
    return this.data.settings;
  }
  setSettings(patch) {
    Object.assign(this.data.settings, patch);
    this.save();
  }

  // ===== Curricula =====
  getCurricula(filter = {}) {
    let result = [...this.data.curricula];
    if (filter.publicOnly) result = result.filter(c => c.isPublic);
    if (filter.subject) result = result.filter(c => c.subject === filter.subject);
    if (filter.schoolLevel) result = result.filter(c => c.schoolLevel === filter.schoolLevel);
    if (filter.industry) result = result.filter(c => c.industry === filter.industry);
    if (filter.q) {
      const q = filter.q.toLowerCase();
      result = result.filter(c =>
        (c.title || '').toLowerCase().includes(q) ||
        (c.theme || '').toLowerCase().includes(q) ||
        (c.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }

  getCurriculum(id) {
    return this.data.curricula.find(c => c.id === id);
  }

  addCurriculum(curr) {
    if (!curr.id) curr.id = 'curr-' + Date.now();
    if (!curr.createdAt) curr.createdAt = new Date().toISOString().split('T')[0];
    if (!curr.stats) curr.stats = { views: 0, downloads: 0, likes: 0 };
    this.data.curricula.unshift(curr);
    this.save();
    return curr;
  }

  updateCurriculum(id, patch) {
    const idx = this.data.curricula.findIndex(c => c.id === id);
    if (idx >= 0) {
      this.data.curricula[idx] = { ...this.data.curricula[idx], ...patch };
      this.save();
      return this.data.curricula[idx];
    }
    return null;
  }

  deleteCurriculum(id) {
    this.data.curricula = this.data.curricula.filter(c => c.id !== id);
    this.save();
  }

  // ===== Drafts =====
  saveDraft(draft) {
    if (!draft.id) draft.id = 'draft-' + Date.now();
    const idx = this.data.drafts.findIndex(d => d.id === draft.id);
    if (idx >= 0) {
      this.data.drafts[idx] = draft;
    } else {
      this.data.drafts.unshift(draft);
    }
    this.save();
    return draft;
  }
  getDraft(id) {
    return this.data.drafts.find(d => d.id === id);
  }

  // ===== Evaluations =====
  addEvaluation(evaluation) {
    evaluation.id = 'eval-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    evaluation.createdAt = new Date().toISOString();
    this.data.evaluations.push(evaluation);
    this.save();
    return evaluation;
  }
  getEvaluations(curriculumId) {
    if (curriculumId) {
      return this.data.evaluations.filter(e => e.curriculumId === curriculumId);
    }
    return this.data.evaluations;
  }
}

window.STORE = new Store();
