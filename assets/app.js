// RA coding tool. All work lives in this browser (localStorage) until the RA
// exports it. Nothing is sent to any server.
(function () {
  const CB = window.CODEBOOK;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const themeBy = Object.fromEntries(CB.themes.map((t) => [t.code, t]));
  const subsFor = (code) => (!code ? [] : themeBy[code].sub || CB.topicDomains);

  let S = null; // { ra, batch, codes, cur }
  const key = () => `aidspeech:${S.batch.batch_id}:${S.ra}`;
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  };
  function save() {
    if (!store.set(key(), { ra: S.ra, batch: S.batch, codes: S.codes, cur: S.cur, saved: new Date().toISOString() }))
      toast("Could not autosave: export a backup now!");
    store.set("aidspeech:last", key());
    $("#saved").textContent = "Saved " + new Date().toLocaleTimeString();
  }
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2200); }

  const blankArt = () => ({ status: "todo", no_acts: false, flag: "", notes: "", acts: [] });
  const blankAct = (quote = "") => ({ speaker_name: "", speaker_role: "", speaker_type: "", form: "direct", quote, theme: "", theme_sub: "", theme2: "", theme2_sub: "", confidence: "", notes: "", created: new Date().toISOString() });
  const art = () => S.batch.articles[S.cur];
  const code = (id = art().id) => (S.codes[id] ||= blankArt());

  function actProblems(a) {
    const p = [];
    if (!a.speaker_name.trim()) p.push("speaker");
    if (!a.speaker_type) p.push("speaker type");
    if (!a.quote.trim()) p.push("quote");
    if (!a.theme) p.push("primary theme");
    else if (!a.theme_sub) p.push("primary sub-code");
    if (a.theme2 && !a.theme2_sub) p.push("secondary sub-code");
    if (!a.confidence) p.push("confidence");
    return p;
  }

  // ---------- loader ----------
  function showLoader() {
    $("#app").hidden = true; $("#loader").hidden = false;
    const last = store.get("aidspeech:last");
    const resume = last && store.get(last);
    $("#resume").innerHTML = resume
      ? `<p>Resume <b>${esc(resume.batch.batch_id)}</b> as <b>${esc(resume.ra)}</b> (last saved ${new Date(resume.saved).toLocaleString()}). <button class="primary" id="resumeBtn">Resume</button></p>` : "";
    if (resume) $("#resumeBtn").onclick = () => start(resume);
  }
  function readFile(file) {
    const ra = $("#raName").value.trim();
    if (!ra) { toast("Enter your RA initials first"); $("#raName").focus(); return; }
    const fr = new FileReader();
    fr.onload = () => {
      let d; try { d = JSON.parse(fr.result); } catch { return toast("That file is not valid JSON"); }
      if (d.articles && d.batch_id) { // a batch file
        const prev = store.get(`aidspeech:${d.batch_id}:${ra}`);
        if (prev && !confirm(`You already have saved work for ${d.batch_id}. Continue it? (Cancel = start over)`))
          return start({ ra, batch: d, codes: {}, cur: 0 });
        return start(prev || { ra, batch: d, codes: {}, cur: 0 });
      }
      if (d.backup && d.batch) return start({ ra: d.ra, batch: d.batch, codes: d.codes, cur: 0 }); // a backup
      toast("Unrecognised file: load a batch file (e.g. EN-B01.json) or a backup");
    };
    fr.readAsText(file);
  }
  function start(st) {
    S = st; S.cur = Math.min(S.cur || 0, S.batch.articles.length - 1);
    $("#loader").hidden = true; $("#app").hidden = false;
    $("#who").textContent = `${S.ra} · ${S.batch.batch_id} (${S.batch.language})`;
    save(); render();
  }

  // ---------- render ----------
  function render() { renderList(); renderArticle(); renderCoding(); renderProgress(); }
  function status(id) { const c = S.codes[id]; return c ? c.status : "todo"; }
  function renderProgress() {
    const n = S.batch.articles.length, d = S.batch.articles.filter((a) => status(a.id) === "done").length;
    const acts = Object.values(S.codes).reduce((s, c) => s + c.acts.length, 0);
    $("#progress").textContent = `${d}/${n} articles done · ${acts} speech acts`;
  }
  function renderList() {
    $("#list").innerHTML = S.batch.articles.map((a, i) => {
      const st = status(a.id), n = S.codes[a.id]?.acts.length || 0;
      return `<div class="item ${i === S.cur ? "on" : ""}" data-i="${i}"><span class="st ${st}">${st === "done" ? "✓ done" : st === "started" ? "● " + n : "○"}</span><span class="id">${esc(a.id)}</span><br>${esc(a.title).slice(0, 70)}</div>`;
    }).join("");
  }
  function renderArticle() {
    const a = art(), c = code();
    // highlight quotes that appear verbatim in the text
    const spans = [];
    c.acts.forEach((x, i) => { const q = x.quote.trim(); if (q.length >= 8) { const at = a.text.indexOf(q); if (at >= 0) spans.push([at, at + q.length, i + 1]); } });
    spans.sort((p, q) => p[0] - q[0]);
    let html = "", pos = 0;
    for (const [s, e, n] of spans) { if (s < pos) continue; html += esc(a.text.slice(pos, s)) + `<mark title="Speech act ${n}">${esc(a.text.slice(s, e))}</mark>`; pos = e; }
    html += esc(a.text.slice(pos));
    $("#article").innerHTML = `<h2>${esc(a.title)}</h2>
      <div class="src">${esc(a.id)} · ${esc(a.country)} · ${esc(a.source)} · ${esc(a.date)}${a.author ? " · " + esc(a.author) : ""} · <a href="${esc(a.url)}" target="_blank" rel="noopener">original ↗</a></div>
      <div class="body" id="body">${html}</div>`;
    $("#article").scrollTop = 0;
  }
  const opts = (list, val, blank = "— choose —") => `<option value="">${blank}</option>` + list.map(([v, l]) => `<option value="${v}" ${v === val ? "selected" : ""}>${esc(l)}</option>`).join("");
  const themeOpts = (val, blank) => opts(CB.themes.map((t) => [t.code, t.label]), val, blank);

  function renderCoding() {
    const c = code();
    const actsHtml = c.acts.map((x, i) => {
      const bad = c.status === "done" ? [] : actProblems(x);
      const t = themeBy[x.theme], t2 = themeBy[x.theme2];
      return `<div class="act" data-i="${i}">
        <div class="head"><span>Speech act ${i + 1}</span><span><button data-act="up" ${i ? "" : "disabled"} title="Move up">↑</button> <button class="danger" data-act="del">Delete</button></span></div>
        <div class="row"><div><label>Speaker name</label><input type="text" data-f="speaker_name" value="${esc(x.speaker_name)}" placeholder="e.g. Muhammad Ali Pate"></div>
          <div><label>Role / organisation</label><input type="text" data-f="speaker_role" value="${esc(x.speaker_role)}" placeholder="e.g. Health Minister"></div></div>
        <div class="row"><div><label>Speaker type</label><select data-f="speaker_type">${opts(CB.speakerTypes, x.speaker_type)}</select></div>
          <div><label>Form</label><div class="radios"><label><input type="radio" name="form${i}" data-f="form" value="direct" ${x.form === "direct" ? "checked" : ""}> direct</label><label><input type="radio" name="form${i}" data-f="form" value="indirect" ${x.form === "indirect" ? "checked" : ""}> reported</label></div></div></div>
        <div class="field"><label>Quote (paste or select in the article)</label><textarea rows="3" data-f="quote">${esc(x.quote)}</textarea></div>
        <div class="row"><div><label>Primary theme</label><select data-f="theme">${themeOpts(x.theme)}</select></div>
          <div><label>${x.theme === "not_aid" ? "Topic domain" : "Sub-code"}</label><select data-f="theme_sub" ${x.theme ? "" : "disabled"}>${opts(subsFor(x.theme), x.theme_sub)}</select></div></div>
        ${t ? `<div class="hint">${esc(t.def)}</div>` : ""}
        <div class="row" style="margin-top:6px"><div><label>Secondary theme (optional)</label><select data-f="theme2">${themeOpts(x.theme2, "— none —")}</select></div>
          <div><label>Sub-code</label><select data-f="theme2_sub" ${x.theme2 ? "" : "disabled"}>${opts(subsFor(x.theme2), x.theme2_sub)}</select></div></div>
        ${t2 ? `<div class="hint">${esc(t2.def)}</div>` : ""}
        <div class="row" style="margin-top:6px"><div><label>Confidence</label><select data-f="confidence">${opts([["3", "3 – clear"], ["2", "2 – probably"], ["1", "1 – hard call"]], x.confidence)}</select></div>
          <div><label>Notes</label><input type="text" data-f="notes" value="${esc(x.notes)}"></div></div>
        ${bad.length && (x.theme || x.quote) ? `<div class="hint" style="color:var(--warn)">Missing: ${bad.join(", ")}</div>` : ""}
      </div>`;
    }).join("");
    $("#coding").innerHTML = `
      <div class="artbox">
        <label><input type="checkbox" id="noActs" ${c.no_acts ? "checked" : ""}> No speech acts in this article</label>
        <div class="row" style="margin-top:8px"><div><label>Text problem?</label><select id="flag">${opts([["truncated", "Truncated / incomplete"], ["garbled", "Garbled / boilerplate"], ["not_article", "Not a news article"], ["duplicate", "Duplicate of another article"], ["wrong_language", "Wrong language"]], c.flag, "— no problem —")}</select></div>
          <div><label>Article notes</label><input type="text" id="artNotes" value="${esc(c.notes)}"></div></div>
      </div>
      ${actsHtml || (c.no_acts ? "" : `<div class="empty">Select a quote in the article, or click “Add speech act”.</div>`)}
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button id="addAct" ${c.no_acts ? "disabled" : ""}>+ Add speech act</button><span style="flex:1"></span>
        ${c.status === "done" ? `<button id="reopen">Reopen</button>` : `<button class="primary" id="done">Mark done &amp; next →</button>`}
      </div>`;
  }

  // ---------- events ----------
  function onCodingInput(e) {
    const el = e.target, c = code();
    if (el.id === "noActs") {
      if (el.checked && c.acts.length && !confirm("Delete the speech acts already entered for this article?")) { el.checked = false; return; }
      c.no_acts = el.checked; if (el.checked) c.acts = [];
      touch(c); renderCoding(); renderArticle(); return;
    }
    if (el.id === "flag") { c.flag = el.value; return touch(c); }
    if (el.id === "artNotes") { c.notes = el.value; return touch(c); }
    const box = el.closest(".act"); if (!box || !el.dataset.f) return;
    const a = c.acts[+box.dataset.i], f = el.dataset.f;
    a[f] = el.value;
    if (f === "theme") a.theme_sub = "";
    if (f === "theme2") a.theme2_sub = "";
    touch(c);
    if (["theme", "theme2", "theme_sub", "theme2_sub", "speaker_type", "confidence"].includes(f)) renderCodingKeepScroll();
  }
  function renderCodingKeepScroll() { const y = $("#coding").scrollTop; renderCoding(); $("#coding").scrollTop = y; }
  function touch(c) { if (c.status === "todo") c.status = "started"; save(); renderList(); renderProgress(); }

  function addAct(quote) {
    const c = code(); if (c.no_acts) return toast("Untick ‘No speech acts’ first");
    if (c.status === "done") c.status = "started";
    c.acts.push(blankAct(quote)); touch(c); renderCoding(); renderArticle();
    const boxes = document.querySelectorAll(".act"); const last = boxes[boxes.length - 1];
    last.scrollIntoView({ behavior: "smooth", block: "start" }); $("[data-f=speaker_name]", last).focus();
  }
  function markDone() {
    const c = code();
    if (!c.no_acts && !c.acts.length && !c.flag) return toast("Add speech acts, tick ‘No speech acts’, or flag a text problem");
    const bad = c.acts.map((a, i) => [i + 1, actProblems(a)]).filter(([, p]) => p.length);
    if (bad.length) { renderCoding(); return toast(`Speech act ${bad[0][0]} is missing: ${bad[0][1].join(", ")}`); }
    c.status = "done"; c.done_at = new Date().toISOString(); save();
    const next = S.batch.articles.findIndex((a, i) => i > S.cur && status(a.id) !== "done");
    if (next >= 0) S.cur = next; else toast("All articles in this batch are done. Export your codes!");
    save(); render();
  }

  // ---------- export ----------
  const COLS = ["codebook_version", "ra", "batch_id", "article_id", "country", "source", "date", "url", "title", "article_status", "no_speech_acts", "text_flag", "article_notes", "act_n", "speaker_name", "speaker_role", "speaker_type", "speech_form", "quote", "primary_theme", "primary_sub", "secondary_theme", "secondary_sub", "confidence", "act_notes", "done_at"];
  function rows() {
    const out = [];
    for (const a of S.batch.articles) {
      const c = S.codes[a.id] || blankArt();
      const base = { codebook_version: CB.VERSION, ra: S.ra, batch_id: S.batch.batch_id, article_id: a.id, country: a.country, source: a.source, date: a.date, url: a.url, title: a.title, article_status: c.status, no_speech_acts: c.no_acts ? 1 : 0, text_flag: c.flag, article_notes: c.notes, done_at: c.done_at || "" };
      if (!c.acts.length) { out.push({ ...base, act_n: 0 }); continue; }
      c.acts.forEach((x, i) => out.push({ ...base, act_n: i + 1, speaker_name: x.speaker_name, speaker_role: x.speaker_role, speaker_type: x.speaker_type, speech_form: x.form, quote: x.quote, primary_theme: x.theme, primary_sub: x.theme_sub, secondary_theme: x.theme2, secondary_sub: x.theme2_sub, confidence: x.confidence, act_notes: x.notes }));
    }
    return out;
  }
  const csvCell = (v) => { v = String(v ?? ""); return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; };
  function download(name, text, type) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  const stamp = () => new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
  function exportCsv() {
    const csv = "﻿" + [COLS.join(","), ...rows().map((r) => COLS.map((k) => csvCell(r[k])).join(","))].join("\r\n");
    download(`${S.batch.batch_id}_${S.ra}_${stamp()}.csv`, csv, "text/csv;charset=utf-8");
  }
  function exportBackup() {
    download(`${S.batch.batch_id}_${S.ra}_${stamp()}_backup.json`, JSON.stringify({ backup: 1, codebook_version: CB.VERSION, ra: S.ra, batch: S.batch, codes: S.codes }), "application/json");
  }

  // ---------- wire up ----------
  document.addEventListener("DOMContentLoaded", () => {
    const drop = $("#drop"), file = $("#file");
    $("#raName").value = store.get("aidspeech:ra") || "";
    $("#raName").addEventListener("change", (e) => store.set("aidspeech:ra", e.target.value.trim()));
    file.addEventListener("change", () => file.files[0] && readFile(file.files[0]));
    drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("over"); });
    drop.addEventListener("dragleave", () => drop.classList.remove("over"));
    drop.addEventListener("drop", (e) => { e.preventDefault(); drop.classList.remove("over"); e.dataTransfer.files[0] && readFile(e.dataTransfer.files[0]); });

    $("#list").addEventListener("click", (e) => { const it = e.target.closest(".item"); if (!it) return; S.cur = +it.dataset.i; save(); render(); });
    $("#coding").addEventListener("input", onCodingInput);
    // re-highlight the article once a quote edit is finished
    $("#coding").addEventListener("change", (e) => { if (e.target.dataset.f === "quote") renderArticle(); });
    $("#coding").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.id === "addAct") return addAct("");
      if (b.id === "done") return markDone();
      if (b.id === "reopen") { code().status = "started"; save(); return render(); }
      const i = +b.closest(".act")?.dataset.i, c = code();
      if (b.dataset.act === "del" && confirm(`Delete speech act ${i + 1}?`)) { c.acts.splice(i, 1); touch(c); renderCoding(); renderArticle(); }
      if (b.dataset.act === "up") { [c.acts[i - 1], c.acts[i]] = [c.acts[i], c.acts[i - 1]]; touch(c); renderCoding(); }
    });
    // add a speech act from selected article text
    const sel = $("#selbtn");
    $("#article").addEventListener("mouseup", (e) => {
      setTimeout(() => {
        const s = window.getSelection(), t = s.toString().trim();
        if (!t || !$("#body")?.contains(s.anchorNode)) { sel.style.display = "none"; return; }
        sel.style.left = e.clientX + 8 + "px"; sel.style.top = e.clientY + 8 + "px"; sel.style.display = "block"; sel._text = t;
      }, 0);
    });
    document.addEventListener("mousedown", (e) => { if (e.target !== sel) sel.style.display = "none"; });
    sel.addEventListener("click", () => { sel.style.display = "none"; addAct(sel._text.replace(/\s+/g, " ")); window.getSelection().removeAllRanges(); });

    $("#prev").onclick = () => { if (S.cur > 0) { S.cur--; save(); render(); } };
    $("#next").onclick = () => { if (S.cur < S.batch.articles.length - 1) { S.cur++; save(); render(); } };
    $("#csv").onclick = exportCsv;
    $("#backup").onclick = exportBackup;
    $("#switch").onclick = () => { S = null; showLoader(); };
    document.addEventListener("keydown", (e) => {
      if (!S || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
      if (e.key === "ArrowRight" || e.key === "j") $("#next").click();
      if (e.key === "ArrowLeft" || e.key === "k") $("#prev").click();
    });
    window.addEventListener("beforeunload", () => S && save());
    showLoader();
  });
})();
