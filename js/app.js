(function () {
  var S = { screen: 'start', def: 'pf', role: 'view', scope: 'upto', sources: false, attach: false, handoff: false, scheduled: false, view: 'chart', sql: null, thought: true, fb: null, fbSent: false, reasons: {}, inputs: {}, modal: null, toast: null };
  var RAW = [['Jan', 1115], ['Feb', 993], ['Mar', 1160], ['Apr', 1160], ['May', 1153], ['Jun', 1023], ['Jul', 1066], ['Aug', 1022]];
  var STEPS = [['start', 'Start'], ['answer', 'Answer'], ['share', 'Share'], ['schedule', 'Schedule'], ['connect', 'Connected apps']];
  var QUESTION = 'How did revenue change month over month?';
  var toastTimer, lastModal = null;

  var I = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    agents: '<rect x="3" y="6" width="15" height="13" rx="2"/><path d="M7 11h.01M11 11h.01M7 15h7M19 2v4M17 4h4"/>',
    grid: '<circle cx="5" cy="5" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="19" cy="5" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="19" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="19" cy="19" r="1"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    moreV: '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    clip: '<path d="M21 11.5l-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8l9-9a3.7 3.7 0 0 1 5.2 5.2l-9 9a1.8 1.8 0 0 1-2.6-2.6l8.2-8.2"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M10 4v16"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M3 20h18"/>',
    shield: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M9 12l2 2 4-4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
    db: '<ellipse cx="12" cy="5.5" rx="7" ry="2.5"/><path d="M5 5.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6M5 11.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6"/>',
    graph: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8 7.5l3 8M16 7.5l-3 8M8.5 6h7"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01"/>',
    tUp: '<path d="M7 10v11H4V10zM7 10l4-7a2 2 0 0 1 3 2l-1 5h6a2 2 0 0 1 2 2.3l-1.3 7A2 2 0 0 1 17.7 21H7"/>',
    tDown: '<path d="M17 14V3h3v11zM17 14l-4 7a2 2 0 0 1-3-2l1-5H5a2 2 0 0 1-2-2.3l1.3-7A2 2 0 0 1 6.3 3H17"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    file: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/>',
    plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
    send: '<path d="M4 12l16-8-6 16-2-7z"/>'
  };
  function icon(n, s) { s = s || 18; return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[n] + '</svg>'; }
  var LOGO = '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l9.5 5.2L12 13 2.5 7.7z" fill="#FF3621"/><path d="M2.5 11.6L12 16.9l9.5-5.3" fill="none" stroke="#FF3621" stroke-width="2.2" stroke-linejoin="round"/><path d="M2.5 15.8L12 21.1l9.5-5.3" fill="none" stroke="#FF3621" stroke-width="2.2" stroke-linejoin="round"/></svg>';
  var SPARKLE = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.2 6.3L20.5 10l-6.3 2.2L12 18.5l-2.2-6.3L3.5 10l6.3-1.7z" fill="#FF3621"/><path d="M5 20h14" stroke="#FF8A70" stroke-width="2" stroke-linecap="round"/></svg>';

  function set(p) { for (var k in p) S[k] = p[k]; render(true); }
  function fmt(v) { return 'R$' + (v / 1000).toFixed(2) + 'M'; }
  function on(c) { return c ? ' on' : ''; }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function toast(msg) { S.toast = msg; clearTimeout(toastTimer); toastTimer = setTimeout(function () { S.toast = null; render(); }, 3500); }

  function derived() {
    var isP = S.def === 'p', f = isP ? 0.86 : 1;
    var vals = RAW.map(function (r) { return r[1] * f; });
    var lo = fmt(Math.min.apply(null, vals)), hi = fmt(Math.max.apply(null, vals));
    return {
      isP: isP, vals: vals,
      headline: 'Monthly revenue held between ' + lo + ' and ' + hi + ' in Jan–Aug 2018, peaking in March and April.',
      headlineHtml: 'Monthly revenue held between <strong>' + lo + '</strong> and <strong>' + hi + '</strong> in Jan–Aug 2018, peaking in <strong>March and April</strong>.',
      chartTitle: (isP ? 'Revenue, price only' : 'Revenue, price + freight') + ' · full months, 2018 · illustrative values',
      aria: 'Bar chart of monthly revenue, January to August 2018, between ' + lo + ' and ' + hi + '; September 2018 shown as a partial, excluded month.',
      defLine: isP ? 'Revenue = item price only (your definition)' : 'Revenue = item price + freight',
      source: isP ? 'Source: Genie Agent Olist Commerce · based on certified metric view sales.revenue, with your price-only change' : 'Source: certified metric view sales.revenue · Genie Agent Olist Commerce · ontology rule "exclude canceled orders"',
      schedName: isP ? 'Weekly revenue (price only)' : 'Weekly revenue (price + freight)',
      schedDef: isP ? 'price-only definition' : 'certified price + freight definition'
    };
  }

  // ---------- Shell ----------
  function currentStep() {
    if (S.modal) return S.modal;
    return S.screen === 'schedules' ? 'schedule' : S.screen;
  }

  function topbar() {
    var cur = currentStep(), idx = STEPS.map(function (s) { return s[0]; }).indexOf(cur);
    return '<header class="top">' +
      '<div class="brand">' + LOGO + '<span class="wordmark">databricks</span><span class="tag">Concept prototype · illustrative data</span></div>' +
      '<nav class="stepper" aria-label="Prototype walkthrough"><span class="stepper-l">Walkthrough</span>' +
      STEPS.map(function (s, i) {
        var a = i === idx;
        return '<button type="button" class="' + (a ? 'on' : i < idx ? 'done' : '') + '" data-step="' + s[0] + '"' + (a ? ' aria-current="step"' : '') + '><span class="num">' + (i + 1) + '</span>' + s[1] + '</button>';
      }).join('') + '</nav>' +
      '<div class="top-r"><button type="button" class="ws"><span>workspace</span>' + icon('down', 16) + '</button>' +
      '<button type="button" class="iconbtn apps" aria-label="Apps">' + icon('grid', 20) + '</button>' +
      '<div class="avatar" aria-label="Khedaar">K</div></div></header>';
  }

  function mainhead() {
    if (S.screen !== 'answer') return '';
    return '<div class="mainhead"><nav class="crumbs" aria-label="Breadcrumb"><span>Agents</span>' + icon('right', 14) + '<span>Olist Commerce Agent</span>' + icon('right', 14) + '<span class="cur" aria-current="page">Monthly revenue change</span></nav>' +
      '<div class="row" style="align-items:center;gap:4px;flex-wrap:nowrap"><button type="button" class="iconbtn" aria-label="Rename chat">' + icon('pencil') + '</button>' +
      '<button type="button" class="pill" data-act="openShare">Share</button><button type="button" class="iconbtn" aria-label="More options">' + icon('more') + '</button></div></div>';
  }

  function composer(dock) {
    var id = dock ? 'followup' : 'ask';
    var c = '<div class="composer"><label for="' + id + '" class="sr-only">' + (dock ? 'Write a message' : 'Ask a question') + '</label>' +
      '<textarea id="' + id + '" rows="' + (dock ? 1 : 2) + '" placeholder="' + (dock ? 'Write a message…' : 'Ask a question about your data…') + '">' + (dock ? '' : QUESTION) + '</textarea>' +
      '<div class="composer-bar">' +
      (dock ? '<span class="composer-hint"></span>' : '<span class="composer-hint">' + icon('agents', 16) + 'Olist Commerce Agent</span>') +
      '<button type="button" class="iconbtn" aria-label="Attach data, files or apps"' + (dock ? '' : ' data-act="attach" aria-expanded="' + S.attach + '"') + '>' + icon('clip', 20) + '</button>' +
      '<button type="button" class="send' + (dock ? ' idle' : '') + '" aria-label="' + (dock ? 'Send' : 'Ask') + '"' + (dock ? '' : ' data-go="answer"') + '>' + icon('up', 18) + '</button></div></div>';
    if (!dock) return c;
    return '<div class="dock"><div class="dock-in">' + c + '<div class="disclaimer">Always review the accuracy of responses.</div></div></div>';
  }

  // ---------- Start ----------
  function start() {
    var h = '<section aria-label="Guided start" class="start">' +
      '<h1>How can I help you, Khedaar?</h1>' + composer(false);
    if (S.attach) {
      h += '<div class="card menu" role="menu"><div class="menu-h">Add to your question</div>' +
        menuItem('db', 'Databricks data', 'A table, metric view, dashboard or Genie Agent', '') +
        menuItem('file', 'Files', 'CSV, Excel or PDF up to 5 GB · kept for this chat only', '') +
        menuItem('plug', 'Connected apps', 'Google Drive · connected, read-only · Manage', 'connect') + '</div>';
    }
    h += '<div class="access">' + icon('shield', 16) +
      '<span>Answers use data you can access: <strong>3 Genie Agents</strong> · <strong>4 metric views</strong> · <strong>1 connected app</strong></span>' +
      '<button type="button" class="link" style="font-size:14px;padding:6px 4px" data-act="sources" aria-expanded="' + S.sources + '">' + (S.sources ? 'Hide sources' : 'See sources') + '</button></div>';
    if (S.sources) {
      h += '<div class="card sources"><div class="grid2" style="gap:10px 24px">' +
        '<div><strong>Olist Commerce</strong> · Genie Agent · <span class="cert">Certified</span></div>' +
        '<div><strong>sales.revenue</strong> · metric view · <span class="cert">Certified</span></div>' +
        '<div><strong>Reviews</strong> · Genie Agent · <span class="cert">Certified</span></div>' +
        '<div><strong>reviews.kpis</strong> · metric view · <span class="cert">Certified</span></div>' +
        '<div><strong>Logistics</strong> · Genie Agent · not certified</div>' +
        '<div><strong>orders.delivery</strong>, <strong>customers.base</strong> · metric views</div>' +
        '<div><strong>Google Drive</strong> · connected app · read-only, only you</div></div>' +
        '<div style="color:var(--ink3);font-size:13px">Published by your data team in Unity Catalog. Missing something? <button type="button" class="link" data-act="handoffFromStart">Ask the data team</button></div></div>';
    }
    h += '<div class="stack" style="gap:10px;margin-top:10px"><div class="label">Start from a certified question</div><div class="row" style="gap:8px">' +
      [QUESTION, 'Which states have the most customers?', 'What is our late-delivery rate?'].map(function (q) {
        return '<button type="button" class="chip" data-go="answer">' + q + '</button>';
      }).join('') + '</div></div></section>';
    return h;
  }
  function menuItem(ic, t, d, go) {
    return '<button type="button" role="menuitem" class="menu-i"' + (go ? ' data-go="' + go + '"' : '') + '>' + icon(ic) + '<span><strong>' + t + '</strong><small>' + d + '</small></span></button>';
  }

  // ---------- Answer ----------
  function answer(D) {
    var isChart = S.view !== 'table';
    var h = '<section aria-label="Answer" class="thread">' +
      '<div class="bubble-user">' + QUESTION + '</div>' +
      '<article class="msg">' +
      '<button type="button" class="thought" data-act="thought" aria-expanded="' + S.thought + '">' + SPARKLE + 'Thought process<span class="chev">' + icon('right', 16) + '</span></button>' +
      (S.thought ? ontology(D) : '') +
      '<h2>Monthly revenue, Jan–Aug 2018</h2>' +
      '<p>' + D.headlineHtml + '</p>' +
      '<p>The largest month-over-month moves were the dips in <strong>February (−10.9%)</strong> and <strong>June (−11.3%)</strong>; every other month moved by less than ±5%. September 2018 is left out because it contains a single order.</p>' +
      '<div class="card chartcard"><div class="chartcard-h"><div class="chartcard-t">Revenue by month<div>' + D.chartTitle + '</div></div>' +
      '<div class="row" style="align-items:center;gap:6px"><button type="button" class="iconbtn" aria-label="Download">' + icon('download') + '</button>' +
      '<div class="seg" role="group" aria-label="View as"><button type="button" class="' + (isChart ? 'on' : '') + '" aria-pressed="' + isChart + '" data-set="view:chart">' + icon('chart', 15) + 'Chart</button><button type="button" class="' + (!isChart ? 'on' : '') + '" aria-pressed="' + !isChart + '" data-set="view:table">' + icon('table', 15) + 'Table</button></div></div></div>';
    if (isChart) {
      h += '<div class="bars" role="img" aria-label="' + D.aria + '">';
      D.vals.forEach(function (v) {
        h += '<div class="barcol"><div class="barval">' + fmt(v) + '</div><div class="bar" style="height:' + Math.round(v / 1160 * 175) + 'px"></div></div>';
      });
      h += '<div class="barcol"><div class="barval">partial</div><div class="bar partial"></div></div></div>' +
        '<div class="months">' + RAW.map(function (r) { return '<div>' + r[0] + '</div>'; }).join('') + '<div>Sep*</div></div>' +
        '<div class="foot">* Sep 2018 is a partial month (1 order) and is excluded from comparisons.</div>';
    } else {
      h += '<div class="tablewrap"><table><thead><tr><th scope="col">Month (2018)</th><th scope="col" style="text-align:right">Revenue</th><th scope="col" style="text-align:right">Change vs. prior month</th></tr></thead><tbody>';
      RAW.forEach(function (r, i) {
        var mom = '—', color = 'var(--ink3)';
        if (i > 0) {
          var pct = (RAW[i][1] - RAW[i - 1][1]) / RAW[i - 1][1] * 100;
          mom = (pct > 0 ? '+' : pct < 0 ? '−' : '') + Math.abs(pct).toFixed(1) + '%';
          color = Math.abs(pct) >= 5 ? (pct < 0 ? 'var(--danger)' : 'var(--ok)') : 'var(--ink3)';
        }
        h += '<tr><td>' + r[0] + '</td><td style="text-align:right">' + fmt(D.vals[i]) + '</td><td style="text-align:right;font-weight:600;color:' + color + '">' + mom + '</td></tr>';
      });
      h += '</tbody></table></div>';
    }
    h += '</div>' +
      '<div class="note">' + icon('info') + '<div><strong>How sure is this?</strong> The totals are summed directly from the orders shown, not estimated. Month-to-month moves under ±5% are within normal variation here; the Feb and Jun dips (about −11%) are larger, but this data alone doesn\'t show why.</div></div>' +
      '<div class="panel"><div class="panel-h"><div class="panel-t">' + icon('calc') + 'How this was calculated</div>' +
      '<div class="row" style="align-items:center;gap:8px"><span style="font-size:13px;color:var(--ink2)">Change definition:</span>' +
      '<div class="seg" role="group" aria-label="Revenue definition"><button type="button" class="' + (!D.isP ? 'on' : '') + '" aria-pressed="' + !D.isP + '" data-set="def:pf">Price + freight</button><button type="button" class="' + (D.isP ? 'on' : '') + '" aria-pressed="' + D.isP + '" data-set="def:p">Price only</button></div></div></div>' +
      '<ul class="calc">' +
      '<li>' + D.defLine + ' <button type="button" class="link" data-set="sql:def">View in SQL</button></li>' +
      '<li>Orders: all statuses except canceled and unavailable <button type="button" class="link" data-set="sql:status">View in SQL</button></li>' +
      '<li>Period: Jan–Aug 2018, full calendar months only <button type="button" class="link" data-set="sql:period">View in SQL</button></li>' +
      '<li style="color:var(--warn)"><strong>Excluded:</strong> Sep 2018 (partial month, 1 order), shown hatched</li></ul>';
    if (S.sql) {
      var lines = [
        ["SELECT DATE_TRUNC('month', o.order_purchase_timestamp) AS month,", null],
        [D.isP ? '  SUM(i.price) AS revenue' : '  SUM(i.price + i.freight_value) AS revenue', 'def'],
        ['FROM olist_orders o JOIN olist_order_items i USING (order_id)', null],
        ["WHERE o.order_status NOT IN ('canceled', 'unavailable')", 'status'],
        ["  AND o.order_purchase_timestamp >= '2018-01-01'", 'period'],
        ["  AND o.order_purchase_timestamp <  '2018-09-01'  -- full months only", 'period'],
        ['GROUP BY 1 ORDER BY 1', null]
      ];
      h += '<div class="sql"><div class="sql-h"><span>Generated SQL · highlighted line matches the assumption</span><button type="button" class="link" style="color:#A9B0B8;font-size:12px;padding:0" data-set="sql:">Hide</button></div>' +
        lines.map(function (l) { return '<div class="l' + (l[1] && l[1] === S.sql ? ' hit' : '') + '">' + esc(l[0]) + '</div>'; }).join('') + '</div>';
    }
    if (D.isP) h += '<div class="note-warn">You changed the definition. This answer no longer matches the certified metric view <strong>sales.revenue</strong>; anyone you share it with will see your definition labeled.</div>';
    h += '</div>' + sourceCard(D) +
      '<div class="small">' + D.source + '</div>' +
      '<div class="actions"><div class="row" style="gap:8px"><button type="button" class="pill" data-act="openShare">Share</button><button type="button" class="pill" data-act="openSchedule">' + icon('clock', 16) + 'Schedule</button><button type="button" class="pill" data-act="handoff" aria-expanded="' + S.handoff + '">Ask the data team</button></div>' +
      '<div class="row" style="align-items:center;gap:4px"><span style="font-size:13px;color:var(--ink2);margin-right:4px">Was this helpful?</span>' +
      '<button type="button" class="thumb' + (S.fb === 'up' ? ' up' : '') + '" aria-label="Helpful" aria-pressed="' + (S.fb === 'up') + '" data-act="fbUp">' + icon('tUp') + '</button>' +
      '<button type="button" class="thumb' + (S.fb === 'down' ? ' down' : '') + '" aria-label="Not helpful" aria-pressed="' + (S.fb === 'down') + '" data-act="fbDown">' + icon('tDown') + '</button></div></div>' +
      feedback();
    if (S.handoff) {
      h += '<div class="stack handoff"><div><strong>Request to the Olist Commerce data team</strong> (drafted, not sent)</div><div>Attached: your question, this answer, the SQL and the assumptions above.</div><label for="note" class="label">Add a note</label><input id="note" type="text" value="Should revenue in exec reports include freight?"><div><button type="button" class="pill primary">Send request</button></div></div>';
    }
    h += '<div class="stack" style="gap:8px"><div class="label">Suggested next questions</div><div class="row" style="gap:8px">' +
      ['Why did June dip?', 'Break this down by category', 'Orders vs. average order value'].map(function (q) { return '<button type="button" class="chip">' + q + '</button>'; }).join('') +
      '</div></div></article></section>';
    return h;
  }

  function ontology(D) {
    var rows = [
      ['revenue', 'Revenue', D.isP ? 'Changed by you' : 'Certified', D.isP ? 'Item price only. The certified definition also includes freight.' : 'Item price + freight on orders that were not canceled', 'Owner: Olist Commerce data team · approved metric'],
      ['month over month', 'Calendar month', 'Certified', 'Each full month compared with the month before; partial months are left out', 'Ontology rule: compare full calendar periods only'],
      ['(implied) orders', 'Order', 'Certified', 'One purchase. Canceled and unavailable orders do not count toward revenue', 'Ontology rule: exclude canceled orders']
    ];
    var h = '<div class="panel"><div class="panel-t">' + icon('graph') + 'How Genie understood your question</div>' +
      '<div class="ont head"><div>Your words</div><div>Business concept</div><div>What it means here</div></div>';
    rows.forEach(function (r) {
      var changed = r[2] === 'Changed by you';
      h += '<div class="ont"><div><span class="word">“' + r[0] + '”</span></div><div class="stack" style="gap:4px;align-items:flex-start"><div style="font-weight:600">' + r[1] + '</div><span class="badge ' + (changed ? 'warn' : 'ok') + '">' + r[2] + '</span></div>' +
        '<div class="stack" style="gap:2px"><div>' + r[3] + '</div><div class="small">' + r[4] + '</div></div></div>';
    });
    return h + '<div style="font-size:13px;color:var(--ink2)">From the Genie Ontology your data team maintains. Doesn\'t look right? <button type="button" class="link" style="padding:0" data-act="suggest">Suggest a change</button></div></div>';
  }

  function sourceCard(D) {
    function f(label, main, sub, mono) { return '<div class="fact"><div class="k">' + label + '</div><div>' + main + '</div><div class="s' + (mono ? ' mono' : '') + '">' + sub + '</div></div>'; }
    return '<div class="panel"><div class="panel-t">' + icon('db') + 'Where this came from</div>' +
      '<div class="grid2" style="gap:12px 24px;font-size:14px">' +
      f('Approved metric', '<strong>Revenue</strong> <span class="badge ok">Certified</span>', 'sales.revenue', true) +
      f('Owner', '<strong>Olist Commerce data team</strong>', 'via Genie Agent “Olist Commerce”', false) +
      f('Built from', 'Orders and Order items tables', 'olist_orders · olist_order_items', true) +
      f('Freshness', 'Refreshed daily · last update [time]', 'Your access: you can see all rows used', false) + '</div>' +
      '<div class="path" aria-label="Data path"><span class="hop">9 source files</span><span class="arrow" aria-hidden="true">→</span><span class="hop">Unity Catalog tables</span><span class="arrow" aria-hidden="true">→</span><span class="hop">Approved metric: Revenue</span><span class="arrow" aria-hidden="true">→</span>' +
      '<span class="hop end' + (D.isP ? ' warn' : '') + '">' + (D.isP ? 'This answer (your price-only change)' : 'This answer') + '</span></div></div>';
  }

  function feedback() {
    if (S.fbSent) return '<div role="status" class="status">' + (S.fb === 'down' ? 'Thanks. Sent to Genie and the Olist Commerce data team; you will be notified when they reply.' : 'Thanks. Your feedback helps Genie and the data team keep answers right.') + '</div>';
    if (!S.fb) return '';
    var down = S.fb === 'down';
    var list = down ? ['Wrong definition', 'Numbers look off', 'Missing data', 'Hard to understand', 'Other'] : ['Clear definitions', 'Numbers I can trust', 'Easy to share', 'Saved me a ticket'];
    var h = '<div class="panel"><div style="font-weight:600;font-size:15px">' + (down ? 'What went wrong?' : 'What was most useful?') + '</div><div class="row" role="group" style="gap:8px">' +
      list.map(function (l) { var p = !!S.reasons[l]; return '<button type="button" class="pill' + on(p) + '" aria-pressed="' + p + '" data-reason="' + l + '">' + (p ? icon('check', 14) : '') + l + '</button>'; }).join('') + '</div>' +
      '<label for="fbtext" class="label">Add details (optional)</label><textarea id="fbtext" rows="3" placeholder="' + (down ? 'e.g. Our exec reports exclude freight from revenue' : 'e.g. The calculation matched what finance uses') + '"></textarea>';
    if (down) h += '<div class="stack" style="gap:6px;font-size:14px"><label><input type="checkbox" checked> Also send to the Olist Commerce data team, who owns this metric</label><label><input type="checkbox" checked> Include this answer, its calculation and SQL</label></div>';
    return h + '<div class="modal-f"><button type="button" class="pill" data-act="fbCancel">Cancel</button><button type="button" class="pill primary" data-act="fbSend">Send feedback</button></div></div>';
  }

  // ---------- Modals ----------
  function modalWrap(title, body) {
    return '<div class="overlay"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-t"><div class="modal-h"><h2 id="modal-t">' + title + '</h2><button type="button" class="iconbtn" aria-label="Close" data-act="closeModal">' + icon('x') + '</button></div>' + body + '</div></div>';
  }

  function shareModal() {
    var h = '<div class="stack" style="gap:6px"><label for="who" class="label">People or groups</label><input id="who" type="text" value="[manager\'s email]"></div>' +
      '<div class="stack" style="gap:8px"><div class="label">They can</div><div class="row" role="group" aria-label="Role" style="gap:8px">' +
      '<button type="button" class="pill' + on(S.role === 'view') + '" aria-pressed="' + (S.role === 'view') + '" data-set="role:view">View</button>' +
      '<button type="button" class="pill' + on(S.role === 'cont') + '" aria-pressed="' + (S.role === 'cont') + '" data-set="role:cont">View and continue the chat</button></div></div>' +
      '<div class="stack" style="gap:8px"><div class="label">What they see</div><div class="row" role="group" aria-label="Scope" style="gap:8px">' +
      '<button type="button" class="pill' + on(S.scope === 'upto') + '" aria-pressed="' + (S.scope === 'upto') + '" data-set="scope:upto">Up to this message</button>' +
      '<button type="button" class="pill' + on(S.scope === 'live') + '" aria-pressed="' + (S.scope === 'live') + '" data-set="scope:live">This message and future ones</button></div>';
    if (S.scope === 'live') h += '<div class="note-warn">Anything you ask later in this chat, including Drive results, will also be visible to them.</div>';
    h += '</div><div class="stack inset"><div style="font-weight:600">Included</div><div>Chart, answer text, assumptions and SQL</div><div>Uploaded files and connected-app results: <strong>none in this chat</strong></div><div style="color:var(--ink2)">Recipients see results only for data they can access. Rows they can\'t access are hidden and marked.</div></div>' +
      '<div style="font-size:13px;color:var(--ink2)">They\'ll get an email. You can remove access anytime from Shared with.</div>' +
      '<div class="modal-f"><button type="button" class="pill lg" data-act="closeModal">Cancel</button><button type="button" class="pill lg primary" data-act="doShare">Share</button></div>';
    return modalWrap('Share this answer', h);
  }

  function scheduleModal(D) {
    var h = '<dl class="kv"><dt>Name</dt><dd><strong>' + D.schedName + '</strong></dd><dt>Sends to</dt><dd><strong>[your email]</strong></dd>' +
      '<dt>When</dt><dd><strong>Every Monday, 9:00 AM Pacific Time</strong> <button type="button" class="link">Change</button></dd>' +
      '<dt>Next send</dt><dd><strong>Mon, Nov 2, 9:00 AM PT</strong></dd><dt>Data</dt><dd>Re-runs the query each week with the ' + D.schedDef + '</dd>' +
      '<dt>Test email</dt><dd>None, unless you choose "Send a test now"</dd></dl>' +
      '<div class="preview"><div class="preview-h">Email preview</div>' +
      '<div class="stack" style="padding:12px 14px;font-size:14px;gap:4px"><div><strong>Subject:</strong> ' + D.schedName + ': week of Nov 2</div><div style="color:var(--ink2)">' + D.headline + '</div><div style="color:var(--ink3);font-size:13px">' + D.defLine + ' · Jan–Aug 2018 · Sep 2018 excluded · Open in GenieOne</div></div></div>' +
      '<div class="modal-f"><button type="button" class="pill lg">Send a test now</button><button type="button" class="pill lg primary" data-act="confirm">Confirm schedule</button></div>';
    return modalWrap('Confirm your schedule', h);
  }

  // ---------- Pages ----------
  function schedRow(name, when, extra, active) {
    return '<div class="card sched"><div class="sched-ic">' + icon('clock', 22) + '</div><div class="stack" style="flex:1;min-width:0;gap:2px">' +
      '<div class="sched-t">' + name + '</div><div class="sched-s">' + when + '</div>' + (extra ? '<div class="small" style="font-size:13px">' + extra + '</div>' : '') + '</div>' +
      (active ? '<div class="row" style="gap:8px;align-items:center"><span class="badge ok">Active</span><button type="button" class="pill">Pause</button><button type="button" class="pill">Edit</button></div>' : '') +
      '<button type="button" class="iconbtn" aria-label="More options for ' + name + '">' + icon('moreV', 20) + '</button></div>';
  }

  function schedules(D) {
    var h = '<section aria-label="Schedules"><div class="page-h"><div><h1>Schedules</h1><p>Run tasks on a schedule or whenever you need them</p></div>' +
      '<div class="row" style="gap:8px;align-items:center"><button type="button" class="plain">' + icon('chat', 20) + 'Send feedback</button>' +
      '<div class="split"><button type="button" data-go="start">' + icon('plus', 20) + 'Create in chat</button><button type="button" aria-label="More ways to create">' + icon('down', 18) + '</button></div></div></div><div class="list">';
    if (S.scheduled) h += schedRow(D.schedName, 'Every Monday at 09:00 (America/Los_Angeles) · Next run Mon, Nov 2 at 9:00 AM', 'To [your email] · Re-runs the query with the ' + D.schedDef + ' · Run history: no runs yet. Each run will show sent, failed or skipped, with the reason.', true);
    h += schedRow('Daily Olist file list email', 'At 09:00 (America/Los_Angeles) · Next run Thu, Oct 29 at 9:00 AM', '', false);
    return h + '</div></section>';
  }

  function connect() {
    return '<section aria-label="Connected apps"><div class="page-h"><div><h1>Connected apps</h1><p>Let GenieOne search and read your files and messages to add context to answers. It never edits or sends anything on your behalf.</p></div></div>' +
      '<div class="grid2">' +
      '<div class="card app"><div class="row" style="justify-content:space-between;align-items:center;gap:8px"><div style="font-weight:600;font-size:17px">Google Drive</div><span class="badge ok">Connected</span></div>' +
      '<dl class="kv" style="grid-template-columns:90px minmax(0,1fr);gap:6px 10px;font-size:14px"><dt>Access</dt><dd><strong>Read-only</strong>: search and read files</dd><dt>Who</dt><dd><strong>Only you</strong>: uses your own Drive permissions</dd><dt>Last used</dt><dd>Today, in 1 chat</dd></dl>' +
      '<div><button type="button" class="pill">Manage or disconnect</button></div></div>' +
      '<div class="card app"><div class="row" style="justify-content:space-between;align-items:center;gap:8px"><div style="font-weight:600;font-size:17px">Microsoft 365</div><span class="badge mute">Not connected</span></div>' +
      '<div style="font-size:14px;color:var(--ink2)">Choose what to connect. Each part is read-only and uses your own permissions.</div>' +
      '<div class="stack" style="gap:6px;font-size:14px"><label><input type="checkbox" checked> SharePoint files</label><label><input type="checkbox"> Outlook mail</label><label><input type="checkbox"> Teams chats</label></div>' +
      '<div class="small">Your admin may need to approve this connection.</div><div><button type="button" class="pill primary">Connect 1 part</button></div></div>' +
      '</div></section>';
  }

  // ---------- Render ----------
  function render(resetScroll) {
    var D = derived();
    var oldMain = document.querySelector('.main');
    var top = oldMain && !resetScroll ? oldMain.scrollTop : 0;
    var sc = S.screen;
    var view = sc === 'start' ? start() : sc === 'answer' ? answer(D) : sc === 'schedules' ? schedules(D) : connect();
    var wide = sc === 'schedules' || sc === 'connect';
    document.getElementById('root').innerHTML =
      '<div class="shell">' + topbar() +
      '<main class="main" id="main">' + mainhead() + '<div class="content' + (wide ? ' wide' : '') + '">' + view + '</div>' + (sc === 'answer' ? composer(true) : '') + '</main></div>' +
      (S.modal === 'share' ? shareModal() : S.modal === 'schedule' ? scheduleModal(D) : '') +
      (S.toast ? '<div class="toast" role="status">' + icon('check', 16) + S.toast + '</div>' : '');
    document.getElementById('main').scrollTop = top;
    for (var id in S.inputs) { var el = document.getElementById(id); if (el) el.value = S.inputs[id]; }
    if (S.modal && S.modal !== lastModal) { var f = document.querySelector('.modal input, .modal button'); if (f) f.focus(); }
    lastModal = S.modal;
  }

  function step(s) {
    if (s === 'share' || s === 'schedule') set({ screen: 'answer', modal: s, attach: false });
    else set({ screen: s, modal: null, attach: false });
  }

  document.addEventListener('input', function (e) {
    if (e.target.id && (e.target.type === 'text' || e.target.tagName === 'TEXTAREA')) S.inputs[e.target.id] = e.target.value;
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (S.modal) { S.modal = null; render(); }
    else if (S.attach) { S.attach = false; render(); }
  });

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.classList.contains('overlay')) { S.modal = null; render(); return; }
    var b = t.closest('button');
    if (!b) return;
    if (b.dataset.step) { step(b.dataset.step); return; }
    if (b.dataset.go) { set({ screen: b.dataset.go, attach: false, modal: null }); return; }
    if (b.dataset.set) { var kv = b.dataset.set.split(':'); S[kv[0]] = kv[1] || null; render(); return; }
    var a = b.dataset.act;
    if (a === 'sources') { S.sources = !S.sources; render(); }
    else if (a === 'attach') { S.attach = !S.attach; render(); }
    else if (a === 'handoff') { S.handoff = !S.handoff; render(); }
    else if (a === 'handoffFromStart') { set({ screen: 'answer', handoff: true }); }
    else if (a === 'openShare') { S.modal = 'share'; render(); }
    else if (a === 'openSchedule') { S.modal = 'schedule'; render(); }
    else if (a === 'closeModal') { S.modal = null; render(); }
    else if (a === 'doShare') { S.modal = null; toast('Shared with [manager\'s email]'); render(); }
    else if (a === 'confirm') { S.scheduled = true; toast('Scheduled. It now appears in Schedules.'); set({ modal: null, screen: 'schedules' }); }
    else if (a === 'thought') { S.thought = !S.thought; render(); }
    else if (a === 'suggest') { S.fb = 'down'; S.fbSent = false; S.reasons = { 'Wrong definition': true }; render(); }
    else if (a === 'fbUp' || a === 'fbDown') { S.fb = a === 'fbUp' ? 'up' : 'down'; S.fbSent = false; S.reasons = {}; render(); }
    else if (a === 'fbCancel') { S.fb = null; S.reasons = {}; delete S.inputs.fbtext; render(); }
    else if (a === 'fbSend') { S.fbSent = true; delete S.inputs.fbtext; render(); }
    else if (b.dataset.reason) { S.reasons[b.dataset.reason] = !S.reasons[b.dataset.reason]; render(); }
  });

  // Deep link to a walkthrough step, e.g. index.html#answer or #schedules
  var hash = location.hash.slice(1);
  if (hash === 'schedules' || STEPS.some(function (s) { return s[0] === hash; })) step(hash);
  else render();
})();
