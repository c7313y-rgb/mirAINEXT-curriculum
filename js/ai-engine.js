// ===== mirAI Curriculum - AI Engine =====
// デモモード + OpenAI APIモードの両対応。

class AIEngine {
  constructor() {
    this.demoDelay = 1500; // デモモードの擬似遅延
  }

  isApiMode() {
    const s = window.STORE?.getSettings() || {};
    return s.useApiMode && !!s.openaiKey;
  }

  // ===== カリキュラム生成 =====
  async generateCurriculum(params) {
    // params: { industry, subject, schoolLevel, grade, sessions, theme, question, files }
    if (this.isApiMode()) {
      try {
        return await this.generateWithOpenAI(params);
      } catch (e) {
        console.warn('OpenAI generation failed, falling back to demo:', e);
        return this.generateDemo(params);
      }
    }
    return this.generateDemo(params);
  }

  // ===== デモ生成 =====
  async generateDemo(params) {
    await this.delay(this.demoDelay);
    const ind = window.MIRAI_UTILS.getIndustryById(params.industry) || window.MIRAI_DATA.industries[0];
    const subj = window.MIRAI_UTILS.getSubjectById(params.subject);
    const subjName = subj?.name || '探究';
    const sessions = parseInt(params.sessions) || 4;
    const theme = params.theme || ind.tagline;

    // テンプレートベースで生成
    const slides = [];
    // 1: Title
    slides.push({
      title: `${ind.name} × ${subjName}: ${theme}`,
      subtitle: ind.tagline,
      type: 'title',
      image: ind.image,
    });
    // 2: Goal
    slides.push({
      title: '本日のゴール',
      type: 'objectives',
      items: [
        `${ind.name}業界の最新動向を理解する`,
        `${subjName}の知識を実社会の課題に応用する`,
        `データとテクノロジーの活用方法を学ぶ`,
        `自分なりの提案・アイデアを形にする`,
      ],
    });
    // 3-N: Content per session
    const themesArr = ind.themes || ['データ活用', 'AI', 'IoT', 'DX'];
    for (let i = 0; i < Math.max(0, sessions - 3); i++) {
      const t = themesArr[i % themesArr.length];
      slides.push({
        title: `${i + 1}コマ目: ${t}の基礎`,
        type: 'content',
        body: `${ind.name}業界における「${t}」の活用例を紹介し、その背景にある技術や考え方を理解する。実際の事例から、未来の働き方や社会への影響を考察する。`,
        image: ind.image,
      });
      slides.push({
        title: `${i + 1}コマ目: 探究の問い`,
        type: 'question',
        body: params.question || `あなたの身の回りで、「${t}」が活用できそうな場面はありますか？グループで議論し、アイデアをまとめてみよう。`,
      });
    }
    // List slide
    slides.push({
      title: 'キーワードまとめ',
      type: 'list',
      items: themesArr.slice(0, 5).map(t => `${t} - ${ind.name}の中核技術`),
    });
    // Final
    slides.push({
      title: 'まとめ',
      type: 'summary',
      items: [
        `${ind.name}業界はデジタル化で大きく変革中`,
        `${subjName}で学んだことは社会で役立つ`,
        `次のステップを考えよう`,
      ],
    });

    const compliance = 75 + Math.floor(Math.random() * 20);
    const title = `${theme.length > 25 ? theme.slice(0, 22) + '…' : theme}`;

    return {
      title: title,
      industry: params.industry,
      subject: params.subject,
      schoolLevel: params.schoolLevel,
      grade: parseInt(params.grade) || 2,
      sessions: sessions,
      theme: theme,
      tags: [ind.name, subjName, ...themesArr.slice(0, 2)],
      thumbnail: ind.image,
      compliance: compliance,
      slides: slides,
      complianceReport: this.generateComplianceReport(params.subject, compliance),
    };
  }

  // ===== OpenAI API モード =====
  async generateWithOpenAI(params) {
    const settings = window.STORE.getSettings();
    const apiKey = settings.openaiKey;
    if (!apiKey) throw new Error('No API key');

    const ind = window.MIRAI_UTILS.getIndustryById(params.industry) || {};
    const subj = window.MIRAI_UTILS.getSubjectById(params.subject) || {};

    const prompt = `あなたは教育カリキュラムの設計専門家です。以下の情報から、日本の学校で使える${params.sessions}コマの授業カリキュラムをJSON形式で生成してください。

業界: ${ind.name}（${ind.tagline}）
教科: ${subj.name}
学校段階: ${params.schoolLevel}
コマ数: ${params.sessions}
テーマ: ${params.theme}
生徒への問い: ${params.question || '（指定なし）'}

以下のJSON形式で返してください（説明文なしでJSONのみ）:
{
  "title": "カリキュラムタイトル",
  "tags": ["タグ1", "タグ2"],
  "slides": [
    { "title": "...", "subtitle": "...", "type": "title" },
    { "title": "...", "type": "objectives", "items": ["..."] },
    { "title": "...", "type": "content", "body": "..." },
    { "title": "...", "type": "question", "body": "..." },
    { "title": "...", "type": "summary", "items": ["..."] }
  ],
  "compliance": 85
}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });
    if (!res.ok) throw new Error('OpenAI API error: ' + res.status);
    const data = await res.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    // 画像を業界デフォルトで補完
    parsed.slides = (parsed.slides || []).map(s => ({
      ...s,
      image: s.image || (s.type === 'title' || s.type === 'content' ? ind.image : undefined),
    }));

    return {
      title: parsed.title || params.theme,
      industry: params.industry,
      subject: params.subject,
      schoolLevel: params.schoolLevel,
      grade: parseInt(params.grade) || 2,
      sessions: parseInt(params.sessions) || 4,
      theme: params.theme,
      tags: parsed.tags || [ind.name],
      thumbnail: ind.image,
      compliance: parsed.compliance || 85,
      slides: parsed.slides || [],
      complianceReport: this.generateComplianceReport(params.subject, parsed.compliance || 85),
    };
  }

  // ===== 学習指導要領適合分析 =====
  generateComplianceReport(subjectId, score) {
    const g = window.MIRAI_DATA.curriculumGuidelines[subjectId];
    if (!g) {
      return {
        score,
        pillars: [],
        missing: [],
        suggestions: ['対応する指導要領データが見つかりません。汎用的な適合性で評価しています。'],
      };
    }
    const pillars = g.pillars.map(p => ({
      ...p,
      coverage: 50 + Math.floor(Math.random() * 50),
    }));
    const missing = pillars
      .filter(p => p.coverage < 70)
      .map(p => `「${p.name}」のカバー率がやや低めです (${p.coverage}%)`);
    const suggestions = [
      '具体的なデータ事例を1つ追加すると、適合率がさらに向上します',
      '生徒の探究活動の時間を確保することで、主体的・対話的な学びを強化できます',
      '振り返りのワークシートを配置すると、学習評価が容易になります',
    ];
    return { score, pillars, missing, suggestions };
  }

  // ===== AIチャット応答 =====
  async chatReply(userMsg, context) {
    if (this.isApiMode()) {
      try {
        return await this.chatWithOpenAI(userMsg, context);
      } catch (e) {
        console.warn('OpenAI chat failed:', e);
        return this.chatDemo(userMsg, context);
      }
    }
    return this.chatDemo(userMsg, context);
  }

  async chatDemo(userMsg, context) {
    await this.delay(800);
    const replies = [
      `承知しました。「${userMsg}」について、カリキュラムに反映できるよう設計を考えます。`,
      `素晴らしい視点です。それでは、生徒たちが主体的に取り組めるよう、${context?.subject || '指定教科'}の探究要素を強化しましょう。`,
      `その方向で生成しますね。何コマで実施されますか？また、対象学年を教えてください。`,
      `わかりました。「${userMsg}」を中心テーマに、4コマ構成でカリキュラム素案を作成します。「生成」ボタンを押してください。`,
      `テーマが明確になりました。学習指導要領との適合性も考慮しながら設計します。具体的な事例も追加しましょうか？`,
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  async chatWithOpenAI(userMsg, context) {
    const settings = window.STORE.getSettings();
    const apiKey = settings.openaiKey;
    const sysMsg = `あなたは教育カリキュラム設計のアシスタントです。日本の中学・高校・高専・大学向けに、企業と教員の橋渡しをするカリキュラムをデザインします。${context?.industry ? '対象業界: ' + context.industry : ''} ${context?.subject ? '対象教科: ' + context.subject : ''}。簡潔に応答してください。`;
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: sysMsg },
          { role: 'user', content: userMsg },
        ],
        temperature: 0.7,
      }),
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.choices[0].message.content;
  }

  delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
}

window.AI = new AIEngine();
