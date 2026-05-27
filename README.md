# 🎓 mirAI Curriculum

> **企業の知見を、未来の授業へ。**
> AIが企業の技術・サービスを学習指導要領準拠のカリキュラムへ自動変換するプラットフォーム。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](#)
[![No Backend](https://img.shields.io/badge/Backend-None-success)](#)

## 🌟 概要

**mirAI Curriculum** は、[mirAI-NEXT](https://c7313y-rgb.github.io/mirAI-NEXT/) の「カリキュラムサポート生成」機能に特化した、企業と教員が共創するカリキュラム共創プラットフォームです。

- **企業側** は自社の技術・製品データをアップロードし、AIにカリキュラム素案を生成させ、学習指導要領との適合性を確認しながらライブラリに公開できます。
- **教員側** は公開されたカリキュラムを検索・カスタマイズし、自分の授業向けに最適化、PPTX/PDFで出力して実授業に活用できます。
- 授業後の **ルーブリック評価データ** は統計分析され、企業側にもフィードバックされる共創サイクルを実現します。

## ✨ 主な機能

### 🏢 企業側機能
- 業種選択（10種の業界カテゴリ）
- 資料アップロード（PDF/Word/画像/テキスト）
- AIチャットで授業設計（教科・コマ数・テーマ・問い）
- スライド形式のカリキュラム素案を自動生成
- インラインスライド編集
- **学習指導要領 適合分析**（観点別カバレッジ・改善提案）
- ライブラリ公開／非公開選択
- フィードバック分析ダッシュボード

### 🎓 教員側機能
- カリキュラム検索（テーマ・教科・学年・業界・コマ数）
- カスタマイズ（コマ数・対象学年・学校段階）
- スライド編集・プレビュー・PPTX/PDF出力
- ルーブリック評価入力
- 統計ダッシュボード（観点別評価・カリキュラム別比較）

## 🚀 ライブデモ

GitHub Pages にデプロイすれば、すぐに利用可能です。

| ロール | 発行ID | 用途 |
|:--|:--|:--|
| 企業 | `COMP-DEMO` | 企業側機能を試す |
| 教員 | `TEACH-DEMO` | 教員側機能を試す |

## 📁 プロジェクト構造

```
mirai-curriculum/
├── index.html              # ランディングページ
├── README.md
├── LICENSE
├── css/
│   └── styles.css          # カスタムスタイル
├── js/
│   ├── data.js             # マスターデータ（業界・教科・サンプルカリキュラム）
│   ├── store.js            # localStorageベースのデータストア
│   ├── ai-engine.js        # AI生成エンジン（デモ/API両対応）
│   ├── slide-renderer.js   # スライドレンダリング・PPTX/PDF出力
│   ├── layout.js           # 共通レイアウト（サイドバー・ヘッダー）
│   └── main.js             # 共通ユーティリティ
├── pages/
│   ├── login.html
│   ├── company-dashboard.html
│   ├── industry-select.html
│   ├── curriculum-create.html
│   ├── slide-editor.html
│   ├── company-library.html
│   ├── company-feedback.html
│   ├── teacher-dashboard.html
│   ├── library.html
│   ├── curriculum-customize.html
│   ├── teacher-my.html
│   ├── evaluation-dashboard.html
│   └── settings.html
└── assets/                 # アイコン・画像等（オプション）
```

## 🛠️ 技術スタック

- **HTML + Tailwind CSS（CDN）** - 静的サイト構成、ビルド不要
- **Vanilla JavaScript** - フレームワーク非依存、軽量
- **Chart.js** - 統計グラフ・ダッシュボード可視化
- **PptxGenJS** - PPTX形式出力
- **OpenAI API（オプション）** - 実AI生成モード
- **Unsplash Source API** - 業界・テーマ別の画像自動取得

データは全てブラウザの **localStorage** に保存されるため、バックエンド不要・プライバシー保護も万全。

## 🤖 AIモードについて

### デモモード（デフォルト）
- APIキー不要・無料
- 事前定義された業界別テンプレートでカリキュラムを生成
- GitHub Pages公開デモに最適

### OpenAI APIモード
- 設定画面から自分のOpenAI APIキーを登録
- 本物のAIが各企業の業界特性を考慮した独自カリキュラムを生成
- APIキーは **ブラウザのみに保存**（サーバー送信なし）

## 📦 GitHub Pagesへのデプロイ

### 1. リポジトリにプッシュ

```bash
git clone https://github.com/<your-name>/mirai-curriculum.git
cd mirai-curriculum
# ファイルを配置...
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. GitHub Pages を有効化

リポジトリ Settings → Pages → Source: `main` ブランチ、フォルダ `/ (root)` を選択して Save。

数分後、`https://<your-name>.github.io/mirai-curriculum/` でアクセス可能になります。

### 3. ローカル動作確認

```bash
# Python 簡易サーバー
python3 -m http.server 8000
# → http://localhost:8000/ でアクセス
```

## 🎨 デザインコンセプト

- **ネイビーブルー × パープルのグラデーション** - 信頼感とイノベーション
- **モダンミニマル** - 教育機関にも企業にも馴染むトーン
- **写真ベースの業界カード** - 視覚的に業界を即理解
- **ステップ式UI** - 直感的な操作フロー

## 📊 サンプルデータ

初回起動時に **6種類のサンプルカリキュラム** がプリロードされます：

1. スマートファクトリー入門（製造業 × 情報Ⅱ）
2. アグリテックで食を守る（農業 × 探究）
3. FinTechで未来予測（金融 × 数学）
4. 医療AIで命を支える（医療 × 生物）
5. スマートシティ設計（建設 × 探究）
6. 気象データで防災を考える（環境 × 物理）

## 🔒 プライバシー

本アプリは完全クライアントサイドで動作します：

- ユーザーデータ、APIキー、カリキュラム情報は全てブラウザの localStorage に保存
- サーバへの通信は OpenAI API（APIモード使用時のみ）と画像取得のみ
- 学校名や生徒名などの個人情報も外部送信されません

## 📜 ライセンス

MIT License - 詳細は [LICENSE](./LICENSE) を参照。

## 🙏 クレジット

- 由来: [mirAI-NEXT](https://c7313y-rgb.github.io/mirAI-NEXT/)
- 画像: [Unsplash](https://unsplash.com/) (Free for commercial use)
- アイコン: Unicode絵文字
- フォント: [Google Fonts](https://fonts.google.com/) (Inter, Noto Sans JP)

---

<div align="center">

**🎓 mirAI Curriculum** — Co-create the future of learning.

Made with ❤️ for educators and innovators.

</div>
