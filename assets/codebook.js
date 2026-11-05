// Single source of truth for the codebook. The Codebook page and the coding
// tool both render from this file: edit here and both update.
// Bump VERSION whenever a code changes; it is written into every export row.
window.CODEBOOK = {
  VERSION: "ra-v1 (2026-11)",

  speakerTypes: [
    ["recipient_gov", "Recipient government", "Government, officials, state agencies or ruling party of the African country being discussed."],
    ["donor_gov", "Donor government", "US or other foreign governments, embassies, bilateral agencies (USAID, FCDO, GIZ, JICA, AFD, China, Gulf states acting as donors)."],
    ["multilateral", "Multilateral", "UN agencies, World Bank, IMF, AfDB, Global Fund, Gavi, AU, EU institutions."],
    ["ngo_civil_society", "NGO / civil society", "NGOs, CSOs, unions, religious bodies, advocacy groups (local or international)."],
    ["expert_academic", "Expert / academic", "Analysts, economists, researchers, think tanks, doctors speaking as experts."],
    ["affected_public", "Affected public", "Ordinary citizens, patients, beneficiaries, community members."],
    ["private_sector", "Private sector", "Firms, business associations, bankers, investors."],
    ["opposition_politician", "Opposition politician", "Opposition parties and their officials, dissenting legislators."],
    ["other", "Other", "Anyone else (e.g. traditional leaders, foreign non-donor officials)."],
  ],

  topicDomains: [
    ["health", "Health"], ["humanitarian", "Humanitarian"], ["economy_finance", "Economy / finance"],
    ["trade", "Trade"], ["governance_politics", "Governance / politics"], ["security_conflict", "Security / conflict"],
    ["education", "Education"], ["agriculture_food", "Agriculture / food"], ["climate_environment", "Climate / environment"],
    ["diplomacy", "Diplomacy"], ["social_gender", "Social / gender"], ["other", "Other"],
  ],

  // Each speech act gets ONE primary theme (required) and an optional secondary
  // theme. `sub` is the required sub-code for that theme.
  themes: [
    {
      code: "pro_aid", label: "Pro-aid",
      def: "Speaker values foreign aid, opposes cuts, appeals for funding, or praises a donor programme.",
      ex: "\"The withdrawal of USAID support will cost lives; we urge Washington to reconsider.\"",
      sub: [
        ["values_aid", "Values aid / its results"],
        ["opposes_cuts", "Opposes cuts or freeze"],
        ["appeal_funding", "Appeals for (more) funding"],
        ["praises_programme", "Praises a donor programme"],
      ],
    },
    {
      code: "anti_aid", label: "Anti-aid / aid critique",
      def: "Speaker criticises foreign aid itself, or justifies cutting it. Pick the type of critique.",
      ex: "\"Aid has kept us on our knees for sixty years.\"",
      sub: [
        ["donor_retrenchment", "Donor justifies cutting its own aid (budget, 'America First', 'not a charity')"],
        ["dependency_critique", "Aid breeds dependence, blocks self-reliance"],
        ["sovereignty_imperialism", "Aid as interference / neo-colonialism / sovereignty-violating conditions"],
        ["waste_corruption", "Aid is wasted, stolen, diverted, inefficient"],
        ["ideological", "Opposed on culture-war / moral grounds"],
        ["other", "Other critique"],
      ],
    },
    {
      code: "recipient_autonomy", label: "Recipient autonomy",
      def: "Self-reliance, sovereignty, national ownership, reducing dependence, domestic resource mobilisation, the right to set one's own priorities. Applies in ANY domain (aid, trade, debt, security, food).",
      ex: "\"We must fund our own health system.\"",
      sub: [
        ["assert", "Asserts / calls for autonomy"],
        ["undermined", "Says an external actor erodes or constrains autonomy"],
      ],
    },
    {
      code: "legitimization", label: "Legitimization",
      def: "Aid used to legitimise the recipient government.",
      ex: "\"This grant reflects our confidence in the President's reform agenda.\" (donor endorsement)",
      sub: [
        ["donor_endorsement", "Donor/multilateral praises or endorses the recipient government, or frames aid as a reward or vote of confidence"],
        ["ownership_claiming", "Recipient government claims donor-funded results as its own, or frames a donor project as part of its national plan"],
        ["both", "Both"],
      ],
    },
    {
      code: "blame", label: "Blame attribution",
      def: "Speaker assigns responsibility for a problem. Code the target.",
      ex: "\"The crisis in our clinics is a direct result of Washington's freeze.\" (donor_policy)",
      sub: [
        ["recipient_gov", "Recipient government"],
        ["donor_policy", "Donor's foreign / aid decisions (freeze, conditionality)"],
        ["donor_domestic_politics", "Donor's internal politics (DOGE, Congress, courts, partisan fights)"],
        ["intermediaries", "NGOs, contractors, implementing partners, foreign firms"],
        ["conflict_actor", "Armed groups, warring governments"],
        ["global_system", "Creditors, rating agencies, IFIs, international order"],
        ["multiple", "More than one of the above"],
        ["other", "Other"],
      ],
    },
    {
      code: "capacity", label: "Capacity",
      def: "Emphasis on the recipient's institutional, health-system, fiscal, technical or human capacity.",
      ex: "\"Our system is ready to absorb these programmes.\" (strength)",
      sub: [
        ["strength", "Has / is building capacity, can cope or take over"],
        ["deficit", "Lacks capacity, cannot cope, systems will collapse"],
      ],
    },
    {
      code: "alternative_financing", label: "Alternative financing",
      def: "Proposes or reports replacing or supplementing aid with domestic or private money.",
      ex: "\"Government has allocated N300bn to fill the gap left by donors.\"",
      sub: [
        ["domestic_revenue", "Domestic revenue / new taxes or levies"],
        ["budget_reallocation", "Budget reallocation"],
        ["private_sector", "Private sector / local manufacturing"],
        ["diaspora", "Diaspora / remittances"],
        ["other", "Other"],
      ],
    },
    {
      code: "alternative_donors", label: "Alternative donors / partners",
      def: "Other external partners stepping in for, or competing with, Western donors.",
      ex: "\"China has offered to support the hospital project.\"",
      sub: [
        ["china", "China"], ["russia", "Russia"], ["gulf", "Gulf states / Turkey"], ["india", "India"],
        ["other_western", "EU / other Western donor filling a US gap"], ["south_south", "South–South / African partners"], ["other", "Other"],
      ],
    },
    {
      code: "culture_war_conditionality", label: "Culture-war conditionality",
      def: "Aid or policy tied to culture-war or ideological conditions: abortion / family planning restrictions, abstinence, DEI or gender bans, 'woke' programmes, Afrikaner refugee claims.",
      ex: "\"Funding will not go to organisations that promote abortion.\"",
      sub: [["supports", "Speaker supports the condition"], ["opposes", "Speaker opposes the condition"], ["describes", "Describes it neutrally"]],
    },
    {
      code: "contested_reassurance", label: "Reassurance / contested reassurance",
      def: "An official reassures or denies a problem, or another speaker disputes such a reassurance. Plain self-praise or a plain denial of wrongdoing is NOT this code.",
      ex: "\"There is no shortage of ARVs; all facilities are fully stocked.\"",
      sub: [["reassurance", "Official reassures / denies a problem"], ["dispute", "Speaker contradicts a reassurance"]],
    },
    {
      code: "aid_dignity", label: "Aid and dignity",
      def: "Aid framed in terms of the recipient's dignity. Plain diplomatic thanks counts as gratitude only if thanks is the main point of the act.",
      ex: "\"We cannot keep going around with a begging bowl.\" (humiliation)",
      sub: [
        ["gratitude", "Thanks a donor"],
        ["humiliation", "Aid as begging, shame, insult, charity"],
        ["entitlement_rights", "Aid/services as a right, obligation, reparations, fair share"],
      ],
    },
    {
      code: "descriptive_technical", label: "Descriptive / technical (aid)",
      def: "Aid-related, but the speaker only describes it (project launch, figures, procedures) without any of the stances above.",
      ex: "\"The $20m project will cover 12 districts over four years.\"",
      sub: [["announcement", "Project or funding announcement"], ["technical", "Technical / M&E / budget detail"], ["other", "Other description"]],
    },
    {
      code: "not_aid", label: "Not aid-related",
      def: "The speech act does not concern foreign aid, donors, development finance or humanitarian assistance. Just pick the topic domain. Watch for false friends: legal aid, first aid, 'MCC' = milk collection centre.",
      ex: "\"Police will arrest anyone caught extorting motorists.\" (security_conflict)",
      sub: null, // uses topicDomains
    },
  ],

  rules: [
    "A speech act is one statement attributed to an identifiable speaker (a person or a named organisation) in the article. Direct quotes and reported (indirect) speech both count.",
    "Code what the speaker says, not the journalist's framing. Use the title and country only as context.",
    "If the same speaker makes several distinct points, split them into separate speech acts when they would get different themes. Consecutive sentences making the same point = one act.",
    "Pick ONE primary theme: the one that best captures the point of the statement. Use the secondary theme only if a second theme is clearly present.",
    "Aid means ANY foreign aid, development finance or humanitarian assistance, not only the 2025 US cuts.",
    "When unsure between a stance theme and 'Descriptive / technical', choose descriptive. Use the confidence field and the notes to flag hard calls.",
    "If an article has no speech acts, tick 'No speech acts' and move on. If the text is broken, truncated, duplicated or not a news article, flag it.",
  ],
};
