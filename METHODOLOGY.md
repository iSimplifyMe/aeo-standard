# The AEO Standard

**Version 1.0 — July 2026** · Maintained by [iSimplifyMe](https://isimplifyme.com/labs/aeo-standard) · Licensed [CC BY 4.0](LICENSE)

The AEO Standard is a 100-point scoring system for Answer Engine Optimization — the discipline of structuring content so AI answer engines (ChatGPT, Perplexity, Gemini, Claude) can extract, cite, and recommend it. It was developed and refined across a seventeen-site production network before publication, and it is versioned like software: a score always references a specific revision of this document.

**The principle underneath every check:** AI engines cite content that is genuinely worth citing. Structure makes content extractable; substance makes it citable. A page can be perfectly formatted and still earn zero citations because it says nothing a model could not generate itself. This standard scores both — and a structural score alone is **a floor, not a forecast**. No score guarantees citation; answer engines are not deterministic.

Checks are marked **[M]** (mechanical — scoreable by software) or **[J]** (judgment — requires a human reviewer or an LLM pass).

---

## Gating rules — automatic rejection

Two gates apply before any points are scored. Failing either is an automatic **REJECT** regardless of point total:

1. **Hidden machine-only content.** Text placed in the page for crawlers but hidden from human readers — screen-reader-only blocks of body copy, `clip: rect(0,0,0,0)` or 1×1-pixel containers, off-screen or white-on-white text. Hidden text is a spam pattern, it does not work (engines render the page and discount it), and on health, legal, and financial sites it is a manual-action risk.
2. **Fabricated authority.** Invented credentials, invented statistics, or citations to sources that do not exist.

Fix the gating violation first; then score.

## Section 1 — Substance & Originality (25 points)

| Check | Points |
|---|---|
| Makes a claim, take, or synthesis not already in the generic top-10 results [J] | 5 |
| First-hand experience, proprietary data, original analysis, or named-expert insight [J] | 5 |
| Specific named entities, numbers, and examples — not generic advice [J] | 5 |
| Would NOT be reproduced by a one-line generic LLM prompt [J] | 5 |
| Demonstrable expertise: credentialed expert named in-content, organizational authority markers, or proprietary data [J] | 5 |

Section 1 carries the most weight deliberately: it is the section commodity content fails, and the reason a page of well-formed answer blocks can still earn nothing.

## Section 2 — Atomic Answer Blocks (15 points)

An atomic answer block is a direct, factual, 40–60-word answer to a specific question, preceded by a question-phrased heading, self-contained enough to make complete sense when extracted in isolation, and **visible on the rendered page**.

| Check | Points |
|---|---|
| Blocks are visible on the page — never hidden or screen-reader-only [M] | 3 |
| Answer blocks are 40–60 words and self-contained — no "as mentioned above" [M] | 3 |
| The primary question is answered in the first 40 words of its section [M] | 3 |
| 3–5 atomic blocks minimum, each targeting a distinct question [M] | 3 |
| Definitive language — "X is…" not "X might be…" [J] | 3 |

Recommended minimums: five blocks for a 1,500-word piece, seven for 2,000+ words, three for a service or pillar page — each targeting a distinct question intent.

## Section 3 — Structured Data & Schema (10 points)

| Check | Points |
|---|---|
| FAQPage schema with 3+ question–answer pairs [M] | 2 |
| Article or BlogPosting schema with all required fields [M] | 2 |
| BreadcrumbList schema [M] | 2 |
| HowTo, Person, or Organization schema where applicable [M] | 2 |
| Schema validates with zero errors [M] | 2 |

Implementation notes from production: BreadcrumbList is the most commonly missing schema. JSON-LD delivered inside a `@graph` container is valid and common — a validator that fails to descend into `@graph` will report schema as missing when it is not. And a BreadcrumbList nested as a property of a type that does not define it (for example `TechArticle.breadcrumb`) is invisible to rich-results detection — emit it as a top-level node.

## Section 4 — RAG / Retrieval Readiness (20 points)

Retrieval pipelines chunk content on structural boundaries and embed the chunks. Walls of text chunk badly, hedged language embeds weakly, and a chunk that reads "it monitors them" retrieves nothing.

| Check | Points |
|---|---|
| Key facts front-loaded — the answer appears in the first 1–2 sentences of each section [J] | 3 |
| Short paragraphs, 2–4 sentences — clean chunk boundaries [M] | 3 |
| Content chunks on real structural boundaries — headings and paragraphs, no fake blocks [M] | 3 |
| Entity consistency — the same name for the same thing throughout [J] | 3 |
| Data-backed claims with specific numbers [J] | 3 |
| Source attribution for statistics and claims [M] | 3 |
| Definitive statements, no ambiguous pronouns [J] | 2 |

## Section 5 — Semantic HTML & Heading Hierarchy (10 points)

| Check | Points |
|---|---|
| Single H1 matching the target query [M] | 2 |
| H2s map to subtopics; H3/H4 nested without skipping levels [M] | 2 |
| Headings phrased as questions where natural [M] | 2 |
| Table of contents with anchor links [M] | 2 |
| Clear, readable structure — no reliance on exotic markup [J] | 2 |

## Section 6 — Internal Linking & Fan-Out Coverage (10 points)

When a model receives a question, it expands it into adjacent sub-queries before retrieving. A page that answers the head query in isolation — with no cluster covering the expansion — loses citations to sites that cover the neighborhood.

| Check | Points |
|---|---|
| Links to the pillar or hub page with keyword anchor text [M] | 2 |
| 3+ internal links per 1,500 words, with varied anchor text [M] | 2 |
| Links to related cluster content [M] | 2 |
| The page or its cluster covers the query fan-out [J] | 2 |
| No orphan pages — new content is linked FROM existing pages [M] | 2 |

## Section 7 — SEO Meta & Technical (10 points)

| Check | Points |
|---|---|
| SEO title 50–60 characters [M] | 2 |
| Meta description 150–160 characters [M] | 2 |
| Clean URL slug — short, evergreen, no dates [M] | 2 |
| Image alt text on all images [M] | 1 |
| OG and Twitter card meta tags [M] | 1 |
| Canonical URL [M] | 1 |
| Page load under 3 seconds [M] | 1 |

---

## Score thresholds

Sections total exactly 100: 25 + 15 + 10 + 20 + 10 + 10 + 10.

| Score | Verdict |
|---|---|
| 95–100 | **PUBLISH** — hygiene and substance floor cleared |
| 85–94 | **REVISE** — minor fixes needed |
| 70–84 | **REWRITE** — structural or substance gaps |
| Below 70 | **REJECT** |
| Any gating violation | **REJECT**, regardless of score |

## Scoring output format

A conforming scorer reports a scorecard in this shape:

```
| Section | Score | Max | Issues |
|---------|-------|-----|--------|
| Substance & Originality | X | 25 | [specific issues] |
| Atomic Answer Blocks | X | 15 | [specific issues] |
| Structured Data & Schema | X | 10 | [specific issues] |
| RAG / Retrieval Readiness | X | 20 | [specific issues] |
| Semantic HTML & Headings | X | 10 | [specific issues] |
| Internal Linking & Fan-Out | X | 10 | [specific issues] |
| SEO Meta & Technical | X | 10 | [specific issues] |
| TOTAL | X | 100 | |
```

…followed by a verdict (PUBLISH / REVISE / REWRITE / REJECT, with gating violations overriding) and a fix list prioritized by points recoverable.

## Common failure patterns

Observed across production audits, in rough order of frequency:

1. **Commodity content** — scores well on structure, fails Section 1. If a generic LLM prompt would produce the same page, it earns no citations.
2. **Hidden atomic answers** — screen-reader-only or clipped blocks. Gating REJECT.
3. **Atomic blocks too long** (70+ words) or **not self-contained** ("as we discussed above").
4. **Missing BreadcrumbList** — the single most commonly missing schema.
5. **Meta description and title outside their bands.**
6. **Hedging language** — "might," "could," "possibly," "it's worth noting" — embeds weakly and reads as unciteable.
7. **Wall-of-text paragraphs** — anything over 4 sentences chunks badly.
8. **No fan-out coverage** — the page targets one query in isolation.

## On the evidence behind the weights

The weights encode several years of operating a seventeen-site production network against this rubric. They are experiential, not the output of a controlled study — a standard that overstated its own evidence would fail its own Section 1.

## Versioning

- **Point releases (1.0.x):** clarifications, wording, examples.
- **Minor versions (1.x):** threshold or check changes within the existing sections.
- **Major versions (2.0+):** structural changes to the sections or weights.

Changes are recorded in [CHANGELOG.md](CHANGELOG.md).

## License and attribution

The AEO Standard is licensed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). Use it, adapt it, score against it — with attribution to **iSimplifyMe** and a link to the canonical home: https://isimplifyme.com/labs/aeo-standard

## Tooling

- **Web scanner:** https://isimplifyme.com/tools/aeo-scanner — score any URL in the browser.
- **CLI preview:** `npx aeo-scan <url>` — the [aeo-scan](https://www.npmjs.com/package/aeo-scan) package checks the core mechanical signals; the full CLI (sitemap crawls, CI exit codes, optional LLM-scored judgment checks) is in development against this standard.
