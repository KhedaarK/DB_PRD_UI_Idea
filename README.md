# GenieOne Trust Layer — Concept Prototype

**Live demo:** https://khedaark.github.io/DB_PRD_UI_Idea/

A clickable concept prototype that explores a **trust layer** for AI answers in Databricks One / Genie. It follows one business question from start to finish, *"How did revenue change month over month?"*, and shows what a business user would need to see before they could trust, share and automate an AI-generated answer.

> ⚠️ **All data is illustrative.** This is a design prototype. It has no backend and doesn't connect to Databricks, and nothing you click sends anything anywhere.

---

## Contents

- [Objective](#objective)
- [The five trust questions](#the-five-trust-questions)
- [Quick start](#quick-start)
- [Walkthrough: what you can click](#walkthrough-what-you-can-click)
  - [Top bar](#top-bar)
  - [Step 1 · Start](#step-1--start)
  - [Step 2 · Answer](#step-2--answer)
  - [Step 3 · Share](#step-3--share)
  - [Step 4 · Schedule](#step-4--schedule)
  - [Schedules page](#schedules-page)
  - [Step 5 · Connected apps](#step-5--connected-apps)
- [Try this: a 2-minute demo script](#try-this-a-2-minute-demo-script)
- [What is intentionally not clickable](#what-is-intentionally-not-clickable)
- [Deep links](#deep-links)
- [Run locally](#run-locally)
- [Project structure](#project-structure)
- [How it works](#how-it-works)
- [Deployment](#deployment)

---

## Objective

Business users increasingly ask AI for numbers they then put in front of executives. A plain chat answer ("Revenue was R$1.16M in March") gives them no way to tell:

- whether the number uses the **company-approved definition**,
- how the AI **interpreted their words**,
- what **data and filters** were used,
- **how confident** they should be in a change, and
- what happens when they **share it or schedule it** for other people.

This prototype puts that context right next to the answer, in the Databricks One visual style. The aim is that a non-technical user can verify an answer, see when they've moved away from a certified metric, and loop in the data team, all without leaving the chat.

## The five trust questions

Every part of the answer screen addresses one of these:

| Question a user has | Where the prototype answers it |
|---|---|
| *Did it understand me?* | **Thought process → How Genie understood your question** maps the user's words to certified business concepts from the Genie Ontology. |
| *How was this calculated?* | **How this was calculated** lists the definition, filters and period, each linked to the exact line of generated SQL. |
| *Where did the data come from?* | **Where this came from** shows the certified metric, owner, tables, freshness, access and a data-lineage path. |
| *How sure should I be?* | **How sure is this?** separates normal variation (under ±5%) from notable moves (the Feb/Jun dips) and states what the data can't explain. |
| *What if I change it, share it or automate it?* | The **definition switch**, **Share** and **Schedule** flows label any departure from the certified definition and spell out exactly what recipients will see. |

---

## Quick start

1. Open the [live demo](https://khedaark.github.io/DB_PRD_UI_Idea/).
2. Use the **Walkthrough** stepper in the top bar (**1 Start · 2 Answer · 3 Share · 4 Schedule · 5 Connected apps**) to jump between steps, or click through the flow naturally.
3. Reload the page at any time to reset everything.

---

## Walkthrough: what you can click

✅ = works in the prototype · ◻️ = visual only (see [not clickable](#what-is-intentionally-not-clickable))

### Top bar

| Element | What it does |
|---|---|
| ✅ **Walkthrough stepper** (1–5) | Jumps to any step. The current step is black and completed steps have a green number. On phones it becomes a swipeable row. |
| ◻️ Logo, *Concept prototype* tag, **K** avatar | Labels only. |

### Step 1 · Start

The landing screen, styled as a new Genie chat.

| Element | What it does |
|---|---|
| ✅ **Question box** | Editable text, prefilled with the demo question. What you type is kept as you move around the app. |
| ✅ **↑ Send** (black circle) | Asks the question and opens the **Answer**. |
| ✅ **📎 Paperclip** | Opens the **Add to your question** menu: *Databricks data*, *Files* and *Connected apps*. Press **Esc** to close it. |
| ✅ → *Connected apps* (in that menu) | Goes to **Step 5 · Connected apps**. |
| ✅ **See sources / Hide sources** | Expands the list of sources the user can access: 3 Genie Agents, 4 metric views and 1 connected app, each marked *Certified* or not. |
| ✅ → **Ask the data team** (in sources) | Opens the Answer with a drafted request to the data team already expanded. |
| ✅ **Certified question chip** | Same as Send: opens the Answer. |

### Step 2 · Answer

The core of the prototype. Everything below sits in one chat answer.

**Header and message**

| Element | What it does |
|---|---|
| ◻️ Breadcrumbs | *Agents › Olist Commerce Agent › Monthly revenue change*: context only. |
| ✅ **Share** (top right) | Opens the **Share** dialog (Step 3). |
| ✅ **✦ Thought process** | Expands or collapses **How Genie understood your question**: a table mapping *Your words → Business concept → What it means here*, with *Certified* badges and ontology rules. It starts expanded. |
| ✅ → **Suggest a change** | Opens the 👎 feedback form with *Wrong definition* already selected. |

**Chart card**

| Element | What it does |
|---|---|
| ✅ **Chart / Table** toggle | Switches between the bar chart and a table. The table adds *Change vs. prior month*, with moves of ±5% or more colored red or green. |
| ◻️ Download icon | Visual only. |
| — Hatched **Sep\*** bar | Shows that September 2018 is a partial month (1 order) and is excluded. |

**How this was calculated**

| Element | What it does |
|---|---|
| ✅ **Price + freight / Price only** switch | The key trust interaction. Switching to *Price only* updates **everything** at once: chart values, headline, chart title, the ontology row (badge changes to *Changed by you*), the lineage path (ends in amber), the source line, the schedule name, and an amber warning that the answer **no longer matches the certified metric `sales.revenue`**. |
| ✅ **View in SQL** (×3) | Opens the generated SQL and **highlights the line** that implements that assumption (definition, order-status filter or period). |
| ✅ **Hide** (in SQL panel) | Closes the SQL. |

**Where this came from:** a read-only card showing the approved metric, owner, source tables, freshness, the user's access, and the lineage path *9 source files → Unity Catalog tables → Approved metric → This answer*.

**Actions and feedback**

| Element | What it does |
|---|---|
| ✅ **Share** | Opens the **Share** dialog. |
| ✅ **🕒 Schedule** | Opens the **Confirm your schedule** dialog (Step 4). |
| ✅ **Ask the data team** | Toggles a drafted request to the data team that bundles the question, answer, SQL and assumptions. The note field is editable. |
| ✅ **👍 / 👎** | Opens a feedback form with reason chips (different for 👍 and 👎). |
| ✅ → **Reason chips** | Toggle on and off; you can pick several. |
| ✅ → **Add details** | Editable. Your text survives other clicks. |
| ✅ → **Checkboxes** (👎 only) | Choose whether to notify the metric owner and attach the SQL. |
| ✅ → **Cancel / Send feedback** | Cancel closes the form. Send shows a confirmation that names who was notified. |
| ✅ **Write a message…** (bottom) | You can type here; sending is visual only. |

### Step 3 · Share

A dialog over the answer.

| Element | What it does |
|---|---|
| ✅ **People or groups** | Editable recipient field. |
| ✅ **View / View and continue the chat** | Sets the recipient's role. |
| ✅ **Up to this message / This message and future ones** | Sets the share scope. Choosing *future ones* shows a warning that later answers, including Drive results, will also be visible. |
| — **Included** box | Lists exactly what is shared, and notes that recipients only see rows they're allowed to access. |
| ✅ **Share** | Closes the dialog and shows a *Shared with…* confirmation. |
| ✅ **Cancel**, **✕**, **Esc** or clicking outside | Closes the dialog. |

### Step 4 · Schedule

A dialog over the answer.

| Element | What it does |
|---|---|
| — Schedule details | Name, recipient, timing (every Monday 9:00 AM PT), next send, and which definition the re-run uses. The name and definition follow the **Price only** switch. |
| — **Email preview** | The subject and body the recipient would receive. |
| ✅ **Confirm schedule** | Creates the schedule and opens the **Schedules page** with a *Scheduled* confirmation. |
| ✅ **✕**, **Esc** or clicking outside | Closes the dialog. |

### Schedules page

Reached by confirming a schedule (or via `#schedules`).

| Element | What it does |
|---|---|
| — **Your new schedule** | Shows *Active*, timing, recipient, definition and run-history notes. |
| — **Example schedule** | A pre-existing daily schedule, for context. |
| ✅ **＋ Create in chat** | Returns to **Start**. |

### Step 5 · Connected apps

| Element | What it does |
|---|---|
| — **Google Drive** card | Connected. Read-only, uses only your own permissions, last used today. |
| ✅ **Microsoft 365 checkboxes** | Pick SharePoint files, Outlook mail or Teams chats. Each is read-only. |

---

## Try this: a 2-minute demo script

1. **Start:** click **See sources** to show that answers are limited to certified data the user can access. Click **↑** to ask.
2. **Answer:** point out **Thought process**, where *"revenue"* maps to the certified *Revenue* metric.
3. Switch the chart to **Table** to see the −10.9% (Feb) and −11.3% (Jun) dips next to normal variation.
4. Click **View in SQL** next to *Orders* and note the highlighted `WHERE` line.
5. Flip the definition to **Price only**. Watch the numbers, the *Changed by you* badge, the amber lineage and the warning all update.
6. Click **👎**, choose *Wrong definition*, and type a note. The feedback is routed to the metric's owner.
7. Click **Share**, choose **This message and future ones**, and read the warning.
8. Click **Schedule**, then **Confirm**. The schedule name carries the *price only* label onto the Schedules page.

---

## What is intentionally not clickable

To keep the demo focused, these elements are **visual only**: *Databricks data* and *Files* in the attach menu; the chart download icon; *Send request* in the data-team draft; the suggested next questions; sending from the bottom message box; *Change* and *Send a test now* in the schedule dialog; *Pause*, *Edit*, *⋮*, *Send feedback* and the *Create in chat* dropdown on the Schedules page; *Manage or disconnect* and *Connect 1 part* on Connected apps.

Only one question is fully built. Other questions are deliberately left out rather than filled with made-up answers.

---

## Deep links

Add a hash to the URL to open a specific step:

| Link | Opens |
|---|---|
| [`#start`](https://khedaark.github.io/DB_PRD_UI_Idea/#start) | Start screen |
| [`#answer`](https://khedaark.github.io/DB_PRD_UI_Idea/#answer) | Answer |
| [`#share`](https://khedaark.github.io/DB_PRD_UI_Idea/#share) | Answer with the Share dialog open |
| [`#schedule`](https://khedaark.github.io/DB_PRD_UI_Idea/#schedule) | Answer with the Schedule dialog open |
| [`#schedules`](https://khedaark.github.io/DB_PRD_UI_Idea/#schedules) | Schedules page |
| [`#connect`](https://khedaark.github.io/DB_PRD_UI_Idea/#connect) | Connected apps |

---

## Run locally

No build step and no dependencies. You can open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Project structure

```
index.html        Page shell: fonts (DM Sans, JetBrains Mono) and the #root mount point
css/styles.css    Design tokens, layout, components and responsive rules
js/app.js         State, screen renderers, dialogs, toasts and event handling
README.md         This file
```

## How it works

- **Vanilla JS, no framework.** `js/app.js` holds all UI state in one object, `S` (current screen, open dialog, revenue definition, chart view, feedback and so on).
- **Render on every change.** Each click updates `S` and calls `render()`, which rebuilds the page from HTML strings. Text you type is saved in `S.inputs` and restored after each render.
- **Derived content.** `derived()` computes everything that depends on the revenue definition (values, headline, labels, schedule name) so it all stays consistent.
- **Event delegation.** A single click listener routes `data-step`, `data-go`, `data-set` and `data-act` attributes. **Esc** closes dialogs and menus.
- **Icons** are inline SVGs from the `I` map, rendered with `icon(name)`.
- **Visual style** follows Databricks One: warm off-white surfaces, DM Sans, pill buttons, black primary actions and teal chart bars.

## Deployment

The site is published with **GitHub Pages** from the `main` branch. Each push to `main` redeploys within about 1–2 minutes. Browsers may cache the old files for up to 10 minutes, so use a hard refresh (**Cmd + Shift + R**) to see the update.
