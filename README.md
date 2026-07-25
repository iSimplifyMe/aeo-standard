# The AEO Standard

The 100-point Answer Engine Optimization rubric — published, versioned, and open for adoption.

**→ [Read the standard: METHODOLOGY.md](METHODOLOGY.md)**

- **Canonical home:** https://isimplifyme.com/labs/aeo-standard
- **Current version:** 1.0 (July 2026)
- **License:** [CC BY 4.0](LICENSE) — use, adapt, and score against it, with attribution
- **Tooling:** [free web scanner](https://isimplifyme.com/tools/aeo-scanner) · [`npx aeo-scan`](https://www.npmjs.com/package/aeo-scan) CLI preview · [scanner source (MIT)](https://github.com/iSimplifyMe/aeo-scan)

## What this is

A scoring system for whether AI answer engines (ChatGPT, Perplexity, Gemini, Claude) can extract, cite, and recommend a page. Seven sections, 100 points, two hard gating rules. Checks are marked mechanical (software-scoreable) or judgment (human/LLM), because the half that matters most — whether the content says anything worth citing — cannot be measured by regex, and a standard that pretended otherwise would reward exactly the commodity content it exists to filter out.

**A score is a floor, not a forecast.** Answer engines are not deterministic; no score guarantees citation. Any tool or consultant promising otherwise is selling certainty that does not exist.

## Contributing

The standard is versioned like software (see METHODOLOGY.md § Versioning). Issues that identify ambiguities, contradictions, or evidence for/against specific weights are welcome. The maintainers publish revisions on a deliberate cadence — this is a standards document, not a fast-moving codebase.

---

Maintained by [iSimplifyMe](https://isimplifyme.com) — AI orchestration infrastructure and answer-engine optimization.
