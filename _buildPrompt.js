const { TEMPLATE } = require("./_promptTemplate");

const fmt = (n) => {
  const v = Number(n);
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
};

function scoreLine(p) {
  return `RS ${fmt(p.rs)}, LP ${fmt(p.lp)}, RI ${fmt(p.ri)}, HA ${fmt(p.ha)}`;
}

function isSplit(p) {
  const s = [p.rs, p.lp, p.ri, p.ha].map(Number).sort((a, b) => b - a);
  return s[0] - s[1] <= 5;
}

// Builds the full Coach system prompt for one signed-in person.
// `me` and `team` are rows from public.iopt_profiles.
function buildSystemPrompt(me, team) {
  let prompt = TEMPLATE
    .replace("{{firstName}}", me.first_name)
    .replace("{{RS}}", fmt(me.rs))
    .replace("{{LP}}", fmt(me.lp))
    .replace("{{RI}}", fmt(me.ri))
    .replace("{{HA}}", fmt(me.ha))
    .replace(
      "Dominant style: {{dominant}} Secondary style: {{secondary}} Strategic pattern: {{pattern}}",
      `Dominant style: ${me.dominant}\nSecondary style: ${me.secondary}\nStrategic pattern: ${me.pattern}`
    );

  const others = (team || []).filter((t) => t.email.toLowerCase() !== me.email.toLowerCase());
  if (others.length > 0) {
    const lines = others.map(
      (t) =>
        `- ${t.first_name}${t.last_name ? " " + t.last_name : ""}: ${scoreLine(t)}. Dominant ${t.dominant}, secondary ${t.secondary}, pattern ${t.pattern}${isSplit(t) ? " (split style)" : ""}.`
    );
    const teamSection =
      `\n\n${me.first_name.toUpperCase()}'S TEAM (${me.team})\n\n` +
      `${me.first_name} works with the people below, and you know their actual I-OPT scores. ` +
      `When ${me.first_name} mentions one of them by name, use that person's real scores and name the specific style dynamic between them. ` +
      `Do not ask for the style of anyone listed here. For anyone not listed, ask what style they are if ${me.first_name} has not said.\n\n` +
      lines.join("\n");
    prompt = prompt.replace("\n\nTHE I-OPT FRAMEWORK", teamSection + "\n\nTHE I-OPT FRAMEWORK");
  }
  return prompt;
}

module.exports = { buildSystemPrompt };
