# GenieOne trust layer prototype

A static, click-through concept prototype for a "trust layer" in GenieOne. It shows how an answer explains where its numbers came from, how the question was interpreted, and what happens when a user changes a certified definition. All data is illustrative.

## Screens

1. **Start**: a guided prompt, a list of the data sources the user can access, an attach menu, and certified starter questions.
2. **Answer**: a headline, a chart/table toggle, a confidence note, the ontology mapping ("How Genie understood your question"), the calculation with linked SQL, a revenue definition switch (price + freight / price only), lineage, feedback, and a handoff to the data team.
3. **Share**: recipients, role and scope options, with a warning when sharing live.
4. **Schedule**: a confirmation dialog with an email preview, plus a Schedules list once confirmed.
5. **Connected apps**: Google Drive (connected) and Microsoft 365 (not connected).

## Run

No build step and no dependencies. You can open `index.html` directly in a browser, or serve it:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Layout

```
index.html        page shell (header, nav, #app mount point)
css/styles.css    all styles
js/app.js         state, screen renderers and the click handler (vanilla JS)
```

`js/app.js` keeps all UI state in one object `S`. Every interaction updates `S` and calls `render()`, which rebuilds the current screen from HTML strings.
