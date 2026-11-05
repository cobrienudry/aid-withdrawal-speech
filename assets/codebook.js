// CODEBOOK. Edit here; the app and its coding guide both read this file.
// Bump CB_VERSION whenever a category or question changes: it is saved with every code.
window.CB_VERSION = "v1.1-2026-11-05";

// Actor lists reused by several questions.
const ACTORS = [
  ["us", "United States"], ["china", "China"], ["russia", "Russia"], ["eu", "EU / European donors"],
  ["gulf", "Gulf states / Turkey"], ["un", "UN / multilateral agency"], ["ifi", "World Bank / IMF"],
  ["recipient_gov", "Recipient government"], ["ngo", "NGO / civil society"], ["other", "Other"],
];

// THEMES: present or not in a speech act. Several can apply at once.
// key = keyboard shortcut in "All categories"; q = follow-up questions asked when the theme is present.
window.CATS = [
  { id: "pain", key: "1", label: "Pain", color: "--pain",
    desc: "The speaker describes harm, hardship, suffering, loss or risk to people, services or the economy.",
    q: [
      { id: "aid_specific", label: "Is the pain specific to aid withdrawal?", opts: [["yes", "Yes"], ["no", "No"], ["unclear", "Unclear"]] },
      { id: "blame", label: "Is blame assigned?", showIf: ["aid_specific", "yes"], opts: [["yes", "Yes"], ["no", "No"]] },
    ] },
  { id: "autonomy", key: "2", label: "Autonomy", color: "--auto",
    desc: "The speaker stresses self-reliance, sovereignty, national ownership, reducing dependence, or the right to set the country's own priorities.",
    q: [
      { id: "basis", label: "What is the autonomy claim based on?", opts: [["capacity", "Capacity / technocratic"], ["ideological", "Ideological"], ["both", "Both"]] },
    ] },
  { id: "technocratic", key: "3", label: "Technocratic", color: "--tech",
    desc: "The speech is in a technical register: programme or finance jargon, budget lines, indicators, procedures, monitoring and evaluation.",
    q: [
      { id: "numbers", label: "Does it use numbers or statistics?", opts: [["yes", "Yes"], ["no", "No"]] },
    ] },
  { id: "security", key: "4", label: "Security", color: "--sec",
    desc: "The speaker talks about security: conflict, terrorism, insurgency, defence, policing or military cooperation.",
    q: [] },
  { id: "accommodation", key: "5", label: "Accommodation", color: "--acc",
    desc: "The speaker accommodates a foreign actor: reaffirms the partnership, offers something, cooperates on security, or defers and flatters.",
    q: [
      { id: "actor", label: "Who is being accommodated? (all that apply)", many: true, opts: ACTORS },
      { id: "type", label: "Which kind? (all that apply)", many: true,
        opts: [["partnership", "Reaffirming partnership"], ["offers", "Offers to do things"], ["security", "Security cooperation"], ["kowtowing", "Kowtowing"]] },
    ] },
  { id: "praise", key: "6", label: "Praise", color: "--praise",
    desc: "The speaker praises an actor in a way that bears on aid: thanks or credits a donor, a programme, or a government for aid-related work.",
    q: [
      { id: "target", label: "Who is praised? (all that apply)", many: true, opts: ACTORS },
      { id: "aid_related", label: "Is the praise about aid itself?", opts: [["yes", "Yes"], ["no", "No"]] },
      { id: "kind", label: "What kind of praise? (all that apply)", many: true,
        opts: [["results", "Aid results / programme"], ["generosity", "Generosity / gratitude"], ["partnership", "Partnership / friendship"], ["leadership", "Leadership / governance"], ["other", "Other"]] },
    ] },
];

// Exclusive answers: picking one clears the themes above, and vice versa.
window.EXCL = [
  { id: "none", key: "0", label: "None of these", color: "--none", desc: "A real speech act with none of the themes above." },
  { id: "bad", key: "x", label: "Not a speech act", color: "--bad", desc: "Extraction error: no identifiable speaker, the journalist's own words, or garbled text. Add a note. No further questions are asked." },
  { id: "irrelevant", key: "r", label: "Not relevant to dataset", color: "--irr", desc: "A real speech act, but off-topic for this project. No further questions are asked; the next speech act opens. If the whole article is off-topic, use “Whole article not relevant” above the speech acts instead." },
];

// DETAILS: answered for every speech act (unless it is "Not a speech act").
window.ATTRS = [
  { id: "topic", label: "Topic", color: "--topic",
    desc: "Specific topics the speech act mentions.",
    q: [{ id: "topic", label: "Which of these topics does it mention? (all that apply)", many: true, only: "neither",
      opts: [["pepfar", "PEPFAR"], ["tariffs", "Tariffs"], ["neither", "Neither"]] }] },
  { id: "speaker", label: "Speaker authority / type", color: "--spk",
    desc: "Who is speaking, by their position. Use the speaker's title and the article.",
    q: [{ id: "type", label: "What kind of speaker is this?", opts: [
      ["head_of_state", "Head of state / government"], ["minister", "Minister / government official"], ["legislator", "Legislator"],
      ["opposition", "Opposition politician"], ["local_leader", "Local / traditional leader"], ["donor_official", "Donor government official"],
      ["multilateral", "UN / multilateral official"], ["ngo", "NGO / civil society"], ["expert", "Expert / academic"],
      ["business", "Business"], ["media", "Journalist / media"], ["citizen", "Ordinary citizen / beneficiary"],
      ["organisation", "Organisation (no named person)"], ["other", "Other"]] }] },
  { id: "venue", label: "Venue / formality", color: "--venue",
    desc: "Where or how the statement was made, as far as the article says.",
    q: [{ id: "venue", label: "Where or how was it said?", opts: [
      ["rally", "Campaign rally"], ["press_conf", "Press conference"], ["speech", "Official speech / address"], ["interview", "Interview"],
      ["parliament", "Parliament / legislature"], ["statement", "Written statement / press release"], ["social", "Social media"],
      ["event", "Meeting / event / ceremony"], ["report", "Report / document"], ["unclear", "Unclear / not stated"]] }] },
];
