// CODEBOOK. Edit here; the app and its coding guide both read this file.
// Bump CB_VERSION whenever a category or question changes: it is saved with every code.
// v3.1 (2026-11-18): every choice question gets "Other" + a typed box; "Other theme" added.
// v3 (2026-11-16) follows the team's category list; see speech_categories/v3/codebook_v3.md in the parent project.
window.CB_VERSION = "v3.1-2026-11-18";

// Actor list reused by blame, accommodation and praise. A target not on the list: pick "Other"
// and type it in the box; recurring new targets get added here.
const ACTORS = [
  ["us", "United States"], ["other_donor", "Other donor country"], ["donors_general", "Donors in general"],
  ["china", "China"], ["russia", "Russia"], ["eu_europe", "EU / Europe"], ["gulf_turkey", "Gulf states / Turkey"],
  ["multilateral", "UN / World Bank / IMF / multilateral"], ["own_gov", "Own government"], ["prev_gov", "Previous government"],
  ["other_african_gov", "Other African government"], ["opposition", "Opposition"], ["ngo", "NGO / civil society"],
  ["private_sector", "Private sector"], ["public", "The public / citizens"], ["other", "Other (type below)"],
];
const otherBox = (on = "target") => ({ id: "other_target", label: "If other: who?", text: true, placeholder: "name the target", showIf: [on, "other"] });

// THEMES: present or not in a speech act. Several can apply at once.
// key = keyboard shortcut in "All categories"; q = follow-up questions asked when the theme is present.
// Question kinds: opts (one answer), many: true (all that apply; `only` = answer that clears the others),
// text: true (short typed answer), showIf: [question id, value or [values]] (asked only after that answer;
// for an all-that-apply question, when any of those values is picked).
window.CATS = [
  { id: "blame", key: "1", label: "Blame", color: "--pain",
    desc: "The speaker assigns fault for a problem to someone (a government, a donor, a group). Describing a problem without saying whose fault it is is not blame.",
    q: [
      { id: "target", label: "Who is blamed? (all that apply)", many: true, opts: ACTORS },
      otherBox(),
    ] },
  { id: "pain", key: "2", label: "Pain and suffering", color: "--sec",
    desc: "The speaker describes pain and suffering, broadly defined: deaths, disease, hunger, job losses, hardship, risk to people or services.",
    q: [
      { id: "aid_withdrawal", label: "Is the suffering due to aid withdrawal or aid cuts?", opts: [["yes", "Yes"], ["no", "No"]] },
      { id: "blame", label: "Suffering due to the withdrawal: is blame assigned? (all that apply)", showIf: ["aid_withdrawal", "yes"], many: true, only: "none",
        opts: [["none", "No blame assigned"], ...ACTORS] },
      otherBox("blame"),
    ] },
  { id: "accommodation", key: "3", label: "Accommodation", color: "--acc",
    desc: "The speaker keeps the relationship going by accommodating an outside power or its demands: reaffirming the partnership, or offering security cooperation, data access, critical minerals, taking refugees/deportees, trade concessions, policy alignment.",
    q: [
      { id: "type", label: "Which kind? (all that apply)", many: true, opts: [
        ["partnership", "Reaffirming partnership"], ["security_coop", "Security cooperation"], ["data_access", "Data access"],
        ["critical_minerals", "Critical minerals access"], ["refugees", "Refugees / deportees"], ["trade_concession", "Trade concession"],
        ["policy_alignment", "Policy alignment"], ["other", "Other (type below)"]] },
      { id: "target", label: "Toward whom? (all that apply)", many: true, opts: ACTORS },
      otherBox(),
    ] },
  { id: "praise", key: "4", label: "Praise", color: "--praise",
    desc: "The speaker praises, thanks or commends an actor. Praise evaluates an actor positively; accommodation offers or concedes something. An act can be both.",
    q: [
      { id: "target", label: "Who is praised? (all that apply)", many: true, opts: ACTORS },
      otherBox(),
      { id: "about", label: "Is the praise about aid?", opts: [["aid", "Aid-related"], ["general", "General (not about aid)"], ["both", "Both"]] },
    ] },
  { id: "capaut", key: "5", label: "Capacity / autonomy", color: "--auto",
    desc: "Capacity (technical): we can make this happen, e.g. filling the gap from aid cuts with concrete financing or domestic programmes. Autonomy (political): independence, less reliance on the US or donors, sovereignty, “we can stand on our own”.",
    q: [
      { id: "basis", label: "Which?", opts: [["capacity", "Capacity (technical)"], ["autonomy", "Autonomy (ideological)"], ["both", "Both"]] },
    ] },
  { id: "technocratic", key: "6", label: "Technocratic", color: "--tech",
    desc: "The speaker talks about aid or policy in technical, apolitical terms: figures, programme mechanics, implementation. Can combine with other themes; “pure technocratic” is computed later as technocratic with no other theme.",
    q: [
      { id: "style", label: "Which style?", opts: [["apolitical", "Apolitical (plain technical information)"], ["evasive", "Jargon to avoid a political stance"]] },
    ] },
  { id: "security", key: "7", label: "Security concerns", color: "--venue",
    desc: "The speaker raises security concerns: terrorism, conflict, instability, border or migration security, military cooperation.",
    q: [] },
  { id: "outside", key: "8", label: "Outside option", color: "--spk",
    desc: "The speaker mentions an outside (non-US, non-domestic) source of funding or support: other donors, China, a trade agreement, loans or bonds, investment. Domestic money is capacity, not an outside option.",
    q: [
      { id: "who", label: "From whom? (all that apply)", many: true, opts: [
        ["western_io", "Western donors / IOs (EU, Japan, World Bank, IMF, UN, Global Fund)"], ["china", "China"],
        ["other_bilateral", "Other bilateral (Gulf, India, Russia, Turkey…)"], ["african_regional", "African / regional (AfCFTA, AfDB, AU)"],
        ["private", "Private / philanthropy"]] },
      { id: "type", label: "What type? (all that apply)", many: true, opts: [
        ["foreign_aid", "Foreign aid"], ["trade_agreement", "Trade agreement"], ["finance", "Finance (loans, bonds, debt)"], ["investment", "Investment"]] },
      { id: "proactive", label: "How is it raised?", opts: [["fallback", "As a replacement: “we will be fine, we have X”"], ["incidental", "Mentioned, not as a replacement"]] },
    ] },
  { id: "other", key: "9", label: "Other theme", color: "--none", noTask: true,
    desc: "A theme that matters here but is not on the list. Mark it and describe the theme in a few words. Recurring answers become new themes.",
    q: [
      { id: "what", label: "What theme?", text: true, placeholder: "describe the theme" },
    ] },
];

// Exclusive answers: picking one clears the themes above, and vice versa.
window.EXCL = [
  { id: "none", key: "0", label: "None of these", color: "--none", desc: "A real speech act with none of the themes above." },
  { id: "bad", key: "x", label: "Not a speech act", color: "--bad", desc: "Extraction error: no identifiable speaker, the journalist's own words, or garbled text. Add a note. No further questions are asked." },
  { id: "irrelevant", key: "r", label: "Not relevant to dataset", color: "--irr", desc: "A real speech act, but off-topic for this project. No further questions are asked; the next speech act opens. If the whole article is off-topic, use “Whole article not relevant” above the speech acts instead." },
];

// DETAILS: answered for every speech act (unless it is flagged). The first question of each is the
// one number keys answer in a one-detail task, so it must be a choice question.
window.ATTRS = [
  { id: "relevance", label: "Relevance", color: "--topic",
    desc: "Aid-relevant: about foreign aid or development/humanitarian assistance from any donor, at any time. US withdrawal: about the 2025 US aid withdrawal (USAID freeze/closure, PEPFAR disruption, stop-work orders, US exit from WHO/UN funding).",
    q: [
      { id: "aid", label: "Is it aid-relevant?", opts: [["1", "Yes"], ["0", "No"]] },
      { id: "us_withdrawal", label: "Is it relevant to the US aid withdrawal?", opts: [["1", "Yes"], ["0", "No"]] },
    ] },
  { id: "response", label: "Responding to", color: "--topic",
    desc: "The action or event the speech act responds to. The speech date (not the publication date) helps tell which: use the text (“on Tuesday”, “last week”, “on 14 March”).",
    q: [
      { id: "topic", label: "What is it responding to? (all that apply)", many: true, only: "none", opts: [
        ["usaid_cuts", "US aid freeze / USAID closure"], ["pepfar", "PEPFAR"], ["us_who_un_exit", "US exit from WHO / UN funding"],
        ["tariffs", "US tariffs"], ["agoa", "AGOA"], ["us_visa_travel_ban", "US visas / travel ban"], ["us_deportations", "US deportations"],
        ["us_other", "Other US action"], ["other_donor_cuts", "Other donors' cuts"], ["donor_programme", "Ordinary aid programme / launch"],
        ["debt_finance", "IMF / World Bank / debt"], ["conflict", "Conflict / crisis"], ["migration", "Migration"],
        ["domestic_policy", "Domestic policy / politics"], ["other", "Other (type below)"], ["none", "Nothing specific"]] },
      { id: "topic_other", label: "If other: what?", text: true, placeholder: "name the event", showIf: ["topic", "other"] },
      { id: "date_source", label: "When was it said?", opts: [["pub", "Same as publication date / not stated"], ["stated", "Date given in the text"], ["relative", "Worked out (“yesterday”, “on Monday”)"]] },
      { id: "speech_date", label: "Speech date", text: true, placeholder: "YYYY-MM-DD", showIf: ["date_source", ["stated", "relative"]] },
    ] },
  { id: "speaker", label: "Speaker", color: "--spk",
    desc: "Who is speaking. Leader = president / prime minister, or wording like “the Government of Kenya insisted”. High-level = ministers, diplomats, cabinet directors. Low-level = MPs, senators, party representatives, local politicians, attachés. Technocrats = government or diplomatic staff, technical agencies (no political agenda). Reports = a report, study, poll, newspaper or memo cited as the source.",
    q: [
      { id: "type", label: "What kind of speaker?", opts: [
        ["leader", "State: leader"], ["high_gov", "State: high-level government"], ["low_gov", "State: low-level government"], ["technocrat", "State: technocrat"],
        ["io", "IO representative"], ["ngo", "NGO representative"], ["academia", "Academia / expert"], ["private", "Private sector"],
        ["report", "Report / study / media"], ["other", "Other (citizen, religious or traditional leader…)"]] },
      { id: "authority", label: "Can the speaker commit a government?", opts: [["1", "Yes"], ["0", "No"]] },
    ] },
  { id: "venue", label: "Venue / formality", color: "--venue",
    desc: "Where or how the statement was made, and how formal it is. High: official statements, formal addresses (parliament, summits, budget speech), court. Medium: press conferences, events, reports. Low: interviews, social media, informal remarks.",
    q: [
      { id: "venue", label: "Where or how was it said?", opts: [
        ["official_statement", "Official statement / press release"], ["formal_address", "Formal address (parliament, summit, UN)"],
        ["press_conference", "Press conference"], ["interview", "Interview"], ["event_remarks", "Event / launch / ceremony"],
        ["social_media", "Social media"], ["publication", "Report / publication"], ["court", "Court"], ["unclear", "Unclear / not stated"]] },
      { id: "formality", label: "Formality", opts: [["high", "High"], ["medium", "Medium"], ["low", "Low"]] },
    ] },
];

// Every choice question (not plain yes/no) gets an "Other" answer and, right after it, a typed box
// asked only when Other is picked. Questions that already have one keep theirs.
[...CATS, ...ATTRS].forEach(cat => {
  const out = [];
  cat.q.forEach(q => {
    out.push(q);
    if (q.text || !q.opts) return;
    const ids = q.opts.map(o => o[0]);
    if (ids.every(id => ["yes", "no", "1", "0"].includes(id))) return;
    if (!ids.includes("other")) {
      const tail = ids.length && ["none", "unclear"].includes(ids[ids.length - 1]) ? 1 : 0;   // keep "none"/"unclear" last
      q.opts = [...q.opts.slice(0, q.opts.length - tail), ["other", "Other (type below)"], ...q.opts.slice(q.opts.length - tail)];
    }
    const hasBox = cat.q.some(x => x.text && x.showIf && x.showIf[0] === q.id);
    if (!hasBox) out.push({ id: q.id + "_other", label: "If other: what?", text: true, placeholder: "type it", showIf: [q.id, "other"] });
  });
  cat.q = out;
});
