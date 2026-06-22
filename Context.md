# AlgoViz — Product Context Document
**Version:** 2.0 | **Date:** June 2026  
**Purpose:** LLM context document — feed this to any AI to get full product understanding

---

## 1. WHAT WE ARE BUILDING

**AlgoViz** is a mini SaaS that does three things no existing tool does together:

1. **Paste your code → AI animates it** step by step (linked lists, trees, graphs, arrays, etc.)
2. **AI tells you what's wrong** — what your code does vs. what it should do
3. **AI shows the correct solution** — visual diff, explanation of what to change and why

Plus a **library of predefined visualizations** for all major DSA patterns (sliding window, two pointers, BFS/DFS, linked list reversal, etc.) that users can browse and learn from without pasting any code.

---

## 2. THE PROBLEM WE SOLVE

Every existing tool fails in at least one critical way:

| Tool | What it does | What it DOESN'T do |
|---|---|---|
| LeetCode | Problem bank, run code | No visualization, no AI explanation of WHY |
| NeetCode | Video solutions | Static, pre-recorded, can't visualize YOUR code |
| AlgoMonster | Pattern-based learning, templates | No animation of custom code, no "what's wrong with mine" |
| VisuAlgo | Predefined animations of standard algos | Cannot take user's code as input |
| algorithm-visualizer.org | Can visualize custom JS code | No AI, no error detection, no "correct solution" overlay |
| Python Tutor | Step-through code execution | Text only, no DSA-specific visual metaphors |

**The gap:** Nobody combines (a) custom code input + (b) animated DSA visualization + (c) AI that identifies the bug + (d) shows the correct approach visually.

---

## 3. TARGET USER

**Primary:** CS students and software engineers preparing for technical interviews at FAANG/top tech companies.

**Secondary:** Self-taught developers learning DSA for the first time.

**Pain they feel:**
- "I understand the concept but I can't see why my pointer logic is wrong."
- "My code fails 3 test cases but I don't know what's happening inside."
- "I've watched 10 videos on linked list reversal but it still doesn't click visually."
- "I need something that shows ME my code, not a generic animation."

---

## 4. CORE FEATURES

### Feature 1: AI Code Animator (Main Feature)
- User pastes their code (C++, Python, Java, JavaScript)
- User provides input (e.g., `1->2->3->4->5, k=3`)
- AI traces execution step by step
- Output: animated SVG/canvas visualization with:
  - Nodes drawn as visual boxes/circles
  - Pointers (`prev`, `curr`, `next`, `left`, `right`, `slow`, `fast`, etc.) shown as labeled arrows
  - Step counter + description of what each line does
  - Play / Pause / Previous / Next controls
  - Speed control (slow / normal / fast)

### Feature 2: AI Bug Detector + Fix Suggester
- After animating the user's code, AI compares behavior to the expected correct execution
- Outputs:
  - "Your code fails at step 4 — `curr->next` is being reassigned before saving `nextNode`"
  - Highlights the exact line(s) causing the issue
  - Shows the CORRECT animation running in a side-by-side or overlay view
  - Explains in plain English what to change and why
  - Provides corrected code diff

### Feature 3: Predefined Pattern Library
A curated set of animations for all major DSA patterns that users can browse, interact with, and learn from without pasting any code:

**Linked Lists**
- Reversal (k-group, full, partial)
- Fast & slow pointers (cycle detection)
- Merge two sorted lists
- Find middle node

**Trees**
- BFS level-order traversal
- DFS (inorder, preorder, postorder)
- Height/depth calculation
- Lowest common ancestor

**Arrays / Sliding Window**
- Sliding window (fixed, dynamic)
- Two pointers (opposite ends, same direction)
- Kadane's algorithm
- Binary search

**Graphs**
- BFS / DFS
- Dijkstra's shortest path
- Topological sort

**Dynamic Programming**
- Fibonacci (top-down vs bottom-up)
- 0/1 Knapsack
- Longest Common Subsequence

Each predefined visualization includes:
- The animated execution with pointer labels
- Pattern explanation ("When to use this pattern")
- Template code in C++, Python, Java, JS
- Common LeetCode problems that use this pattern

### Feature 4: Ask the AI
After any animation (user's code or predefined), user can chat with AI:
- "Why does prev need to start at NULL?"
- "What happens if k > length of list?"
- "Show me what happens with input 1->2->3 instead"
AI re-runs/re-explains using the visual context already on screen.

---

## 5. USER FLOW

```
Landing Page
    ↓
[Try Free] → Paste Code + Input
    ↓
AI traces execution → Generates step data
    ↓
Animated visualization renders
    ↓
[Optional] AI Bug Analysis → Shows what's wrong
    ↓
[Optional] Correct solution overlay
    ↓
User asks follow-up questions in chat
    ↓
[Upgrade to Pro] for unlimited runs + full pattern library
```

---

## 6. COMPETITIVE LANDSCAPE & MARKET PRICING

### Direct Competitors (Pricing as of 2026)

| Platform | Price | Model | What they do |
|---|---|---|---|
| LeetCode Premium | $159/year | Annual subscription | Problem bank + company tags |
| NeetCode Pro | $119/year or $219 lifetime | Subscription or one-time | Video solutions + spaced repetition |
| AlgoMonster | ~$300–$459 lifetime | One-time purchase | Pattern-based learning, templates |
| AlgoExpert | $199/year | Annual subscription | Video solutions + integrated IDE |
| Design Gurus | $180/year | Annual subscription | Pattern courses, text-first |
| VisuAlgo | Free | Donation-funded | Static predefined visualizations |
| algorithm-visualizer.org | Free | Open source | Custom JS code visualization (no AI) |

### Key Insight from Market Research
- The $119–$300 price range is well-established and accepted by interview preppers
- Lifetime deals convert well in this market (AlgoMonster uses this effectively)
- **No competitor** offers: custom code input + AI animation + bug detection + correct solution
- The "what's wrong with MY code" use case is completely unaddressed

---

## 7. PROPOSED PRICING

### Free Tier (always free)
- 3 AI code animations per day
- Full access to predefined pattern library (view-only, no customization)
- Basic step-through controls
- No bug analysis

### Pro — $12/month or $99/year
- Unlimited AI code animations
- Full bug detection + correct solution overlay
- Side-by-side comparison (your code vs. correct)
- Customizable inputs for all predefined patterns
- AI chat on any visualization
- All languages (C++, Python, Java, JS)
- Export animations as GIF or shareable link

### Lifetime — $199 one-time
- Everything in Pro, forever
- Priority AI processing
- Early access to new pattern animations
- Best for serious interview preppers who want a permanent resource

### Team/Bootcamp — $49/month for up to 10 seats
- All Pro features
- Instructor dashboard (see which students are struggling with which patterns)
- Custom pattern uploads
- Bulk seat management

---

## 8. MONETIZATION STRATEGY

1. **Freemium → Pro conversion**: 3 free runs/day creates habit, then paywall hits when user needs it most (debugging a hard problem at night before interview)
2. **Lifetime deal launch**: Launch with a lifetime deal ($149 intro, raise to $199) to get early revenue + testimonials
3. **Bootcamp B2B**: Partner with coding bootcamps as a tool for their DSA curriculum
4. **Affiliate**: NeetCode, TechLead, etc. have large audiences that pay for prep tools

---

## 9. TECH STACK RECOMMENDATION

### Frontend
- **Next.js 14** (App Router) — fast, SEO-friendly landing page + app in one
- **Tailwind CSS** — rapid UI
- **Framer Motion** — smooth pointer/arrow animations
- **SVG** for the visualization canvas (lightweight, scalable)

### Backend / AI
- **Anthropic Claude API** (claude-sonnet-4-6) — for code tracing, bug detection, explanation
- **Next.js API Routes** — simple serverless backend
- **Prompt architecture**: System prompt provides DSA visualization schema; user sends code + input; Claude returns JSON step-data; frontend renders animation

### Auth + Payments
- **Clerk** — authentication (fast setup)
- **Stripe** — subscriptions + one-time payments
- **Supabase** — user data, usage tracking, saved visualizations

### Hosting
- **Vercel** — deploy Next.js in one click

---

## 10. AI PROMPT ARCHITECTURE

### Step 1: Code Tracer Prompt
```
System: You are a DSA code execution tracer. Given code and input, return a JSON array of execution steps. Each step has:
{
  "step": number,
  "description": "what is happening in plain English",
  "code_line": "the line of code executing",
  "variables": { "prev": null, "curr": 1, "nextNode": 2, ... },
  "nodes": [1, 2, 3, 4, 5],
  "edges": [[1,2],[2,3],[3,4],[4,5]],
  "pointers": { "curr": 1, "prev": null, "nextNode": 2 },
  "highlighted_nodes": [1],
  "reversed_edges": []
}
Return ONLY valid JSON. No prose. No markdown.

User: 
Code: [paste code]
Input: 1->2->3->4->5, k=3
Language: C++
```

### Step 2: Bug Detector Prompt
```
System: You are a DSA bug analyzer. Compare the user's execution trace against the correct execution for this problem. Identify:
1. The first step where execution diverges
2. The specific variable(s) that are wrong
3. The root cause (one sentence)
4. The fix (one sentence)
5. The corrected code (diff format)

User:
Problem: Reverse first k nodes of a linked list
User's step trace: [JSON from Step 1]
Expected output: 3->2->1->4->5
```

### Step 3: Chat Follow-up Prompt
```
System: You are explaining a DSA algorithm visualization. The user is currently looking at an animated visualization of [algorithm name] with input [input]. The execution trace is [JSON]. Answer questions concisely, referencing specific steps by number when possible.
```

---

## 11. MVP SCOPE (Ship in 2 Weeks)

### Week 1
- [ ] Landing page (problem, solution, demo GIF, pricing, waitlist)
- [ ] Basic animation engine (SVG, step-through, prev/next controls)
- [ ] 5 predefined patterns in the library (linked list reversal, two pointers, sliding window, BFS, binary search)
- [ ] AI code tracer integration (Claude API → JSON steps → render animation)

### Week 2
- [ ] Bug detection feature
- [ ] Auth (Clerk) + usage limits (3/day free)
- [ ] Stripe payments (Pro monthly + Lifetime)
- [ ] AI chat on visualizations
- [ ] Share link for animations

### Post-MVP
- [ ] More predefined patterns (20+ total)
- [ ] Multi-language support (currently C++ priority, then Python)
- [ ] Side-by-side (your code vs. correct)
- [ ] Export as GIF
- [ ] Bootcamp dashboard

---

## 12. PREDEFINED VISUALIZATION DATA FORMAT

Each predefined visualization is stored as a JSON file:

```json
{
  "id": "linked-list-reversal-k-group",
  "name": "Reverse Linked List (K-Group)",
  "category": "Linked Lists",
  "pattern": "Pointer Manipulation",
  "difficulty": "Medium",
  "leetcode_problems": [25, 92, 206],
  "languages": {
    "cpp": "...",
    "python": "...",
    "java": "..."
  },
  "default_input": { "list": [1,2,3,4,5], "k": 3 },
  "steps": [
    {
      "step": 0,
      "description": "Initial state. prev=NULL, curr points to head (node 1).",
      "variables": { "prev": null, "curr": 1, "nextNode": null, "i": 1 },
      "nodes": [1,2,3,4,5],
      "edges": [[1,2],[2,3],[3,4],[4,5]],
      "pointers": { "curr": 1, "prev": null }
    }
  ],
  "pattern_explanation": "Use three pointers: prev, curr, nextNode. Save next, reverse link, advance.",
  "when_to_use": "When asked to reverse all or part of a linked list in-place.",
  "time_complexity": "O(n)",
  "space_complexity": "O(1)"
}
```

---

## 13. LANDING PAGE COPY (Draft)

**Headline:** Your code, animated. Your bugs, explained.

**Subheadline:** Paste your linked list, tree, or graph code → watch it execute step by step → see exactly where it breaks and how to fix it.

**CTA:** Try it free — no signup required

**Social Proof:** "The first tool that shows me *my* code failing, not a generic animation." — Beta user

**Feature Bullets:**
- Paste any DSA code in C++, Python, or Java
- AI traces every pointer, arrow, and variable change
- Bug detected? See the exact step where your logic breaks
- Side-by-side: your buggy execution vs. the correct one
- Library of 20+ animated patterns — linked lists, trees, graphs, DP, and more
- Ask AI anything about the visualization

---

## 14. KEY DIFFERENTIATORS TO EMPHASIZE IN MARKETING

1. **"Your code, not a demo"** — every other tool shows generic animations. We animate YOUR submission.
2. **"Not just where, but why"** — we don't just show the bug, we explain the reasoning and show the fix visually.
3. **"Interview-ready patterns"** — our library maps directly to LeetCode patterns, not academic CS topics.
4. **"One tool, complete loop"** — learn pattern → write code → see it animate → get bug report → fix → repeat. All in one place.

---

## 15. RISKS & MITIGATIONS

| Risk | Mitigation |
|---|---|
| Claude API costs spike at scale | Rate-limit free tier aggressively (3/day), cache predefined animations, only call API for user code |
| Code tracing accuracy (AI hallucinates steps) | Add validation layer: parse JSON, check node/edge consistency, show "verify manually" warning for complex code |
| Users expect all languages | Launch C++ + Python only, add Java/JS in v2 |
| Competitors copy the idea | Speed to market + quality of predefined library is the moat. Ship fast. |
| Low conversion from free to paid | Ensure the free 3-run limit hits at the most painful moment (when they find a bug but can't see the fix) |

---

## 16. PAGES — FULL SITEMAP & LAYOUT SPEC

Every page the product needs, what it contains, and its single job.

---

### PAGE 1: Landing Page `/`
**Single job:** Convert a visitor into a free trial user in under 60 seconds.

**Sections (top to bottom):**

```
┌─────────────────────────────────────────────┐
│  NAV: Logo | Patterns | Pricing | Login | [Try Free →] │
├─────────────────────────────────────────────┤
│  HERO                                        │
│  Headline: "Your code, animated."            │
│  Sub: Paste DSA code → AI traces every       │
│       pointer → see exactly where it breaks  │
│  [Try it free] [See an example →]            │
│  ── Live demo widget (embedded, no signup) ──│
│    [Linked list reversal, 5 nodes, playing]  │
├─────────────────────────────────────────────┤
│  PROBLEM STRIP                               │
│  3 columns: "You watch videos" / "You read   │
│  solutions" / "You still don't get it"       │
│  → "AlgoViz shows you what YOUR code does"  │
├─────────────────────────────────────────────┤
│  HOW IT WORKS  (3 steps, horizontal)         │
│  1. Paste your code + input                  │
│  2. AI traces every step, animated           │
│  3. See bugs, get the fix, understand why    │
├─────────────────────────────────────────────┤
│  FEATURE DEEP DIVE (alternating L/R)         │
│  - AI Code Animator (screenshot/gif)         │
│  - Bug Detector + Fix (side-by-side view)    │
│  - Pattern Library (grid of cards)           │
│  - Ask AI (chat panel)                       │
├─────────────────────────────────────────────┤
│  PATTERN LIBRARY PREVIEW                     │
│  Scrollable row of cards:                    │
│  Linked List | Trees | Graphs | Sliding Win  │
│  Each card: name, animated GIF, "Explore →" │
├─────────────────────────────────────────────┤
│  PRICING (3 tiers: Free / Pro / Lifetime)   │
├─────────────────────────────────────────────┤
│  SOCIAL PROOF / TESTIMONIALS                 │
├─────────────────────────────────────────────┤
│  FINAL CTA: "Start visualizing for free"    │
├─────────────────────────────────────────────┤
│  FOOTER: Links | Twitter | GitHub | Pricing  │
└─────────────────────────────────────────────┘
```

---

### PAGE 2: Visualizer App `/app`
**Single job:** Let the user paste code and see it animate. The core product.

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│ NAV: Logo | Patterns | [Upgrade] | Avatar            │
├────────────────┬─────────────────────────────────────┤
│  LEFT PANEL    │  RIGHT PANEL (main)                  │
│  (360px)       │                                      │
│                │  ┌──────────────────────────────┐   │
│  Language:     │  │  VISUALIZATION CANVAS (SVG)  │   │
│  [C++ ▾]       │  │  Nodes, arrows, pointers     │   │
│                │  │  animating step by step      │   │
│  Code editor   │  └──────────────────────────────┘   │
│  (syntax HL)   │                                      │
│                │  CONTROLS: ◀ ▶ ▶▶ [Speed] [Auto]    │
│  Input:        │  Step 3 / 10                         │
│  [1→2→3→4→5]  │                                      │
│  [k = 3]       │  STEP DESCRIPTION:                   │
│                │  "nextNode = curr->next (node 2)"    │
│  [▶ Animate]   │                                      │
│                │  ── TAB BAR ──────────────────────── │
│  ── AFTER ──   │  [Animation] [Bug Report] [AI Chat]  │
│  Bug Report:   │                                      │
│  ⚠ Step 3:     │  BUG REPORT TAB:                     │
│  curr->next    │  - Error found at step X             │
│  assigned too  │  - Root cause: ...                   │
│  early         │  - Fix: change line 7 to ...         │
│                │  - Corrected code diff               │
│  [See fix]     │  [Show correct animation →]          │
└────────────────┴─────────────────────────────────────┘
```

---

### PAGE 3: Pattern Library `/patterns`
**Single job:** Browse and learn from 20+ predefined DSA visualizations.

**Layout:**
```
┌─────────────────────────────────────────────┐
│  NAV                                         │
├─────────────────────────────────────────────┤
│  HEADER: "Pattern Library"                  │
│  Sub: "Master the 15 patterns that cover    │
│        90% of coding interview problems"    │
├─────────────────────────────────────────────┤
│  FILTER BAR:                                 │
│  [All] [Linked Lists] [Trees] [Graphs]       │
│  [Arrays] [Sliding Window] [DP] [Search]    │
├─────────────────────────────────────────────┤
│  PATTERN GRID (3 cols desktop, 1 col mobile)│
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ 🔗 Linked │ │ 🌲 Tree  │ │ 📊 Array │    │
│  │  List    │ │  BFS    │ │ Two Ptr  │    │
│  │ Reversal │ │         │ │          │    │
│  │ [Animate]│ │ [Animate]│ │ [Animate]│    │
│  │ Medium   │ │ Easy    │ │ Medium   │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│  ...more cards...                           │
└─────────────────────────────────────────────┘
```

---

### PAGE 4: Pattern Detail `/patterns/[slug]`
**Single job:** Deep-dive into one pattern — animate it, read the explanation, get the template.

**Layout:**
```
┌─────────────────────────────────────────────┐
│  NAV + breadcrumb: Patterns > Linked List > │
│  Reversal (K-Group)                         │
├─────────────────────────────────────────────┤
│  TITLE + METADATA                            │
│  "Reverse Linked List — K-Group"            │
│  Difficulty: Medium | Pattern: Pointer Manip│
│  LeetCode: #25, #92, #206                   │
├──────────────────────────┬──────────────────┤
│  VISUALIZATION (full)    │  EXPLANATION     │
│                          │                  │
│  [animated SVG]          │  When to use:    │
│  controls below          │  "When asked to  │
│                          │  reverse part of │
│  Custom input:           │  a list in-place"│
│  List: [1,2,3,4,5]      │                  │
│  K: [3]                  │  Key insight:    │
│  [Re-run]                │  3 pointers:     │
│                          │  prev/curr/next  │
├──────────────────────────┴──────────────────┤
│  CODE TEMPLATE (tabs: C++ | Python | Java)   │
│  [syntax highlighted code block]             │
├─────────────────────────────────────────────┤
│  RELATED PROBLEMS (LeetCode cards)          │
│  RELATED PATTERNS (next to explore)         │
├─────────────────────────────────────────────┤
│  TRY WITH YOUR CODE →                       │
│  [Opens /app with this pattern pre-selected]│
└─────────────────────────────────────────────┘
```

---

### PAGE 5: Pricing `/pricing`
**Single job:** Convert a free user to Pro or Lifetime.

**Layout:**
```
┌─────────────────────────────────────────────┐
│  HEADLINE: "One tool. The complete loop."   │
│  Sub: Learn → Code → Animate → Fix → Repeat │
├─────────────────────────────────────────────┤
│  BILLING TOGGLE: [Monthly] / [Annual -17%]  │
├──────────┬────────────┬──────────────────────┤
│  FREE    │  PRO       │  LIFETIME            │
│  $0      │  $12/mo    │  $199 once           │
│          │  ($99/yr)  │                      │
│  3 runs/ │  Unlimited │  Unlimited forever   │
│  day     │  runs      │  + early access      │
│  Pattern │  Bug detect│  + priority AI       │
│  library │  + fix     │                      │
│  (view)  │  AI Chat   │                      │
│          │  All langs │                      │
│  [Start] │  [Get Pro] │  [Go Lifetime]       │
└──────────┴────────────┴──────────────────────┘
│  FEATURE COMPARISON TABLE (full)            │
│  FAQ                                        │
└─────────────────────────────────────────────┘
```

---

### PAGE 6: Auth Pages `/login` and `/signup`
**Single job:** Get the user in with minimum friction.
- Email + password OR Google OAuth
- On signup: ask "What's your goal?" (Interview prep / Learning DSA / Teaching)
- Redirect to `/app` after auth

---

### PAGE 7: Dashboard `/dashboard`
**Single job:** Show the user their history and usage at a glance.

**Sections:**
- Usage meter (runs used today: 2/3 free, or ∞ Pro)
- Recent visualizations (last 5, thumbnail + code snippet + timestamp)
- Saved patterns (bookmarked pattern pages)
- Quick actions: [New visualization] [Browse patterns]

---

### PAGE 8: Settings `/settings`
- Profile (name, email)
- Subscription status + manage billing (Stripe portal link)
- Default language preference (C++ / Python / Java / JS)
- Animation speed default
- Notification preferences

---

## 17. COLOR PALETTE

Designed using the Frontend Design skill principles: one bold signature choice, everything else disciplined and quiet. The subject is code + learning + precision — so the palette leans dark (focus), electric (clarity), with warm amber as the "aha moment" accent (the color of understanding).

### Token System

```
--color-bg-base:       #0D0F14   /* Deep navy-black — the canvas */
--color-bg-surface:    #151820   /* Card/panel surfaces */
--color-bg-elevated:   #1E2230   /* Modals, dropdowns, hover states */
--color-border:        #2A2F42   /* Subtle structural lines */
--color-border-strong: #3D4460   /* Active/focused borders */

--color-text-primary:  #F0F2F8   /* Main readable text — cool white */
--color-text-secondary:#8B92A8   /* Labels, metadata, placeholders */
--color-text-muted:    #555D78   /* Disabled, hints */

/* Signature accent — electric violet-blue */
/* This is the one bold risk: not cyan, not green, not the defaults */
--color-accent:        #7B6FF0   /* Primary actions, CTA buttons */
--color-accent-hover:  #9186F5   /* Hover state */
--color-accent-glow:   rgba(123, 111, 240, 0.25) /* Focus rings, node halos */

/* Semantic pointer colors — used in the visualization canvas */
--color-pointer-curr:  #F5C542   /* curr pointer — warm amber (the "you are here") */
--color-pointer-prev:  #4ADE80   /* prev pointer — mint green (behind) */
--color-pointer-next:  #F87171   /* nextNode pointer — soft red (ahead) */
--color-pointer-slow:  #60A5FA   /* slow pointer — light blue */
--color-pointer-fast:  #FB923C   /* fast pointer — orange */

/* Status colors */
--color-success:       #34D399   /* Correct / pass */
--color-error:         #F87171   /* Bug detected / fail */
--color-warning:       #FBBF24   /* Warning / edge case */
--color-info:          #60A5FA   /* Info / hint */

/* Node colors */
--color-node-default:  #2A2F42   /* Unvisited node background */
--color-node-active:   #7B6FF0   /* Currently executing node */
--color-node-visited:  #1E3A5F   /* Visited/processed node */
--color-node-reversed: #1A3A2A   /* Reversed edge — green tint */
--color-node-error:    #3A1A1A   /* Error node — red tint */
--color-node-text:     #F0F2F8   /* Text inside nodes */
--color-edge-default:  #3D4460   /* Normal arrow */
--color-edge-active:   #7B6FF0   /* Arrow being moved/reversed */
--color-edge-reversed: #4ADE80   /* Reversed edge (completed) */
```

### Typography

```
Display face:  "DM Mono" — monospaced, technical authority.
               Used for: hero headline, node values, code line highlights.
               Weight: 500 (medium). The one typographic choice that says "this is a code tool."

Body face:     "Inter" — clean, readable, neutral at small sizes.
               Used for: body copy, descriptions, UI labels.
               Weights: 400 (body), 500 (label), 600 (heading).

Code face:     "JetBrains Mono" — ligature-rich, developer-familiar.
               Used for: code editor, syntax highlighting, variable names.
               Weight: 400.

Type scale:
  --text-xs:    11px / 1.4
  --text-sm:    13px / 1.5
  --text-base:  15px / 1.6
  --text-lg:    18px / 1.5
  --text-xl:    22px / 1.4
  --text-2xl:   28px / 1.3
  --text-3xl:   36px / 1.2
  --text-hero:  56px / 1.1  (DM Mono, weight 500)
```

### Signature Element

The **"pulse ring" on active nodes**: when `curr` lands on a node, the node glows with a 2-step pulsing ring in `--color-accent-glow`. This is the single animated signature — it makes the moment of execution feel alive without cluttering the rest of the UI. Everything else in the UI is static and precise; this one moment breathes.

CSS:
```css
@keyframes node-pulse {
  0%   { box-shadow: 0 0 0 0px var(--color-accent-glow); }
  50%  { box-shadow: 0 0 0 8px var(--color-accent-glow); }
  100% { box-shadow: 0 0 0 0px transparent; }
}
.node--active {
  animation: node-pulse 1.2s ease-out infinite;
  border: 2px solid var(--color-accent);
}
```

### Color Usage Rules (for LLM codegen)

1. **Never use white backgrounds** — everything sits on `--color-bg-base` or `--color-bg-surface`
2. **Buttons:** Primary = `--color-accent` bg + `--color-text-primary` text. Ghost = transparent + `--color-border` border + `--color-text-secondary`
3. **Cards:** `--color-bg-surface` bg + `--color-border` border + 8px border-radius
4. **Code blocks:** `--color-bg-elevated` bg + `--color-border` border + 4px border-radius
5. **Pointer labels in canvas:** always use the semantic pointer colors — never override these
6. **Hover states:** shift one step up the surface scale (surface → elevated) + lighten border
7. **Focus rings:** `2px solid --color-accent` + `--color-accent-glow` outer glow

---

## 18. FRONTEND DESIGN SKILL (for LLM codegen)

This section embeds the Anthropic Frontend Design Skill so any LLM building UI for AlgoViz has the design philosophy inline.

### Core Principle
Approach every UI screen as the design lead at a small studio. Every screen should be unmistakably AlgoViz — not a generic dark-mode SaaS. The subject is code execution and pointer logic — draw aesthetic choices from that world: monospace type, precise node geometry, deliberate arrow angles, the grammar of diagrams.

### Design Principles (abridged from Anthropic SKILL.md)

**The hero is a thesis.** Open with the most characteristic thing: not a headline + gradient button. On our landing page, the hero IS the live animation widget — show the product, don't describe it.

**Typography carries personality.** DM Mono for display = the tool has a point of view. Don't use Inter for headlines — that's the generic answer.

**Structure is information.** Only use numbered steps if the content truly is a sequence. In AlgoViz, step numbers in the visualizer ARE real sequence information — use them. In the landing page feature list, they are not — use visual icons instead.

**Motion serves, not decorates.** One signature animation (the node pulse). Pointer transitions should ease with `cubic-bezier(0.4, 0, 0.2, 1)` — firm, precise, like a cursor clicking. No bounce. No spring. This is a debugging tool, not a toy.

**Restraint:** spend boldness in one place (the electric violet accent `#7B6FF0`). Everything else should be disciplined grays, dark surfaces, quiet borders.

### Process for any new screen

1. Name the screen's single job before writing any code
2. Confirm: does this screen use a color/font not in the token system? Don't — derive everything from the tokens above
3. Check: does any animation here compete with the node pulse? If yes, remove it
4. Critique: would this screen look identical on a different SaaS? If yes, find the one element that makes it AlgoViz-specific and strengthen it

### Writing rules for UI copy

- Write from the user's side: "Animate my code" not "Submit for processing"
- Active verbs: "See what changed" not "View differences"  
- Error messages explain + direct: "Your code has a syntax error on line 7 — check the bracket on line 7" not "An error occurred"
- Empty states invite action: "Paste your first algorithm above to see it come to life"
- Buttons match their outcome: the button says "Animate" → the result is an animation, not a "processing" spinner with no label

---

*End of document v2.0. Feed this to any LLM to get full context for building, designing, marketing, or extending AlgoViz.*