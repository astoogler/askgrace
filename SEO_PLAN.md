I now have a thorough understanding of the entire codebase. Let me compile the comprehensive SEO audit and growth plan.

---

# ASK GRACE -- COMPREHENSIVE SEO AUDIT & GROWTH PLAN

---

## SECTION 1: CURRENT APP SEO AUDIT

### 1.1 Landing Site Files Inventory (`landing/` folder)

The landing site consists of exactly 6 non-asset files:

| File | Purpose | SEO Role |
|------|---------|----------|
| `index.html` | Homepage / landing page | Primary ranking page |
| `privacy.html` | Privacy policy | Legal/trust signal |
| `terms.html` | Terms of service | Legal/trust signal |
| `sitemap.xml` | XML sitemap | Crawl discovery |
| `robots.txt` | Crawler directives | Crawl control |
| `vercel.json` | Clean URL config (`cleanUrls: true`) | Removes .html extensions |

### 1.2 Meta Tags Assessment

**Homepage (`landing/index.html`)**
- Title: "Ask Grace -- AI Companion for Seniors | Safe, Simple & Trusted" -- Good length (58 chars), includes primary keywords
- Meta description: 193 chars -- slightly long for SERP display (aim for 155). Content is good but could be tighter.
- Meta keywords: Present but this tag is ignored by Google. Harmless but wasted effort.
- Canonical: `https://www.askgrace.org` -- PROBLEM: Uses `www.` prefix. Must confirm this is the preferred version and that non-www redirects to www (or vice versa). Inconsistency with sitemap URLs which use `https://askgrace.org/` (no www).
- Robots: `index, follow` -- correct
- OG tags: Complete and well-formed (type, url, title, description, image with dimensions, site_name)
- Twitter card: Complete (summary_large_image, title, description, image)
- No `hreflang` -- fine for English-only site

**Privacy page (`landing/privacy.html`)**
- Title: "Privacy Policy -- Ask Grace" -- acceptable
- Meta description: Present and relevant
- Canonical: `https://askgrace.org/privacy` -- no www prefix, inconsistent with homepage canonical
- No OG tags -- missing
- No Twitter card tags -- missing
- No structured data -- missed opportunity for BreadcrumbList

**Terms page (`landing/terms.html`)**
- Title: "Terms of Service -- Ask Grace" -- acceptable
- Meta description: Present and relevant
- Canonical: `https://askgrace.org/terms` -- no www, same inconsistency
- No OG tags -- missing
- No Twitter card tags -- missing
- No structured data -- missed opportunity

### 1.3 Structured Data Assessment

Only the homepage has structured data:
- **SoftwareApplication** schema: Present, with name, url, applicationCategory ("HealthApplication"), operatingSystem, description, offers (free), and audience (PeopleAudience, requiredMinAge: 55)
- Missing: **Organization** schema (brand identity)
- Missing: **WebSite** schema with SearchAction (sitelinks search box)
- Missing: **FAQPage** schema on the FAQ section (the homepage has 7 FAQ items in `<details>` elements -- this is a direct missed opportunity for FAQ rich results)
- Missing: **BreadcrumbList** on subpages

### 1.4 Heading Hierarchy Assessment

**Homepage:**
- H1: "Meet Grace -- Your Trusted AI Companion" -- single H1, good
- H2: "Everything a Senior Needs, Nothing They Don't" / "Simple to Start, Easy to Use" / "Safety First -- Always" / "Are You Setting This Up for a Parent?" / "Common Questions" / "Ready to Meet Grace?" -- logical flow, good
- H3: Feature cards and steps use H3 -- correct hierarchy
- H4: Safety items use H4 -- correct

**Privacy and Terms pages:**
- H1: Present and singular
- H2: Used for section headings -- correct hierarchy
- No H3/H4 -- appropriate for these page types

### 1.5 Image / Alt Tag Assessment

- The homepage uses NO `<img>` tags at all -- only emoji characters for icons
- `og-image.png` exists at 1.2MB -- excessively large for an OG image. Should be under 300KB.
- Favicons properly configured with multiple sizes
- No alt text issues since no images are present, but also no image SEO opportunity

### 1.6 Internal Linking Assessment

**Homepage internal links:**
- Nav: Only the brand name (not linked to /) and one CTA to `app.askgrace.org`
- Footer: Links to app, #safety, #faq, /privacy, /terms
- No nav links to subpages of the landing site
- No breadcrumbs on any page
- Privacy and Terms pages link back to `/` and to each other

**Critical gap:** The footer nav has only 5 links. There is no main navigation with links to content pages (because no content pages exist yet). The nav bar contains only the brand and a single CTA button.

### 1.7 Sitemap Assessment

The sitemap contains only 3 URLs:
- `https://askgrace.org/` (priority 1.0, weekly)
- `https://askgrace.org/privacy` (priority 0.5, monthly)
- `https://askgrace.org/terms` (priority 0.5, monthly)

**Issues:**
- Domain inconsistency: Sitemap uses `askgrace.org` (no www), homepage canonical uses `www.askgrace.org`
- Only 3 pages total -- extremely thin site from Google's perspective
- No `<lastmod>` concerns (dates look correct)

### 1.8 Robots.txt Assessment

```
User-agent: *
Allow: /
Sitemap: https://askgrace.org/sitemap.xml
```

- Functional but minimal
- Does not block `app.askgrace.org` -- that is a separate subdomain with its own deployment, so this is fine
- No mention of `llms.txt` or AI crawler directives

### 1.9 Rendering Strategy & SEO Implications

**Landing site (askgrace.org):** Static HTML files served by Vercel with `cleanUrls: true`. This is ideal for SEO -- fully crawlable, no JavaScript rendering required, fast TTFB.

**React app (app.askgrace.org):** Vite SPA, client-side rendered. The `vercel.json` at root rewrites all routes to `index.html`. The app renders into `<div id="root"></div>` with no server-side content. This is invisible to search engines, but that is correct since the app is behind auth and should not be indexed.

### 1.10 Technical Blockers Summary

| Blocker | Severity | Details |
|---------|----------|---------|
| Canonical domain inconsistency | HIGH | Homepage canonical says `www.askgrace.org`, sitemap says `askgrace.org` |
| Only 3 indexable pages | HIGH | Google sees an extremely thin site with no topical authority |
| No FAQPage schema | MEDIUM | 7 FAQ items exist in HTML but no JSON-LD to trigger rich results |
| No Organization schema | MEDIUM | No brand entity signal |
| Missing OG/Twitter on subpages | LOW | Privacy/Terms missing social meta |
| OG image too large | LOW | 1.2MB -- should compress to <300KB |
| No breadcrumbs | MEDIUM | Subpages have no structured navigation hierarchy |
| No content pages for target keywords | CRITICAL | Zero pages targeting "is ai safe for seniors", "best ai for seniors", etc. |

---

## SECTION 2: STRATEGIC POSITIONING

### 2.1 Core Positioning Statement

"The safe, simple AI for people who feel overwhelmed by technology."

This positioning must manifest across every touchpoint:

### 2.2 Positioning in Metadata

- **Title formula:** `[Specific Topic] | Ask Grace -- Safe, Simple AI for Seniors`
- **Description formula:** Always lead with the user benefit, include "safe" or "trusted", end with a clear action
- Every page title should contain at least one of: "safe," "simple," "seniors," "beginners," "trusted"
- OG titles can be shorter/punchier than SEO titles

### 2.3 Positioning in Schema

- SoftwareApplication: Keep `applicationCategory: "HealthApplication"` and `audience.requiredMinAge: 55`
- Add Organization schema emphasizing trust signals
- FAQPage schema should prioritize safety questions
- Every Article/Guide schema should include `audience: PeopleAudience`

### 2.4 Positioning in Content

- **Tone:** Warm, patient, clear. Never condescending. Use "you" frequently.
- **Reading level:** Target 6th-8th grade Flesch-Kincaid
- **Structure:** Short paragraphs (2-3 sentences max), generous whitespace, large text
- **Trust signals on every page:** "Grace never gives medical advice," "Your conversations are private," "Designed with safety guardrails"
- **CTAs:** Always "Try Grace Free" or "Start Chatting" -- never aggressive/salesy language

### 2.5 Positioning in URL Structure

- Use human-readable, question-based URLs: `/is-ai-safe-for-seniors` not `/articles/ai-safety-assessment`
- Keep URLs short and memorable (seniors might type them)
- Use hyphens, lowercase, no special characters

---

## SECTION 3: RECOMMENDED SITE ARCHITECTURE

### 3.1 Full URL Structure

All pages below are static HTML files in the `landing/` folder, following the same pattern as `privacy.html` and `terms.html`.

#### Tier 1: Core Pages

| URL | File | Purpose | Search Intent | Keyword Themes | Priority |
|-----|------|---------|---------------|----------------|----------|
| `/` | `index.html` | Homepage | Branded / navigational | "ask grace", "ai companion seniors" | P0 |
| `/for-seniors` | `for-seniors.html` | Audience landing page | Informational/commercial | "ai for seniors", "best ai for elderly" | P1 |
| `/for-beginners` | `for-beginners.html` | Audience landing page | Informational/commercial | "ai for beginners", "easy ai tool" | P1 |
| `/safe-ai` | `safe-ai.html` | Safety/trust pillar | Informational | "is ai safe", "safe ai tools", "ai safety" | P1 |
| `/how-to-use-ai` | `how-to-use-ai.html` | Getting started guide | Informational | "how to use ai", "ai for dummies" | P2 |
| `/faq` | `faq.html` | Standalone FAQ | Informational | "ai questions seniors", "is ai safe" | P1 |

#### Tier 2: Topic Hubs

| URL | File | Purpose | Search Intent | Keyword Themes |
|-----|------|---------|---------------|----------------|
| `/topics/scam-protection` | `topics/scam-protection.html` | Topic hub | Informational | "scam protection seniors", "ai scam detection" |
| `/topics/health-questions` | `topics/health-questions.html` | Topic hub | Informational | "ai health questions", "ask ai about health" |
| `/topics/daily-reminders` | `topics/daily-reminders.html` | Topic hub | Informational | "medication reminders seniors", "daily reminder app" |
| `/topics/companionship` | `topics/companionship.html` | Topic hub | Informational | "ai companion lonely seniors", "senior companionship" |

#### Tier 3: Blog / Guides

| URL Pattern | Folder | Purpose | Search Intent |
|-------------|--------|---------|---------------|
| `/blog/` | `blog/index.html` | Blog index | Discovery |
| `/blog/[slug]` | `blog/[slug].html` | Individual posts | Informational |
| `/guides/` | `guides/index.html` | Guide index | Informational |
| `/guides/[slug]` | `guides/[slug].html` | Individual guides | Informational |

#### Tier 4: Comparison & Use Case Pages

| URL Pattern | Folder | Purpose | Search Intent |
|-------------|--------|---------|---------------|
| `/compare/grace-vs-chatgpt` | `compare/grace-vs-chatgpt.html` | Comparison | Commercial investigation |
| `/compare/grace-vs-alexa` | `compare/grace-vs-alexa.html` | Comparison | Commercial investigation |
| `/use-cases/[slug]` | `use-cases/[slug].html` | Use case detail | Informational/commercial |

#### Tier 5: Programmatic / Long-tail

| URL Pattern | Folder | Purpose |
|-------------|--------|---------|
| `/is-ai-safe-for-[audience]` | root-level | Safety question pages |
| `/best-ai-for-[audience]` | root-level | "Best" recommendation pages |
| `/how-to-use-ai-for-[task]` | root-level | Task-specific guides |

### 3.2 Internal Linking Architecture

```
Homepage (/)
  |
  +-- /for-seniors          <-- main nav
  |     +-- links to /safe-ai, /topics/*, /use-cases/*
  |
  +-- /for-beginners        <-- main nav
  |     +-- links to /how-to-use-ai, /guides/*
  |
  +-- /safe-ai              <-- main nav
  |     +-- links to /is-ai-safe-for-*, /faq
  |
  +-- /how-to-use-ai        <-- main nav
  |     +-- links to /guides/*, /for-beginners
  |
  +-- /faq                  <-- main nav
  |
  +-- /blog/                <-- footer nav
  |     +-- /blog/[slug]
  |
  +-- /compare/             <-- linked from /for-seniors, /for-beginners
  |     +-- /compare/grace-vs-chatgpt
  |
  +-- /topics/              <-- linked contextually
  |     +-- /topics/scam-protection
  |     +-- /topics/health-questions
  |
  +-- /use-cases/           <-- linked from topic hubs
       +-- /use-cases/[slug]
```

---

## SECTION 4: PROGRAMMATIC SEO ARCHITECTURE

### 4.1 "Is AI Safe for [Audience]" Pages

**URL pattern:** `/is-ai-safe-for-[audience]`
**Examples:** `/is-ai-safe-for-seniors`, `/is-ai-safe-for-grandparents`, `/is-ai-safe-for-elderly-parents`, `/is-ai-safe-for-people-with-dementia`, `/is-ai-safe-for-children`

**Template sections:**
1. **Direct answer paragraph** (featured snippet target): "Yes, AI can be safe for [audience] when it includes proper guardrails. Ask Grace was designed specifically for..."
2. **What makes AI risky** -- 3-4 real risks with examples
3. **What makes AI safe** -- How Ask Grace addresses each risk
4. **Real scenarios** -- 3 concrete use cases for this audience
5. **Safety checklist** -- "What to look for in a safe AI tool"
6. **FAQ block** -- 3-5 audience-specific questions
7. **CTA** -- "Try Grace Free"

**What makes it non-thin:** Each page must have at least 1,200 words of unique content tailored to the specific audience's concerns, fears, and needs. The "real scenarios" and "FAQ block" sections must be entirely unique per page.

**Schema:** `FAQPage` + `Article` + `BreadcrumbList`

**Metadata pattern:**
- Title: `Is AI Safe for [Audience]? Yes -- Here's What to Look For | Ask Grace`
- Description: `Learn whether AI is safe for [audience]. We explain the risks, safeguards, and what to look for in a trustworthy AI tool for [audience].`

### 4.2 "Best AI for [Audience]" Pages

**URL pattern:** `/best-ai-for-[audience]`
**Examples:** `/best-ai-for-seniors`, `/best-ai-for-non-technical-people`, `/best-ai-for-elderly-parents`, `/best-ai-for-people-who-hate-technology`

**Template sections:**
1. **What [audience] needs from AI** -- unique requirements and pain points
2. **Comparison table** -- Grace vs 3-4 alternatives on audience-relevant criteria
3. **Why Grace was built for [audience]** -- specific features mapped to needs
4. **What to avoid** -- AI tools that are too complex, unsafe, or expensive
5. **Getting started** -- step-by-step for this audience
6. **FAQ block** -- 3-5 questions
7. **CTA**

**What makes it non-thin:** Genuine comparison criteria specific to the audience (not generic feature lists). Each page must include at least 5 unique evaluation criteria relevant to that audience.

**Schema:** `Article` + `FAQPage` + `BreadcrumbList`

**Metadata pattern:**
- Title: `Best AI for [Audience] in 2026 -- Safe, Simple & Free | Ask Grace`
- Description: `Looking for the best AI for [audience]? We compare the top options based on safety, simplicity, and [audience-specific criterion].`

### 4.3 "How to Use AI for [Task]" Pages

**URL pattern:** `/how-to-use-ai-for-[task]`
**Examples:** `/how-to-use-ai-for-health-questions`, `/how-to-use-ai-for-scam-protection`, `/how-to-use-ai-for-writing-letters`, `/how-to-use-ai-for-medication-reminders`, `/how-to-use-ai-for-recipes`

**Template sections:**
1. **What this guide covers** -- brief intro
2. **Step-by-step instructions** -- with screenshots/examples
3. **Example prompts** -- 5-10 real prompts the user can try
4. **What Grace will and won't do** -- safety boundaries
5. **Tips for better results** -- practical advice
6. **Related tasks** -- internal links to related guides
7. **FAQ block**
8. **CTA**

**What makes it non-thin:** Real example prompts and responses. Step-by-step instructions with specific language. Must include at least 8 example prompts unique to the task.

**Schema:** `HowTo` + `FAQPage` + `BreadcrumbList`

**Metadata pattern:**
- Title: `How to Use AI for [Task] -- Simple Guide for Beginners | Ask Grace`
- Description: `Learn how to use AI for [task] with this step-by-step guide. Includes example prompts and safety tips. No tech experience needed.`

### 4.4 "[Topic] Explained Simply" Pages

**URL pattern:** `/guides/[topic]-explained-simply`
**Examples:** `/guides/ai-explained-simply`, `/guides/chatbots-explained-simply`, `/guides/machine-learning-explained-simply`

**Template sections:**
1. **One-sentence definition** (featured snippet target)
2. **Everyday analogy** -- explain in terms of familiar concepts
3. **How it works in plain language** -- no jargon
4. **How it affects you** -- practical relevance
5. **Common misconceptions** -- myth-busting
6. **Glossary** -- key terms defined simply
7. **FAQ block**
8. **CTA**

**What makes it non-thin:** The "everyday analogy" and "how it affects you" sections must be genuinely written for a non-technical audience. Minimum 1,000 words. Must avoid jargon entirely.

**Schema:** `Article` + `FAQPage` + `BreadcrumbList` + `DefinedTermSet` (if applicable)

---

## SECTION 5: KEYWORD CLUSTERS & PRIORITY TARGETS

### 5.1 Cluster: Senior-Focused AI

| Keyword | Intent | Volume Est. | Difficulty | Page Type | Priority |
|---------|--------|-------------|------------|-----------|----------|
| ai for seniors | Commercial | Medium | Low-Med | `/for-seniors` | P1 |
| best ai for seniors | Commercial | Medium | Low | `/best-ai-for-seniors` | P1 |
| ai companion for seniors | Commercial | Low-Med | Low | `/for-seniors` | P1 |
| ai assistant for elderly | Commercial | Low | Low | `/for-seniors` | P2 |
| ai for elderly parents | Commercial | Low-Med | Low | `/best-ai-for-elderly-parents` | P1 |

### 5.2 Cluster: AI Safety & Trust

| Keyword | Intent | Volume Est. | Difficulty | Page Type | Priority |
|---------|--------|-------------|------------|-----------|----------|
| is ai safe | Informational | Medium | Medium | `/safe-ai` | P1 |
| is ai safe for seniors | Informational | Low-Med | Low | `/is-ai-safe-for-seniors` | P1 |
| safe ai tools | Commercial | Low | Low | `/safe-ai` | P1 |
| can ai give bad advice | Informational | Low | Very Low | `/safe-ai` | P2 |
| ai safety for beginners | Informational | Low | Low | `/is-ai-safe-for-beginners` | P2 |

### 5.3 Cluster: Beginner Guides

| Keyword | Intent | Volume Est. | Difficulty | Page Type | Priority |
|---------|--------|-------------|------------|-----------|----------|
| how to use ai | Informational | High | High | `/how-to-use-ai` | P2 |
| ai for beginners | Informational | Medium | Medium | `/for-beginners` | P1 |
| ai for dummies | Informational | Medium | Low-Med | `/for-beginners` | P1 |
| what is ai in simple terms | Informational | Low-Med | Low | `/guides/ai-explained-simply` | P2 |
| how to talk to ai | Informational | Low | Very Low | `/guides/how-to-talk-to-ai` | P3 |

### 5.4 Cluster: Scam Protection

| Keyword | Intent | Volume Est. | Difficulty | Page Type | Priority |
|---------|--------|-------------|------------|-----------|----------|
| scam protection for seniors | Informational | Medium | Medium | `/topics/scam-protection` | P2 |
| ai scam detection | Informational | Low | Low | `/topics/scam-protection` | P2 |
| how to protect seniors from scams | Informational | Low-Med | Medium | Blog post | P3 |
| irs scam seniors | Informational | Low | Low | Blog post | P3 |

### 5.5 Cluster: Comparisons

| Keyword | Intent | Volume Est. | Difficulty | Page Type | Priority |
|---------|--------|-------------|------------|-----------|----------|
| chatgpt for seniors | Informational | Low-Med | Low | `/compare/grace-vs-chatgpt` | P2 |
| chatgpt alternative for seniors | Commercial | Low | Very Low | `/compare/grace-vs-chatgpt` | P2 |
| simple ai like chatgpt | Commercial | Low | Low | `/compare/grace-vs-chatgpt` | P2 |
| alexa vs ai companion | Commercial | Low | Low | `/compare/grace-vs-alexa` | P3 |

### 5.6 Cluster: Use Cases

| Keyword | Intent | Volume Est. | Difficulty | Page Type | Priority |
|---------|--------|-------------|------------|-----------|----------|
| ai for health questions | Informational | Low-Med | Low | `/how-to-use-ai-for-health-questions` | P2 |
| ai for medication reminders | Informational | Low | Very Low | `/how-to-use-ai-for-medication-reminders` | P3 |
| ai for writing letters | Informational | Low | Very Low | `/how-to-use-ai-for-writing-letters` | P3 |
| ai for recipes seniors | Informational | Low | Very Low | `/how-to-use-ai-for-recipes` | P3 |

### 5.7 TOP 20 PRIORITY PAGE OPPORTUNITIES

| Rank | Target Page | Primary Keyword | Difficulty | Conversion Potential | Notes |
|------|-------------|-----------------|------------|---------------------|-------|
| 1 | `/for-seniors` | ai for seniors | Low-Med | HIGH | Core audience page, high intent |
| 2 | `/is-ai-safe-for-seniors` | is ai safe for seniors | Low | HIGH | Directly addresses fear barrier |
| 3 | `/best-ai-for-seniors` | best ai for seniors | Low | HIGH | Commercial intent, low competition |
| 4 | `/for-beginners` | ai for beginners | Medium | HIGH | Broadens TAM beyond seniors |
| 5 | `/safe-ai` | safe ai tools | Low | HIGH | Trust pillar, links to all safety content |
| 6 | `/faq` | (multiple long-tail) | Very Low | MEDIUM | FAQ rich results, low effort |
| 7 | `/compare/grace-vs-chatgpt` | chatgpt for seniors | Low | HIGH | Captures comparison shoppers |
| 8 | `/how-to-use-ai` | how to use ai | High | MEDIUM | High volume, harder to rank |
| 9 | `/is-ai-safe-for-elderly-parents` | is ai safe for elderly parents | Very Low | HIGH | Caregiver audience, buying intent |
| 10 | `/best-ai-for-elderly-parents` | best ai for elderly parents | Very Low | HIGH | Caregiver decision-maker |
| 11 | `/topics/scam-protection` | scam protection seniors | Medium | MEDIUM | Unique differentiator feature |
| 12 | `/guides/ai-explained-simply` | what is ai in simple terms | Low | LOW | Top-of-funnel awareness |
| 13 | `/how-to-use-ai-for-health-questions` | ai for health questions | Low | MEDIUM | High-value use case |
| 14 | `/compare/grace-vs-alexa` | alexa vs ai companion | Low | MEDIUM | Different product category |
| 15 | `/topics/health-questions` | ask ai about health | Low | MEDIUM | Topic hub |
| 16 | `/is-ai-safe-for-beginners` | ai safety for beginners | Low | MEDIUM | Broader audience |
| 17 | `/best-ai-for-non-technical-people` | ai for non technical people | Very Low | HIGH | Underserved niche |
| 18 | `/topics/companionship` | ai companion lonely seniors | Low | MEDIUM | Emotional differentiator |
| 19 | `/use-cases/caregiver-setup` | set up ai for elderly parent | Very Low | HIGH | Caregiver conversion page |
| 20 | `/blog/why-seniors-dont-need-to-fear-ai` | seniors afraid of ai | Very Low | MEDIUM | Content marketing, shareable |

---

## SECTION 6: SCHEMA / STRUCTURED DATA MATRIX

| Page Type | Recommended Schema | Required Fields | Optional Fields | Risks/Notes |
|-----------|--------------------|-----------------|-----------------|-------------|
| Homepage | `SoftwareApplication` (keep), `Organization`, `WebSite`, `FAQPage` | name, url, description, offers, audience | aggregateRating (only if you collect reviews), screenshot | Do NOT add aggregateRating without real reviews |
| For Seniors / For Beginners | `WebPage`, `BreadcrumbList`, `FAQPage` | name, description, mainEntity (FAQ) | speakable | None |
| Safe AI / Trust pages | `Article`, `FAQPage`, `BreadcrumbList` | headline, author, datePublished, mainEntityOfPage | speakable | author must be a real person or the organization |
| Comparison pages | `Article`, `BreadcrumbList` | headline, author, datePublished | - | Do NOT use Product schema for competitors |
| Blog articles | `Article`, `BreadcrumbList` | headline, author, datePublished, dateModified, image | speakable, wordCount | Must have a real author |
| FAQ page | `FAQPage`, `BreadcrumbList` | mainEntity (Question/Answer pairs) | - | Only include questions actually visible on the page |
| How-to guides | `HowTo`, `BreadcrumbList`, `FAQPage` | name, step (HowToStep with name, text) | estimatedCost, totalTime, tool | Only include steps that match visible content |
| Topic hubs | `WebPage`, `BreadcrumbList` | name, description | - | None |
| Use case pages | `Article`, `BreadcrumbList`, `FAQPage` | headline, author, datePublished | - | None |
| Privacy / Terms | `WebPage`, `BreadcrumbList` | name, description | - | None |

**Organization schema (add to homepage):**
```json
{
  "@type": "Organization",
  "name": "Ask Grace",
  "url": "https://askgrace.org",
  "logo": "https://askgrace.org/apple-touch-icon.png",
  "description": "AI companion designed for adults 65+ with built-in safety guardrails",
  "sameAs": []
}
```

**WebSite schema (add to homepage):**
```json
{
  "@type": "WebSite",
  "name": "Ask Grace",
  "url": "https://askgrace.org"
}
```

**FAQPage schema (add to homepage and /faq):**
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Ask Grace really free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. You can start chatting with Grace right away at no cost..."
      }
    }
  ]
}
```

---

## SECTION 7: INTERNAL LINKING FRAMEWORK

### 7.1 Hub-and-Spoke Model

**Hub pages:** `/for-seniors`, `/for-beginners`, `/safe-ai`, `/how-to-use-ai`
**Spoke pages:** All blog posts, guides, comparisons, use cases, programmatic pages

Each hub page should link to 5-10 relevant spoke pages. Each spoke page should link back to its parent hub and to 2-3 sibling spokes.

### 7.2 Contextual Anchor Text Rules

- Use descriptive anchor text that includes the target page's primary keyword
- Vary anchor text -- do not use the same exact phrase every time
- Link naturally within paragraph text, not just in "Related Links" blocks
- Every page should have at least 3 internal links to other landing site pages
- Never use "click here" as anchor text

### 7.3 Breadcrumb Structure

All pages except the homepage should have visible breadcrumbs with corresponding `BreadcrumbList` schema.

Pattern: `Home > [Section] > [Page Title]`

Examples:
- `/for-seniors`: Home > For Seniors
- `/blog/why-seniors-love-ai`: Home > Blog > Why Seniors Love AI
- `/compare/grace-vs-chatgpt`: Home > Compare > Grace vs ChatGPT
- `/is-ai-safe-for-seniors`: Home > Safe AI > Is AI Safe for Seniors?

### 7.4 Navigation Structure

**Main nav** (add to all pages):
- For Seniors
- For Beginners
- Safety
- How It Works
- FAQ

**Footer nav** (expand):
- For Seniors | For Beginners | Safety | How It Works | FAQ
- Blog | Guides | Compare
- Privacy | Terms | Contact

### 7.5 Related Content Linking

Every content page should end with a "You might also like" section containing 3 related pages. Selection logic:
1. Same topic cluster gets priority
2. Same audience (seniors vs beginners) gets priority
3. Adjacent funnel stage (awareness links to consideration, consideration links to conversion)

### 7.6 Cross-Linking Rules

- Every `/is-ai-safe-for-*` page links to `/safe-ai` and `/for-seniors` or `/for-beginners`
- Every `/best-ai-for-*` page links to `/compare/*` pages
- Every `/how-to-use-ai-for-*` page links to `/how-to-use-ai` and the relevant `/topics/*` page
- Every `/compare/*` page links to `/for-seniors` and the app CTA
- Blog posts always link to at least one hub page

---

## SECTION 8: PAGE TEMPLATE BLUEPRINTS

### 8.1 Senior/Beginner Audience Page (`/for-seniors`, `/for-beginners`)

- **Title:** `AI for Seniors -- Safe, Simple & Free | Ask Grace` (under 60 chars)
- **Meta description:** `Ask Grace is the AI designed for seniors. Simple to use, safe by design, and always free. No tech skills needed.` (under 155 chars)
- **H1:** `The AI Built for Seniors Who Want Simple, Safe Help`
- **Intro (100-150 words):** Empathetic opening acknowledging fears/concerns, positioning Grace as the solution
- **Answer snippet (40-60 words):** Direct answer to "what is the best AI for seniors" -- paragraph format for featured snippet
- **Feature blocks:** 4-6 features with H3 headings, mapped to audience needs
- **Social proof section:** Testimonials or caregiver endorsements (when available)
- **FAQ block:** 5-7 questions specific to this audience, with `FAQPage` schema
- **CTA:** "Try Grace Free -- No Download, No Credit Card"
- **Schema:** `WebPage`, `FAQPage`, `BreadcrumbList`
- **Content length:** 1,500-2,000 words
- **Internal links:** 5-8 links to related pages

### 8.2 Safety/Trust Page (`/safe-ai`)

- **Title:** `Is AI Safe? How Ask Grace Keeps You Protected | Ask Grace`
- **Meta description:** `Worried about AI safety? Ask Grace has built-in guardrails that protect you from bad advice, scams, and privacy risks. Learn how.`
- **H1:** `How Ask Grace Keeps AI Safe and Trustworthy`
- **Intro:** Address the fear directly, validate it, then explain the solution
- **"The Risks" section:** Honest list of AI risks with H3 per risk
- **"How Grace Protects You" section:** Matched solutions for each risk
- **Safety checklist:** Visible checklist with checkmarks (mirrors homepage pattern)
- **FAQ block:** 5-7 safety-specific questions
- **CTA**
- **Schema:** `Article`, `FAQPage`, `BreadcrumbList`
- **Content length:** 1,800-2,500 words

### 8.3 Comparison Page (`/compare/grace-vs-chatgpt`)

- **Title:** `Ask Grace vs ChatGPT for Seniors -- Which Is Better? | Ask Grace`
- **Meta description:** `Comparing Ask Grace and ChatGPT for seniors. See which AI is safer, simpler, and better designed for people over 65.`
- **H1:** `Ask Grace vs ChatGPT: Which AI Is Better for Seniors?`
- **Quick verdict (50-80 words):** Featured snippet target
- **Comparison table:** Side-by-side with 8-10 criteria
- **Detailed breakdown:** H3 per criterion with 100-200 words each
- **"Who should use which" section:** Honest recommendation
- **FAQ block**
- **CTA**
- **Schema:** `Article`, `FAQPage`, `BreadcrumbList`
- **Content length:** 1,500-2,000 words

### 8.4 Blog Article

- **Title:** `[Descriptive Title] | Ask Grace Blog`
- **Meta description:** 140-155 chars summarizing the article
- **H1:** Same as or similar to title (without "| Ask Grace Blog")
- **Intro (100 words):** Hook + what the reader will learn
- **Body:** H2 sections, H3 subsections, short paragraphs, bullet lists
- **Key takeaways box:** 3-5 bullet points
- **FAQ block:** 3-5 questions
- **Related articles:** 3 links
- **Author byline:** Name, brief bio
- **CTA**
- **Schema:** `Article`, `BreadcrumbList`, `FAQPage`
- **Content length:** 1,200-2,000 words

### 8.5 FAQ Page (`/faq`)

- **Title:** `Frequently Asked Questions About Ask Grace | Ask Grace`
- **Meta description:** `Get answers to common questions about Ask Grace -- safety, privacy, cost, how it works, and more.`
- **H1:** `Frequently Asked Questions`
- **Category sections:** Group by theme (Getting Started, Safety, Privacy, Features, Technical)
- **Each Q:** `<details>` element with `<summary>` as H3
- **Each A:** Clear, complete answer in 2-4 sentences
- **Schema:** `FAQPage` with all questions, `BreadcrumbList`
- **Content length:** 2,000-3,000 words (20-30 questions)

### 8.6 Topic Hub (`/topics/scam-protection`)

- **Title:** `Scam Protection for Seniors -- How AI Can Help | Ask Grace`
- **Meta description:** `Learn how Ask Grace helps protect seniors from common scams. IRS calls, tech support fraud, fake prizes -- Grace detects them all.`
- **H1:** `How Ask Grace Protects Seniors from Scams`
- **Overview (200 words):** Topic introduction
- **Related guides list:** Links to 5-10 related blog posts and guides
- **Feature spotlight:** How Grace handles this topic specifically
- **FAQ block**
- **CTA**
- **Schema:** `WebPage`, `BreadcrumbList`
- **Content length:** 1,000-1,500 words

---

## SECTION 9: TECHNICAL SEO CHECKLIST

### 9.1 Metadata
- [ ] Fix canonical domain inconsistency: Decide on `www.askgrace.org` vs `askgrace.org` and use it consistently everywhere (canonical tags, sitemap, OG URLs, internal links)
- [ ] Set up 301 redirect from non-preferred domain variant to preferred
- [ ] Add OG and Twitter card tags to privacy.html and terms.html
- [ ] Compress `og-image.png` from 1.2MB to under 300KB
- [ ] Create page-specific OG images for key pages (for-seniors, safe-ai, etc.)
- [ ] Remove `<meta name="keywords">` tag (ignored by Google, reveals strategy to competitors)
- [ ] Shorten homepage meta description to under 155 characters

### 9.2 Canonicals
- [ ] Every page must have a `<link rel="canonical">` with absolute URL
- [ ] Canonical domain must match across all pages and sitemap
- [ ] No trailing slashes in canonicals (match Vercel's behavior with `cleanUrls`)

### 9.3 OG Tags
- [ ] Every public page needs: og:type, og:url, og:title, og:description, og:image, og:site_name
- [ ] Blog articles should use `og:type: article` with `article:published_time` and `article:author`
- [ ] OG images should be 1200x630px, under 300KB

### 9.4 Sitemap
- [ ] Update sitemap.xml every time a new page is added to `landing/`
- [ ] Add all new pages with appropriate priority and changefreq
- [ ] Ensure sitemap domain matches canonical domain
- [ ] Consider a sitemap index if page count exceeds 50

### 9.5 Robots.txt
- [ ] Add `Disallow: /api/` if any API routes exist on the landing domain
- [ ] Consider adding `llms.txt` at root for AI crawler context
- [ ] Ensure Sitemap URL uses correct domain variant

### 9.6 Structured Data
- [ ] Add Organization schema to homepage
- [ ] Add WebSite schema to homepage
- [ ] Add FAQPage schema to homepage (7 existing FAQ items)
- [ ] Add BreadcrumbList schema to all subpages
- [ ] Validate all schema with Google Rich Results Test before deploying
- [ ] Never add schema types that do not correspond to visible page content

### 9.7 Page Speed
- [ ] Inline critical CSS (already done -- CSS is in `<style>` tags)
- [ ] Preconnect to Google Fonts (already done)
- [ ] Use `font-display: swap` (already using `display=swap` in Google Fonts URL)
- [ ] Compress OG image
- [ ] Consider self-hosting fonts for faster load (eliminates Google Fonts render-blocking)
- [ ] Add `loading="lazy"` to any below-fold images added in future

### 9.8 Rendering / Indexability
- [ ] Landing site: Static HTML, fully crawlable -- no issues
- [ ] App (app.askgrace.org): Client-side SPA, not indexable -- correct behavior
- [ ] Ensure app.askgrace.org has its own robots.txt with `Disallow: /` if it should not be indexed
- [ ] Add `<meta name="robots" content="noindex, nofollow">` to the app's `index.html` at `/Users/austin/Desktop/hashtagadagency/askgrace/index.html`

### 9.9 404 Handling
- [ ] Create a custom `404.html` in `landing/` folder
- [ ] Style it consistently with the rest of the site
- [ ] Include navigation links back to key pages
- [ ] Vercel serves custom 404.html automatically

### 9.10 Breadcrumbs
- [ ] Add visible breadcrumb HTML to all pages except homepage
- [ ] Add corresponding BreadcrumbList JSON-LD schema
- [ ] Breadcrumb text should match page titles

### 9.11 LLM-Crawlability
- [ ] Create `/llms.txt` with site description, purpose, and key pages
- [ ] Ensure content is in semantic HTML (not hidden behind JS interactions)
- [ ] The existing `<details>` FAQ elements are accessible to crawlers -- good

---

## SECTION 10: PHASED IMPLEMENTATION ROADMAP

### Phase 1: Quick Wins (Week 1-2)

**Objective:** Fix technical SEO issues and capture low-hanging rich results

**Deliverables:**
1. Fix canonical domain inconsistency across all files
2. Add FAQPage schema to homepage (7 existing questions)
3. Add Organization + WebSite schema to homepage
4. Compress OG image to under 300KB
5. Add OG + Twitter tags to privacy.html and terms.html
6. Add `<meta name="robots" content="noindex">` to the React app's index.html
7. Create custom 404.html
8. Remove `<meta name="keywords">` from homepage
9. Shorten meta description to under 155 chars

**Dependencies:** None
**Complexity:** Low
**SEO Impact:** Medium (rich results from FAQ schema, technical foundation)

### Phase 2: Core Audience Pages (Week 2-4)

**Objective:** Create the highest-value pages that target direct conversion keywords

**Deliverables:**
1. Create `/for-seniors` page (HTML file in landing/)
2. Create `/for-beginners` page
3. Create `/safe-ai` page
4. Create `/faq` standalone page (expanded from homepage FAQ)
5. Add main navigation to all pages (shared nav pattern)
6. Add breadcrumbs to all subpages
7. Update sitemap.xml with new pages
8. Update footer links on all pages

**Dependencies:** Phase 1 (canonical fix)
**Complexity:** Medium
**SEO Impact:** High (targets primary keywords with dedicated pages)

### Phase 3: Comparison & Programmatic Pages (Week 4-6)

**Objective:** Capture commercial-intent and long-tail traffic

**Deliverables:**
1. Create `/compare/grace-vs-chatgpt`
2. Create `/is-ai-safe-for-seniors`
3. Create `/best-ai-for-seniors`
4. Create `/is-ai-safe-for-elderly-parents`
5. Create `/best-ai-for-elderly-parents`
6. Create `/how-to-use-ai` getting started guide
7. Update sitemap.xml

**Dependencies:** Phase 2 (nav and breadcrumb patterns established)
**Complexity:** Medium
**SEO Impact:** High (low-competition keywords with high conversion potential)

### Phase 4: Topic Hubs & Guides (Week 6-10)

**Objective:** Build topical authority clusters

**Deliverables:**
1. Create `/topics/scam-protection`
2. Create `/topics/health-questions`
3. Create `/topics/companionship`
4. Create `/guides/ai-explained-simply`
5. Create `/how-to-use-ai-for-health-questions`
6. Create `/how-to-use-ai-for-scam-protection`
7. Create `/use-cases/caregiver-setup`
8. Build internal linking between all pages

**Dependencies:** Phase 3
**Complexity:** Medium-High (more content needed)
**SEO Impact:** Medium-High (topical authority, more indexed pages)

### Phase 5: Blog Launch (Week 10-14)

**Objective:** Create a content engine for ongoing organic growth

**Deliverables:**
1. Create `/blog/index.html` listing page
2. Publish 5-8 initial blog posts targeting long-tail keywords
3. Establish blog post template with consistent structure
4. Create an editorial calendar for ongoing publishing
5. Suggested initial posts:
   - "Why Seniors Don't Need to Fear AI"
   - "5 Ways AI Can Help You Stay Independent"
   - "How to Spot a Scam: A Senior's Guide"
   - "Setting Up AI for Your Elderly Parent: A Caregiver's Guide"
   - "What Is ChatGPT and Should Seniors Use It?"

**Dependencies:** Phase 4
**Complexity:** High (ongoing content production)
**SEO Impact:** High long-term (compound growth, topical authority)

### Phase 6: Authority Building (Week 14+)

**Objective:** Build domain authority and external signals

**Deliverables:**
1. Submit to senior-focused directories and resource lists
2. Pursue guest posting on senior/caregiver/health blogs
3. Create shareable resources (printable guides, checklists)
4. Expand programmatic pages to more audiences
5. Add additional comparison pages
6. Monitor rankings and iterate on content
7. Pursue AARP, senior living community, and caregiver network mentions

**Dependencies:** Phases 1-5
**Complexity:** High (requires outreach)
**SEO Impact:** Very High long-term (domain authority growth)

---

## SECTION 11: RISKS & TRADEOFFS

### 11.1 Thin Content Risk

Creating many programmatic pages (e.g., 20 "Is AI safe for [audience]" pages) risks triggering Google's thin content penalty if the pages are too similar. **Guardrails:**
- Each programmatic page must have at least 1,200 words of unique content
- At least 3 sections per page must be entirely unique (not template fill-in-the-blank)
- Start with 5-8 pages, monitor indexing and rankings before expanding
- If Google's Search Console shows "Crawled - currently not indexed" for these pages, consolidate

### 11.2 YMYL Risk

Health questions and scam protection content falls under Google's "Your Money or Your Life" (YMYL) criteria. **Guardrails:**
- Always include disclaimers: "Grace is not a doctor/lawyer/financial advisor"
- Cite authoritative sources (CDC, FTC, NIH) where relevant
- Include author attribution on blog posts (ideally with medical/tech credentials)
- Never make specific medical/legal/financial claims
- The existing safety disclaimers on the homepage and in the app are strong -- maintain this pattern

### 11.3 Keyword Cannibalization

Multiple pages targeting similar keywords (e.g., `/for-seniors` vs `/best-ai-for-seniors` vs `/is-ai-safe-for-seniors`) could cannibalize each other. **Guardrails:**
- Each page must target a distinct primary keyword with distinct search intent
- `/for-seniors` = commercial, "I want an AI for seniors"
- `/best-ai-for-seniors` = commercial comparison, "which AI is best for seniors"
- `/is-ai-safe-for-seniors` = informational, "I'm worried about safety"
- Monitor Search Console for which page ranks for which queries; consolidate if needed

### 11.4 Over-Optimization Risk

Stuffing every title with "seniors" and "safe" could appear spammy. **Guardrails:**
- Vary title structures
- Use natural language in headings
- Do not repeat the exact same phrase more than 2-3 times per page
- Write for humans first, then optimize for search

### 11.5 Static HTML Scaling Risk

Managing 30-50 static HTML files without a CMS or build system becomes error-prone (updating nav across all files, etc.). **Mitigations:**
- Create an HTML template with shared nav/footer as a reference
- Use a simple build script (even a bash script) to inject shared partials into pages
- Consider a lightweight static site generator (11ty/Eleventy) for the landing/ folder only -- this is NOT a framework migration; Eleventy outputs plain HTML and fits the existing Vercel static deployment

### 11.6 What to Avoid

- Do NOT add fake reviews or testimonials to structured data
- Do NOT create doorway pages (pages that are essentially identical targeting different city names)
- Do NOT hide text or links for SEO purposes
- Do NOT build links through PBNs or link farms
- Do NOT claim medical credentials or expertise the team does not have
- Do NOT add `aggregateRating` schema without real user reviews

---

## SECTION 12: FIRST ACTIONS

The immediate next steps for the team, in priority order:

1. **Decide canonical domain:** Choose `www.askgrace.org` or `askgrace.org`. Update ALL files: homepage canonical, sitemap, OG URLs. Set up 301 redirect for the non-preferred variant in Vercel's domain settings.

2. **Add FAQPage schema to homepage:** The 7 FAQ items already exist in HTML. Adding JSON-LD for FAQPage takes 15 minutes and can trigger FAQ rich results in Google within days.

3. **Add Organization and WebSite schema to homepage.** Another 10-minute task.

4. **Compress the OG image.** Run it through TinyPNG or similar. Target under 300KB.

5. **Add noindex to the React app.** Add `<meta name="robots" content="noindex, nofollow">` to `/Users/austin/Desktop/hashtagadagency/askgrace/index.html` (the Vite app entry point at app.askgrace.org).

6. **Create the `/for-seniors` page.** This is the single highest-value new page. Use the homepage as a structural template. Target "ai for seniors" and "ai companion for seniors."

7. **Create the `/is-ai-safe-for-seniors` page.** Second highest-value page. Directly addresses the #1 barrier to adoption.

8. **Submit sitemap to Google Search Console.** If not already done, verify the domain in GSC and submit the sitemap.

---

## PRIORITIZED ENGINEERING TASK LIST

| Priority | Task | Effort | Files Affected |
|----------|------|--------|----------------|
| P0 | Fix canonical domain inconsistency | 30 min | `landing/index.html`, `landing/sitemap.xml`, `landing/robots.txt` |
| P0 | Add FAQPage JSON-LD to homepage | 15 min | `landing/index.html` |
| P0 | Add Organization + WebSite JSON-LD to homepage | 15 min | `landing/index.html` |
| P0 | Add noindex meta to React app | 5 min | `index.html` (root) |
| P1 | Add OG + Twitter tags to privacy.html and terms.html | 20 min | `landing/privacy.html`, `landing/terms.html` |
| P1 | Compress og-image.png | 10 min | `landing/og-image.png` |
| P1 | Create shared nav/footer HTML pattern for reuse | 1 hr | New reference template |
| P1 | Create `/for-seniors` page | 2-4 hr | `landing/for-seniors.html` |
| P1 | Create `/for-beginners` page | 2-4 hr | `landing/for-beginners.html` |
| P1 | Create `/safe-ai` page | 2-4 hr | `landing/safe-ai.html` |
| P1 | Create `/faq` standalone page | 2-3 hr | `landing/faq.html` |
| P2 | Create `/is-ai-safe-for-seniors` | 2-3 hr | `landing/is-ai-safe-for-seniors.html` |
| P2 | Create `/best-ai-for-seniors` | 2-3 hr | `landing/best-ai-for-seniors.html` |
| P2 | Create `/compare/grace-vs-chatgpt` | 3-4 hr | `landing/compare/grace-vs-chatgpt.html` |
| P2 | Create custom 404 page | 1 hr | `landing/404.html` |
| P2 | Update sitemap.xml with all new pages | 30 min | `landing/sitemap.xml` |
| P3 | Create build script for shared partials | 2-3 hr | New build script |
| P3 | Create `/topics/` hub pages | 2-3 hr each | `landing/topics/*.html` |
| P3 | Create `/how-to-use-ai` page | 2-3 hr | `landing/how-to-use-ai.html` |
| P3 | Create `/blog/` infrastructure | 3-4 hr | `landing/blog/index.html` + posts |

## PRIORITIZED SEO/CONTENT TASK LIST

| Priority | Task | Effort | Notes |
|----------|------|--------|-------|
| P0 | Verify domain in Google Search Console | 15 min | Essential for monitoring |
| P0 | Submit sitemap to GSC | 5 min | After sitemap fixes |
| P1 | Write content for `/for-seniors` | 3-4 hr | 1,500-2,000 words, audience-specific |
| P1 | Write content for `/safe-ai` | 3-4 hr | 1,800-2,500 words, addresses fears |
| P1 | Write content for `/for-beginners` | 3-4 hr | 1,500-2,000 words |
| P1 | Expand FAQ to 20-30 questions for standalone /faq page | 2-3 hr | Organize by category |
| P2 | Write `/is-ai-safe-for-seniors` | 3-4 hr | 1,200+ words unique content |
| P2 | Write `/best-ai-for-seniors` | 3-4 hr | Include honest comparison table |
| P2 | Write `/compare/grace-vs-chatgpt` | 3-4 hr | Fair, honest comparison |
| P2 | Keyword research validation | 2-3 hr | Use GSC data + free tools to validate volume estimates |
| P3 | Write 5 initial blog posts | 15-20 hr | See Phase 5 topic list |
| P3 | Create editorial calendar | 2 hr | Monthly publishing cadence |
| P3 | Write topic hub content | 6-8 hr | 3-4 topic hubs |
| P4 | Outreach to senior-focused directories | Ongoing | Phase 6 authority building |

## ROUTE-BY-ROUTE IMPLEMENTATION RECOMMENDATIONS

| Route | Action | Template Base | Schema Needed | Internal Links To |
|-------|--------|---------------|---------------|-------------------|
| `/` (homepage) | Update: fix canonical, add schemas, compress OG | Existing | SoftwareApplication, Organization, WebSite, FAQPage | /for-seniors, /for-beginners, /safe-ai, /faq |
| `/privacy` | Update: add OG tags, breadcrumb schema | Existing | WebPage, BreadcrumbList | /, /terms |
| `/terms` | Update: add OG tags, breadcrumb schema | Existing | WebPage, BreadcrumbList | /, /privacy |
| `/for-seniors` | Create new | Senior audience template | WebPage, FAQPage, BreadcrumbList | /, /safe-ai, /best-ai-for-seniors, /compare/* |
| `/for-beginners` | Create new | Audience template | WebPage, FAQPage, BreadcrumbList | /, /how-to-use-ai, /guides/* |
| `/safe-ai` | Create new | Trust/safety template | Article, FAQPage, BreadcrumbList | /, /is-ai-safe-for-*, /for-seniors |
| `/faq` | Create new | FAQ template | FAQPage, BreadcrumbList | /, /for-seniors, /safe-ai |
| `/how-to-use-ai` | Create new | Guide template | HowTo, BreadcrumbList | /, /for-beginners, /how-to-use-ai-for-* |
| `/compare/grace-vs-chatgpt` | Create new | Comparison template | Article, FAQPage, BreadcrumbList | /, /for-seniors, /best-ai-for-seniors |
| `/is-ai-safe-for-seniors` | Create new | Programmatic safety template | Article, FAQPage, BreadcrumbList | /safe-ai, /for-seniors |
| `/best-ai-for-seniors` | Create new | Programmatic "best" template | Article, FAQPage, BreadcrumbList | /for-seniors, /compare/* |
| `/topics/scam-protection` | Create new | Topic hub template | WebPage, BreadcrumbList | /, /for-seniors, blog posts |
| `/blog/index` | Create new | Blog listing template | WebPage, BreadcrumbList | /, all blog posts |
| `/blog/[slug]` | Create new | Blog article template | Article, FAQPage, BreadcrumbList | /, /blog/, hub pages |

## REUSABLE COMPONENTS FOR SCALABLE SEO PAGES

Since the landing site is static HTML, "components" means reusable HTML snippets to copy into each page:

1. **Shared `<head>` block** -- Standard meta tags, fonts, favicons, GTM. Parameterize: title, description, canonical URL, OG image.

2. **Navigation HTML** -- Consistent nav bar across all pages with links to core sections. File reference: model after the `<nav>` in `landing/index.html` but expanded.

3. **Breadcrumb HTML + Schema** -- Visible breadcrumb trail with corresponding JSON-LD. Parameterize: array of {name, url} pairs.

4. **FAQ section HTML + Schema** -- `<details>` elements with corresponding FAQPage JSON-LD. Parameterize: array of {question, answer} pairs.

5. **CTA block** -- Consistent call-to-action section linking to `app.askgrace.org`. Two variants: inline (within content) and full-width (section-level).

6. **Footer HTML** -- Expanded footer with full site navigation. Same across all pages.

7. **Article header** -- For blog/guide pages: H1, author byline, date, breadcrumbs, reading time.

8. **Related content block** -- "You might also like" section with 3 card links. Parameterize: array of {title, url, description}.

9. **Safety disclaimer** -- Standard disclaimer text for YMYL pages. Already exists in footer of homepage.

10. **Comparison table** -- HTML table with Grace vs competitor columns. Parameterize: criteria rows and cell values.

## MIGRATIONS & CONTENT MODEL CHANGES NEEDED

1. **No framework migration needed.** The static HTML approach works perfectly for SEO. Do NOT migrate to Next.js, Gatsby, or any SSR framework for the landing site.

2. **Build tooling addition (recommended, not required):** Consider adding a simple build step for the `landing/` folder to inject shared nav/footer into all pages. Options:
   - A shell script using `sed` to replace placeholder comments with partial HTML files
   - Eleventy (11ty) configured to output into `landing/` -- zero-config static site generator
   - This prevents the "update nav in 30 files" problem as the site grows

3. **Folder structure change:** Create subdirectories in `landing/` for page categories:
   ```
   landing/
     index.html
     for-seniors.html
     for-beginners.html
     safe-ai.html
     how-to-use-ai.html
     faq.html
     404.html
     compare/
       grace-vs-chatgpt.html
     topics/
       scam-protection.html
     guides/
       ai-explained-simply.html
     blog/
       index.html
       why-seniors-dont-need-to-fear-ai.html
     is-ai-safe-for-seniors.html
     best-ai-for-seniors.html
   ```

4. **Vercel configuration:** The existing `landing/vercel.json` with `cleanUrls: true` handles .html extension removal automatically. No changes needed. Subdirectories like `compare/grace-vs-chatgpt.html` will automatically be served at `/compare/grace-vs-chatgpt`.

5. **Content model:** No database or CMS is needed at this stage. Static HTML files are sufficient for 20-50 pages. Revisit when approaching 100+ pages.

6. **Image assets:** Create a `landing/images/` directory for blog post images, page-specific OG images, and any screenshots or diagrams used in content pages.

7. **React app change:** Add `<meta name="robots" content="noindex, nofollow">` to the root `index.html` at `/Users/austin/Desktop/hashtagadagency/askgrace/index.html` to ensure the SPA is not indexed if crawlers reach it.

---

### Critical Files for Implementation

- `/Users/austin/Desktop/hashtagadagency/askgrace/landing/index.html` -- Homepage requiring schema additions (FAQPage, Organization, WebSite), canonical fix, meta description shortening, and keywords tag removal
- `/Users/austin/Desktop/hashtagadagency/askgrace/landing/sitemap.xml` -- Must be updated with every new page and domain must match canonical
- `/Users/austin/Desktop/hashtagadagency/askgrace/landing/vercel.json` -- Already correctly configured with `cleanUrls: true`; may need custom 404 routing later
- `/Users/austin/Desktop/hashtagadagency/askgrace/index.html` -- React app entry point that needs a noindex meta tag added
- `/Users/austin/Desktop/hashtagadagency/askgrace/landing/robots.txt` -- Domain in Sitemap directive must match canonical domain choice
