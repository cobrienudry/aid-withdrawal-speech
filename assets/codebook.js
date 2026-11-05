// CODEBOOK. Edit here; the app and its coding guide both read this file.
// Bump CB_VERSION whenever a category or question changes: it is saved with every code.
window.CB_VERSION = "draft-2026-11-05c";
window.CATS = [
  { id: "pain", key: "1", label: "Pain", color: "--pain",
    desc: "The speaker describes harm, hardship, suffering, loss or risk to people, services or the economy.",
    q: [
      { id: "aid_specific", label: "Is the pain specific to aid withdrawal?", opts: [["yes", "Yes"], ["no", "No"], ["unclear", "Unclear"]] },
      { id: "blame", label: "Is blame assigned?", showIf: ["aid_specific", "yes"], opts: [["yes", "Yes"], ["no", "No"]] },
    ] },
  { id: "autonomy", key: "2", label: "Autonomy", color: "--auto",
    desc: "The speaker stresses self-reliance, sovereignty, national ownership, reducing dependence, or the right to set the country's own priorities.",
    q: [] },
  { id: "accommodation", key: "3", label: "Accommodation", color: "--acc",
    desc: "The speaker accommodates the donor: reassures, defers to, or offers something to keep the relationship.",
    q: [
      { id: "type", label: "Which kind? (all that apply)", many: true,
        opts: [["partnership", "Reaffirming partnership"], ["offers", "Offers to do things"], ["security", "Security cooperation"], ["kowtowing", "Kowtowing"]] },
    ] },
];
// Exclusive answers: picking one clears the categories above, and vice versa.
window.EXCL = [
  { id: "none", key: "0", label: "None of these", color: "--none", desc: "A real speech act that fits none of the categories." },
  { id: "bad", key: "x", label: "Not a speech act", color: "--bad", desc: "Extraction error: no identifiable speaker, the journalist's own words, or garbled text. Add a note." },
];
