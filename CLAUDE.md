# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code へのガイドです。

## プロジェクト概要

不動産アプリ（realestate-app）。

Supabase 認証付きの不動産管理 Web アプリ。会員登録・ログイン後に物件一覧（現在はダミーデータ）を表示する。

## 技術スタック

- React + Vite（JavaScript / JSX）
- React Router（画面遷移）
- Supabase（認証：メールアドレス＋パスワード）

Supabase の接続情報は `.env` の `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` で管理する（`.env` はコミットしない。雛形は `.env.example`）。

## 開発コマンド

```bash
npm install      # 依存関係のインストール
npm run dev      # 開発サーバー起動（http://localhost:5173）
npm run build    # ビルド
npm run preview  # ビルド結果の確認
```

## ディレクトリ構成

- `src/lib/supabase.js` — Supabase クライアント
- `src/contexts/AuthContext.jsx` — ログイン状態の管理（`useAuth` フック）
- `src/components/` — `ProtectedRoute`（未ログインならログイン画面へ）、`GuestRoute`（ログイン済みなら物件一覧へ）
- `src/pages/` — `Login` / `Signup` / `Properties`
- `src/data/properties.js` — 物件のダミーデータ

コード中のコメントは日本語で書く。

## Git 運用ルール

### 基本方針

- **コードを変更したら、そのたびにコミットして GitHub にプッシュすること。**
  変更をローカルに溜め込まず、作業の区切りごとに必ず `git push` まで完了させる。
- 1 コミット = 1 つのまとまった変更にする。無関係な変更を 1 つのコミットに混ぜない。

### 作業の流れ

1. 変更前に `git status` と `git pull` で最新状態を確認する
2. コードを変更する
3. テスト・Lint がある場合は実行し、通ることを確認する
4. 変更内容を確認する（`git diff`）
5. 対象ファイルを指定してステージする（`git add <ファイル>`）
6. コミットする
7. `git push` で GitHub にプッシュする

### コミットメッセージ

- 日本語で、何を・なぜ変更したかを簡潔に書く
- 1 行目は要約（50 文字程度まで）、必要なら空行を挟んで詳細を書く
- 例:
  ```
  物件一覧ページに価格フィルターを追加

  最低価格・最高価格で絞り込めるようにした。
  ```

### 注意事項

- `.env`、API キー、パスワードなどの機密情報は絶対にコミットしない（`.gitignore` に追加する）
- `git push --force` や `git reset --hard` などの破壊的な操作は、ユーザーの明示的な指示がない限り行わない
- pre-commit フックが失敗した場合は `--no-verify` で回避せず、原因を修正する
- プッシュが失敗した場合（リモートに新しいコミットがある等）は、`git pull --rebase` で取り込んでから再度プッシュする。コンフリクトが起きたらユーザーに確認する
