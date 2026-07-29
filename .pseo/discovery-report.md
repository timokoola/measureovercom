# pSEO Discovery Report

Date: 2026-02-06

## Data Assets Found
| Entity | Record Count | Key Fields | Source |
|--------|-------------|------------|--------|
| None detected | N/A | N/A | No DB/CMS/API/static datasets found in repo |

Notes:
- The repo is an Astro + Preact static app with no backend data layer.
- No `data/`, `content/`, or CMS configs are present; only UI code and utilities.

## Proposed Page Types (ranked by opportunity)

### 1. Guides / How‑to library
- **Pattern**: `/guides/{topic}`
- **Record count**: 50–200 (new content required)
- **Search intent**: Informational
- **Keyword pattern**: “measure from image”, “scale drawing from photo”, “draw straight lines on image”
- **Data source**: New content dataset (MDX)
- **Content uniqueness**: Medium
- **Data gaps**: No guides, no taxonomy, no FAQs
- **Feasibility**: Needs new data source

### 2. Paper size reference pages
- **Pattern**: `/paper-sizes/{size}`
- **Record count**: 20–60
- **Search intent**: Informational
- **Keyword pattern**: “A4 size in inches”, “A0 dimensions”
- **Data source**: New structured dataset (MDX or JSON)
- **Content uniqueness**: Medium
- **Data gaps**: No dedicated data beyond UI labels
- **Feasibility**: Needs new data source

### 3. Use‑case pages
- **Pattern**: `/use-cases/{use-case}`
- **Record count**: 30–100
- **Search intent**: Informational / Commercial investigation
- **Keyword pattern**: “stencil from photo”, “pattern from image”, “scale drawing for woodworking”
- **Data source**: New content dataset (MDX)
- **Content uniqueness**: Medium
- **Data gaps**: No use‑case inventory or examples
- **Feasibility**: Needs new data source

## Rejected Candidates
| Entity | Reason Rejected |
|--------|----------------|
| App features | No structured dataset per feature |
| Locations/services/products | Not applicable |

## Recommended URL Structure
```
/guides/{topic}
/paper-sizes/{size}
/units/{unit}
/use-cases/{use-case}
/glossary/{term}
```

## Data Enrichment Needed
- Structured content model (title, summary, steps, FAQs, examples)
- Paper size dataset (dimensions, ratios, conversions)
- Use‑case library with templates

## YMYL Assessment
- YMYL category: None
- Risk level: Low
- Recommendation: Standard pSEO OK

## Minimal Content Schema (MDX)

Base fields (all page types):
- `slug`
- `title`
- `summary` (2–3 sentences)
- `body` (markdown)
- `faqs` (array of `{q, a}`)
- `category`
- `lastUpdated`

Guides extension:
- `steps[]` (title + body)
- `difficulty`
- `timeToComplete`
- `tools[]`

Paper sizes extension:
- `dimensions` (mm/in)
- `aspectRatio`
- `printableArea`
- `commonUseCases[]`

Use cases extension:
- `useCase`
- `recommendedSettings`
- `exampleInputs[]`
- `expectedOutputs[]`

Glossary extension:
- `term`
- `definition`
- `relatedTerms[]`

## Next Steps
1. Confirm page types with stakeholder.
2. Create MDX content datasets for guides, paper sizes, and use cases.
3. Run pseo-audit once data exists.
4. Begin implementation with pseo-data.
