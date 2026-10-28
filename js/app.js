(function () {
  var S = { screen: 'start', def: 'pf', role: 'view', scope: 'upto', sources: false, attach: false, handoff: false, confirmed: false, view: 'chart', sql: null, ont: true, fb: null, fbSent: false, reasons: {}, inputs: {} };
  var RAW = [['Jan', 1115], ['Feb', 993], ['Mar', 1160], ['Apr', 1160], ['May', 1153], ['Jun', 1023], ['Jul', 1066], ['Aug', 1022]];
  var STEPS = [['start', '1 · Start'], ['answer', '2 · Answer'], ['share', '3 · Share'], ['schedule', '4 · Schedule'], ['connect', '5 · Connected apps']];

  function set(p) { for (var k in p) S[k] = p[k]; render(); window.scrollTo(0, 0); }
  function fmt(v) { return 'R$' + (v / 1000).toFixed(2) + 'M'; }
  function on(c) { return c ? ' on' : ''; }

  function derived() {
    var isP = S.def === 'p', f = isP ? 0.86 : 1;
    var vals = RAW.map(function (r) { return r[1] * f; });
    var lo = fmt(Math.min.apply(null, vals)), hi = fmt(Math.max.apply(null, vals));
    return {
      isP: isP, vals: vals,
      headline: 'Monthly revenue held between ' + lo + ' and ' + hi + ' in Jan–Aug 2018, peaking in March and April.',
      chartTitle: (isP ? 'Revenue, price only' : 'Revenue, price + freight') + ' · full months, 2018 · illustrative values',
      aria: 'Bar chart of monthly revenue, January to August 2018, between ' + lo + ' and ' + hi + '; September 2018 shown as a partial, excluded month.',
      defLine: isP ? 'Revenue = item price only (your definition)' : 'Revenue = item price + freight',
      source: isP ? 'Source: Genie Agent Olist Commerce · based on certified metric view sales.revenue, with your price-only change' : 'Source: certified metric view sales.revenue · Genie Agent Olist Commerce · ontology rule "exclude canceled orders"',
      schedName: isP ? 'Weekly revenue (price only)' : 'Weekly revenue (price + freight)',
      schedDef: isP ? 'price-only definition' : 'certified price + freight definition'
    };
  }

  function nav() {
    return STEPS.map(function (s) {
      return '<button type="button" class="btn' + on(S.screen === s[0]) + '" data-go="' + s[0] + '"' + (S.screen === s[0] ? ' aria-current="step"' : '') + '>' + s[1] + '</button>';
    }).join('');
  }

  function start() {
    var h = '<section aria-label="Guided start" class="stack" style="gap:20px;padding-top:24px">' +
      '<h1 style="margin:0;font-size:32px;letter-spacing:-0.02em">How can I help you, Maya?</h1>' +
      '<div class="row" style="align-items:center;gap:8px;font-size:14px;color:var(--ink2)">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E4FB8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"></path><path d="M9 12l2 2 4-4"></path></svg>' +
      '<span>Answers use data you can access: <strong>3 Genie Agents</strong> · <strong>4 metric views</strong> · <strong>1 connected app</strong></span>' +
      '<button type="button" class="link" style="font-size:14px;font-weight:600;padding:10px 4px" data-act="sources">' + (S.sources ? 'Hide sources' : 'See sources') + '</button></div>';
    if (S.sources) {
      h += '<div class="card stack" style="padding:16px 20px;gap:12px;font-size:14px;border-radius:12px"><div class="grid2" style="gap:10px 24px">' +
        '<div><strong>Olist Commerce</strong> · Genie Agent · <span style="color:var(--ok);font-weight:600">Certified</span></div>' +
        '<div><strong>sales.revenue</strong> · metric view · <span style="color:var(--ok);font-weight:600">Certified</span></div>' +
        '<div><strong>Reviews</strong> · Genie Agent · <span style="color:var(--ok);font-weight:600">Certified</span></div>' +
        '<div><strong>reviews.kpis</strong> · metric view · <span style="color:var(--ok);font-weight:600">Certified</span></div>' +
        '<div><strong>Logistics</strong> · Genie Agent · not certified</div>' +
        '<div><strong>orders.delivery</strong>, <strong>customers.base</strong> · metric views</div>' +
        '<div><strong>Google Drive</strong> · connected app · read-only, only you</div></div>' +
        '<div style="color:var(--ink3);font-size:13px">Published by your data team in Unity Catalog. Missing something? <button type="button" class="link" data-act="handoffFromStart">Ask the data team</button></div></div>';
    }
    h += '<label for="ask" class="label">Ask a question</label>' +
      '<div class="row" style="gap:8px;background:#fff;border:1px solid var(--line2);border-radius:14px;padding:8px;align-items:center;flex-wrap:nowrap">' +
      '<button type="button" aria-label="Attach data, files or apps" data-act="attach" style="width:44px;height:44px;border:0;border-radius:10px;background:var(--chip);cursor:pointer;display:flex;align-items:center;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C1C1A" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button>' +
      '<input id="ask" type="text" value="How did revenue change month over month?" style="flex:1;min-width:0;border:0;outline:none;font-size:16px;padding:10px 0">' +
      '<button type="button" class="btn primary" data-go="answer">Ask</button></div>';
    if (S.attach) {
      h += '<div class="card stack" style="padding:8px;max-width:420px;border-radius:12px;box-shadow:0 8px 24px rgba(28,28,26,.08)">' +
        '<div style="padding:8px 12px;font-size:12px;font-weight:600;color:var(--ink3)">Add to your question</div>' +
        menuItem('Databricks data', 'A table, metric view, dashboard or Genie Agent', '') +
        menuItem('Files', 'CSV, Excel or PDF up to 5 GB · kept for this chat only', '') +
        menuItem('Connected apps', 'Google Drive · connected, read-only · Manage', 'connect') + '</div>';
    }
    h += '<div class="label" style="margin-top:8px">Start from a certified question</div><div class="row" style="gap:10px">' +
      ['How did revenue change month over month?', 'Which states have the most customers?', 'What is our late-delivery rate?'].map(function (q) {
        return '<button type="button" class="chipq" data-go="answer">' + q + '</button>';
      }).join('') + '</div></section>';
    return h;
  }
  function menuItem(t, d, go) {
    return '<button type="button"' + (go ? ' data-go="' + go + '"' : '') + ' style="text-align:left;min-height:44px;padding:8px 12px;border:0;background:none;border-radius:8px;cursor:pointer;font-size:14px;color:var(--ink)"><strong>' + t + '</strong><br><span style="color:var(--ink3);font-size:13px">' + d + '</span></button>';
  }

  function answer(D) {
    var isChart = S.view !== 'table';
    var h = '<section aria-label="Answer" class="stack" style="gap:16px">' +
      '<div style="align-self:flex-end;background:var(--accentSoft);border-radius:14px;padding:10px 16px;max-width:80%">How did revenue change month over month?</div>' +
      '<article class="card stack" style="gap:20px">' +
      '<p style="margin:0;font-size:18px;font-weight:600;line-height:1.4">' + D.headline + '</p>' +
      '<div class="stack" style="gap:8px"><div class="row" style="justify-content:space-between;align-items:center;gap:8px">' +
      '<div style="font-size:13px;color:var(--ink3)">' + D.chartTitle + '</div>' +
      '<div class="seg" role="group" aria-label="View as" style="background:var(--chip);border:0"><button type="button" class="' + (isChart ? 'on' : '') + '" aria-pressed="' + isChart + '" data-set="view:chart">Chart</button><button type="button" class="' + (!isChart ? 'on' : '') + '" aria-pressed="' + !isChart + '" data-set="view:table">Table</button></div></div>';
    if (isChart) {
      h += '<div><div class="bars" role="img" aria-label="' + D.aria + '">';
      D.vals.forEach(function (v) {
        h += '<div class="barcol"><div class="barval">' + fmt(v) + '</div><div style="width:100%;height:' + Math.round(v / 1160 * 170) + 'px;background:var(--accent);border-radius:4px 4px 0 0"></div></div>';
      });
      h += '<div class="barcol"><div class="barval">partial</div><div style="width:100%;height:8px;border-radius:4px 4px 0 0;background:repeating-linear-gradient(45deg,#B45309 0 3px,#FCEFC7 3px 6px)"></div></div></div>' +
        '<div class="months">' + RAW.map(function (r) { return '<div>' + r[0] + '</div>'; }).join('') + '<div>Sep*</div></div>' +
        '<div style="font-size:12px;color:var(--ink3);margin-top:6px">* Sep 2018 is a partial month (1 order) and is excluded from comparisons.</div></div>';
    } else {
      h += '<div style="overflow-x:auto;border:1px solid var(--line);border-radius:10px"><table><thead><tr><th scope="col">Month (2018)</th><th scope="col" style="text-align:right">Revenue</th><th scope="col" style="text-align:right">Change vs. prior month</th></tr></thead><tbody>';
      RAW.forEach(function (r, i) {
        var mom = '—', color = 'var(--ink3)';
        if (i > 0) {
          var pct = (RAW[i][1] - RAW[i - 1][1]) / RAW[i - 1][1] * 100;
          mom = (pct > 0 ? '+' : pct < 0 ? '−' : '') + Math.abs(pct).toFixed(1) + '%';
          color = Math.abs(pct) >= 5 ? (pct < 0 ? '#9A3412' : 'var(--ok)') : 'var(--ink3)';
        }
        h += '<tr><td>' + r[0] + '</td><td style="text-align:right">' + fmt(D.vals[i]) + '</td><td style="text-align:right;font-weight:600;color:' + color + '">' + mom + '</td></tr>';
      });
      h += '</tbody></table></div>';
    }
    h += '</div>' +
      '<div class="row" style="gap:10px;align-items:flex-start;flex-wrap:nowrap;font-size:14px;background:var(--bg);border-radius:10px;padding:10px 14px">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#44443F" stroke-width="2" stroke-linecap="round" aria-hidden="true" style="flex:none;margin-top:2px"><circle cx="12" cy="12" r="9"></circle><path d="M12 8v5M12 16h.01"></path></svg>' +
      '<div><strong>How sure is this?</strong> The totals are summed directly from the orders shown, not estimated. Month-to-month moves under ±5% are within normal variation here; the Feb and Jun dips (about −11%) are larger, but this data alone doesn\'t show why.</div></div>' +
      ontology(D) +
      '<div class="soft stack" style="gap:10px"><div class="row" style="justify-content:space-between;align-items:center;gap:8px">' +
      '<div style="font-weight:700;font-size:14px">How this was calculated</div>' +
      '<div class="row" style="align-items:center;gap:8px"><span style="font-size:13px;color:var(--ink2)">Change definition:</span>' +
      '<div class="seg" role="group" aria-label="Revenue definition"><button type="button" class="' + (!D.isP ? 'on' : '') + '" aria-pressed="' + !D.isP + '" data-set="def:pf">Price + freight</button><button type="button" class="' + (D.isP ? 'on' : '') + '" aria-pressed="' + D.isP + '" data-set="def:p">Price only</button></div></div></div>' +
      '<ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px;font-size:14px">' +
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
      h += '<div class="sql"><div class="row" style="justify-content:space-between;padding:0 14px 8px;font-size:12px;color:#C9C8C0"><span>Generated SQL · highlighted line matches the assumption</span><button type="button" class="link" style="color:#C9C8C0;font-size:12px;padding:0" data-set="sql:">Hide</button></div>' +
        lines.map(function (l) { return '<div class="l' + (l[1] && l[1] === S.sql ? ' hit' : '') + '">' + esc(l[0]) + '</div>'; }).join('') + '</div>';
    }
    if (D.isP) h += '<div class="note-warn">You changed the definition. This answer no longer matches the certified metric view <strong>sales.revenue</strong>; anyone you share it with will see your definition labeled.</div>';
    h += '</div>' + sourceCard(D) +
      '<div class="row" style="justify-content:space-between;align-items:center;gap:10px"><div class="row" style="gap:10px"><button type="button" class="btn primary" data-go="share">Share</button><button type="button" class="btn" data-go="schedule">Schedule</button><button type="button" class="btn" data-act="handoff">Ask the data team</button></div>' +
      '<div class="row" style="align-items:center;gap:6px"><span style="font-size:13px;color:var(--ink2)">Was this helpful?</span>' +
      '<button type="button" class="thumb' + (S.fb === 'up' ? ' up' : '') + '" aria-label="Helpful" aria-pressed="' + (S.fb === 'up') + '" data-act="fbUp"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10v11H4V10zM7 10l4-7a2 2 0 0 1 3 2l-1 5h6a2 2 0 0 1 2 2.3l-1.3 7A2 2 0 0 1 17.7 21H7"></path></svg></button>' +
      '<button type="button" class="thumb' + (S.fb === 'down' ? ' down' : '') + '" aria-label="Not helpful" aria-pressed="' + (S.fb === 'down') + '" data-act="fbDown"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 14V3h3v11zM17 14l-4 7a2 2 0 0 1-3-2l1-5H5a2 2 0 0 1-2-2.3l1.3-7A2 2 0 0 1 6.3 3H17"></path></svg></button></div></div>' +
      feedback();
    if (S.handoff) {
      h += '<div class="stack" style="font-size:14px;background:var(--accentSoft);border-radius:10px;padding:12px 14px;gap:6px"><div><strong>Request to the Olist Commerce data team</strong> (drafted, not sent)</div><div>Attached: your question, this answer, the SQL and the assumptions above.</div><label for="note" class="label">Add a note</label><input id="note" type="text" value="Should revenue in exec reports include freight?"><div><button type="button" class="btn primary">Send request</button></div></div>';
    }
    h += '<div class="stack" style="gap:8px"><div class="label">Suggested next questions</div><div class="row" style="gap:8px">' +
      ['Why did June dip?', 'Break this down by category', 'Orders vs. average order value'].map(function (q) { return '<button type="button" class="chipq">' + q + '</button>'; }).join('') +
      '</div></div></article></section>';
    return h;
  }

  function ontology(D) {
    var rows = [
      ['revenue', 'Revenue', D.isP ? 'Changed by you' : 'Certified', D.isP ? 'Item price only. The certified definition also includes freight.' : 'Item price + freight on orders that were not canceled', 'Owner: Olist Commerce data team · approved metric'],
      ['month over month', 'Calendar month', 'Certified', 'Each full month compared with the month before; partial months are left out', 'Ontology rule: compare full calendar periods only'],
      ['(implied) orders', 'Order', 'Certified', 'One purchase. Canceled and unavailable orders do not count toward revenue', 'Ontology rule: exclude canceled orders']
    ];
    var h = '<div class="stack" style="border:1px solid var(--line);border-radius:12px;padding:16px 18px;gap:12px"><div class="row" style="justify-content:space-between;align-items:center;gap:8px">' +
      '<div class="row" style="align-items:center;gap:8px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E4FB8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="2.5"></circle><circle cx="18" cy="6" r="2.5"></circle><circle cx="12" cy="18" r="2.5"></circle><path d="M8 7.5l3 8M16 7.5l-3 8M8.5 6h7"></path></svg><div style="font-weight:700;font-size:14px">How Genie understood your question</div></div>' +
      '<button type="button" class="link" style="font-weight:600;padding:8px 4px" aria-expanded="' + S.ont + '" data-act="ont">' + (S.ont ? 'Hide' : 'Show') + '</button></div>';
    if (S.ont) {
      h += '<div class="ont head"><div>Your words</div><div>Business concept</div><div>What it means here</div></div>';
      rows.forEach(function (r) {
        var changed = r[2] === 'Changed by you';
        h += '<div class="ont"><div><span class="pill">“' + r[0] + '”</span></div><div class="stack" style="gap:2px"><div style="font-weight:700">' + r[1] + '</div><div class="badge ' + (changed ? 'warn' : 'ok') + '" style="align-self:flex-start;padding:1px 8px">' + r[2] + '</div></div>' +
          '<div class="stack" style="gap:2px"><div>' + r[3] + '</div><div style="font-size:12px;color:var(--ink3)">' + r[4] + '</div></div></div>';
      });
      h += '<div style="font-size:13px;color:var(--ink2)">From the Genie Ontology your data team maintains. Doesn\'t look right? <button type="button" class="link" style="padding:0" data-act="suggest">Suggest a change</button></div>';
    }
    return h + '</div>';
  }

  function sourceCard(D) {
    function f(label, main, sub, mono) { return '<div><div style="font-size:12px;color:var(--ink3)">' + label + '</div><div>' + main + '</div><div style="font-size:12px;color:var(--ink3)' + (mono ? ';font-family:\'JetBrains Mono\',ui-monospace,monospace' : '') + '">' + sub + '</div></div>'; }
    return '<div class="stack" style="border:1px solid var(--line);border-radius:12px;padding:16px 18px;gap:12px">' +
      '<div class="row" style="align-items:center;gap:8px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E4FB8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7" ry="2.5"></ellipse><path d="M5 5.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6M5 11.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6"></path></svg><div style="font-weight:700;font-size:14px">Where this came from</div></div>' +
      '<div class="grid2" style="gap:10px 24px;font-size:14px">' +
      f('Approved metric', '<strong>Revenue</strong> <span class="badge ok" style="padding:2px 8px">Certified</span>', 'sales.revenue', true) +
      f('Owner', '<strong>Olist Commerce data team</strong>', 'via Genie Agent “Olist Commerce”', false) +
      f('Built from', 'Orders and Order items tables', 'olist_orders · olist_order_items', true) +
      f('Freshness', 'Refreshed daily · last update [time]', 'Your access: you can see all rows used', false) + '</div>' +
      '<div class="row" aria-label="Data path" style="align-items:center;gap:6px;font-size:13px"><span class="hop">9 source files</span><span aria-hidden="true" style="color:var(--ink3)">→</span><span class="hop">Unity Catalog tables</span><span aria-hidden="true" style="color:var(--ink3)">→</span><span class="hop">Approved metric: Revenue</span><span aria-hidden="true" style="color:var(--ink3)">→</span>' +
      '<span class="hop" style="font-weight:600;' + (D.isP ? 'background:var(--warnSoft);color:var(--warn)' : 'background:var(--accentSoft);color:var(--accent)') + '">' + (D.isP ? 'This answer (your price-only change)' : 'This answer') + '</span></div></div>';
  }

  function feedback() {
    if (S.fbSent) return '<div role="status" style="background:var(--okSoft);color:var(--ok);border-radius:10px;padding:10px 14px;font-size:14px;font-weight:600">' + (S.fb === 'down' ? 'Thanks. Sent to Genie and the Olist Commerce data team; you will be notified when they reply.' : 'Thanks. Your feedback helps Genie and the data team keep answers right.') + '</div>';
    if (!S.fb) return '';
    var down = S.fb === 'down';
    var list = down ? ['Wrong definition', 'Numbers look off', 'Missing data', 'Hard to understand', 'Other'] : ['Clear definitions', 'Numbers I can trust', 'Easy to share', 'Saved me a ticket'];
    var h = '<div class="stack" style="border:1px solid var(--line2);border-radius:12px;padding:16px 18px;gap:12px;background:#fff"><div style="font-weight:700;font-size:15px">' + (down ? 'What went wrong?' : 'What was most useful?') + '</div><div class="row" role="group" style="gap:8px">' +
      list.map(function (l) { var p = !!S.reasons[l]; return '<button type="button" class="btn' + on(p) + '" style="font-size:13px;padding:0 12px" aria-pressed="' + p + '" data-reason="' + l + '">' + l + '</button>'; }).join('') + '</div>' +
      '<label for="fbtext" class="label">Add details (optional)</label><textarea id="fbtext" rows="3" placeholder="' + (down ? 'e.g. Our exec reports exclude freight from revenue' : 'e.g. The calculation matched what finance uses') + '"></textarea>';
    if (down) h += '<div class="stack" style="gap:6px;font-size:14px"><label><input type="checkbox" checked> Also send to the Olist Commerce data team, who owns this metric</label><label><input type="checkbox" checked> Include this answer, its calculation and SQL</label></div>';
    return h + '<div class="row" style="justify-content:flex-end;gap:10px"><button type="button" class="btn" data-act="fbCancel">Cancel</button><button type="button" class="btn primary" data-act="fbSend">Send feedback</button></div></div>';
  }

  function share() {
    var h = '<section aria-label="Share"><div class="dialog"><h2 style="margin:0;font-size:20px">Share this answer</h2>' +
      '<div class="stack" style="gap:6px"><label for="who" class="label">People or groups</label><input id="who" type="text" value="[manager\'s email]"></div>' +
      '<div class="stack" style="gap:6px"><div class="label">They can</div><div class="row" role="group" aria-label="Role" style="gap:8px">' +
      '<button type="button" class="btn' + on(S.role === 'view') + '" aria-pressed="' + (S.role === 'view') + '" data-set="role:view">View</button>' +
      '<button type="button" class="btn' + on(S.role === 'cont') + '" aria-pressed="' + (S.role === 'cont') + '" data-set="role:cont">View and continue the chat</button></div></div>' +
      '<div class="stack" style="gap:6px"><div class="label">What they see</div><div class="row" role="group" aria-label="Scope" style="gap:8px">' +
      '<button type="button" class="btn' + on(S.scope === 'upto') + '" aria-pressed="' + (S.scope === 'upto') + '" data-set="scope:upto">Up to this message</button>' +
      '<button type="button" class="btn' + on(S.scope === 'live') + '" aria-pressed="' + (S.scope === 'live') + '" data-set="scope:live">This message and future ones</button></div>';
    if (S.scope === 'live') h += '<div class="note-warn">Anything you ask later in this chat, including Drive results, will also be visible to them.</div>';
    h += '</div><div class="stack" style="background:var(--bg);border-radius:12px;padding:14px 16px;font-size:14px;gap:6px"><div style="font-weight:700">Included</div><div>Chart, answer text, assumptions and SQL</div><div>Uploaded files and connected-app results: <strong>none in this chat</strong></div><div style="color:var(--ink2)">Recipients see results only for data they can access. Rows they can\'t access are hidden and marked.</div></div>' +
      '<div style="font-size:13px;color:var(--ink2)">They\'ll get an email. You can remove access anytime from Shared with.</div>' +
      '<div class="row" style="justify-content:flex-end;gap:10px"><button type="button" class="btn" data-go="answer">Cancel</button><button type="button" class="btn primary" data-go="schedule">Share</button></div></div></section>';
    return h;
  }

  function schedule(D) {
    var h = '<section aria-label="Schedule" class="stack" style="gap:20px"><div class="dialog"><h2 style="margin:0;font-size:20px">Confirm your schedule</h2>' +
      '<dl class="kv"><dt>Name</dt><dd><strong>' + D.schedName + '</strong></dd><dt>Sends to</dt><dd><strong>[your email]</strong></dd>' +
      '<dt>When</dt><dd><strong>Every Monday, 9:00 AM Pacific Time</strong> <button type="button" class="link">Change</button></dd>' +
      '<dt>Next send</dt><dd><strong>Mon, Nov 2, 9:00 AM PT</strong></dd><dt>Data</dt><dd>Re-runs the query each week with the ' + D.schedDef + '</dd>' +
      '<dt>Test email</dt><dd>None, unless you choose "Send a test now"</dd></dl>' +
      '<div style="border:1px solid var(--line);border-radius:12px;overflow:hidden"><div style="background:var(--bg);padding:8px 14px;font-size:12px;font-weight:600;color:var(--ink2)">Email preview</div>' +
      '<div class="stack" style="padding:12px 14px;font-size:14px;gap:4px"><div><strong>Subject:</strong> ' + D.schedName + ': week of Nov 2</div><div style="color:var(--ink2)">' + D.headline + '</div><div style="color:var(--ink3);font-size:13px">' + D.defLine + ' · Jan–Aug 2018 · Sep 2018 excluded · Open in GenieOne</div></div></div>' +
      '<div class="row" style="justify-content:flex-end;gap:10px"><button type="button" class="btn">Send a test now</button><button type="button" class="btn primary" data-act="confirm">Confirm schedule</button></div></div>';
    if (S.confirmed) {
      h += '<div class="stack" style="width:100%;max-width:560px;margin:0 auto;gap:10px"><div role="status" style="background:var(--okSoft);color:var(--ok);border-radius:10px;padding:10px 14px;font-size:14px;font-weight:600">Scheduled. It now appears in Schedules.</div>' +
        '<div class="card stack" style="padding:18px 20px;gap:10px"><h3 style="margin:0;font-size:16px">Schedules</h3><div class="row" style="justify-content:space-between;gap:8px;align-items:center;border-top:1px solid var(--line);padding-top:10px">' +
        '<div><div style="font-weight:600">' + D.schedName + '</div><div style="font-size:13px;color:var(--ink3)">To [your email] · Mondays 9:00 AM PT · Next: Mon, Nov 2</div></div>' +
        '<div class="row" style="gap:8px;align-items:center"><span class="badge ok">Active</span><button type="button" class="btn">Pause</button><button type="button" class="btn">Edit</button></div></div>' +
        '<div style="font-size:13px;color:var(--ink3)">Run history: no runs yet. Each run will show sent, failed or skipped, with the reason.</div></div></div>';
    }
    return h + '</section>';
  }

  function connect() {
    return '<section aria-label="Connected apps" class="stack" style="gap:16px"><h2 style="margin:0;font-size:22px">Connected apps</h2>' +
      '<p style="margin:0;color:var(--ink2);font-size:14px">Connected apps let GenieOne search and read your files and messages to add context to answers. It never edits or sends anything on your behalf.</p>' +
      '<div class="grid2">' +
      '<div class="card stack" style="padding:18px;gap:10px;border-radius:14px"><div class="row" style="justify-content:space-between;align-items:center;gap:8px"><div style="font-weight:700">Google Drive</div><span class="badge ok">Connected</span></div>' +
      '<dl class="kv" style="grid-template-columns:90px minmax(0,1fr);gap:4px 10px;font-size:13px"><dt>Access</dt><dd><strong>Read-only</strong>: search and read files</dd><dt>Who</dt><dd><strong>Only you</strong>: uses your own Drive permissions</dd><dt>Last used</dt><dd>Today, in 1 chat</dd></dl>' +
      '<div><button type="button" class="btn">Manage or disconnect</button></div></div>' +
      '<div class="card stack" style="padding:18px;gap:10px;border-radius:14px"><div class="row" style="justify-content:space-between;align-items:center;gap:8px"><div style="font-weight:700">Microsoft 365</div><span class="badge mute">Not connected</span></div>' +
      '<div style="font-size:13px;color:var(--ink2)">Choose what to connect. Each part is read-only and uses your own permissions.</div>' +
      '<div class="stack" style="gap:6px;font-size:14px"><label><input type="checkbox" checked> SharePoint files</label><label><input type="checkbox"> Outlook mail</label><label><input type="checkbox"> Teams chats</label></div>' +
      '<div style="font-size:12px;color:var(--ink3)">Your admin may need to approve this connection.</div><div><button type="button" class="btn primary">Connect 1 part</button></div></div>' +
      '</div></section>';
  }

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function render() {
    var D = derived();
    document.getElementById('nav').innerHTML = nav();
    var v = S.screen === 'start' ? start() : S.screen === 'answer' ? answer(D) : S.screen === 'share' ? share() : S.screen === 'schedule' ? schedule(D) : connect();
    document.getElementById('app').innerHTML = v;
    for (var id in S.inputs) { var el = document.getElementById(id); if (el) el.value = S.inputs[id]; }
  }

  document.addEventListener('input', function (e) {
    if (e.target.id && (e.target.type === 'text' || e.target.tagName === 'TEXTAREA')) S.inputs[e.target.id] = e.target.value;
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.go) { set({ screen: b.dataset.go, attach: false, confirmed: b.dataset.go === 'schedule' ? false : S.confirmed }); return; }
    if (b.dataset.set) { var kv = b.dataset.set.split(':'); var p = {}; p[kv[0]] = kv[1] || null; for (var k in p) S[k] = p[k]; render(); return; }
    var a = b.dataset.act;
    if (a === 'sources') { S.sources = !S.sources; render(); }
    else if (a === 'attach') { S.attach = !S.attach; render(); }
    else if (a === 'handoff') { S.handoff = !S.handoff; render(); }
    else if (a === 'handoffFromStart') { set({ screen: 'answer', handoff: true }); }
    else if (a === 'confirm') { S.confirmed = true; render(); }
    else if (a === 'ont') { S.ont = !S.ont; render(); }
    else if (a === 'suggest') { S.fb = 'down'; S.fbSent = false; S.reasons = { 'Wrong definition': true }; render(); }
    else if (a === 'fbUp' || a === 'fbDown') { S.fb = a === 'fbUp' ? 'up' : 'down'; S.fbSent = false; S.reasons = {}; render(); }
    else if (a === 'fbCancel') { S.fb = null; S.reasons = {}; delete S.inputs.fbtext; render(); }
    else if (a === 'fbSend') { S.fbSent = true; delete S.inputs.fbtext; render(); }
    else if (b.dataset.reason) { S.reasons[b.dataset.reason] = !S.reasons[b.dataset.reason]; render(); }
  });

  render();
})();
