/** Inner-page copy from BIOVITY Website Master Document v3.4. UK English. */

export const pathways = [
  {
    slug: "longevity",
    name: "Longevity",
    card: "I feel well, and I want to stay that way",
    headline: "Live longer. Live better.",
    who: "You feel well today. You want to keep it that way for decades. And you’d rather act early than wait for problems.",
    noticing: ["Curious about your biological age", "Wanting real data, not guesswork", "Thinking about your family’s health history"],
    helps: [
      "DISCOVER: we talk through your goals and history",
      "BIOBLUEPRINT: three tests show where your body stands today",
      "DOX: we strengthen the foundations, with food and liver support",
      "CONTINUUM: we re-test and track your progress every year",
    ],
    question: "I’m healthy. Is this for me?",
    answer: "Yes. Longevity is about acting while you’re well. That’s when small changes matter most.",
    cta: "START MY LONGEVITY JOURNEY",
  },
  {
    slug: "performance",
    name: "High performance",
    card: "I want more energy, focus and faster recovery",
    headline: "Energy, focus and recovery, at your best.",
    who: "Founders, athletes and anyone who pushes hard. You want to perform well, and keep doing it for years.",
    noticing: ["Tired even after a full night’s sleep", "Taking longer to recover from training", "Losing focus later in the day"],
    helps: [
      "BIOBLUEPRINT: NutriDNA shows how your genes respond to food, exercise and sleep. Your Cell Score shows how well your cells are protected",
      "DOX: a food plan and ANF sessions to support recovery",
      "CONTINUUM: regular performance and recovery reviews",
    ],
    question: "Will this replace my coach or trainer?",
    answer: "No. It gives you and your coach better information to work with.",
    cta: "START MY PERFORMANCE JOURNEY",
  },
  {
    slug: "metabolic",
    name: "Metabolic health",
    card: "I’m worried about my sugar, weight or diabetes",
    headline: "Take charge of your sugar, weight and energy.",
    who: "People living with diabetes or prediabetes, people finding weight hard to shift, and anyone with diabetes in the family.",
    noticing: ["Seeing your blood sugar creep up", "Feeling tired or foggy after meals", "Finding weight hard to lose"],
    helps: [
      "BIOBLUEPRINT: blood tests show your sugar and metabolic markers. NutriDNA shows how your body handles carbs and fats",
      "DOX: a food plan built for your body, with liver support",
      "CELLUTION: for people living with diabetes, if a specialist confirms it’s suitable, alongside your usual care",
      "CONTINUUM: regular re-tests so you can see your progress",
    ],
    note: "Keep taking your diabetes medicines and seeing your doctor. THOP works alongside your care, never instead of it.",
    cta: "START MY METABOLIC JOURNEY",
  },
  {
    slug: "fertility",
    name: "Fertility",
    card: "I’m thinking about my fertility or reproductive health",
    headline: "Your fertility, understood.",
    who: "",
    panels: [
      ["For women: Her Biology", "Female biology ages on its own clock. Changes in your 30s and 40s, perimenopause and menopause all affect your heart, bones, brain and metabolism. Her Biology looks at the whole picture, not just one hormone."],
      ["For men", "Sperm health is often linked to overall health. We look at both together."],
    ],
    noticing: [] as string[],
    helps: [
      "DISCOVER: a private, unhurried conversation about your goals",
      "BIOBLUEPRINT: your markers, your genes and your Cell Score",
      "DOX: preparing your body with food and liver support",
      "CELLUTION: for fertility concerns in women and men, if a specialist confirms it’s suitable, alongside specialist fertility care",
    ],
    question: "Do I need to stop my current fertility treatment?",
    answer: "No. We work alongside your fertility specialist.",
    cta: "START MY FERTILITY JOURNEY",
  },
  {
    slug: "joints",
    name: "Joints and recovery",
    card: "My joints are stiff, sore or slow to heal",
    headline: "Move freely again.",
    who: "People with knee or joint wear, osteoarthritis, tendon or cartilage problems, or injuries that are slow to heal.",
    noticing: ["Feeling stiffness or pain in your knees or joints", "Finding stairs or long walks harder", "Healing more slowly than you used to"],
    helps: [
      "DISCOVER: includes an orthopaedic assessment, with scans if needed",
      "BIOBLUEPRINT: shows what’s happening inside your body, beyond the joint",
      "DOX: prepares your body before treatment",
      "CELLUTION: your own stem cells for joint wear, such as knee osteoarthritis, if a specialist confirms it’s suitable",
      "CONTINUUM: tracks your movement and recovery over time",
    ],
    question: "Do I need surgery first?",
    answer: "Not necessarily. Your specialist will explain every option, including surgery, during your assessment.",
    cta: "START MY JOINTS JOURNEY",
  },
  {
    slug: "executive",
    name: "The busy executive",
    card: "I want a clear picture of my health, fast",
    headline: "A clear picture of your health. In very little time.",
    who: "Leaders with full diaries. You want the full picture, without ten separate appointments.",
    noticing: ["Short on time for check-ups", "Holding reports that never connect", "Dealing with stress, travel and poor sleep"],
    helps: [
      "One coordinator who books and manages everything",
      "All three BIOBLUEPRINT tests, done quickly and privately",
      "One dashboard and one Biological Twin, instead of a pile of reports",
      "CONTINUUM membership to keep you on track all year",
    ],
    question: "Can you work around my schedule?",
    answer: "Yes. Your coordinator plans every visit around your diary.",
    cta: "START MY JOURNEY",
  },
] as const;

export type Pathway = (typeof pathways)[number];

export const hallmarks = [
  ["DNA damage", "Your DNA picks up wear and tear over time"],
  ["Shorter telomeres", "The protective caps on your chromosomes wear down"],
  ["Gene switches drift", "The switches that turn genes on and off go out of tune"],
  ["Protein upkeep slows", "Cells get worse at keeping their proteins in shape"],
  ["Clean-up slows", "Cells clear out their waste less well"],
  ["Fuel signals blur", "The body reads food and energy signals less clearly"],
  ["Power stations weaken", "Mitochondria make less energy"],
  ["‘Zombie’ cells build up", "Old cells stop working but don’t clear away"],
  ["Repair cells run low", "Stem cells become fewer and slower"],
  ["Cell signals break down", "Cells stop talking to each other clearly"],
  ["Inflammation simmers", "Low-level inflammation runs in the background"],
  ["Gut balance shifts", "The mix of bacteria in your gut changes"],
] as const;

export const journeySteps = [
  ["01", "CONNECT", "Send us a message or WhatsApp. Your coordinator gets back to you."],
  ["02", "DISCOVER", "Meet our clinical team. Share your story and your goals."],
  ["03", "MAP", "Do your three BIOBLUEPRINT tests: fingertip scan, blood draw, cheek swab."],
  ["04", "REVEAL", "See your Biological Twin. We explain every result."],
  ["05", "PREPARE", "Start DOX: your food plan and ANF sessions."],
  ["06", "REGENERATE", "CELLUTION, if a specialist confirms it’s right for you."],
  ["07", "CONTINUE", "Regular check-ins and re-tests with CONTINUUM."],
] as const;

export const centreRooms = [
  ["ARRIVAL", "A quiet welcome. You’re greeted by name."],
  ["CONSULTATION ROOMS", "Private rooms for unhurried conversations."],
  ["ASSESSMENT AREA", "Where your fingertip scan and blood draw happen."],
  ["OUR LAB", "Our in-house lab, where CELLUTION cells are prepared on site."],
  ["REVEAL ROOM", "Where you see your Biological Twin for the first time."],
] as const;
