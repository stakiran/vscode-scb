# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

VS Code extension that adds Scrapbox-like editing support for `.scb` files: syntax highlighting, indent-based decorations, and bracket-link navigation. TypeScript, compiled to `out/` and packaged as a `.vsix`. Published to the VS Code Marketplace as `stakiran.vscode-scb`.

Earlier versions were split into separate `vscode-scb-syntax` and `vscode-scb-commands` extensions; from v0.3.0 they are unified into this single extension and the user-side `settings.json` setup is no longer required.

## Commands

```
npm run compile     # tsc -p ./  (outputs to out/)
npm run watch       # tsc -watch
npm run lint        # eslint --ext .ts ./src
npm run pretty      # prettier ./src/*.ts --write
vsce package        # build .vsix
vsce publish        # publish (author only; `vsce login stakiran` once)
code --install-extension vscode-scb-VERSION.vsix
```

Tests use VS Code's integration runner: `runTest.ts` downloads VS Code and executes Mocha suites in `out/test/suite/`. There is no `npm test` script wired up — invoke `node out/test/runTest.js` after `npm run compile` if a test run is needed. `pretest` already runs `compile`.

## Architecture

Single-file extension entry point: `src/extension.ts`. Two responsibilities live side by side:

1. **Commands** (registered in `activate`): bracket-link new/open (`vscodescb.neworopen`), copy current filename as `[name]` link, jump to prev/next top-level (un-indented) line, show context menu. Command IDs, palette `when` clauses, context-menu groups, and default keybindings are all declared in `package.json` under `contributes.*` — keep these in sync when adding/removing commands.

2. **Decorations** (`updateDecorations`): runs on activation, active-editor change, and document change. Iterates every line and applies `TextEditorDecorationType`s for indents (4 cycling colors by depth), `[link]`, `` `literal` ``, `>quote`, and `code:...:c` blocks. Decoration types are module-level singletons created once in `activate` and pushed to `context.subscriptions`. **This is independent of the TextMate grammar in `syntaxes/scb.tmLanguage.json`** — both systems color the same constructs; if you add a token type, update both.

Code-block detection is two-pass-friendly: `buildCodeBlockSet` walks the document once to mark all lines belonging to a `code:...` / `:c` region so the per-line decoration loop can skip them as a unit.

`newOrOpen` flow (the Shift+Enter command): if a single-line selection exists, wrap it in `[...]`; otherwise try VS Code's built-in `editor.action.openLink`, then detect a `[...]` around the cursor by scanning the current line for the nearest `[` and `]`. URLs (`://` inside the brackets) are skipped. Otherwise, the bracket text is sanitized via `util.fixInvalidFilename` (replaces Windows-invalid chars **and spaces** with `_`), `.scb` is appended, and the file is opened — using VS Code's "untitled" scheme trick (`smartopenIfDoesnotExists`) so a non-existent target opens as an unsaved buffer instead of failing.

`JumpToTopLevelLine` defines a "top-level line" as any non-empty line whose first character is not a space.

## Conventions and gotchas

- Indent is **1 space** per level, not 2 or a tab. `package.json` forces `editor.tabSize: 1`, `insertSpaces: true`, `detectIndentation: false` for the `[vscode-scb]` language. Tests and grammar both assume this.
- The grammar has explicit `indent1`…`indent8` rules plus `indent9over`; the decoration code cycles 4 colors via `(len - 1) % 4`. They will not produce identical visual output — the TM grammar paints scopes, the decoration API paints colors directly. Both run.
- `fixInvalidFilename` replaces spaces with `_` on purpose (comment in code: スペースはファイル名としては有効だが何かとウザイので潰す). Don't "fix" this — the `util.test.ts` cases lock the behavior in.
- `node_modules` is **intentionally bundled** into the published `.vsix` (see commented-out line in `.vscodeignore`). v0.1.0 shipped without it and produced "command not found" errors — see CHANGELOG v0.1.1. Don't add `node_modules` back to `.vscodeignore`.
- `SELF_EXTENSION_ID = 'stakiran.vscode-scb'` is hard-coded in `extension.ts`. If the publisher or name in `package.json` changes, this must change too.
- All command `when` clauses are `resourceExtname == .scb`. New commands intended only for `.scb` files should follow the same pattern in `package.json`.
- Bracket detection in `getStringBetweenBracket` is deliberately naive — it does not consult TextMate scopes (no public VS Code API for that), so it will match `[link]` inside literals/codeblocks. The author considered this acceptable; preserve the comment block if you touch this function.
