#!/usr/bin/env node
/**
 * Build the white-paper PDF edition of The AEO Standard from METHODOLOGY.md.
 *
 * Zero dependencies: a minimal Markdown converter covering exactly the
 * feature set METHODOLOGY.md uses (h1-h3, tables, lists, bold/italic/code,
 * links, hr, fenced code, paragraphs), styled for print, rendered to PDF via
 * headless Chrome.
 *
 * Usage:  node tools/build-pdf.mjs [outfile]
 * Output: dist/the-aeo-standard-v<version>.pdf (default)
 *
 * Regenerate ONLY when the standard revs; the version below must match
 * METHODOLOGY.md's stated version.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const VERSION = '1.0'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const md = readFileSync(resolve(root, 'METHODOLOGY.md'), 'utf8')

/* ── minimal md → html (METHODOLOGY.md's feature set only) ── */
function inline(s) {
  return s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
}

function mdToHtml(src) {
  const lines = src.split('\n')
  const out = []
  let i = 0
  let inCode = false, listType = null, para = []

  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = [] } }
  const closeList = () => { if (listType) { out.push(`</${listType}>`); listType = null } }

  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('```')) {
      flushPara(); closeList()
      if (!inCode) { out.push('<pre><code>'); inCode = true } else { out.push('</code></pre>'); inCode = false }
      i++; continue
    }
    if (inCode) { out.push(line.replace(/&/g, '&amp;').replace(/</g, '&lt;')); i++; continue }

    if (/^\|/.test(line) && /^\|[\s:-]+\|/.test(lines[i + 1] || '')) {
      flushPara(); closeList()
      const headers = line.split('|').slice(1, -1).map((h) => `<th>${inline(h.trim())}</th>`).join('')
      i += 2
      const rows = []
      while (i < lines.length && /^\|/.test(lines[i])) {
        rows.push('<tr>' + lines[i].split('|').slice(1, -1).map((c) => `<td>${inline(c.trim())}</td>`).join('') + '</tr>')
        i++
      }
      out.push(`<table><thead><tr>${headers}</tr></thead><tbody>${rows.join('')}</tbody></table>`)
      continue
    }

    const h = line.match(/^(#{1,3}) (.*)/)
    if (h) { flushPara(); closeList(); out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue }
    if (/^---+$/.test(line.trim())) { flushPara(); closeList(); out.push('<hr>'); i++; continue }

    const ol = line.match(/^\d+\. (.*)/)
    const ul = line.match(/^- (.*)/)
    if (ol || ul) {
      flushPara()
      const want = ol ? 'ol' : 'ul'
      if (listType !== want) { closeList(); out.push(`<${want}>`); listType = want }
      out.push(`<li>${inline((ol || ul)[1])}</li>`)
      i++; continue
    }

    if (line.trim() === '') { flushPara(); closeList(); i++; continue }
    para.push(line.trim()); i++
  }
  flushPara(); closeList()
  return out.join('\n')
}

const body = mdToHtml(md)

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @page { margin: 22mm 18mm; }
  * { box-sizing: border-box; }
  body { font: 10.5pt/1.55 -apple-system, 'Helvetica Neue', Arial, sans-serif; color: #17191f; margin: 0; }
  .cover { height: 92vh; display: flex; flex-direction: column; justify-content: center; page-break-after: always; }
  .cover .kicker { font-size: 9pt; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; color: #EB1C23; }
  .cover h1 { font-size: 34pt; line-height: 1.1; margin: 12px 0 18px; }
  .cover .sub { font-size: 12pt; color: #444; max-width: 34em; }
  .cover .meta { margin-top: 42px; font-size: 9.5pt; color: #666; }
  h1 { font-size: 20pt; margin: 26px 0 8px; }
  h2 { font-size: 14pt; margin: 24px 0 6px; border-bottom: 1.5px solid #EB1C23; padding-bottom: 4px; page-break-after: avoid; }
  h3 { font-size: 11.5pt; margin: 18px 0 4px; page-break-after: avoid; }
  p { margin: 6px 0; }
  a { color: #B3151A; text-decoration: none; }
  code { font: 9pt ui-monospace, Menlo, monospace; background: #f4f3f0; padding: 1px 4px; border-radius: 3px; }
  pre { background: #f4f3f0; padding: 10px 12px; border-radius: 6px; overflow: hidden; }
  pre code { background: none; padding: 0; }
  table { border-collapse: collapse; width: 100%; margin: 10px 0; page-break-inside: avoid; font-size: 9.5pt; }
  th { text-align: left; background: #17191f; color: #fff; padding: 6px 8px; font-weight: 600; }
  td { padding: 5px 8px; border-bottom: 1px solid #e2e0db; vertical-align: top; }
  hr { border: 0; border-top: 1px solid #e2e0db; margin: 20px 0; }
  li { margin: 3px 0; }
  .foot { margin-top: 34px; padding-top: 10px; border-top: 1px solid #e2e0db; font-size: 8.5pt; color: #777; }
</style></head><body>
  <div class="cover">
    <div class="kicker">iSimplifyMe · White Paper</div>
    <h1>The AEO Standard</h1>
    <div class="sub">The 100-point, seven-section Answer Engine Optimization rubric — gating rules, atomic answer specifications, and score thresholds. Published openly, versioned like software.</div>
    <div class="meta">Version ${VERSION} · July 2026 · CC BY 4.0 · Canonical home: isimplifyme.com/labs/aeo-standard</div>
  </div>
  ${body}
  <div class="foot">The AEO Standard v${VERSION} — © 2026 iSimplifyMe, licensed CC BY 4.0 (attribution required). Canonical: https://isimplifyme.com/labs/aeo-standard · Scanner: https://isimplifyme.com/tools/aeo-scanner · A score is a floor, not a forecast.</div>
</body></html>`

mkdirSync(resolve(root, 'dist'), { recursive: true })
const htmlPath = resolve(root, 'dist', 'the-aeo-standard.html')
writeFileSync(htmlPath, html)

const outfile = process.argv[2] || resolve(root, 'dist', `the-aeo-standard-v${VERSION}.pdf`)
execFileSync(CHROME, [
  '--headless', '--disable-gpu', '--no-pdf-header-footer',
  `--print-to-pdf=${outfile}`, htmlPath,
], { stdio: 'pipe' })
console.log('wrote', outfile)
