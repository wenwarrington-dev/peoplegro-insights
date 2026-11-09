import { useState, useEffect } from "react";
import { supabase, supabaseConfigured, IoptRow } from "./supabase";

// ---------------------------------------------------------------------------
// Look and feel
// ---------------------------------------------------------------------------
const C = {
  brand: "#3D6425", brandLight: "#578B38", ink: "#2B2B2B", text: "#2F3A32", sub: "#45524A", muted: "#56645A",
  line: "#DDE8D8", soft: "#F8FAF6", neutral: "#F1F2F1", pillLine: "#9AA39C", page: "#EEF3EA",
};
const FONT = "Georgia, 'Times New Roman', serif";

type Code = "RS" | "LP" | "RI" | "HA";
const ORDER: Code[] = ["RS", "LP", "RI", "HA"];

// ---------------------------------------------------------------------------
// Content (matches PeopleGro Insights Copy Draft v1)
// ---------------------------------------------------------------------------
const STY: Record<Code, any> = {
  RS: {
    name: "Reactive Stimulator", color: "#166534", light: "#F0FDF4", border: "#86EFAC", q: "When?", share: 15,
    key: "Forward movement, even with little information", motto: "He who hesitates is lost",
    desc: "When you're working from your RS preferred style, you move first and adjust as you go. You take in information in a loose, jump-around way and turn it into action quickly. Waiting feels riskier to you than acting.",
    bring: "Speed, decisiveness, adaptability, and energy to get a stuck team moving", watch: "Skipping details, moving on before others are ready", motivates: "Freedom to act, variety, fast feedback", gift: "You keep things moving and get teams unstuck",
    Time: "Now. Fast pace.", Detail: "Minimal, given or received", Risk: "What risk? There's always an adjustment.",
    traits: ["Opportunity Oriented", "High Intensity", "Volatility Tolerant", "Flexible Focus", "Short Range Horizon", "Decisive", "Fast Execution", "Action Oriented"],
    good: "Passionate, competitive, confident, intuitive, forceful, spirited, daring, eager, bold", bad: "Insensitive, combative, impulsive, abrasive, inexact, volatile, pushy, blunt",
    changeLook: "Shortcuts, practical solutions, and quick results", changeBring: "You adopt change early and thrive in the volatility",
    stress: "Push hard to do something, anything, to get unstuck", trigger: "No clear way forward",
    listen: "You may start planning your response while the other person is still talking, and miss what comes at the end.", listenTry: "Questions like \"What would forward movement look like?\" or \"What is the timeline?\" can help you stay with the speaker.",
    when: "Things feel stuck, a decision keeps getting pushed back, or the team is waiting for perfect information.", looks: "You might choose one next step you could take today, or set a short deadline. Some people find it helps to decide with what they know now and plan to adjust. What would fit this situation?",
    words: "forward movement, success, achievement",
    tips: ["Short, bulleted emails about one thing", "Being clear about whether you want action or a sounding board", "The main point first, with details if they ask", "Energy. Tone and gestures matter", "Short, frequent meetings"],
    strong: "You keep pushing to do something, even when more action is making things worse.",
    snowS: ["Focuses on improvement in speed or volume", "Recovers quickly from any missteps", "Early adopter of change initiatives", "Thrives in the volatility of change", "Energetic and outgoing", "Readily accepts change", "Quickly offers ideas", "Agile"],
    snowC: ["May move to action before change is understood", "May have difficulty relating to long-term vision", "Resists change that introduces complexity", "Tendency to leave projects unfinished", "Resists added detail", "Risk is inherent and inevitable in change"],
  },
  LP: {
    name: "Logical Processor", color: "#1D4ED8", light: "#EFF6FF", border: "#BFDBFE", q: "How?", share: 30,
    key: "Certainty of outcome, knowing how it will work before you act", motto: "Do it once, do it right",
    desc: "When you're working from your LP preferred style, you want to do it once and do it right. You take in information step by step and act on it in a planned, orderly way. Once you've mastered a process, you're the most efficient person in the room.",
    bring: "Precision, thoroughness, quality, reliable processes", watch: "Judging new ideas before they mature, holding tightly to procedures", motivates: "Clear expectations, accuracy, predictability", gift: "You build quality, consistent processes",
    Time: "Take the time to do it right", Detail: "All operational detail matters", Risk: "Low tolerance",
    traits: ["Analytically Oriented", "High Certainty of Outcome", "Contemplative", "High Rule/Norm Compliance", "Hesitantly Decisive", "Comprehensive Planning", "High Conceptual Detail", "Project Level Horizon"],
    good: "Conscientious, trustworthy, committed, composed, restrained, resolute, focused, devoted", bad: "Judgmental, hardhearted, mechanical, secretive, stubborn, inflexible, plodding, distant",
    changeLook: "New directions, processes, and methods, which you then follow exactly", changeBring: "You spot operational risk and make the change work day to day",
    stress: "Hold tightly to the known process and want everything in writing", trigger: "Uncertainty or pressure to skip steps",
    listen: "You're quick to spot gaps in logic, and new ideas always have gaps early on.", listenTry: "Giving an idea time to mature, or offering a small test, before judging it.",
    when: "Good ideas keep stalling before they're finished, or work keeps getting redone.", looks: "You might write out the steps in order, or set a finish date. Some people find it helps to ask how it will work, or to test it small first. What would fit this situation?",
    words: "certainty of outcome, planning, logical, beta test",
    tips: ["Logic, consistency, and a matter-of-fact delivery", "Patience with skepticism. Trust is earned through consistency", "Plenty of operational detail", "Showing HOW a change makes things better", "Time for change to settle in"],
    strong: "You hold tighter to the process, procedure, or task, even when it isn't getting the results you want.",
    snowS: ["Sustained effort through the entire change", "Readily accepts incremental change", "Helps identify operational risk exposures", "Tests new ideas thoroughly", "Operationalizes change", "Deliberate", "Careful", "Precise"],
    snowC: ["Resistant to completely new approaches", "Adopts change initiatives slowly (where's the proof?)", "“Visions” are viewed as “dreams”", "“Suffers in silence”", "Skeptical", "Anxious"],
  },
  RI: {
    name: "Relational Innovator", color: "#A16207", light: "#FEFCE8", border: "#FDE68A", q: "What?", share: 22,
    key: "Finding the gap, and a better way that serves the mission", motto: "There is always a better way",
    desc: "When you're working from your RI preferred style, you look for the gap and the better way, and it has to connect to the mission. You make connections between things that seem unrelated, then think them through before acting.",
    bring: "Fresh thinking, vision, optimism, imagining possible futures", watch: "Following new ideas before finishing the current one", motivates: "Meaningful work, big ideas, feeling heard", gift: "You find gaps and push people further than they thought possible",
    Time: "Fluid. It varies.", Detail: "Matters when invested, otherwise tuned out", Risk: "Very optimistic",
    traits: ["Innovation Focused", "Rapid Idea Generation", "Flexible Planning", "Mission Oriented", "Variable Intensity", "Optimistic", "Comfortable with Ambiguity"],
    good: "Ingenious, forthright, engaging, inspired, flexible, positive, daring, clever", bad: "Absent-minded, undependable, unfocused, inattentive, capricious, inefficient, excitable, dreamer",
    changeLook: "Fluid, fast-moving situations that need creative solutions", changeBring: "You keep the mission in view and encourage change of all kinds",
    stress: "Freeze, with too many options and no clear best one", trigger: "No better way to be found, or a gap you have no authority to fix",
    listen: "Your mind starts connecting what you hear to other ideas, and you can miss important details.", listenTry: "A clarifying question before moving to a new idea can help you catch what you might miss.",
    when: "The usual approach has stopped working, or the team feels stuck defending how things have always been done.", looks: "You might ask what if, or look for the gap nobody is talking about. Some people find it helps to come up with a few options before choosing one. What would fit this situation?",
    words: "sustainability, collaboration, practical innovation, explore alternatives",
    tips: ["A clear connection to the mission", "The what and why, with less time on the how", "Comparisons and analogies", "When the answer is no, framing it as timing or readiness", "Flexibility. Changes and new versions are part of the process"],
    strong: "You keep searching for the better way. When there isn't one, you can end up in a holding pattern, with lots of options and no movement.",
    snowS: ["Ideas contain new and exciting methods", "Takes a long-range view of major issues", "Thinks in terms of overall mission", "Encourages changes of all types", "Focus on substantive improvements", "Open and expressive", "Readily cooperates", "Creative"],
    snowC: ["Unwilling to give up control over approach", "Lack of detail focus can create exposures", "Attention diverted by even newer ideas", "Resists “tried and true” methods", "Candid in negative judgments", "Risk is inherent and inevitable in change"],
  },
  HA: {
    name: "Hypothetical Analyzer", color: "#DC2626", light: "#FEF2F2", border: "#FCA5A5", q: "Why?", share: 33,
    key: "Complete, reasoned understanding, with a logic path you can explain", motto: "Think, then act",
    desc: "When you're working from your HA preferred style, you think, then act. You take in all the information, sort what's valid from what isn't, and build a full picture before you move.",
    bring: "Systems thinking, long-term strategy, contingency planning", watch: "Overanalyzing, treating every risk as equally likely", motivates: "Intellectual challenge, understanding the why", gift: "You can hold a whole system in mind",
    Time: "Understanding takes time", Detail: "All data is good, so it can be sorted", Risk: "Calculate and understand it first",
    traits: ["Analytically Oriented", "High Certainty of Outcome", "Contemplative", "High Rule/Norm Compliance", "Comprehensive Planning", "Long-Term Horizon", "Systemic Thinking", "High Conceptual Clarity"],
    good: "Calm, astute, patient, attentive, insightful, intelligent, agreeable, supportive", bad: "Slow, timid, trifling, tortuous, compliant, indecisive, convoluted, longwinded",
    changeLook: "Time to examine every possible contingency", changeBring: "You see how the change fits the whole system",
    stress: "Become frustrated and keep raising the same concerns", trigger: "Others brushing off risks you've identified",
    listen: "You're a naturally good listener, and you can get pulled toward the most interesting part and miss the rest.", listenTry: "Staying with the speaker through the less interesting parts, and asking for time to process if you need it.",
    when: "Things are moving fast and keep breaking, or a decision will affect a lot of people or systems.", looks: "You might step back and ask why, or map who and what this touches. Some people find it helps to list the risks and what they would do about each. What would fit this situation?",
    words: "systems, risk assessment, contingency planning, complete understanding",
    tips: ["The big picture first", "A walk-through of how you got there, including options ruled out", "Showing WHY a change makes things better", "Openness to questions. They're testing the logic, not you", "Saying how much detail you need when you ask"],
    strong: "You keep analyzing and raising risks, even after you have enough to decide.",
    snowS: ["Identifier of systems risk", "Thinks systemically", "Focus on the “big picture”", "Complete understanding of change", "Knows how the change “fits in”", "Examines all possible contingencies", "Readily accepts change at a measured pace", "Expert-level knowledge of the change effects"],
    snowC: ["Skeptical", "Overly analytical", "Moves to action reluctantly", "Unlikely to fully buy in to visions", "Frustrated by fast-moving changes", "Less committed to actual implementation"],
  },
};

const PAT: Record<string, string> = { "RI+RS": "Changer", "RS+RI": "Changer", "RS+LP": "Performer", "LP+RS": "Performer", "LP+HA": "Conservator", "HA+LP": "Conservator", "HA+RI": "Perfector", "RI+HA": "Perfector" };
const OPP: Record<Code, Code> = { RS: "HA", HA: "RS", RI: "LP", LP: "RI" };
const PCHANGE: Record<string, string> = {
  Changer: "You measure success by the overall change, and turn a stream of ideas into action.",
  Performer: "You tend to accept change and are eager to show results.",
  Conservator: "Focusing on the short-term goals of the change can help reduce your discomfort.",
  Perfector: "You work on turning raw ideas into finished concepts.",
};

const PATTERNS = [
  { name: "Changer", combo: "RI + RS", share: 21, desc: "Comes up with new ideas and starts acting on them quickly. Creative, agile, optimistic.", watch: "Moving faster than the team can follow." },
  { name: "Performer", combo: "RS + LP", share: 14, desc: "Focused on the task and the result. Quick, reliable decisions.", watch: "Trading long-term thinking for immediate results." },
  { name: "Conservator", combo: "LP + HA", share: 46, desc: "Careful, detailed, and skeptical of new situations. Consistent, quality work.", watch: "Resisting change even when it's needed." },
  { name: "Perfector", combo: "HA + RI", share: 19, desc: "Values new ideas but shares them after thinking through risk and reward.", watch: "Taking a long time to reach a conclusion." },
];
const PATTERN_TIPS = [
  { name: "Changer", combo: "RI + RS", tip: "Energy and the big idea, then help choosing what to act on first." },
  { name: "Performer", combo: "RS + LP", tip: "Clarity about the task, the result, and the deadline." },
  { name: "Conservator", combo: "LP + HA", tip: "Time, detail, and evidence, and seeing that the risks were considered." },
  { name: "Perfector", combo: "HA + RI", tip: "Hearing the idea early, with room to think it through." },
];
const PAIRS: [string, string][] = [
  ["RS + LP", "Good working relationship. RS can frustrate LP by acting without a plan. LP can frustrate RS by being slow."],
  ["RS + HA", "Can work very well. HA helps with goals and options, RS makes ideas real."],
  ["RS + RI", "Lots of energy and ideas. May need an LP or HA to add structure."],
  ["LP + HA", "Natural fit. HA plans and assesses, LP executes."],
  ["LP + RI", "Can work well with effort. RI's constant new ideas can feel threatening to LP."],
  ["HA + RI", "Very good fit when both understand the dynamic. May need an RS or LP to get to action."],
  ["RS + RS", "Fast and energized, but both may push their own direction. Agree on what moving forward means."],
  ["LP + LP", "Friction can come from each protecting their own process."],
  ["RI + RI", "Can turn into a better-idea competition. You may not see the mission the same way."],
  ["HA + HA", "Each has their own vetted information. Common ground on the facts can help."],
];
const TO: Record<Code, Record<Code, string>> = {
  RS: { RS: "It can help to agree on what moving forward means right now.", LP: "It can help to be specific and logical, and show how it fits what they already trust.", HA: "Questions are likely. It can help to show your thought path and the big picture.", RI: "It can help to keep it focused, use analogies, and connect it to the mission." },
  LP: { RS: "It can help to keep it short and action-focused, with some energy.", HA: "Challenge is likely, and it isn't about your competence. It can help to show the big picture.", RI: "It can help to connect it to the mission and use analogies, and to be ready for deep dives.", LP: "It can help to respect each other's structure and look for common ground." },
  RI: { RS: "It can help to lead with energy and the action, and keep it short and prioritized.", LP: "It can help to slow down, give more detail than feels natural, and walk through your logic.", HA: "It can help to lay out your reasoning and the big picture, and give them time to think.", RI: "It can help to skip the better-idea competition and give them something to react to." },
  HA: { RS: "It can help to cover the essentials quickly and build some enthusiasm.", LP: "It can help to be clear and logical, and tie new information to how the work gets done.", RI: "It can help to keep it focused and use comparisons.", HA: "It can help to explain your logic path and look for common ground on the facts." },
};
const DEES = [
  { name: "Disengagement", looks: "Hard to find, doing only the basics, no questions", hear: "\"I don't care.\" \"Whatever you want.\"", helps: "Making the first move, creating safety, asking questions, and listening." },
  { name: "Disidentification", looks: "Dwelling on the past, sticking with the old team", hear: "\"It wasn't broken, why change it?\" \"I used to...\"", helps: "Exploring what mattered most before, and what the change might offer." },
  { name: "Disorientation", looks: "Endless questions, frozen by fear of doing it wrong, very busy", hear: "\"Not sure where to start.\"", helps: "A big-picture framework and a plan with clear priorities." },
  { name: "Disenchantment", looks: "Raised voice, walking out, malicious compliance", hear: "\"I can't believe this is happening.\"", helps: "Recognizing that anger often masks another D, and room to vent respectfully. Acknowledging isn't agreeing." },
];
const ASSESS: [string, string][] = [
  ["I already miss the old days", "The future is bright"], ["I feel unsure, or even stuck", "I know what to do"], ["A loss", "A gain"],
  ["Chaotic", "Manageable"], ["Separate from change", "Involved with change"], ["Confused", "Clear"], ["Powerless", "Empowered"],
  ["Afraid to make mistakes", "Growth opportunity"], ["Punished", "Rewarded"], ["Been doing it wrong", "Evolving"],
];
const LEVELS = [
  ["Point of view", "Hearing emotion and logic, with compassion, to understand their world"],
  ["Emotion", "Hearing the emotions driving their reasoning"],
  ["Logic", "Following their internal logic"],
  ["Rebuttal", "Focused on your response, getting ready to argue"],
  ["Gist", "Tuning in and out, checking it against your own logic"],
];
const STUCK: [string, string][] = [
  ["All or nothing", "What's beyond the black and white I'm seeing? Is there an \"and\" instead of an \"or\"?"],
  ["Overgeneralizing", "Am I projecting one past event onto this situation?"],
  ["Emotional filtering", "Am I seeing only the positives or only the negatives?"],
  ["Downplaying the positive", "Am I brushing off real compliments?"],
  ["Jumping to conclusions", "Am I mind reading with no evidence? What don't I know?"],
  ["Magnifying or minimizing", "Am I blowing this out of proportion, or downplaying something that matters?"],
  ["Storytelling as truth", "What story am I telling myself? Can I trade up for a better story?"],
  ["Critical statements", "Am I using should, must, have to, or can't?"],
  ["I am what I think", "Am I reasoning from a feeling?"],
  ["Labeling", "Am I labeling myself or others based on a mistake?"],
  ["Blaming", "Am I blaming myself for more than my share, or missing my part?"],
  ["Unspoken expectations", "How would they know what I wanted?"],
  ["Processing style", "Are different, or similar, processing styles at play?"],
  ["Us vs. them", "Am I seeing this as us vs. them, right vs. wrong, or win vs. lose?"],
];

type Res = { id: string; t: string; kind: string; d: string; imgs?: { src: string; alt: string }[]; videos?: { id: string; title: string; note?: string }[]; paras?: string[]; list?: string[]; after?: string[]; links?: { href: string; text: string }[] };
const RESOURCES: Res[] = [
  { id: "model", t: "The PeopleGro Model", kind: "Guide", d: "Three buckets for satisfaction and success, and the lotus that ties them together.",
    imgs: [{ src: "/images/peoplegro-model.jpg", alt: "The PeopleGro Model: self-awareness and self-management, results and productivity, and technical and operational, leading to satisfaction and success" }, { src: "/images/peoplegro-model-lotus.jpg", alt: "The integrated PeopleGro Model as a lotus, with self-awareness and self-management at the center, results and productivity on the left, and technical and operational on the right" }],
    paras: ["The PeopleGro Model works in every part of life: at work, at home, and as a volunteer. You define what satisfaction and success mean for you. No one else should define that for you.", "There are three buckets. Two are about what we do, and one is about how we do it."],
    list: ["Technical and operational (what): your knowledge, experience, skills, talents, and education. You own this. You don't turn in your brain with your badge.", "Results and productivity (what): what you want to accomplish for yourself, your family, or your organization.", "Self-awareness and self-management (how): how we work together to get there. Working together is the hardest thing we do as human beings."],
    after: ["In the integrated model, self-awareness and self-management are the center petal of a lotus, because the how elevates both what buckets. The lotus grows out of the muck and blooms above the water, a strong metaphor for people and organizations."] },
  { id: "protocols", t: "The Interaction Protocols", kind: "Video", d: "How we agree to be together and work together.",
    videos: [{ id: "289925773", title: "Interaction Protocols: What Are They and Why Use Them" }],
    paras: ["PeopleGro developed these over years of working with clients. They set the tone for how people work together. There are five protocols in two groups."],
    list: ["We agree: Individual intent is not being questioned. We don't know each other's stories, and we're all doing the best we can in this moment.", "We agree: To practice self-awareness and self-management. Not perfection, just paying attention and adjusting as needed.", "We agree: To stay in the conversation and support each other. Skeptical is OK. Cynical is not. You don't have to agree, but you strive to understand.", "We give permission: To speak as openly and directly as you are able to in the moment. Thinking out loud is messy, and it builds shared understanding.", "We give permission: To stumble, to not be your best, and to learn together. Learning isn't mastery, and it isn't always linear. Allow space and grace."],
    after: ["PeopleGro opens sessions by reading these out loud and asking everyone for a thumbs up. You might try the same with your own team."] },
  { id: "responsible", t: "Who's Responsible for Communication?", kind: "Video", d: "Why each of us is 100% responsible for four things in every conversation.",
    videos: [{ id: "289915324", title: "Who's Responsible for Communication?", note: "Testing version. An updated video is coming." }],
    paras: ["In a conversation between two people, who is responsible for what? Many people say 50/50. PeopleGro's answer: each of us is 100% responsible for four things."],
    list: ["Your content: the words you say", "Your nonverbals: body language, facial expressions, tone of voice, and whether they line up", "Your reaction or response to the other person", "Paying attention to the other person's feedback"],
    after: ["The one thing we're not responsible for is how our words land on the other person's ear. That's why their feedback matters so much. Some days 100% is aspirational, and that's OK. It's a muscle that grows with practice."] },
  { id: "sasm", t: "Self-Awareness and Self-Management", kind: "Guide", d: "The two primary tenets of emotional intelligence, and the heart of the PeopleGro Model.",
    paras: ["Self-awareness is our ability to recognize our automatic behaviors and responses, our triggers, our stories, our mental models, and our assumptions.", "Self-management is our ability to make a plan and practice doing something differently, based on that self-awareness.", "The bridge between them is reflection: noticing whether something helps us or undermines us, and then choosing what to practice. It's a personal journey done in a social context. We need each other for mirroring, feedback, and support."],
    after: ["Nicole's own example: loud voices hit her nervous system hard. Over time, she built a practice of scanning the room and asking herself, \"Am I OK? Are we OK?\" Then she chooses how to respond. Her questions may not fit everyone, and that's the point. Everyone's practice is their own."] },
  { id: "commodel", t: "The Basic Communication Model", kind: "Guide", d: "Input, process, output, and why we judge what we see.",
    imgs: [{ src: "/images/communication-model.png", alt: "Input, process, and output flow into processing preferences (I-OPT), which lead to behaviors" }],
    paras: ["We take in information, process it, and act on it, all at the same time, all the time. So does everyone else. Together, these create our processing preferences, our I-OPT profile, and our behavior mirrors them.", "Only output is visible to others, and output is behavior. What do we do with each other's output? We judge it. Judging keeps us safe, so we don't want to stop. The challenge is that the brain goes for the lowest-level judgments.", "The antidote is to get curious and act like a kindergartner: play, ask questions, and see learning as play. Curiosity isn't inherited. It's a skill that grows with practice."] },
  { id: "loop", t: "The Feedback Loop", kind: "Guide", d: "Behavior, emotions, feelings, and trading up for a better story.",
    imgs: [{ src: "/images/feedback-loop.png", alt: "The feedback loop: processing styles shape behavior, which leads to emotions, which we interpret as feelings" }],
    paras: ["Behavior is what others see. When we experience someone's behavior, we have a biochemical reaction, an emotion. Then we interpret that emotion, and that interpretation is a feeling: the story we tell ourselves.", "We think we're interpreting the other person's behavior. We're actually interpreting our own emotions. That's the high-leverage point. Our stories can make a reaction stronger and longer, or settle it quickly."],
    after: ["Nicole tells a story about being cut off on the drive home after a 14-hour day, and the stories she told herself about the other driver. The car pulled into her neighbor's driveway. What if she had told herself, \"They're as tired as I am and just trying to get home safely\"? The practice is to notice the story early, get curious, and trade up for a better one."] },
  { id: "friction", t: "The Cost of Friction", kind: "Link", d: "An estimate of what friction costs your team, on the PeopleGro website.",
    paras: ["You may choose to do nothing about friction, but you can't avoid paying its cost: in energy, morale, relationships, and results."],
    links: [{ href: "https://www.peoplegro.com/humanfrictioncalc", text: "Open the Human Friction Calculator" }] },
  { id: "iopt", t: "I-OPT Videos", kind: "Video", d: "Videos on the I-OPT styles and what they mean.",
    videos: [{ id: "361085877", title: "IOpt Style Names: What Do the Words Mean?" }, { id: "361084585", title: "An Introduction to IOpt: Supporting You in How You Do What You Do" }, { id: "361088237", title: "IOpt Patterns: Focusing on Your Sweet Spot" }] },
];

// ---------------------------------------------------------------------------
// Profile logic (rules confirmed with PeopleGro and PCI)
// ---------------------------------------------------------------------------
function analyze(sc: Record<Code, number>) {
  const sorted = ORDER.slice().sort((a, b) => sc[b] - sc[a]);
  const [top, second, third] = sorted;
  const [s1, s2, s3, s4] = sorted.map(c => sc[c]);
  let pattern = PAT[top + "+" + second] || PAT[top + "+" + third] || "None";
  let type: string, moment: string, overTime: string, msg: string;
  const balanced = ORDER.every(c => sc[c] >= 12 && sc[c] <= 13);
  if (balanced) {
    type = "Balanced"; moment = "Less predictable"; overTime = "Less predictable"; pattern = "No single pattern";
    msg = "Your four scores are about equal. You have no single preferred style and no single pattern, so you can draw on every style. The trade-off is that others may find you harder to anticipate. Naming what you need, and which style you're bringing to a situation, helps people work with you. Balanced profiles are rare. In PCI's experience, they often show up during a major shift in someone's life, and they usually don't stay balanced.";
  } else if (s1 - s2 <= 5 && OPP[top] === second && Math.abs(s3 - s4) <= 1) {
    type = "Balanced split"; moment = "Less predictable"; overTime = "Less predictable"; pattern = "No single pattern";
    msg = "Your top two styles, " + top + " and " + second + ", are close and sit on opposite sides of the I-OPT model, and your other two are about equal. There's no single preferred style and no single pattern leading the way. You bring a wide range, and others may find you harder to anticipate. It helps to tell people which style you're working from.";
  } else if (s1 - s2 <= 5) {
    type = "Split style"; moment = "Less predictable"; overTime = "Predictable";
    msg = "Your top two scores, " + top + " and " + second + ", are within 5 points of each other. That's called a split style. In any given moment, you might respond from either one, so people may find you harder to read day to day. Over time, though, your " + pattern + " pattern is clear and consistent. For you, your pattern often describes you better than either style on its own.";
  } else if (s2 - s3 <= 5) {
    const p1 = PAT[top + "+" + second], p2 = PAT[top + "+" + third];
    pattern = [p1, p2].filter(Boolean).join(" / ") || "None";
    type = "Split pattern"; moment = "Predictable"; overTime = "Less predictable";
    msg = "Your " + top + " preferred style is clear, so people can usually predict your first response. Your next two styles, " + second + " and " + third + ", are within 5 points, so over time you may move between two patterns" + (p1 && p2 ? ": " + p1 + " and " + p2 : "") + ". People may see you as consistent in the moment but harder to read over the long run.";
  } else {
    type = "Clear profile"; moment = "Predictable"; overTime = "Predictable";
    msg = "Your " + top + " preferred style is clearly your starting point, and your " + pattern + " pattern shows up consistently over time. People who work with you usually know what to expect. Switching to other styles may take more deliberate effort, especially your less-used ones.";
  }
  const isBal = type === "Balanced" || type === "Balanced split";
  return { sorted, top, second, third, s1, type, moment, overTime, msg, pattern, isBal, strong: !isBal && s1 > 20 };
}

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
const pillStyle = (on: boolean): any => ({ background: on ? C.ink : "#FFFFFF", color: on ? "#FFFFFF" : C.ink, border: on ? "2px solid " + C.ink : "1px solid " + C.pillLine, borderRadius: 18, padding: "8px 13px", fontFamily: FONT, fontSize: 13, cursor: "pointer", minHeight: 36 });
const label: any = { fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: C.muted };
const col = (gap = 12): any => ({ display: "flex", flexDirection: "column", gap });
const card = (border = C.line, bg = "#FFFFFF"): any => ({ border: "1px solid " + border, background: bg, borderRadius: 16, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 });
const p14: any = { margin: 0, fontSize: 14, lineHeight: 1.6 };
const p13: any = { margin: 0, fontSize: 13, lineHeight: 1.55 };
const textarea: any = { border: "1px solid " + C.line, borderRadius: 10, padding: 10, fontSize: 13, resize: "vertical", fontFamily: FONT };

function Pills({ items, value, onChange }: { items: [string, string][]; value: string; onChange: (v: string) => void }) {
  return <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{items.map(([v, l]) => <button key={v} onClick={() => onChange(v)} style={pillStyle(value === v)}>{l}</button>)}</div>;
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width="40" height="40" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 18 C50 18 28 36 28 57 C28 70 38 80 50 82 C62 80 72 70 72 57 C72 36 50 18 50 18Z" fill="#578B38" />
        <path d="M50 28 C50 28 16 46 20 72 C22 84 36 90 50 82 C34 74 26 63 30 50 C34 37 50 28 50 28Z" fill="#455048" opacity={0.45} />
        <path d="M50 28 C50 28 84 46 80 72 C78 84 64 90 50 82 C66 74 74 63 70 50 C66 37 50 28 50 28Z" fill="#B01B43" opacity={0.85} />
        <circle cx="50" cy="54" r="9" fill="#578B38" />
        <circle cx="50" cy="50" r="5" fill="#455048" opacity={0.35} />
      </svg>
      <div>
        <div style={{ lineHeight: 1.1 }}>
          <span style={{ fontSize: 20, fontWeight: 400, color: "#578B38", fontFamily: FONT }}>people</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#455048", fontFamily: FONT }}>gro</span>
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#578B38", letterSpacing: 3, textTransform: "uppercase" }}>Insights</div>
      </div>
    </div>
  );
}

function PrintButton() {
  return <button onClick={() => window.print()} style={{ background: C.ink, color: "#FFFFFF", border: "none", borderRadius: 20, padding: "10px 16px", fontFamily: FONT, fontSize: 13, cursor: "pointer" }}>Download PDF</button>;
}

function Shape({ sc, a }: { sc: Record<Code, number>; a: any }) {
  const cx = 130, cy = 130, k = 110 / 30;
  const r = (v: number) => Math.min(v, 30) * k;
  const pts: Record<Code, [number, number]> = { RS: [cx, cy - r(sc.RS)], LP: [cx + r(sc.LP), cy], HA: [cx, cy + r(sc.HA)], RI: [cx - r(sc.RI), cy] };
  const poly = (["RS", "LP", "HA", "RI"] as Code[]).map(c => pts[c][0].toFixed(1) + "," + pts[c][1].toFixed(1)).join(" ");
  let dx = cx, dy = cy;
  if (!a.isBal) { dx = cx + (pts[a.top as Code][0] - cx + pts[a.second as Code][0] - cx) * 0.35; dy = cy + (pts[a.top as Code][1] - cy + pts[a.second as Code][1] - cy) * 0.35; }
  const me = STY[a.top as Code];
  return (
    <svg width="200" height="200" viewBox="0 0 260 260" role="img" aria-label="Your profile shape">
      <line x1="130" y1="10" x2="130" y2="250" stroke="#9AA89D" strokeWidth="2" />
      <line x1="10" y1="130" x2="250" y2="130" stroke="#9AA89D" strokeWidth="2" />
      <polygon points={poly} fill={me.light} stroke={me.color} strokeWidth="2.5" />
      <circle cx={dx} cy={dy} r="7" fill={C.ink} />
      <text x="130" y="8" textAnchor="middle" fontSize="13" fontWeight="bold" fill={STY.RS.color} dominantBaseline="hanging">RS</text>
      <text x="252" y="126" textAnchor="end" fontSize="13" fontWeight="bold" fill={STY.LP.color}>LP</text>
      <text x="130" y="256" textAnchor="middle" fontSize="13" fontWeight="bold" fill={STY.HA.color}>HA</text>
      <text x="8" y="126" fontSize="13" fontWeight="bold" fill={STY.RI.color}>RI</text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Profile tab
// ---------------------------------------------------------------------------
function ProfileTab({ sc, a, goTap }: any) {
  const [view, setView] = useState("overview");
  return (
    <div style={col(16)}>
      <Pills items={[["overview", "Overview"], ["comm", "Comm Tips"], ["behavior", "Behavior"], ["change", "Change"]]} value={view} onChange={setView} />
      {view === "overview" && <Overview sc={sc} a={a} goTap={goTap} />}
      {view === "comm" && <CommTips a={a} />}
      {view === "behavior" && <Behavior a={a} />}
      {view === "change" && <Change a={a} />}
    </div>
  );
}

function Overview({ sc, a, goTap }: any) {
  const [how, setHow] = useState(false);
  const [notes, setNotes] = useState("");
  const me = STY[a.top as Code];
  return (
    <div style={col(16)}>
      <div style={{ ...card(me.border, me.light), padding: 18 }}>
        <span style={label}>{a.isBal ? "Your highest score" : "Your preferred style"}</span>
        <span style={{ fontSize: 22, fontWeight: "bold", color: me.color }}>{a.top}: {me.name}</span>
        <p style={p14}>This is the style that works for you most of the time, so it's where you naturally start. Remember, you have access to all four styles, all the time. When your usual approach isn't getting the results you want, a good strategy is to intentionally tap into the other styles.</p>
        <p style={{ ...p13, color: C.sub }}>Your style's question is <b style={{ color: me.color }}>{me.q}</b> It's the first thing you want answered before you act.</p>
        <button onClick={() => setHow(!how)} style={{ alignSelf: "flex-start", background: "none", border: "none", padding: 0, fontFamily: FONT, fontSize: 13, color: C.ink, textDecoration: "underline", cursor: "pointer" }}>How does I-OPT work?</button>
      </div>

      {how && (
        <div style={card()}>
          <p style={p13}>I-OPT looks at two things: how you prefer to take in information, and what you prefer to do with it.</p>
          <p style={p13}><b>Structured:</b> step by step, A to B to C. <b>Unpatterned:</b> making connections, A to E to B to Z. Unpatterned doesn't mean unstructured. It's a different kind of logic.</p>
          <p style={p13}><b>Action:</b> getting things done you can see and measure. <b>Thought:</b> planning, analyzing, reasoning things through.</p>
          <div style={{ display: "grid", gridTemplateColumns: "90px repeat(2, minmax(0, 1fr))", gap: 6, fontSize: 12, textAlign: "center" }}>
            <span /><b>Action</b><b>Thought</b>
            <b style={{ textAlign: "left" }}>Structured</b>
            <span style={{ background: STY.LP.light, color: STY.LP.color, borderRadius: 8, padding: "8px 4px" }}>LP Logical Processor</span>
            <span style={{ background: STY.HA.light, color: STY.HA.color, borderRadius: 8, padding: "8px 4px" }}>HA Hypothetical Analyzer</span>
            <b style={{ textAlign: "left" }}>Unpatterned</b>
            <span style={{ background: STY.RS.light, color: STY.RS.color, borderRadius: 8, padding: "8px 4px" }}>RS Reactive Stimulator</span>
            <span style={{ background: STY.RI.light, color: STY.RI.color, borderRadius: 8, padding: "8px 4px" }}>RI Relational Innovator</span>
          </div>
          <p style={{ ...p13, color: C.sub }}>The style names describe how you work. They aren't labels. Everyone uses all four, and your preferred style is simply where you prefer to operate.</p>
        </div>
      )}

      <div style={col(10)}>
        <span style={label}>Your four scores (out of 50)</span>
        {ORDER.map(c => {
          const v = sc[c];
          return (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 28, fontSize: 13, fontWeight: "bold", color: STY[c].color }}>{c}</span>
              <div style={{ flex: "1 1 auto", height: 12, background: "#EEF2EC", borderRadius: 6, overflow: "hidden" }}><div style={{ width: Math.min(100, Math.round(v / 30 * 100)) + "%", height: 12, background: STY[c].color, borderRadius: 6 }} /></div>
              <span style={{ width: 34, textAlign: "right", fontSize: 13, fontWeight: "bold" }}>{v}</span>
              <span style={{ width: 74, fontSize: 11, color: C.muted }}>{v > 20 ? "High" : v >= 10 ? "Moderate" : "Low"}</span>
            </div>
          );
        })}
        <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.5 }}>Your four scores add up to about 50. Everyone has some of each style. A low score means you use that style less naturally, not that you can't use it.</p>
      </div>

      <div style={{ ...col(14), borderTop: "1px solid " + C.line, paddingTop: 16 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <Shape sc={sc} a={a} />
          <div style={{ ...col(8), flex: "1 1 160px" }}>
            <span style={label}>Your profile type</span>
            <b style={{ fontSize: 20 }}>{a.type}</b>
            <div style={{ ...col(4), fontSize: 12 }}>
              <span><b>In the moment:</b> {a.moment}</span>
              <span><b>Over time:</b> {a.overTime}</span>
              <span><b>Pattern:</b> {a.pattern}</span>
            </div>
          </div>
        </div>
        <div style={{ ...card(C.line, C.soft), fontSize: 14, lineHeight: 1.6 }}>{a.msg}</div>
        {a.strong && (
          <div style={{ ...card(me.border, me.light), fontSize: 13, lineHeight: 1.6 }}>
            <b style={{ fontSize: 15, color: me.color }}>When your preferred style is strong</b>
            <span>A high score means this style has worked for you, a lot. That's a strength. It also means you may keep reaching for it even when it isn't working, and that's where you can get worn out.</span>
            <span><b>For {a.top}:</b> {me.strong}</span>
            <button onClick={goTap} style={{ alignSelf: "flex-start", background: "none", border: "none", padding: 0, fontFamily: FONT, fontSize: 13, color: C.ink, textDecoration: "underline", cursor: "pointer" }}>When you're stuck, you might explore another style</button>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, fontSize: 12, lineHeight: 1.45 }}>
          {[["Your preferred style", "Your most likely response to a new issue"], ["Your second preferred style", "Your next most likely response, if your preferred style doesn't fit"], ["Your less-used styles", "The ones you're least likely to reach for, though you can"], ["Your pattern (the dot)", "How you tend to behave over time"]].map(([h, t]) => (
            <div key={h} style={{ border: "1px solid " + C.line, borderRadius: 10, padding: 10 }}><b>{h}</b><br />{t}</div>
          ))}
        </div>
        <div style={{ ...col(6), fontSize: 13, lineHeight: 1.55 }}>
          <b>How far apart your styles are matters</b>
          <span>If your second style is close to your preferred style, moving between them is easy. If there's a big gap, that switch takes more deliberate effort, or help from someone who works from that style.</span>
        </div>
        <div style={{ ...card("transparent", C.neutral), fontSize: 13, lineHeight: 1.55 }}>
          <b>Your profile can change</b>
          <span>Your profile reflects the strategies that work for you right now, and it can change. Profiles can shift with life changes, like a new job or a major life event, or when you choose to develop a style to reach a goal. Whatever the reason, your profile describes where you are right now.</span>
        </div>
      </div>

      {!a.isBal && (
        <div style={card(C.line, C.soft)}>
          <b style={{ fontSize: 14 }}>Most people don't process information the way you do</b>
          <p style={p13}>About {me.share}% of people share your preferred style. That means roughly {100 - me.share} out of every 100 people you work with take in information differently and think about time, detail, and risk differently than you do. What feels obvious to you may not be obvious to them.</p>
        </div>
      )}

      <div style={{ ...card(me.border), padding: 16, gap: 10 }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12 }}>
          <span><b>Key idea:</b> {me.key}</span>
          <span><b>Motto:</b> "{me.motto}"</span>
        </div>
        <p style={p14}>{me.desc}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, fontSize: 12, lineHeight: 1.5 }}>
          {[["What you bring", me.bring], ["Something to notice", me.watch], ["What motivates you", me.motivates], ["Your gift to the team", me.gift]].map(([h, t]) => (
            <div key={h} style={{ background: C.soft, borderRadius: 10, padding: 10 }}><b style={{ color: me.color }}>{h}</b><br />{t}</div>
          ))}
        </div>
      </div>

      <div style={{ border: "1px dashed " + C.pillLine, borderRadius: 16, padding: 16, ...col(8) }}>
        <b style={{ fontSize: 14 }}>What stood out?</b>
        <label htmlFor="reflect" style={{ fontSize: 12, color: C.sub }}>What do you love about your results? What made you think "hmm"? Notice one thing about how you process information this week.</label>
        <textarea id="reflect" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Private notes (not saved yet in this test version)" style={textarea} />
        <span style={{ fontSize: 12, color: C.muted }}>You might share one of these with someone on your team.</span>
      </div>
    </div>
  );
}

function CommTips({ a }: any) {
  const order = [a.top as Code].concat(ORDER.filter(c => c !== a.top));
  return (
    <div style={col(12)}>
      <p style={{ ...p13, color: C.sub }}>What tends to work with each style. Yours is first, so you can share it with your team if you'd like.</p>
      {order.map(c => {
        const s = STY[c]; const mine = c === a.top;
        return (
          <div key={c} style={card(s.border, mine ? s.light : "#FFFFFF")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <b style={{ color: s.color, fontSize: 15 }}>What tends to work with an {c}</b>
              {mine && <span style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", background: s.color, color: "#FFFFFF", borderRadius: 10, padding: "3px 8px" }}>What works with me</span>}
            </div>
            <span style={{ fontSize: 12 }}><b>Words that land:</b> {s.words}</span>
            {s.tips.map((t: string) => <div key={t} style={{ display: "flex", gap: 8, fontSize: 13, lineHeight: 1.45 }}><span style={{ color: s.color }}>•</span><span>{t}</span></div>)}
          </div>
        );
      })}
      <div style={card()}>
        <b style={{ fontSize: 15 }}>What tends to work with each pattern</b>
        {PATTERN_TIPS.map(p => <div key={p.name} style={{ fontSize: 13, lineHeight: 1.5 }}><b>{p.name}</b> ({p.combo}): {p.tip}</div>)}
      </div>
    </div>
  );
}

function Behavior({ a }: any) {
  const me = STY[a.top as Code];
  const order = [a.top as Code].concat(ORDER.filter(c => c !== a.top));
  return (
    <div style={col(14)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><b style={{ fontSize: 18 }}>Behavior</b><PrintButton /></div>
      <p style={p14}>Behavior is what others see. It's the only part of you that's visible to anyone else, and it drives other people's emotional reactions to you.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, textAlign: "center", fontSize: 12, lineHeight: 1.4 }}>
        <div style={{ background: me.light, borderRadius: 12, padding: 10 }}><b>Behavior</b><br />What others see</div>
        <div style={{ background: C.soft, borderRadius: 12, padding: 10 }}><b>Emotions</b><br />A physical reaction</div>
        <div style={{ background: C.soft, borderRadius: 12, padding: 10 }}><b>Feelings</b><br />The story we tell</div>
      </div>
      <div style={col(8)}>
        <span style={label}>Your behavioral characteristics</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {me.traits.map((t: string) => <span key={t} style={{ background: me.light, border: "1px solid " + me.border, color: me.color, borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: "bold" }}>{t}</span>)}
        </div>
      </div>
      <div style={col(8)}>
        <span style={label}>How your behavior can be read</span>
        <p style={{ ...p13, color: C.sub }}>The same behavior can land well or badly, depending on the other person's style and the moment.</p>
        {order.map(c => {
          const s = STY[c]; const mine = c === a.top;
          return (
            <div key={c} style={{ borderRadius: 12, padding: "10px 12px", background: mine ? s.light : "#FFFFFF", border: "1px solid " + (mine ? s.border : C.line) }}>
              <b style={{ color: s.color, fontSize: 13 }}>{c}{mine ? " (you)" : ""}</b>
              <div style={{ fontSize: 12, lineHeight: 1.5, marginTop: 4 }}><b>Lands well:</b> {s.good}</div>
              <div style={{ fontSize: 12, lineHeight: 1.5 }}><b>Causes friction:</b> {s.bad}</div>
            </div>
          );
        })}
      </div>
      <div style={{ ...card("transparent", C.soft), fontSize: 13, lineHeight: 1.55 }}>
        <b>Why reactions can feel so strong</b>
        <span>The bigger the difference between your profile and someone else's, the more intense the reaction can be. And the stronger your preferred style, the stronger your response may be.</span>
        <span>Doing things your way over time proves it works, so it starts to feel like the right way. PeopleGro calls this rightness blindness.</span>
      </div>
      <p style={{ ...p13, fontStyle: "italic", color: C.sub }}>Which of these words would the people you work with use to describe you this week?</p>
    </div>
  );
}

function Change({ a }: any) {
  const me = STY[a.top as Code];
  const [vals, setVals] = useState<number[]>(ASSESS.map(() => 4));
  const [chg, setChg] = useState("");
  return (
    <div style={col(14)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><b style={{ fontSize: 18 }}>Change</b><PrintButton /></div>
      <p style={p14}>Change is personal. Always. It often feels painful because it's easier to see what's going than what's coming. Every style can help at any point in a change, and every style can struggle.</p>
      <div style={{ border: "2px solid " + me.border, borderRadius: 16, padding: 16, ...col(12) }}>
        <b style={{ fontSize: 16, color: me.color }}>Your Change Snowflake ({a.top})</b>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          <div style={{ background: me.light, borderRadius: 12, padding: 12, ...col(6) }}><b style={{ fontSize: 13 }}>Strengths in change</b>{me.snowS.map((t: string) => <span key={t} style={{ fontSize: 12, lineHeight: 1.4 }}>{t}</span>)}</div>
          <div style={{ background: C.neutral, borderRadius: 12, padding: 12, ...col(6) }}><b style={{ fontSize: 13 }}>Challenges in change</b>{me.snowC.map((t: string) => <span key={t} style={{ fontSize: 12, lineHeight: 1.4 }}>{t}</span>)}</div>
        </div>
        <span style={{ fontSize: 11, color: C.muted }}>Change Snowflake © Professional Communications Inc.</span>
      </div>
      <div style={{ ...card(me.border, me.light), fontSize: 13, lineHeight: 1.55, gap: 4 }}>
        <b style={{ color: me.color }}>How you navigate change</b>
        <span><b>You look for:</b> {me.changeLook}</span>
        <span><b>You bring:</b> {me.changeBring}</span>
        <span><b>Your pattern ({a.pattern}):</b> {PCHANGE[a.pattern] || "You may draw on different patterns depending on the change."}</span>
      </div>
      <span style={label}>Common reactions to change: the 4 D's</span>
      {DEES.map(d => (
        <div key={d.name} style={{ ...card(), fontSize: 12, lineHeight: 1.5, gap: 3 }}>
          <b style={{ fontSize: 14 }}>{d.name}</b>
          <span><b>What it can look like:</b> {d.looks}</span>
          <span><b>You might hear:</b> {d.hear}</span>
          <span><b>What can help:</b> {d.helps}</span>
        </div>
      ))}
      <span style={{ fontSize: 11, color: C.muted }}>The 4 D's come from Aftershock: Helping People Through Corporate Change, by Woodward and Buchholz.</span>
      <div style={{ border: "1px solid " + C.pillLine, borderRadius: 16, padding: 16, ...col(12) }}>
        <b style={{ fontSize: 16 }}>PeopleGro Change Assessment</b>
        <label htmlFor="chg" style={{ fontSize: 13, color: C.sub }}>Think of a change you're going through right now.</label>
        <input id="chg" type="text" value={chg} onChange={e => setChg(e.target.value)} placeholder="The change I'm thinking about" style={{ ...textarea, resize: undefined }} />
        <span style={{ fontSize: 12, color: C.sub }}>For each line, pick the number from 0 to 10 that best describes how you feel about this change.</span>
        {ASSESS.map(([l, r], i) => (
          <div key={l} style={col(4)}>
            <label htmlFor={"as" + i} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 12, color: C.sub }}><span>{l}</span><span style={{ fontWeight: "bold", color: C.ink }}>{vals[i]}</span><span style={{ textAlign: "right" }}>{r}</span></label>
            <input id={"as" + i} type="range" min={0} max={10} step={2} value={vals[i]} onChange={e => { const n = vals.slice(); n[i] = Number(e.target.value); setVals(n); }} style={{ width: "100%", accentColor: C.ink }} />
          </div>
        ))}
        <div style={{ ...card("transparent", C.neutral), fontSize: 13, lineHeight: 1.6 }}>Could your processing style be at play? Are you in a D, big or little? What story are you telling yourself? Do you need a Jackalope?</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Working With tab
// ---------------------------------------------------------------------------
function WorkingWithTab({ a, view, setView }: any) {
  const [lens, setLens] = useState("Risk");
  const me = STY[a.top as Code];
  const tapOrder = [a.second as Code].concat(ORDER.filter(c => c !== a.top && c !== a.second));
  return (
    <div style={col(16)}>
      <div style={col(4)}>
        <b style={{ fontSize: 20, color: C.ink }}>Working With</b>
        <span style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>How your profile shows up with other people, and how to tap into the styles you use less, on your own or with a Jackalope.</span>
      </div>
      <Pills items={[["see", "How each style sees things"], ["tap", "Tap into"], ["stress", "Stress & listening"], ["talk", "Talking to each style"], ["patterns", "Patterns"]]} value={view} onChange={setView} />

      {view === "see" && (
        <div style={col(10)}>
          <p style={p14}>Each style sees time, detail, and risk differently. Pick a point to compare all four. Your preferred style is highlighted.</p>
          <Pills items={["Question", "Time", "Detail", "Risk", "Motto"].map(l => [l, l]) as [string, string][]} value={lens} onChange={setLens} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
            {ORDER.map(c => {
              const s = STY[c]; const mine = c === a.top;
              const t = lens === "Question" ? s.q : lens === "Motto" ? s.motto : s[lens];
              return <div key={c} style={{ borderRadius: 12, padding: "10px 12px", background: mine ? s.light : "#FFFFFF", border: mine ? "2px solid " + s.color : "1px solid " + C.line }}><b style={{ color: s.color, fontSize: 12 }}>{c}{mine ? " (you)" : ""}</b><div style={{ fontSize: 13, lineHeight: 1.45, marginTop: 3 }}>{t}</div></div>;
            })}
          </div>
        </div>
      )}

      {view === "tap" && (
        <div style={col(12)}>
          <p style={p14}>Your preferred style is a good place to start. If it isn't getting the results you want, one option is to tap into a different approach. You might do that on your own, or reach out to a Jackalope: someone who shows up with wisdom, courage, and honest feedback, and who works from the style you need. Using a style outside your preferred style takes more energy, and that's normal.</p>
          {tapOrder.map(c => {
            const s = STY[c];
            return (
              <div key={c} style={card(s.border)}>
                <b style={{ color: s.color, fontSize: 15 }}>Tap into {c} when...</b>
                <span style={{ fontSize: 13, lineHeight: 1.5 }}>{s.when}</span>
                <div style={{ background: s.light, borderRadius: 10, padding: 10, fontSize: 13, lineHeight: 1.5 }}><b>What it might look like:</b> {s.looks}</div>
              </div>
            );
          })}
        </div>
      )}

      {view === "stress" && (
        <div style={col(14)}>
          <div style={{ ...card(me.border, me.light), fontSize: 13, lineHeight: 1.55 }}>
            <b style={{ fontSize: 15, color: me.color }}>Under stress</b>
            <span>Each style tends to show up in a recognizable way under pressure. Knowing what that looks like for you helps you catch it early.</span>
            <span><b>You may:</b> {me.stress}</span>
            <span><b>What triggers it:</b> {me.trigger}</span>
          </div>
          <div style={{ ...card(), fontSize: 13, lineHeight: 1.55 }}>
            <b style={{ fontSize: 15 }}>How you listen</b>
            <span>{me.listen}</span>
            <span><b>Something to consider:</b> {me.listenTry}</span>
          </div>
          <div style={col(6)}>
            <b style={{ fontSize: 14 }}>The 5 levels of listening</b>
            {LEVELS.map(([n, t], i) => (
              <div key={n} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, lineHeight: 1.45 }}>
                <span style={{ minWidth: 24, height: 24, borderRadius: 12, background: C.neutral, color: C.ink, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{i + 1}</span>
                <span><b>{n}:</b> {t}</span>
              </div>
            ))}
            <span style={{ fontSize: 11, color: C.muted }}>Adapted from The Black Swan Group</span>
          </div>
        </div>
      )}

      {view === "talk" && (
        <div style={col(14)}>
          <p style={p14}>The simplest way to talk to any style is to answer their question first.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8, textAlign: "center" }}>
            {ORDER.map(c => <div key={c} style={{ background: STY[c].light, border: "1px solid " + STY[c].border, borderRadius: 12, padding: "10px 6px" }}><b style={{ color: STY[c].color, fontSize: 13 }}>{c}</b><div style={{ fontSize: 18, fontWeight: "bold", marginTop: 2 }}>{STY[c].q}</div></div>)}
          </div>
          <div style={{ background: C.soft, borderRadius: 14, padding: "12px 14px", fontSize: 13, lineHeight: 1.55 }}><b>Team tip:</b> Before a big decision, you might ask all four out loud. When will we act? How will it work? What are we doing, and what if it changes? Why this option? If one has no good answer yet, you've found the gap.</div>
          <b style={{ fontSize: 15 }}>From you ({a.top}) to each style</b>
          <span style={{ fontSize: 12, color: C.sub }}>Slow down and make sure your words mean the same thing to them. Slower is faster.</span>
          {ORDER.map(c => <div key={c} style={{ border: "1px solid " + STY[c].border, borderRadius: 14, padding: "12px 14px", fontSize: 13, lineHeight: 1.5 }}><b style={{ color: STY[c].color }}>To {c === a.top ? "another" : "an"} {c} ({STY[c].q})</b><br />{TO[a.top as Code][c]}</div>)}
        </div>
      )}

      {view === "patterns" && (
        <div style={col(12)}>
          <p style={p14}>Your strategic pattern is the combination of your preferred style and second preferred style. It describes how you tend to work and lead over time.</p>
          {PATTERNS.map(p => {
            const mine = a.pattern.indexOf(p.name) >= 0;
            return (
              <div key={p.name} style={{ ...col(6), borderRadius: 14, padding: "12px 14px", background: mine ? C.neutral : "#FFFFFF", border: mine ? "2px solid " + C.ink : "1px solid " + C.line }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><b style={{ fontSize: 15 }}>{p.name} ({p.combo})</b><span style={{ fontSize: 12, color: C.muted }}>{p.share}% of people</span></div>
                <span style={{ fontSize: 13, lineHeight: 1.5 }}>{p.desc}</span>
                <span style={{ fontSize: 13, lineHeight: 1.5 }}><b>Something to notice:</b> {p.watch}</span>
              </div>
            );
          })}
          <b style={{ fontSize: 15, marginTop: 6 }}>Working across styles</b>
          {PAIRS.map(([pair, text]) => <div key={pair} style={{ fontSize: 13, lineHeight: 1.5, borderRadius: 10, padding: "9px 12px", background: pair.indexOf(a.top) >= 0 ? me.light : C.soft }}><b>{pair}</b> {text}</div>)}
          <span style={{ fontSize: 12, color: C.sub }}>Sharing a style means you use words the same way. It doesn't mean you'll agree, and misfires still happen.</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Practice tab
// ---------------------------------------------------------------------------
function PracticeTab() {
  const [deeper, setDeeper] = useState(false);
  const [stuck, setStuck] = useState<Record<string, boolean>>({});
  const banner = (t: string, s: string) => <div style={{ ...col(2), background: C.neutral, borderRadius: 12, padding: "10px 14px" }}><b style={{ fontSize: 15, color: C.ink }}>{t}</b><span style={{ fontSize: 12, color: C.sub }}>{s}</span></div>;
  const step = (id: string, n: number, title: string, hint: string) => (
    <div key={id} style={col(6)}>
      <label htmlFor={id} style={{ fontSize: 14, fontWeight: "bold" }}>{n}. {title}</label>
      <span style={{ fontSize: 12, color: C.sub }}>{hint}</span>
      <textarea id={id} rows={2} style={textarea} />
    </div>
  );
  return (
    <div style={col(14)}>
      <div style={col(6)}>
        <b style={{ fontSize: 20, color: C.ink }}>Practice</b>
        <p style={p14}>When we think we're reacting to someone else's behavior, we're usually reacting to our own emotions and the story we've attached to them. That story happens fast, often with no proof. Slower is faster. This is a place to slow it down.</p>
        <span style={{ fontSize: 12, color: C.muted }}>Everything you write here is private to you. (In this test version, notes aren't saved yet.)</span>
      </div>
      {banner("Self-Awareness", "Notice what happened, how you reacted, and the story you're telling.")}
      {step("q1", 1, "What was the behavior?", "What did they actually do or say? Stick to what a camera would have caught.")}
      {step("q2", 2, "What was your reaction?", "What did you notice in your body? Your body is an early warning system.")}
      {step("q3", 3, "What story are you telling yourself?", "What did you decide their behavior meant, about them, you, or the situation?")}
      {banner("Self-Management", "Choose what you'll do next.")}
      {step("q4", 4, "What's one thing you could explore doing differently?", "Small is fine.")}
      {!deeper && <button onClick={() => setDeeper(true)} style={{ alignSelf: "flex-start", background: "#FFFFFF", color: C.ink, border: "2px solid " + C.ink, borderRadius: 22, padding: "11px 18px", fontFamily: FONT, fontSize: 14, cursor: "pointer" }}>Does this keep happening? Go deeper</button>}
      {deeper && (
        <div style={{ ...col(14), borderTop: "2px solid " + C.line, paddingTop: 14 }}>
          <b style={{ ...label, color: C.ink, fontSize: 13 }}>Self-Awareness: going deeper</b>
          <b style={{ fontSize: 16 }}>5. Where might you be stuck?</b>
          <span style={{ fontSize: 13, lineHeight: 1.55, color: C.sub }}>Mental models work like a pane of glass, framing and quietly distorting what we see. Do any of these feel like they might be at play?</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {STUCK.map(([n]) => <button key={n} aria-pressed={!!stuck[n]} onClick={() => setStuck({ ...stuck, [n]: !stuck[n] })} style={{ ...pillStyle(!!stuck[n]), fontSize: 12 }}>{n}</button>)}
          </div>
          {STUCK.filter(([n]) => stuck[n]).map(([n, q]) => <div key={n} style={{ background: C.neutral, borderRadius: 12, padding: "10px 12px", fontSize: 13, lineHeight: 1.5 }}><b>{n}:</b> {q}</div>)}
          <b style={{ fontSize: 16 }}>6. Is processing style at play?</b>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, fontSize: 12, lineHeight: 1.4 }}>
            <div style={{ border: "1px solid " + C.line, borderRadius: 12, padding: 10 }}><b>How do they take in information?</b><br />Step by step / They jump around and make connections</div>
            <div style={{ border: "1px solid " + C.line, borderRadius: 12, padding: 10 }}><b>What do they do with it?</b><br />Act and get things done / Think and plan first</div>
          </div>
          <span style={{ fontSize: 12, color: C.sub }}>Check: do they usually ask When, How, What, or Why first? The Working With tab shows how your style and theirs tend to work together.</span>
          <b style={{ ...label, color: C.ink, fontSize: 13 }}>Self-Management: going deeper</b>
          <b style={{ fontSize: 16 }}>7. The four questions</b>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>What do I want for myself? For the other person? For our relationship? For our team or organization?</div>
          <b style={{ fontSize: 16 }}>8. Is there one thing you'd like to experiment with?</b>
          <label htmlFor="exp" style={{ fontSize: 12, color: C.sub }}>Is it a reflection of who you are and who you want to be?</label>
          <textarea id="exp" rows={2} placeholder="One thing I'll try" style={textarea} />
        </div>
      )}
      <div style={{ background: C.soft, borderRadius: 14, padding: "12px 14px", fontSize: 13, lineHeight: 1.55, fontStyle: "italic" }}>Individual intent is not being questioned. Style explains behavior. It doesn't excuse it. Would another view help? A Jackalope can be a good person to talk it through with.</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reports and Resources
// ---------------------------------------------------------------------------
function ReportsTab({ a, email }: any) {
  const [state, setState] = useState<Record<string, "idle" | "loading" | "missing">>({});
  const download = async (kind: string) => {
    setState(st => ({ ...st, [kind]: "loading" }));
    const { data, error } = await supabase.storage.from("reports").createSignedUrl(email + "-" + kind + ".pdf", 120);
    if (error || !data?.signedUrl) { setState(st => ({ ...st, [kind]: "missing" })); return; }
    setState(st => ({ ...st, [kind]: "idle" }));
    window.open(data.signedUrl, "_blank", "noopener");
  };
  const reports: [string, string, string][] = [
    ["individual", "Your I-OPT Individual Analysis Report", "Your full I-OPT report from PCI, the one PeopleGro walked you through in your session."],
    ["change", "Your Change Management Report", "How your processing style shows up in change, from PCI."],
  ];
  return (
    <div style={col(14)}>
      <b style={{ fontSize: 20, color: C.ink }}>Reports</b>
      {reports.map(([kind, title, desc]) => (
        <div key={kind} style={{ border: "2px solid " + C.line, borderRadius: 16, padding: 18, ...col(10) }}>
          <b style={{ fontSize: 16 }}>{title}</b>
          <span style={{ fontSize: 13, lineHeight: 1.55, color: C.sub }}>{desc}</span>
          <button onClick={() => download(kind)} disabled={state[kind] === "loading"} style={{ alignSelf: "flex-start", background: C.ink, color: "#FFFFFF", border: "none", borderRadius: 22, padding: "12px 18px", fontFamily: FONT, fontSize: 14, cursor: "pointer" }}>{state[kind] === "loading" ? "Getting your report…" : "Download PDF"}</button>
          {state[kind] === "missing" && <span style={{ fontSize: 12, color: C.sub }}>This report isn't available here yet. Please reach out to your PeopleGro facilitator.</span>}
        </div>
      ))}
      <div style={card()}>
        <b style={{ fontSize: 15 }}>Your summary</b>
        <span style={{ fontSize: 13, lineHeight: 1.6 }}><b>Preferred style:</b> {a.isBal ? "No single preferred style" : a.top + ", " + STY[a.top as Code].name}</span>
        <span style={{ fontSize: 13, lineHeight: 1.6 }}><b>Profile type:</b> {a.type}</span>
        <span style={{ fontSize: 13, lineHeight: 1.6 }}><b>Pattern:</b> {a.pattern}</span>
        <span style={{ fontSize: 13, lineHeight: 1.6 }}><b>Your question:</b> {STY[a.top as Code].q}</span>
      </div>
    </div>
  );
}

function ResourcesTab() {
  const [open, setOpen] = useState("");
  return (
    <div style={col(14)}>
      <b style={{ fontSize: 20, color: C.ink }}>PeopleGro Resources</b>
      <span style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>Key PeopleGro concepts, tools, and videos from the classes. Tap any one to open it.</span>
      {RESOURCES.map(r => {
        const on = open === r.id;
        return (
          <div key={r.id} style={{ border: "1px solid " + C.line, borderRadius: 14, overflow: "hidden" }}>
            <button onClick={() => setOpen(on ? "" : r.id)} aria-expanded={on} style={{ width: "100%", background: on ? C.neutral : "#FFFFFF", border: "none", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer", fontFamily: FONT, color: C.ink, minHeight: 56 }}>
              <span style={col(3)}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><b style={{ fontSize: 15 }}>{r.t}</b><span style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", border: "1px solid " + C.pillLine, borderRadius: 10, padding: "2px 7px", color: C.sub }}>{r.kind}</span></span>
                <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.4 }}>{r.d}</span>
              </span>
              <span style={{ fontSize: 12, whiteSpace: "nowrap", textDecoration: "underline" }}>{on ? "Close" : "Open"}</span>
            </button>
            {on && (
              <div style={{ padding: "4px 16px 16px", ...col(10), fontSize: 13, lineHeight: 1.6 }}>
                {(r.videos || []).map(v => (
                  <div key={v.id} style={col(4)}>
                    <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 10, overflow: "hidden", background: C.ink }}>
                      <iframe src={"https://player.vimeo.com/video/" + v.id} title={v.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
                    </div>
                    <span style={{ fontSize: 12, color: C.sub }}>{v.title}{v.note ? " (" + v.note + ")" : ""}</span>
                  </div>
                ))}
                {(r.imgs || []).map(im => <img key={im.src} src={im.src} alt={im.alt} style={{ width: "100%", maxWidth: 440, border: "1px solid " + C.line, borderRadius: 10, background: "#FFFFFF" }} />)}
                {(r.paras || []).map(p => <p key={p} style={{ margin: 0 }}>{p}</p>)}
                {(r.list || []).map(l => <div key={l} style={{ display: "flex", gap: 8 }}><span>•</span><span>{l}</span></div>)}
                {(r.after || []).map(p => <p key={p} style={{ margin: 0 }}>{p}</p>)}
                {(r.links || []).map(l => <a key={l.href} href={l.href} target="_blank" rel="noreferrer" style={{ alignSelf: "flex-start", background: C.ink, color: "#FFFFFF", borderRadius: 20, padding: "10px 16px", textDecoration: "none", fontSize: 13 }}>{l.text}</a>)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shell, sign-in, and app
// ---------------------------------------------------------------------------
const shell = (children: any) => (
  <div style={{ minHeight: "100vh", background: C.page, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 12px", fontFamily: FONT, color: C.text, boxSizing: "border-box" }}>
    <div style={{ width: "100%", maxWidth: 520, background: "#FFFFFF", borderRadius: 28, boxShadow: "0 16px 64px rgba(0,0,0,0.10)", overflow: "hidden" }}>{children}</div>
  </div>
);
const footer = <div style={{ borderTop: "1px solid " + C.line, background: C.soft, padding: "10px 22px", fontSize: 11, color: C.muted, textAlign: "center" }}>© 2026 PeopleGro, LLC &amp; Professional Communications Inc</div>;

function SignIn() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState("");
  const send = async () => {
    if (!email.trim()) return;
    setStatus("sending"); setErr("");
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim().toLowerCase(), options: { emailRedirectTo: window.location.origin } });
    if (error) { setStatus("error"); setErr(error.message); } else setStatus("sent");
  };
  return shell(
    <>
      <div style={{ padding: "28px 26px 32px" }}>
        <Logo />
        <h2 style={{ fontSize: 20, color: C.ink, margin: "22px 0 6px" }}>Sign in</h2>
        {status === "sent" ? (
          <div style={{ background: C.neutral, borderRadius: 14, padding: "14px 16px", fontSize: 13, lineHeight: 1.6 }}>Check your inbox. We sent a sign-in link to <strong>{email.trim()}</strong>. Open it on this device to continue.</div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: C.sub, margin: "0 0 16px", lineHeight: 1.6 }}>Enter your work email and we'll send you a link. No password needed.</p>
            <label htmlFor="email" style={{ fontSize: 12, color: C.sub }}>Email</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="you@company.com" style={{ width: "100%", border: "1.5px solid " + C.line, borderRadius: 12, padding: "12px 14px", fontSize: 14, fontFamily: FONT, boxSizing: "border-box", margin: "4px 0 10px" }} />
            <button onClick={send} disabled={status === "sending"} style={{ width: "100%", padding: 13, borderRadius: 14, fontSize: 14, fontWeight: "bold", background: status === "sending" ? "#9AA39C" : C.ink, color: "#FFFFFF", border: "none", cursor: "pointer", fontFamily: FONT }}>{status === "sending" ? "Sending…" : "Email me a sign-in link"}</button>
            {status === "error" && <p style={{ fontSize: 12, color: "#991B1B", marginTop: 10 }}>{err}</p>}
          </>
        )}
      </div>
      {footer}
    </>
  );
}

function Message({ title, body, onSignOut }: any) {
  return shell(
    <div style={{ padding: "28px 26px 32px" }}>
      <Logo />
      <h2 style={{ fontSize: 18, color: C.ink, margin: "22px 0 8px" }}>{title}</h2>
      <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.6, margin: "0 0 16px" }}>{body}</p>
      {onSignOut && <button onClick={onSignOut} style={{ background: "none", border: "1.5px solid " + C.line, borderRadius: 12, padding: "8px 14px", fontSize: 12, color: C.ink, cursor: "pointer", fontFamily: FONT }}>Sign out</button>}
    </div>
  );
}

const TABS = ["Profile", "Working With", "Practice", "Reports", "Resources", "Team", "Coach"];

export default function App() {
  const [tab, setTab] = useState("Profile");
  const [wwView, setWwView] = useState("see");
  const [session, setSession] = useState<any>(undefined);
  const [me, setMe] = useState<IoptRow | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const email = session?.user?.email?.toLowerCase();
  useEffect(() => {
    if (!email) { setMe(undefined); return; }
    supabase.from("iopt_profiles").select("*").then(({ data }) => {
      const all = (data || []) as IoptRow[];
      setMe(all.find(r => r.email.toLowerCase() === email) || null);
    });
  }, [email]);

  const signOut = () => supabase.auth.signOut();

  if (!supabaseConfigured) return <Message title="Setup needed" body="This app is not connected to its database yet. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in Vercel." />;
  if (session === undefined || (session && me === undefined)) return <Message title="Loading…" body="One moment." />;
  if (!session) return <SignIn />;
  if (me === null) return <Message title="No profile yet" body={"We couldn't find an I-OPT profile for " + email + ". If you've taken the assessment, please contact your PeopleGro facilitator to get it added."} onSignOut={signOut} />;

  const sc: Record<Code, number> = { RS: Number(me!.rs), LP: Number(me!.lp), RI: Number(me!.ri), HA: Number(me!.ha) };
  const a = analyze(sc);
  const goTap = () => { setTab("Working With"); setWwView("tap"); };

  return shell(
    <>
      <div style={{ padding: "16px 22px 12px", borderBottom: "2px solid #C4DFB0", ...col(6) }}>
        <Logo />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted }}>
          <span style={{ fontStyle: "italic" }}>{me!.first_name}</span>
          <button onClick={signOut} style={{ background: "none", border: "none", color: C.muted, fontSize: 11, cursor: "pointer", textDecoration: "underline", fontFamily: FONT, padding: 0 }}>Sign out</button>
        </div>
      </div>
      <div style={{ display: "flex", borderBottom: "1px solid " + C.line, background: C.soft }}>
        {TABS.map(t => {
          const dis = t === "Team" || t === "Coach"; const on = tab === t;
          return (
            <button key={t} disabled={dis} onClick={() => !dis && setTab(t)} style={{ flex: "1 1 0", minWidth: 0, padding: "10px 2px", minHeight: 48, fontFamily: FONT, fontSize: 11, lineHeight: 1.2, background: dis ? "#EEF0EE" : "none", border: "none", borderBottom: "3px solid " + (on ? C.ink : "transparent"), color: dis ? "#5C655E" : on ? C.text : C.muted, fontWeight: on ? "bold" : "normal", cursor: dis ? "not-allowed" : "pointer" }}>
              <span style={{ display: "block" }}>{t}</span>
              {dis && <span style={{ display: "block", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>Coming soon</span>}
            </button>
          );
        })}
      </div>
      <div style={{ padding: "20px 22px 28px" }}>
        {tab === "Profile" && <ProfileTab sc={sc} a={a} goTap={goTap} />}
        {tab === "Working With" && <WorkingWithTab a={a} view={wwView} setView={setWwView} />}
        {tab === "Practice" && <PracticeTab />}
        {tab === "Reports" && <ReportsTab a={a} email={email} />}
        {tab === "Resources" && <ResourcesTab />}
      </div>
      {footer}
    </>
  );
}
