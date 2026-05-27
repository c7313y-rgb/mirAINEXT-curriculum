// ===== mirAI Curriculum - Slide Renderer & Export =====

window.SLIDE_RENDERER = {
  /**
   * スライドをHTMLに変換
   */
  renderSlide(slide, opts = {}) {
    const editable = opts.editable;
    const e = (v) => MIRAI_UTILS.escape(v || '');
    const editableAttr = editable ? 'contenteditable="true"' : '';

    switch (slide.type) {
      case 'title':
        return `
          <div class="absolute inset-0 slide-bg-template-1 flex">
            <div class="flex-1 p-12 flex flex-col justify-center">
              <div class="text-xs font-bold tracking-widest opacity-80 mb-3" ${editableAttr} data-field="tagline">mirAI Curriculum</div>
              <h1 class="text-5xl font-black leading-tight" ${editableAttr} data-field="title">${e(slide.title)}</h1>
              ${slide.subtitle ? `<p class="mt-4 text-xl opacity-90" ${editableAttr} data-field="subtitle">${e(slide.subtitle)}</p>` : ''}
            </div>
            ${slide.image ? `<div class="w-2/5 relative">
              <img src="${e(slide.image)}" class="absolute inset-0 w-full h-full object-cover opacity-90" onerror="this.style.display='none'" />
              <div class="absolute inset-0 bg-gradient-to-r from-brand-700 to-transparent" style="background:linear-gradient(to right, rgba(31,71,229,1) 0%, transparent 30%);"></div>
            </div>` : ''}
          </div>`;

      case 'objectives':
        return `
          <div class="absolute inset-0 slide-bg-template-2 p-12 flex flex-col">
            <div class="text-xs font-bold tracking-widest text-brand-600 uppercase mb-2">本日のゴール</div>
            <h2 class="text-3xl font-black text-slate-900 mb-8" ${editableAttr} data-field="title">${e(slide.title)}</h2>
            <div class="grid grid-cols-2 gap-4 flex-1">
              ${(slide.items || []).map((item, i) => `
                <div class="bg-white rounded-xl p-5 shadow-sm border border-brand-100 flex items-start gap-3">
                  <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white font-bold flex items-center justify-center flex-shrink-0">${i + 1}</div>
                  <div class="text-base text-slate-700 leading-relaxed pt-1" ${editableAttr} data-field="items.${i}">${e(item)}</div>
                </div>`).join('')}
            </div>
          </div>`;

      case 'content':
        return `
          <div class="absolute inset-0 slide-bg-template-2 flex">
            <div class="flex-1 p-12 flex flex-col justify-center">
              <h2 class="text-3xl font-black text-brand-800 mb-5" ${editableAttr} data-field="title">${e(slide.title)}</h2>
              <p class="text-lg text-slate-700 leading-relaxed" ${editableAttr} data-field="body">${e(slide.body)}</p>
            </div>
            ${slide.image ? `<div class="w-2/5 relative">
              <img src="${e(slide.image)}" class="absolute inset-0 w-full h-full object-cover" onerror="this.style.display='none'" />
            </div>` : ''}
          </div>`;

      case 'list':
        return `
          <div class="absolute inset-0 slide-bg-template-3 p-12 flex flex-col">
            <h2 class="text-3xl font-black text-brand-800 mb-6" ${editableAttr} data-field="title">${e(slide.title)}</h2>
            <div class="space-y-3 flex-1">
              ${(slide.items || []).map((item, i) => `
                <div class="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <div class="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold text-sm flex items-center justify-center flex-shrink-0">${i + 1}</div>
                  <div class="text-base text-slate-700 leading-relaxed pt-0.5" ${editableAttr} data-field="items.${i}">${e(item)}</div>
                </div>`).join('')}
            </div>
          </div>`;

      case 'question':
        return `
          <div class="absolute inset-0 slide-bg-template-4 p-12 flex flex-col justify-center">
            <div class="absolute inset-0 bg-grid-pattern-dark opacity-20"></div>
            <div class="absolute top-12 right-12 text-9xl opacity-10">?</div>
            <div class="relative">
              <div class="text-xs font-bold tracking-widest text-brand-300 uppercase mb-3">💭 Discussion</div>
              <h2 class="text-3xl font-black mb-6" ${editableAttr} data-field="title">${e(slide.title)}</h2>
              <div class="bg-white/10 backdrop-blur rounded-2xl p-7 border border-white/20 max-w-3xl">
                <p class="text-xl leading-relaxed" ${editableAttr} data-field="body">${e(slide.body)}</p>
              </div>
            </div>
          </div>`;

      case 'summary':
        return `
          <div class="absolute inset-0 p-12 flex flex-col" style="background: linear-gradient(135deg, #eef5ff 0%, #f5f3ff 100%);">
            <div class="text-xs font-bold tracking-widest text-brand-600 uppercase mb-2">SUMMARY</div>
            <h2 class="text-3xl font-black text-slate-900 mb-8" ${editableAttr} data-field="title">${e(slide.title)}</h2>
            <div class="space-y-3 flex-1">
              ${(slide.items || []).map((item, i) => `
                <div class="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                  <div class="text-2xl flex-shrink-0">${['✨','🎯','🚀','💡','📚'][i % 5]}</div>
                  <div class="text-base text-slate-700 leading-relaxed pt-1" ${editableAttr} data-field="items.${i}">${e(item)}</div>
                </div>`).join('')}
            </div>
            <div class="mt-6 text-right text-xs text-slate-400">mirAI Curriculum</div>
          </div>`;

      default:
        return `
          <div class="absolute inset-0 p-12 bg-white">
            <h2 class="text-3xl font-black mb-4" ${editableAttr} data-field="title">${e(slide.title || 'スライド')}</h2>
            <p class="text-base text-slate-700" ${editableAttr} data-field="body">${e(slide.body || '')}</p>
          </div>`;
    }
  },

  /**
   * Thumbnail (mini view)
   */
  renderThumbnail(slide, index) {
    const e = (v) => MIRAI_UTILS.escape(v || '');
    const colors = {
      title: 'from-brand-500 to-brand-700 text-white',
      objectives: 'from-brand-50 to-white text-slate-900',
      content: 'from-white to-brand-50 text-slate-900',
      list: 'bg-white text-slate-900 border-l-4 border-brand-500',
      question: 'from-slate-900 to-slate-700 text-white',
      summary: 'from-brand-50 to-accent-500/10 text-slate-900',
    };
    const bgCls = colors[slide.type] || 'bg-white';
    return `
      <div class="bg-gradient-to-br ${bgCls} h-full p-2 flex flex-col">
        <div class="text-[7px] opacity-60 font-bold uppercase">${slide.type}</div>
        <div class="text-[9px] font-bold leading-tight mt-0.5 line-clamp-2">${e(slide.title)}</div>
      </div>`;
  },

  /**
   * PPTX export (basic - uses pptxgenjs if available, else generates downloadable PDF-like data URI)
   */
  async exportPPTX(curriculum) {
    if (typeof PptxGenJS === 'undefined') {
      toast('PPTX出力ライブラリを読み込み中...', 'info');
      await this.loadScript('https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js');
    }
    const pres = new PptxGenJS();
    pres.layout = 'LAYOUT_WIDE';
    pres.title = curriculum.title;
    pres.author = 'mirAI Curriculum';

    const ind = MIRAI_UTILS.getIndustryById(curriculum.industry);
    const indColor = ind?.colorHex?.replace('#', '') || '3366ff';

    (curriculum.slides || []).forEach((s, i) => {
      const slide = pres.addSlide();
      if (s.type === 'title') {
        slide.background = { color: '1F47E5' };
        slide.addText(s.title, { x: 0.5, y: 2, w: 12, h: 1.5, fontSize: 44, color: 'FFFFFF', bold: true, fontFace: 'Yu Gothic UI' });
        if (s.subtitle) slide.addText(s.subtitle, { x: 0.5, y: 3.6, w: 12, h: 0.8, fontSize: 22, color: 'FFFFFFCC', fontFace: 'Yu Gothic UI' });
        slide.addText('mirAI Curriculum', { x: 0.5, y: 6.5, w: 5, h: 0.4, fontSize: 11, color: 'FFFFFF88', fontFace: 'Yu Gothic UI' });
      } else if (s.type === 'question') {
        slide.background = { color: '0F172A' };
        slide.addText('💭 Discussion', { x: 0.5, y: 0.5, w: 5, h: 0.4, fontSize: 14, color: '93C5FD', bold: true, fontFace: 'Yu Gothic UI' });
        slide.addText(s.title, { x: 0.5, y: 1.1, w: 12, h: 1, fontSize: 32, color: 'FFFFFF', bold: true, fontFace: 'Yu Gothic UI' });
        slide.addText(s.body || '', { x: 0.5, y: 2.5, w: 12, h: 3, fontSize: 20, color: 'F1F5F9', fontFace: 'Yu Gothic UI', valign: 'top' });
      } else {
        slide.background = { color: 'F8FAFC' };
        slide.addText(s.title || '', { x: 0.5, y: 0.5, w: 12, h: 0.8, fontSize: 28, color: '1C339C', bold: true, fontFace: 'Yu Gothic UI' });
        if (s.body) slide.addText(s.body, { x: 0.5, y: 1.6, w: 8, h: 5, fontSize: 16, color: '334155', fontFace: 'Yu Gothic UI', valign: 'top' });
        if (s.items && s.items.length) {
          s.items.forEach((item, idx) => {
            slide.addText(`${idx + 1}. ${item}`, { x: 0.7, y: 1.6 + idx * 0.6, w: 11, h: 0.5, fontSize: 16, color: '334155', fontFace: 'Yu Gothic UI' });
          });
        }
        // Footer
        slide.addText(`${i + 1} / ${curriculum.slides.length}`, { x: 11, y: 6.8, w: 2, h: 0.3, fontSize: 10, color: '94A3B8', align: 'right', fontFace: 'Yu Gothic UI' });
      }
    });

    await pres.writeFile({ fileName: `${curriculum.title}.pptx` });
    toast('PPTXファイルをダウンロードしました', 'success');
  },

  /**
   * Print as PDF (browser print)
   */
  exportPDF(curriculum) {
    const w = window.open('', '_blank');
    w.document.write(`
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${curriculum.title}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap" rel="stylesheet">
<style>
  body { font-family: 'Noto Sans JP', sans-serif; margin: 0; background: #f1f5f9; }
  .slide { width: 1280px; height: 720px; margin: 0 auto 20px; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.1); position: relative; overflow: hidden; page-break-after: always; }
  .s-title { background: linear-gradient(135deg, #3366ff, #7c3aed); color: white; padding: 80px; display:flex; flex-direction:column; justify-content:center; }
  .s-title h1 { font-size: 56px; font-weight: 900; margin: 0; }
  .s-title p { font-size: 24px; opacity: 0.9; margin: 20px 0 0; }
  .s-content { padding: 60px; background: linear-gradient(135deg, #fff, #eef5ff); height: 100%; box-sizing: border-box; }
  .s-content h2 { font-size: 36px; font-weight: 900; color: #1c339c; margin: 0 0 30px; }
  .s-content p { font-size: 20px; line-height: 1.7; color: #334155; }
  .s-content ul { font-size: 18px; line-height: 1.9; color: #334155; padding-left: 30px; }
  .s-question { background: #0f172a; color: white; padding: 80px; }
  .s-question .label { font-size: 14px; color: #93c5fd; font-weight: 700; letter-spacing: 2px; margin-bottom: 10px; }
  .s-question h2 { font-size: 40px; font-weight: 900; margin: 0 0 30px; }
  .s-question .box { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; padding: 40px; font-size: 22px; line-height: 1.6; }
  @media print { body { background: white; } .slide { box-shadow: none; margin: 0; } }
</style></head><body>`);

    (curriculum.slides || []).forEach(s => {
      if (s.type === 'title') {
        w.document.write(`<div class="slide s-title"><h1>${MIRAI_UTILS.escape(s.title)}</h1>${s.subtitle ? `<p>${MIRAI_UTILS.escape(s.subtitle)}</p>` : ''}</div>`);
      } else if (s.type === 'question') {
        w.document.write(`<div class="slide s-question"><div class="label">💭 DISCUSSION</div><h2>${MIRAI_UTILS.escape(s.title)}</h2><div class="box">${MIRAI_UTILS.escape(s.body || '')}</div></div>`);
      } else {
        const list = (s.items || []).map(i => `<li>${MIRAI_UTILS.escape(i)}</li>`).join('');
        w.document.write(`<div class="slide s-content"><h2>${MIRAI_UTILS.escape(s.title)}</h2>${s.body ? `<p>${MIRAI_UTILS.escape(s.body)}</p>` : ''}${list ? `<ul>${list}</ul>` : ''}</div>`);
      }
    });
    w.document.write('<script>setTimeout(()=>window.print(), 500);<\/script></body></html>');
    w.document.close();
  },

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  },
};
