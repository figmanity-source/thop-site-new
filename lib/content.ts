// On-page copy aligned to BIOVITY Website Master Document v3.4 (3 November 2026).
// Mapped onto the existing section structure. UK English. Approved wording only.

export const brand = {
  name: "BIOVITY",
  tagline: "BIOLOGICAL LONGEVITY CENTRE",
  protocol: "THOP",
  protocolLong: "THE HUMAN OPTIMISATION PROTOCOL",
  whatsapp:
    "https://wa.me/?text=Hello%20BIOVITY%2C%20I%E2%80%99d%20like%20to%20know%20more%20about%20THOP.",
};

export const stepLinks = [
  { label: "DISCOVER", href: "/#discover" },
  { label: "BIOBLUEPRINT", href: "/#bioblueprint" },
  { label: "DOX", href: "/#dox" },
  { label: "CELLUTION", href: "/#cellution" },
  { label: "CONTINUUM", href: "/#continuum" },
] as const;

export const footerThop = [
  { label: "Discover", href: "/#discover" },
  { label: "BIOBLUEPRINT", href: "/#bioblueprint" },
  { label: "DOX", href: "/#dox" },
  { label: "CELLUTION", href: "/#cellution" },
  { label: "CONTINUUM", href: "/#continuum" },
] as const;

export const exploreLinks = [
  { label: "Science", href: "/science" },
  { label: "Your Journey", href: "/your-journey" },
  { label: "The BIOVITY Centre", href: "/centre" },
  { label: "Ethics Committee", href: "/ethics-committee" },
] as const;

export const aboutLinks = [
  { label: "About us", href: "/about" },
  { label: "Founder", href: "/founder" },
  { label: "Meet the team", href: "/team" },
  { label: "Ethics Committee", href: "/ethics-committee" },
] as const;

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Medical Disclaimer", href: "/medical-disclaimer" },
  { label: "Cookie Policy", href: "/cookies" },
] as const;

export const journeyNav = [
  { label: "The seven steps", href: "/your-journey#steps" },
  { label: "The BIOVITY Centre, Mumbai", href: "/centre" },
  { label: "Self-Check", href: "/your-journey#self-check" },
] as const;

/** Hero carousel of the demo site (6 slides) — used by the Intro + the "Colors" swap section. */
export const heroSlides = [
  {
    key: "thop",
    tag: "BIOVITY · BIOLOGICAL LONGEVITY CENTRE · MUMBAI",
    left: "Your biology is your greatest asset.",
    right: ["Understand it.", "Invest in it."],
    body: "THOP is our five-step journey to help you live longer, and live well. First, we understand your body. Then we build a plan around it. And we stay with you as you change.",
    center: "THOP",
    sub: "THE HUMAN OPTIMISATION PROTOCOL",
    model: "dna",
    colors: ["#9c9aa0", "#2b2a2e"],
  },
  {
    key: "discover",
    tag: "STEP 01 · DISCOVER",
    left: "We get to know you.",
    right: ["Your journey starts", "with a conversation."],
    body: "Your journey starts with a conversation. You meet our clinical team in a private room. We listen to your story, your health history and your goals. We look at any reports you already have. Then, together, we agree your next step.",
    center: "DISCOVER",
    sub: "01 / 05",
    model: "twin",
    colors: ["#b9b6bd", "#55535a"],
  },
  {
    key: "bioblueprint",
    tag: "STEP 02 · BIOBLUEPRINT",
    left: "We map your biology.",
    right: ["Three simple tests.", "Before we change anything, we measure."],
    body: "Before we change anything, we measure. Three simple tests show us how your body is really doing today.",
    center: "BIOBLUEPRINT",
    sub: "02 / 05",
    model: "cell",
    colors: ["#7d8a8c", "#1d2324"],
  },
  {
    key: "dox",
    tag: "STEP 03 · DOX",
    left: "We prepare your body.",
    right: ["We prepare your body", "with food and liver support."],
    body: "Think of your stem cells as seeds. Seeds grow best in healthy soil. DOX gets that soil ready. It has two parts, and both are built from your BIOBLUEPRINT results.",
    center: "DOX",
    sub: "03 / 05",
    model: "dna",
    colors: ["#a59f94", "#2e2b26"],
  },
  {
    key: "cellution",
    tag: "STEP 04 · CELLUTION",
    left: "Your own cells, working for you.",
    right: ["It uses only your own body,", "in two parts, in one visit."],
    body: "CELLUTION is our regenerative medicine programme. It uses only your own body, in two parts, in one visit.",
    center: "CELLUTION",
    sub: "04 / 05",
    model: "cell",
    colors: ["#a3949a", "#2c2226"],
  },
  {
    key: "continuum",
    tag: "STEP 05 · CONTINUUM",
    left: "We stay with you.",
    right: ["Your body", "keeps changing."],
    body: "Your body keeps changing. So your care shouldn’t stop after one visit. CONTINUUM is a year of follow-up, as a private membership.",
    center: "CONTINUUM",
    sub: "05 / 05",
    model: "twin",
    colors: ["#8e959e", "#20242a"],
  },
] as const;

export const heroCta = "BEGIN YOUR JOURNEY";
export const seeSteps = "SEE THE FIVE STEPS";
export const scrollHint = "SCROLL TO EXPLORE";

export const healthspan = {
  title: ["Lifespan is how long you live.", "Healthspan is how long you live well."],
  body: "Many people live long lives. But too many spend their later years managing illness instead of enjoying life. The gap between the two is what longevity medicine is about. Find out what’s happening inside your body early. Act before small changes become big problems.",
  labels: ["lifespan", "healthspan"],
  big: { title: ["HEALTH", "SPAN"], lines: [] },
};

export const why = {
  title: "Your body works as one. Your care should too.",
  body: "Most healthcare today is split up. One doctor for your heart. Another for your hormones. A pile of reports that never quite connect. At BIOVITY, we look at the whole picture. We bring your tests, your history and your goals together. Then we build one clear plan, with qualified doctors.",
  note: "Not another treatment menu. One connected journey.",
};

export const protocol = {
  title: "THOP: The Human Optimisation Protocol.",
  body: "THOP is how we work with every person. There are five steps. Each one builds on the one before. You always know where you are, and what comes next.",
  steps: [
    ["01", "DISCOVER", "We get to know you."],
    ["02", "BIOBLUEPRINT", "We map your biology with three simple tests."],
    ["03", "DOX", "We prepare your body with food and liver support."],
    ["04", "CELLUTION", "Your own stem cells, working for you, when it’s right for you."],
    ["05", "CONTINUUM", "We stay with you, all year."],
  ],
};

/** "THE THOP JOURNEY / 01—05" scroll section. */
export const journey = {
  steps: [
    {
      id: "discover",
      title: "DISCOVER",
      line: "We get to know you.",
      text: "Your journey starts with a conversation. You meet our clinical team in a private room. We listen to your story, your health history and your goals. We look at any reports you already have. Then, together, we agree your next step.",
      leavesLabel: "You leave with",
      leaves: [
        "A clear picture of where you are today",
        "A recommendation for your BIOBLUEPRINT tests",
        "Answers to your questions",
      ],
      cta: "BOOK YOUR DISCOVER CONSULTATION",
    },
    { id: "bioblueprint", title: "BIOBLUEPRINT", line: "We map your biology with three simple tests.", text: "Before we change anything, we measure. Three simple tests show us how your body is really doing today." },
    { id: "dox", title: "DOX", line: "We prepare your body with food and liver support.", text: "Think of your stem cells as seeds. Seeds grow best in healthy soil. DOX gets that soil ready. It has two parts, and both are built from your BIOBLUEPRINT results. DOX is not a replacement for medical detox, treatment of poisoning, or treatment for a medical condition." },
    { id: "cellution", title: "CELLUTION", line: "Your own stem cells, working for you, when it’s right for you.", text: "CELLUTION is our regenerative medicine programme. It uses only your own body, in two parts, in one visit. Every patient is assessed, gives informed consent and is followed up. We never promise a cure. And CELLUTION isn’t right for everyone." },
    { id: "continuum", title: "CONTINUUM", line: "We stay with you.", text: "Your body keeps changing. So your care shouldn’t stop after one visit. CONTINUUM is a year of follow-up, as a private membership. What’s included depends on your membership level." },
  ],
};

export const blueprint = {
  eyebrow: "STEP 02 · BIOBLUEPRINT",
  title: ["We map", "your biology."],
  intro: "Before we change anything, we measure. Three simple tests show us how your body is really doing today.",
  smallPrint: "The fingertip scan uses patent-pending Spectral Rai Technology, taking more than 700,000 light measurements in one reading.",
  tests: [
    { label: "TEST 1 · CELL SCORE", caption: "15 seconds", text: "A fingertip scan. Rest your fingertip on a scanner for about 15 seconds. It reads your carotenoids: the antioxidants that help protect your cells. No blood. No needles." },
    { label: "TEST 2 · BLOOD PICTURE", caption: "one blood draw", text: "One blood draw. We check a wide panel of longevity and stem cell markers. It shows how your metabolism, organs and cells are working right now." },
    { label: "TEST 3 · GENETIC BLUEPRINT", caption: "one cheek swab", text: "A quick cheek swab. NutriDNA by Strand Life Sciences reads how your genes affect food, weight, exercise, inflammation and sleep. The full report runs to around 200 pages. We turn it into a few clear actions." },
  ],
};

export const twin = {
  big: { title: ["BIOLOGICAL", "TWIN"], lines: ["meet", "your", "biological", "twin"] },
  title: "Meet your Biological Twin.",
  dashboard: "Each result goes straight into your private BIOVITY dashboard. When all three are ready, you and our team get a message at the same time. Nothing waits. Nothing gets missed.",
  twin: "We turn all your results into one picture of your body. Green flags show what’s working well. Red flags show where to focus. Tap any flag to see what it means, in plain words.",
  reveal: "You never read your results alone. In a private meeting, your clinician walks you through your Twin, flag by flag. Then we turn it into your plan.",
  sample: "Sample",
  cta: "BUILD YOUR BIOBLUEPRINT",
};

export const dox = {
  eyebrow: "STEP 03 · DOX · NUTRITION DETOX & ANF LIVER CLEANSE",
  title: "We prepare your body.",
  body: "Think of your stem cells as seeds. Seeds grow best in healthy soil. DOX gets that soil ready. It has two parts, and both are built from your BIOBLUEPRINT results.",
  atEnd: "We re-check key markers. You see how your body has responded. And you’re ready for the next step.",
  who: "Anyone preparing for CELLUTION. And anyone who wants structured help with food, lifestyle and recovery, alongside their usual medical care.",
  parts: [
    { label: "PART 1 · NUTRITION DETOX", text: "A food plan made for you. It takes out what works against your body. It adds what your body needs. Our team checks in and adjusts it as you go." },
    { label: "PART 2 · ANF LIVER CLEANSE", text: "A course of ANF sessions at the Centre, given by our clinical team. They run alongside your food plan to support your liver and your recovery." },
  ],
  disclaimer: "DOX is not a replacement for medical detox, treatment of poisoning, or treatment for a medical condition.",
  cta: "ENQUIRE ABOUT DOX",
};

export const cellution = {
  eyebrow: "STEP 04 · CELLUTION · REGENERATIVE MEDICINE",
  title: "Your own cells, working for you.",
  body: "CELLUTION is our regenerative medicine programme. It uses only your own body, in two parts, in one visit.",
  parts: [
    { label: "PART 1 · GROWTH FACTORS", text: "We take a small blood sample and separate your platelets using the SW PRP system. Platelets carry growth factors: your body’s natural repair signals." },
    { label: "PART 2 · BMAC", text: "We collect a small amount of your bone marrow and concentrate your stem cells, your body’s repair cells. BMAC stands for Bone Marrow Aspirate Concentrate." },
  ],
  rules: [
    { label: "NOTHING ADDED", text: "Only your own blood and your own cells. No donor cells." },
    { label: "NOTHING GROWN", text: "Everything is concentrated in a centrifuge. Nothing is grown or multiplied in a lab." },
    { label: "NOTHING ALTERED", text: "Your cells are not changed in any way. And they never leave the Centre." },
  ],
  who: "People with joint wear (such as knee osteoarthritis), diabetes, or fertility concerns, once a specialist confirms it’s suitable.",
};

export const howCellution = {
  eyebrow: "HOW CELLUTION WORKS",
  title: "One visit. Five clear steps.",
  steps: [
    { n: "01", name: "ASSESSMENT", text: "A specialist reviews your results and decides with you if CELLUTION is right for you." },
    { n: "02", name: "COLLECTION", text: "A small blood sample and a small amount of bone marrow are collected, under local anaesthetic." },
    { n: "03", name: "PREPARATION", text: "Our in-house lab separates your platelets and concentrates your bone marrow cells in a centrifuge. That’s all. Every sample is labelled at your bedside." },
    { n: "04", name: "RETURN", text: "Your growth factors and cells are given back to you in the same visit, usually within an hour. We record exactly how much was collected and how much was returned." },
    { n: "05", name: "FOLLOW-UP", text: "We track how you’re doing through CONTINUUM." },
  ],
  areas: [
    "Joints: for wear and tear, such as knee osteoarthritis, after an orthopaedic assessment",
    "Diabetes: alongside your usual diabetes care, never instead of it",
    "Fertility: for women and men, alongside specialist fertility care",
  ],
  disclaimer: "Every patient is assessed, gives informed consent and is followed up. We never promise a cure. And CELLUTION isn’t right for everyone.",
  cta: "REQUEST A CELLUTION ASSESSMENT",
};

export const continuum = {
  eyebrow: "STEP 05 · THOP CONTINUUM",
  title: "We stay with you.",
  big: { title: ["THOP", "CONTINUUM"], lines: ["we", "stay", "with", "you"] },
  body: "Your body keeps changing. So your care shouldn’t stop after one visit. CONTINUUM is a year of follow-up, as a private membership.",
  welcome: "Every member receives the THOP box.",
  items: ["Regular re-tests", "Updates to your Biological Twin", "Food and lifestyle check-ins", "Performance and recovery reviews", "Specialist visits when needed", "A direct line to your coordinator"],
  note: "What’s included depends on your membership level.",
  cta: "ENQUIRE ABOUT CONTINUUM",
  images: ["/images/thop_1.webp", "/images/thop_2.webp", "/images/thop_3.webp", "/images/thop_4.webp"],
};

export const centre = {
  eyebrow: "THE BIOVITY CENTRE · MUMBAI",
  label: "THE BIOVITY CENTRE",
  title: "A calm space in Mumbai, designed for clarity.",
  body: "Quiet. Private. Discreet. Your consultation, tests, results and treatment, all under one roof.",
  cta: "VISIT THE CENTRE",
  image: "/images/thop_5.webp",
  // Rows reuse the original "parts list" layout: name / index / type / detail
  href: "/your-journey#centre",
  rows: [
    { name: "DISCOVER", index: "01", type: "STEP 01", detail: "We get to know you." },
    { name: "BIOBLUEPRINT", index: "02", type: "STEP 02", detail: "We map your biology with three simple tests." },
    { name: "DOX", index: "03", type: "STEP 03", detail: "We prepare your body with food and liver support." },
    { name: "CELLUTION", index: "04", type: "STEP 04", detail: "Your own stem cells, working for you, when it’s right for you." },
    { name: "CONTINUUM", index: "05", type: "STEP 05", detail: "We stay with you, all year." },
  ],
};

export const contact = {
  eyebrow: "BIOVITY · BIOLOGICAL LONGEVITY CENTRE · Mumbai",
  title: "Your next chapter begins with understanding.",
  body: "You don’t need to have it all figured out. You just need a first conversation. We’ll take it from there.",
  primary: "BEGIN YOUR JOURNEY",
  secondary: "WHATSAPP BIOVITY",
  brandLine: "BIOVITY · BIOLOGICAL LONGEVITY CENTRE · Mumbai, India",
  disclaimer: "This website is for general information. It does not replace advice from a registered doctor. All medical decisions at BIOVITY are made by registered medical practitioners.",
  contactLines: [
    "Address [to be supplied]",
    "Phone [to be supplied]",
    "Email [to be supplied]",
    "Hours [to be supplied]",
  ],
};

export const interests = ["THOP", "BIOBLUEPRINT", "DOX", "CELLUTION", "CONTINUUM", "Not sure yet"] as const;
export type Interest = (typeof interests)[number];

export const enquiry = {
  headline: "Let’s start with a conversation.",
  body: "Tell us a little about you. Our patient coordinator will get back to you, usually within one working day.",
  consent: "I agree to be contacted and to BIOVITY’s privacy policy",
  success: "Thank you. Our patient coordinator will be in touch soon.",
  notSent: "Nothing has been sent.",
};

export const biology = {
  headline: "Watch your biology change.",
  body: "One test is a snapshot. Repeat tests tell the story. Your dashboard shows your Twin at the start, and at every check-up after. We report what we measure. We never promise outcomes.",
  start: "At the start",
  later: "At a later check-up",
  sample: "Sample data",
  zones: ["brain and sleep", "heart", "metabolism and liver", "gut", "muscles and joints", "hormones", "immunity", "cells and ageing"],
};

export const founder = {
  headline: "A scientist’s view. A human purpose.",
  name: "Dr Praj Shendge",
  title: "Founder & Scientific Director, BIOVITY · Founder, THOP",
  body: "Dr Praj Shendge has spent more than ten years in biotechnology, embryology, stem cells and regenerative medicine in the United Kingdom. Along the way, she saw how split up and confusing healthcare can feel. BIOVITY is her answer. One place where the science of your body is brought together, and explained.",
  portrait: "Portrait pending client confirmation",
};

export const team = {
  headline: "The right experts. The right setting.",
  body: "Our team includes qualified doctors, specialists, labs and technology partners. Every medical decision is made by a registered doctor. We show you their qualifications, because trust should be earned.",
};

export const faqs = [
  {
    q: "Do I have to do all five steps?",
    a: "Everyone starts with DISCOVER and BIOBLUEPRINT. What comes next depends on your results and your goals.",
  },
  {
    q: "Does any of it hurt?",
    a: "The fingertip scan and cheek swab are painless. The blood test is a normal blood draw. CELLUTION uses a local anaesthetic.",
  },
  {
    q: "How long until I see my results?",
    a: "[To be confirmed by BIOVITY]. You’ll get a message the moment they’re all ready.",
  },
  {
    q: "Is CELLUTION right for me?",
    a: "Only a specialist can say, after your assessment. It’s for joint wear, diabetes and fertility concerns.",
  },
  {
    q: "Where are you?",
    a: "The BIOVITY Centre, Mumbai.",
  },
];
