# GenieOne trust layer prototype

A static, click-through concept prototype for a "trust layer" in GenieOne, styled after the Databricks One / Genie UI (DM Sans, warm off-white surfaces, pill buttons, black primary actions). It shows how an answer explains where its numbers came from, how the question was interpreted, and what happens when a user changes a certified definition. All data is illustrative.

## Screens

1. **Start** (New chat): a greeting, the question composer with an attach menu, the data sources the user can access, and certified starter questions.
2. **Answer**: breadcrumbs, the user's question, "Thought process" (how Genie mapped the question to the ontology), the headline, a chart/table card, a confidence note, the calculation with a definition switch (price + freight / price only) and linked SQL, lineage, feedback, a handoff to the data team, suggested follow-ups, and a sticky composer.
3. **Share**: a modal over the answer with role and scope options and a warning when sharing live.
4. **Schedule**: a confirmation modal with an email preview. Confirming opens the **Schedules** page.
5. **Connected apps** (Customizations): Google Drive (connected) and Microsoft 365 (not connected).

Navigate with the labeled **Walkthrough** stepper in the top bar (1 Start · 2 Answer · 3 Share · 4 Schedule · 5 Connected apps); completed steps are tinted green. To link straight to a step, add a hash to the URL: `#start`, `#answer`, `#share`, `#schedule`, `#schedules` or `#connect`.

## Run

No build step and no dependencies. You can open `index.html` directly in a browser, or serve it:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Layout

```
index.html        page shell (fonts, #root mount point)
css/styles.css    design tokens, layout and responsive rules
js/app.js         state, screen renderers, modals and the click handler (vanilla JS)
```

`js/app.js` keeps all UI state in one object `S`. Every interaction updates `S` and calls `render()`, which rebuilds the shell (top bar, main area, modal, toast) from HTML strings. Icons are inline SVGs from the `I` map, drawn with `icon(name)`.
