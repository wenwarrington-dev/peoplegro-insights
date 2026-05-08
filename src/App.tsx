import { useState, useRef, useEffect } from "react";

const G = {
  green: "#578B38", greenDark: "#3D6425", greenPale: "#EDF4E6",
  greenBorder: "#C4DFB0", red: "#B01B43", charcoal: "#455048",
  charcoalLight: "#6B7B6E", offWhite: "#F8FAF6", border: "#DDE8D8",
};

const STYLES: any = {
  RS: {
    label: "Reactive Stimulator", color: "#C2410C", light: "#FFF7ED", border: "#FED7AA",
    motto: "He who hesitates is lost!", emoji: "⚡",
    gift: "Keeps things moving and helps teams get unstuck",
    focus: "Quick action and forward movement",
    description: "Acts with minimal information, highly adaptable. Moves A→E→B→Z — associative, inductive thinking.",
    strengths: "Speed, decisiveness, adaptability, momentum, getting things started",
    challenges: "May skip details, struggle with follow-through, can create chaos",
    motivators: "Autonomy, fast feedback, variety, short bursts, freedom to act",
    commTips: ["Concentrate on major points — give details only on request","Focus on near-term action — give logic only if required","Pace delivery rapidly — use short and intense bursts","Motivate with emotion — be demonstrative, use emphasis","Hold brief, frequent sessions — RS tend to bore easily","Do not expect long retention","Tell what is wanted — expect fast action"],
    leaderStyle: "Catalytic — sparks energy, creates urgency, pushes teams into action",
    snowflake: ["Opportunity Oriented","High Intensity","Volatility Tolerant","Flexible Focus","Short Range Horizon","Decisive","Fast Execution","Rapid Response","Action Oriented"],
    cultural: ["Assertive & Confident","Short-Term Future","Fast Impulsive Decisions","Uncertainty Tolerant","Tangible Outcome = Success","Individualism","Trust Quickly Given"],
  },
  LP: {
    label: "Logical Processor", color: "#1D4ED8", light: "#EFF6FF", border: "#BFDBFE",
    motto: "Do it once, do it right!", emoji: "🔬",
    gift: "Ensures quality, consistency, and operational excellence",
    focus: "Structure, planning, and operationalizing tasks",
    description: "Detail-oriented, low risk tolerance, sequential execution. Moves A→B→C→D — structured, deductive logic.",
    strengths: "Precision, thoroughness, critical thinking, quality control, reliable systems",
    challenges: "May over-analyze, slow to decide under pressure, can seem detached",
    motivators: "Accuracy, clear expectations, time to process, evidence-based decisions",
    commTips: ["Be logical, internally consistent — be unemotional in delivery","Expect skepticism — offset with visible integrity","Use extensive operational details — what is and will happen","Justify changes — show HOW things will be better","Hold long intensive sessions — LP do not bore easily","Prepare for challenges — expect to be tested","Expect change to take time — LP like to be sure"],
    leaderStyle: "Methodical — sets high standards, builds reliable systems, holds the quality bar",
    snowflake: ["Analytically Oriented","High Certainty of Outcome","Contemplative","High Rule/Norm Compliance","Hesitantly Decisive","Comprehensive Planning","High Conceptual Detail","Project Level Horizon"],
    cultural: ["Thoughtful & Reflective","Strategic Horizon","Logic-Based Decisions","Uncertainty Intolerant","Complete Understanding = Success","Tradition Respected","Trust via Intellectual Consistency"],
  },
  RI: {
    label: "Relational Innovator", color: "#047857", light: "#ECFDF5", border: "#A7F3D0",
    motto: "There is always a better way!", emoji: "🌱",
    gift: "Generates unique ideas and fosters creative solutions",
    focus: "Innovation and finding better ways through people",
    description: "Big-picture, optimistic, comfortable with ambiguity. Always reconsidering — I'll do this, no that, no this other thing.",
    strengths: "Innovation, creative collaboration, optimism, fresh perspectives, mission-driven",
    challenges: "May avoid hard decisions, constantly pivoting, struggles with follow-through",
    motivators: "Inclusion, recognition, big ideas, feeling heard, finding a better way",
    commTips: ["Concentrate on major points — give details only on request","Outline major concepts — service, innovation, impact","Pace delivery rapidly — use short and intense bursts","Motivate with emotion — be demonstrative, use emphasis","Explain the what and why of change — less on HOW","Use analogies and comparisons extensively","Condense and focus — RI do not have long attention spans","Expect new ideas — be flexible/adaptive"],
    leaderStyle: "Nurturing & Innovative — builds loyalty, creates safety, always seeking a better way",
    snowflake: ["Innovation Focused","Rapid Idea Generation","Flexible Planning","Mission Oriented","Variable Intensity","Optimistic","Comfortable with Ambiguity"],
    cultural: ["Assertive & Confident","Creative Decisions","People Sensitivity","Cooperative Achievement","Innovation = Success","Trust through Relationship","Team Oriented"],
  },
  HA: {
    label: "Hypothetical Analyzer", color: "#B01B43", light: "#FCEEF3", border: "#F4B8C8",
    motto: "Think!! Then act.", emoji: "🔭",
    gift: "Holds complex systems in mind and excels in systemic thinking",
    focus: "Complete, reasoned understanding before action",
    description: "Data-driven, asks why, comprehensive analysis. Ponders goals, projections, options, org structures simultaneously.",
    strengths: "Long-term strategy, connecting dots, reframing problems, systemic thinking",
    challenges: "Analysis paralysis, hard to pin down, loses interest in execution",
    motivators: "Big ideas, intellectual challenge, freedom to explore, the why behind everything",
    commTips: ["Use consistent presentation — be unemotional in delivery","Outline long-term consequences — even for short-term ideas","Provide a big picture framework — show how it fits in","Expect skepticism — offset with visible integrity","Justify changes — show WHY things will be better","Explain all options considered — miss nothing","Hold long intensive sessions — HA do not bore easily","Expect change to take time — HA like to be sure"],
    leaderStyle: "Visionary — inspires with ideas, challenges the status quo, sees around corners",
    snowflake: ["Analytically Oriented","High Certainty of Outcome","Contemplative","High Rule/Norm Compliance","Comprehensive Planning","Long-Term Horizon","Systemic Thinking","High Conceptual Clarity"],
    cultural: ["Thoughtful & Reflective","Strategic Horizon","Logic-Based Decisions","Uncertainty Intolerant","Complete Understanding = Success","Tradition Respected","Trust via Intellectual Consistency","Conceptual Perfection"],
  },
};

const PATTERNS: any = {
  Performer: { styles: ["RS","LP"], color: "#9A3412", desc: "Task-specific, action oriented, focused on tangible achievement. Takes short-range perspective and makes quick, reliable decisions." },
  Conservator: { styles: ["LP","HA"], color: "#1E40AF", desc: "Careful, detail-oriented, skeptical of new situations. Long preparation and careful execution result in consistent quality output." },
  Perfector: { styles: ["HA","RI"], color: "#B01B43", desc: "Generates and values new ideas, but expresses them only after exhaustive consideration of risk and reward. Often found in great advisors." },
  Changer: { styles: ["RI","RS"], color: "#065F46", desc: "Generates new ideas quickly and begins implementing immediately. Experimental strategy, averse to detail, rapid and innovative." },
};

const RESOURCES = [
  { type:"video", title:"Introduction to I-OPT", desc:"PeopleGro foundational overview of the I-OPT framework.", style:"ALL", cat:"Getting Started", url:"http://www.iopt.com/coffee-break-videos.html", dur:"12 min", star:true },
  { type:"video", title:"Team Dynamics & I-OPT", desc:"How to read your team's collective processing style and engineer better collaboration.", style:"ALL", cat:"Team & Leadership", url:"http://www.iopt.com/coffee-break-videos.html", dur:"15 min", star:true },
  { type:"video", title:"The RS in Action", desc:"Understanding the Reactive Stimulator — how they process and what they need.", style:"RS", cat:"Style Deep Dives", url:"http://www.iopt.com/coffee-break-videos.html", dur:"8 min", star:false },
  { type:"video", title:"The LP in Action", desc:"Understanding the Logical Processor — structure, detail, and precision.", style:"LP", cat:"Style Deep Dives", url:"http://www.iopt.com/coffee-break-videos.html", dur:"8 min", star:false },
  { type:"video", title:"The RI in Action", desc:"Understanding the Relational Innovator — innovation, people, and possibility.", style:"RI", cat:"Style Deep Dives", url:"http://www.iopt.com/coffee-break-videos.html", dur:"8 min", star:false },
  { type:"video", title:"The HA in Action", desc:"Understanding the Hypothetical Analyzer — systemic thinking and completeness.", style:"HA", cat:"Style Deep Dives", url:"http://www.iopt.com/coffee-break-videos.html", dur:"8 min", star:false },
  { type:"pdf", title:"Getting Your Way — Communication Strategies", desc:"The official I-OPT Strategic Style Communication guide. Essential reading.", style:"ALL", cat:"Getting Started", url:"#", dur:"", star:true },
  { type:"pdf", title:"I-OPT Snowflake — Behavioral Characteristics", desc:"Selected characteristics of all four strategic styles. Your quick-reference guide.", style:"ALL", cat:"Getting Started", url:"#", dur:"", star:false },
  { type:"pdf", title:"Strategic Patterns Summary", desc:"Performer, Conservator, Perfector, Changer — the four combined patterns explained.", style:"ALL", cat:"Team & Leadership", url:"#", dur:"", star:false },
  { type:"article", title:"Why Teams Spend 16 Hours a Week Miscommunicating", desc:"The $18K cost of non-productive conflict and how I-OPT closes the gap.", style:"ALL", cat:"Team & Leadership", url:"#", dur:"", star:true },
  { type:"article", title:"The PeopleGro Model: How Matters", desc:"Self-awareness and self-management as the foundation of all performance.", style:"ALL", cat:"Getting Started", url:"#", dur:"", star:false },
  { type:"article", title:"Embracing Friction: A New Way to Think About Conflict", desc:"The objective is not to eliminate friction but to embrace and manage it.", style:"ALL", cat:"Team & Leadership", url:"#", dur:"", star:false },
  { type:"link", title:"I-OPT Official Website", desc:"Home of Organizational Engineering by Professional Communications Inc.", style:"ALL", cat:"Getting Started", url:"http://www.iopt.com", dur:"", star:false },
  { type:"link", title:"I-OPT Coffee Break Videos", desc:"Short video series covering all aspects of the I-OPT framework.", style:"ALL", cat:"Getting Started", url:"http://www.iopt.com/coffee-break-videos.html", dur:"", star:false },
];

const REPORT_TYPES = [
  { id:"individual", label:"Individual Profile", icon:"👤", scope:"individual" },
  { id:"sales", label:"Sales Style", icon:"💼", scope:"individual" },
  { id:"change", label:"Change Mgmt", icon:"🔄", scope:"individual" },
  { id:"twoperson", label:"TwoPerson™", icon:"🤝", scope:"team" },
  { id:"team", label:"TeamAnalysis™", icon:"🏢", scope:"team" },
  { id:"leader", label:"LeaderAnalysis™", icon:"🎯", scope:"team" },
];

const TABS = ["Profile","Team","Patterns","Reports","Resources","Coach"];
const TAB_ICONS: any = { Profile:"👤", Team:"👥", Patterns:"🔗", Reports:"📄", Resources:"📚", Coach:"💬" };
const TYPE_ICONS: any = { video:"🎥", pdf:"📄", article:"📝", link:"🔗" };
const TYPE_COLORS: any = { video:"#7C3AED", pdf:G.red, article:G.green, link:G.charcoal };

function dominant(p: any) { return Object.entries(p).sort((a:any,b:any)=>b[1]-a[1])[0][0]; }
function second(p: any) { return Object.entries(p).sort((a:any,b:any)=>b[1]-a[1])[1][0]; }
function getPattern(p: any) {
  const d = dominant(p), s = second(p);
  return Object.entries(PATTERNS).find(([,pat]:any) => pat.styles.includes(d) && pat.styles.includes(s));
}

function Logo() {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <svg width="40" height="40" viewBox="0 0 100 100">
        <path d="M50 18 C50 18 28 36 28 57 C28 70 38 80 50 82 C62 80 72 70 72 57 C72 36 50 18 50 18Z" fill={G.green}/>
        <path d="M50 28 C50 28 16 46 20 72 C22 84 36 90 50 82 C34 74 26 63 30 50 C34 37 50 28 50 28Z" fill={G.charcoal} opacity={0.45}/>
        <path d="M50 28 C50 28 84 46 80 72 C78 84 64 90 50 82 C66 74 74 63 70 50 C66 37 50 28 50 28Z" fill={G.red} opacity={0.85}/>
        <circle cx="50" cy="54" r="9" fill={G.green}/>
        <circle cx="50" cy="50" r="5" fill={G.charcoal} opacity={0.35}/>
      </svg>
      <div>
        <div style={{lineHeight:1.1}}>
          <span style={{fontSize:20,fontWeight:400,color:G.green,fontFamily:"Georgia,serif"}}>people</span>
          <span style={{fontSize:20,fontWeight:700,color:G.charcoal,fontFamily:"Georgia,serif"}}>gro</span>
        </div>
        <div style={{fontSize:9,fontWeight:700,color:G.green,letterSpacing:3,textTransform:"uppercase" as const}}>Insights</div>
      </div>
    </div>
  );
}

function Badge({ style, size="md" }: any) {
  const s = STYLES[style];
  const sz: any = { sm:28, md:42, lg:56 };
  const sz2 = sz[size];
  return (
    <div style={{width:sz2,height:sz2,borderRadius:sz2/2,background:s.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:sz2*0.27,flexShrink:0,letterSpacing:"-0.5px",fontFamily:"Georgia,serif"}}>
      {style}
    </div>
  );
}

function KiteProfile({ profile }: any) {
  const cx=105, cy=105, maxR=80, maxScore=50;
  const angles: any = { RS:-90, LP:0, HA:90, RI:180 };
  const lpos: any = { RS:{lx:cx,ly:cy-maxR-22}, LP:{lx:cx+maxR+24,ly:cy}, HA:{lx:cx,ly:cy+maxR+22}, RI:{lx:cx-maxR-24,ly:cy} };
  const toXY = (st: string, v: number) => {
    const r = (Math.min(v,maxScore)/maxScore)*maxR;
    const a = angles[st]*(Math.PI/180);
    return { x: cx+r*Math.cos(a), y: cy+r*Math.sin(a) };
  };
  const pts = ["RS","LP","HA","RI"].map(st => toXY(st, profile[st]));
  const poly = pts.map(p => p.x+","+p.y).join(" ");
  const sOff: any = { RS:{dx:22,dy:0}, LP:{dx:0,dy:-15}, HA:{dx:-22,dy:0}, RI:{dx:0,dy:15} };
  return (
    <div style={{display:"flex",flexDirection:"column" as const,alignItems:"center",marginBottom:16}}>
      <svg width={260} height={260} viewBox="-20 -20 260 260">
        {[10,20,30,40,50].map(r => {
          const rad = (r/maxScore)*maxR;
          const rpts = ["RS","LP","HA","RI"].map(st => {
            const a = angles[st]*(Math.PI/180);
            return (cx+rad*Math.cos(a))+","+(cy+rad*Math.sin(a));
          }).join(" ");
          return <polygon key={r} points={rpts} fill="none" stroke="#E2E8F0" strokeWidth={r===50?1.5:1}/>;
        })}
        {["RS","LP","HA","RI"].map(st => {
          const a = angles[st]*(Math.PI/180);
          return <line key={st} x1={cx} y1={cy} x2={cx+maxR*Math.cos(a)} y2={cy+maxR*Math.sin(a)} stroke="#D1D5DB" strokeWidth={1} strokeDasharray="3,3"/>;
        })}
        <polygon points={poly} fill={G.green+"1A"} stroke={G.green} strokeWidth={2.5} strokeLinejoin="round"/>
        {["RS","LP","HA","RI"].map(st => {
          const p = toXY(st, profile[st]);
          return <circle key={st} cx={p.x} cy={p.y} r={5} fill={STYLES[st].color} stroke="#fff" strokeWidth={2}/>;
        })}
        {["RS","LP","HA","RI"].map(st => {
          const p = toXY(st, profile[st]);
          const off = sOff[st];
          return <text key={st+"s"} x={p.x+off.dx} y={p.y+off.dy} textAnchor="middle" dominantBaseline="central" fill={STYLES[st].color} fontSize={10} fontWeight="bold" fontFamily="Georgia,serif">{profile[st]}</text>;
        })}
        {[10,20,30,40,50].map(r => (
          <text key={r} x={cx+4} y={cy-((r/maxScore)*maxR)+4} fill="#94A3B8" fontSize={8} fontFamily="Georgia,serif">{r}</text>
        ))}
        {Object.entries(lpos).map(([st,pos]:any) => (
          <g key={st}>
            <circle cx={pos.lx} cy={pos.ly} r={15} fill={STYLES[st].color}/>
            <text x={pos.lx} y={pos.ly} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={11} fontWeight="bold" fontFamily="Georgia,serif">{st}</text>
          </g>
        ))}
      </svg>
      <div style={{display:"flex",gap:12,flexWrap:"wrap" as const,justifyContent:"center"}}>
        {Object.entries(STYLES).map(([st,sv]:any) => (
          <div key={st} style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:9,height:9,borderRadius:5,background:sv.color}}/>
            <span style={{fontSize:11,color:G.charcoal,fontWeight:"bold"}}>{st}</span>
            <span style={{fontSize:11,color:G.charcoalLight}}>{profile[st]}/50</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreInput({ profile, setProfile }: any) {
  return (
    <div style={{background:G.offWhite,border:"1px solid "+G.border,borderRadius:14,padding:"14px 16px",marginBottom:16}}>
      <p style={{fontSize:10,color:G.green,textTransform:"uppercase" as const,letterSpacing:2,fontWeight:"bold",margin:"0 0 12px"}}>Enter I-OPT Scores (out of 50)</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {Object.entries(STYLES).map(([st,sv]:any) => (
          <div key={st} style={{background:"#fff",border:"1.5px solid "+sv.border,borderRadius:12,padding:"10px 12px"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:7}}>
              <div style={{width:20,height:20,borderRadius:10,background:sv.color,color:"#fff",fontSize:9,fontWeight:"bold",display:"flex",alignItems:"center",justifyContent:"center"}}>{st}</div>
              <span style={{fontSize:11,fontWeight:"bold",color:sv.color}}>{sv.label}</span>
            </div>
            <input type="number" min={0} max={50} value={profile[st]}
              onChange={(e:any) => setProfile((p:any) => ({...p,[st]:Math.min(50,Math.max(0,Number(e.target.value)))}))}
              style={{width:"100%",border:"1.5px solid "+sv.border,borderRadius:8,padding:"6px 8px",fontSize:20,fontWeight:"bold",color:sv.color,outline:"none",fontFamily:"Georgia,serif",textAlign:"center" as const,background:sv.light,boxSizing:"border-box" as const}}/>
            <p style={{fontSize:9,color:G.charcoalLight,margin:"3px 0 0",textAlign:"center" as const}}>out of 50</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileTab({ profile, setProfile }: any) {
  const dom = dominant(profile);
  const s = STYLES[dom];
  const pat = getPattern(profile);
  const [view, setView] = useState("overview");
  return (
    <div>
      <div style={{background:"linear-gradient(135deg,"+s.light+",#fff)",border:"1.5px solid "+s.border,borderRadius:18,padding:18,marginBottom:16}}>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:12}}>
          <Badge style={dom} size="lg"/>
          <div style={{flex:1}}>
            <p style={{fontSize:10,color:"#94A3B8",textTransform:"uppercase" as const,letterSpacing:2,fontWeight:"bold",margin:"0 0 2px"}}>Dominant Style</p>
            <h2 style={{fontSize:20,fontWeight:"bold",color:s.color,margin:"0 0 5px",lineHeight:1.2}}>{s.label}</h2>
            <div style={{display:"inline-block",background:s.color,color:"#fff",borderRadius:20,padding:"3px 12px",fontSize:11,fontWeight:"bold",marginBottom:6}}>"{s.motto}"</div>
            <p style={{fontSize:12,color:"#475569",margin:0,lineHeight:1.6}}>{s.description}</p>
          </div>
        </div>
        <div style={{background:G.greenPale,border:"1px solid "+G.greenBorder,borderRadius:12,padding:"9px 13px",marginBottom:8,display:"flex",gap:9,alignItems:"center"}}>
          <span style={{fontSize:18}}>🎁</span>
          <div>
            <p style={{fontSize:9,fontWeight:"bold",color:G.green,textTransform:"uppercase" as const,letterSpacing:1,margin:"0 0 1px"}}>Your Gift to Every Team</p>
            <p style={{fontSize:12,color:G.charcoal,margin:0,fontWeight:"bold"}}>{s.gift}</p>
          </div>
        </div>
        {pat && (
          <div style={{background:"rgba(255,255,255,0.85)",borderRadius:10,padding:"7px 10px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{display:"flex",gap:4}}>{(pat[1] as any).styles.map((st:string) => <Badge key={st} style={st} size="sm"/>)}</div>
            <div>
              <p style={{fontSize:10,fontWeight:"bold",color:(pat[1] as any).color,margin:0}}>Pattern: {pat[0]}</p>
              <p style={{fontSize:10,color:"#64748B",margin:0}}>{(pat[1] as any).desc.split(".")[0]}.</p>
            </div>
          </div>
        )}
      </div>

      <div style={{display:"flex",gap:5,marginBottom:14}}>
        {[["overview","Overview"],["comm","Comm Tips"],["snowflake","❄️ Snowflake"],["cultural","🌍 Culture"]].map(([v,l]) => (
          <button key={v} onClick={() => setView(v)} style={{flex:1,padding:"7px 3px",borderRadius:10,border:"1.5px solid "+(view===v?s.color:G.border),background:view===v?s.light:"#fff",color:view===v?s.color:G.charcoalLight,fontSize:10,fontWeight:"bold",cursor:"pointer",fontFamily:"Georgia,serif"}}>{l}</button>
        ))}
      </div>

      {view==="overview" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          {[["💪 Strengths",s.strengths],["⚠️ Watch for",s.challenges],["🔥 Motivated by",s.motivators],["🎯 Leadership",s.leaderStyle]].map(([lbl,val]) => (
            <div key={lbl} style={{background:G.offWhite,borderRadius:12,padding:"10px 12px"}}>
              <p style={{fontSize:10,fontWeight:"bold",color:"#64748B",margin:"0 0 4px"}}>{lbl}</p>
              <p style={{fontSize:11,color:"#1E293B",margin:0,lineHeight:1.5}}>{val}</p>
            </div>
          ))}
        </div>
      )}
      {view==="comm" && (
        <div style={{background:G.greenPale,border:"1px solid "+G.greenBorder,borderRadius:14,padding:"14px 16px",marginBottom:16}}>
          <p style={{fontSize:10,color:G.green,textTransform:"uppercase" as const,letterSpacing:2,fontWeight:"bold",margin:"0 0 10px"}}>How to communicate with you</p>
          {s.commTips.map((tip:string,i:number) => (
            <div key={i} style={{display:"flex",gap:8,marginBottom:7,alignItems:"flex-start"}}>
              <div style={{width:17,height:17,borderRadius:9,background:s.color,color:"#fff",fontSize:9,fontWeight:"bold",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
              <p style={{fontSize:12,color:"#334155",margin:0,lineHeight:1.5}}>{tip}</p>
            </div>
          ))}
        </div>
      )}
      {view==="snowflake" && (
        <div style={{marginBottom:16}}>
          <p style={{fontSize:11,color:"#64748B",marginBottom:10}}>Behavioral characteristics of the <strong style={{color:s.color}}>{s.label}</strong>:</p>
          <div style={{display:"flex",flexWrap:"wrap" as const,gap:6}}>
            {s.snowflake.map((t:string,i:number) => <span key={i} style={{background:s.light,border:"1px solid "+s.border,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:"bold",color:s.color}}>{t}</span>)}
          </div>
        </div>
      )}
      {view==="cultural" && (
        <div style={{marginBottom:16}}>
          <p style={{fontSize:11,color:"#64748B",marginBottom:10}}>Cultural tendencies of the <strong style={{color:s.color}}>{s.label}</strong>:</p>
          <div style={{display:"flex",flexWrap:"wrap" as const,gap:6}}>
            {s.cultural.map((t:string,i:number) => <span key={i} style={{background:G.offWhite,border:"1px solid "+G.border,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:"bold",color:G.charcoal}}>{t}</span>)}
          </div>
        </div>
      )}

      <h3 style={{fontSize:13,fontWeight:"bold",color:G.charcoal,margin:"0 0 14px"}}>Your Strategic Profile (Kite)</h3>
      <KiteProfile profile={profile}/>
      <ScoreInput profile={profile} setProfile={setProfile}/>
    </div>
  );
}

function TeamTab({ profile, team, setTeam }: any) {
  const [name, setName] = useState("");
  const [style, setStyle] = useState("RS");
  const dom = dominant(profile);
  const all = [dom, ...team.map((m:any) => m.style)];
  const counts: any = Object.fromEntries(Object.keys(STYLES).map(s => [s,0]));
  all.forEach((s:string) => counts[s]++);
  const missing = Object.entries(counts).filter(([,v]:any) => v===0).map(([k]) => k);
  const add = () => { if (!name.trim()) return; setTeam((t:any) => [...t,{name:name.trim(),style}]); setName(""); };
  return (
    <div>
      <div style={{background:"linear-gradient(135deg,"+G.greenPale+",#fff)",border:"1px solid "+G.greenBorder,borderRadius:14,padding:"12px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
        <span style={{fontSize:20}}>🪷</span>
        <div>
          <p style={{fontSize:11,fontWeight:"bold",color:G.green,margin:"0 0 2px",textTransform:"uppercase" as const,letterSpacing:1}}>The PeopleGro Model</p>
          <p style={{fontSize:12,color:G.charcoal,margin:0,lineHeight:1.5}}><strong>How Matters.</strong> Human beings are information processing organisms — understanding styles transforms team dynamics.</p>
        </div>
      </div>
      <div style={{background:G.offWhite,borderRadius:16,padding:16,marginBottom:18}}>
        <p style={{fontSize:10,color:"#94A3B8",textTransform:"uppercase" as const,letterSpacing:2,fontWeight:"bold",margin:"0 0 12px"}}>Team Composition · {all.length} people</p>
        <div style={{display:"flex",gap:12,flexWrap:"wrap" as const,marginBottom:10}}>
          {Object.entries(counts).map(([st,ct]:any) => (
            <div key={st} style={{display:"flex",flexDirection:"column" as const,alignItems:"center",gap:4,opacity:ct===0?0.2:1}}>
              <Badge style={st} size="sm"/><span style={{fontSize:10,color:"#64748B"}}>x{ct}</span>
            </div>
          ))}
        </div>
        <div style={{height:7,borderRadius:6,overflow:"hidden",display:"flex",gap:1,marginBottom:12}}>
          {Object.entries(counts).filter(([,c]:any) => c>0).map(([st,ct]:any) => <div key={st} style={{flex:ct,background:STYLES[st].color}}/>)}
        </div>
        <p style={{fontSize:10,color:G.green,fontWeight:"bold",textTransform:"uppercase" as const,letterSpacing:1,margin:"0 0 6px"}}>Gifts on this team</p>
        {all.filter((v:string,i:number,a:string[]) => a.indexOf(v)===i).map((st:string) => (
          <div key={st} style={{display:"flex",gap:6,marginBottom:5,alignItems:"flex-start"}}>
            <span style={{fontSize:11,fontWeight:"bold",color:STYLES[st].color,width:28,flexShrink:0}}>{st}</span>
            <span style={{fontSize:11,color:"#475569"}}>{STYLES[st].gift}</span>
          </div>
        ))}
        {missing.length>0 && <div style={{background:"#FFFBEB",border:"1px solid #FCD34D",borderRadius:10,padding:"8px 12px",fontSize:11,color:"#92400E",marginTop:8}}>⚠️ Missing gifts: {missing.join(", ")}</div>}
        <div style={{background:G.greenPale,border:"1px solid "+G.greenBorder,borderRadius:10,padding:"8px 12px",fontSize:11,color:G.charcoal,marginTop:8}}>📊 Teams spend ~16 hrs/week miscommunicating · $18K+ per team in non-productive conflict</div>
      </div>
      <h3 style={{fontSize:13,fontWeight:"bold",color:G.charcoal,margin:"0 0 10px"}}>Members</h3>
      <div style={{display:"inline-flex",alignItems:"center",gap:6,marginBottom:10,background:STYLES[dom].light,border:"1px solid "+STYLES[dom].border,borderRadius:20,padding:"4px 12px"}}>
        <Badge style={dom} size="sm"/><span style={{fontSize:11,fontWeight:"bold",color:STYLES[dom].color}}>You · {dom} · "{STYLES[dom].motto}"</span>
      </div>
      {team.map((m:any,i:number) => (
        <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderRadius:14,marginBottom:8,background:STYLES[m.style].light,border:"1px solid "+STYLES[m.style].border}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Badge style={m.style} size="sm"/>
            <div>
              <p style={{fontWeight:"bold",fontSize:13,color:"#1E293B",margin:0}}>{m.name}</p>
              <p style={{fontSize:11,color:"#64748B",margin:"1px 0 0"}}>{STYLES[m.style].label} · "{STYLES[m.style].motto}"</p>
            </div>
          </div>
          <button onClick={() => setTeam((t:any) => t.filter((_:any,idx:number) => idx!==i))} style={{background:"none",border:"none",color:"#CBD5E1",fontSize:20,cursor:"pointer",lineHeight:1,padding:4}}>×</button>
        </div>
      ))}
      <div style={{display:"flex",gap:8,marginTop:12}}>
        <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key==="Enter" && add()} placeholder="Member name" style={{flex:1,border:"1.5px solid "+G.border,borderRadius:12,padding:"10px 14px",fontSize:13,outline:"none",fontFamily:"Georgia,serif"}}/>
        <select value={style} onChange={e => setStyle(e.target.value)} style={{border:"1.5px solid "+G.border,borderRadius:12,padding:"10px 6px",fontSize:12,outline:"none",fontFamily:"Georgia,serif"}}>
          {Object.entries(STYLES).map(([k,v]:any) => <option key={k} value={k}>{k} — {v.label}</option>)}
        </select>
        <button onClick={add} style={{background:G.green,color:"#fff",border:"none",borderRadius:12,padding:"10px 16px",fontSize:16,fontWeight:"bold",cursor:"pointer"}}>+</button>
      </div>
    </div>
  );
}

function PatternsTab({ profile, team }: any) {
  const dom = dominant(profile), sec = second(profile), myPat = getPattern(profile);
  return (
    <div>
      <div style={{background:"linear-gradient(135deg,"+G.greenPale+",#fff)",border:"1px solid "+G.greenBorder,borderRadius:14,padding:"13px 16px",marginBottom:18}}>
        <p style={{fontSize:10,color:G.green,fontWeight:"bold",textTransform:"uppercase" as const,letterSpacing:1,margin:"0 0 5px"}}>Strategic Patterns</p>
        <p style={{fontSize:12,color:G.charcoal,margin:0,lineHeight:1.6}}>When two I-OPT styles combine they create a <strong>Strategic Pattern</strong> — a specific signature predicting how someone operates and leads.</p>
      </div>
      {myPat && (
        <div style={{marginBottom:20}}>
          <p style={{fontSize:11,color:"#64748B",fontWeight:"bold",margin:"0 0 8px"}}>YOUR PATTERN ({dom} + {sec}):</p>
          <div style={{background:(myPat[1] as any).color+"0F",border:"2px solid "+(myPat[1] as any).color+"44",borderRadius:16,padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{display:"flex",gap:6}}>{(myPat[1] as any).styles.map((st:string) => <Badge key={st} style={st} size="sm"/>)}</div>
              <h3 style={{fontSize:18,fontWeight:"bold",color:(myPat[1] as any).color,margin:0}}>{myPat[0]}</h3>
            </div>
            <p style={{fontSize:13,color:"#334155",margin:0,lineHeight:1.6}}>{(myPat[1] as any).desc}</p>
          </div>
        </div>
      )}
      <p style={{fontSize:11,color:"#64748B",fontWeight:"bold",margin:"0 0 10px"}}>ALL FOUR PATTERNS:</p>
      {Object.entries(PATTERNS).map(([name,p]:any) => (
        <div key={name} style={{marginBottom:10,background:G.offWhite,border:"1.5px solid "+(myPat&&myPat[0]===name?p.color+"66":G.border),borderRadius:14,padding:"12px 14px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:5}}>
            <div style={{display:"flex",gap:4}}>{p.styles.map((st:string) => <Badge key={st} style={st} size="sm"/>)}</div>
            <h4 style={{fontSize:14,fontWeight:"bold",color:p.color,margin:0}}>{name}</h4>
            <span style={{fontSize:10,color:"#94A3B8"}}>{p.styles.join("+")}</span>
          </div>
          <p style={{fontSize:12,color:"#475569",margin:0,lineHeight:1.5}}>{p.desc}</p>
        </div>
      ))}
      {team.length>0 && (
        <div style={{marginTop:16}}>
          <p style={{fontSize:11,color:"#64748B",fontWeight:"bold",margin:"0 0 10px"}}>YOUR PAIRINGS:</p>
          {team.map((m:any,i:number) => {
            const mp = Object.entries(PATTERNS).find(([,p]:any) => p.styles.includes(dom) && p.styles.includes(m.style));
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"9px 12px",background:mp?(mp[1] as any).color+"0A":G.offWhite,border:"1px solid "+(mp?(mp[1] as any).color+"33":G.border),borderRadius:12}}>
                <Badge style={m.style} size="sm"/>
                <div>
                  <p style={{fontSize:12,fontWeight:"bold",color:"#1E293B",margin:0}}>{m.name} ({m.style})</p>
                  {mp?<p style={{fontSize:11,color:(mp[1] as any).color,margin:0,fontWeight:"bold"}}>You + {m.name} → <strong>{mp[0]}</strong></p>:<p style={{fontSize:11,color:"#94A3B8",margin:0}}>Complementary dynamic</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ReportsTab({ profile, team }: any) {
  const [selected, setSelected] = useState("individual");
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<any>(null);
  const dom = dominant(profile);
  const s = STYLES[dom];
  const counts: any = Object.fromEntries(Object.keys(STYLES).map(st => [st,0]));
  [dom,...team.map((m:any) => m.style)].forEach((st:string) => counts[st]++);
  const missing = Object.entries(counts).filter(([,v]:any) => v===0).map(([k]) => k);
  const selRpt = REPORT_TYPES.find(r => r.id===selected);
  const myPat = getPattern(profile);

  const sys = "You are an expert I-OPT certified coach and PeopleGro Insights facilitator. RS 'He who hesitates is lost!': fast action-first. Gift: keeps things moving. LP 'Do it once, do it right!': structured quality-first. Gift: ensures quality. RI 'There is always a better way!': innovative big-picture. Gift: creative solutions. HA 'Think!! Then act.': systemic ponder-first. Gift: holds complex systems. Patterns: Performer(RS+LP), Conservator(LP+HA), Perfector(HA+RI), Changer(RI+RS). PeopleGro: How Matters. $18K+ per team non-productive conflict. ~16hrs/week miscommunicating. Scores out of 50. Be practical, specific, grounded. Never generic.";

  const buildPrompt = () => {
    const p = profile;
    const pStr = `RS:${p.RS}/50 LP:${p.LP}/50 RI:${p.RI}/50 HA:${p.HA}/50`;
    const teamStr = team.length>0 ? team.map((m:any) => m.name+"("+m.style+")").join(", ") : "No team members";
    const prompts: any = {
      individual: `Profile:${pStr}. Dominant:${dom}. Pattern:${myPat?myPat[0]:"Mixed"}.\nReturn ONLY valid JSON no markdown:\n{"executiveSummary":"2-3 sentences","dominantInPractice":"3 sentences","giftToTeam":"2 sentences","strategicPattern":"2 sentences","strengthsDetail":"3 sentences","developmentAreas":"3 sentences","communicationGuide":"3 sentences","howMatters":"2 sentences","recommendations":["r1","r2","r3","r4"]}`,
      sales: `Profile:${pStr}. Dominant:${dom}.\nReturn ONLY valid JSON no markdown:\n{"executiveSummary":"2 sentences","naturalSalesStyle":"3 sentences","readingClientStyles":"3 sentences","strengthsInSales":"2 sentences","watchOuts":"2 sentences","closingStyle":"2 sentences","recommendations":["r1","r2","r3","r4"]}`,
      change: `Profile:${pStr}. Dominant:${dom}.\nReturn ONLY valid JSON no markdown:\n{"executiveSummary":"2 sentences","changeReactionStyle":"3 sentences","strengthsDetail":"2 sentences","developmentAreas":"2 sentences","communicationGuide":"3 sentences","howMatters":"2 sentences","recommendations":["r1","r2","r3","r4"]}`,
      twoperson: `Person1:${dom}. Person2:${team[0]?team[0].name+"("+team[0].style+")":"Generic LP"}.\nReturn ONLY valid JSON no markdown:\n{"executiveSummary":"2 sentences","naturalSynergies":"3 sentences","naturalTensions":"3 sentences","communicationGuide":"3 sentences","recommendations":["r1","r2","r3","r4"]}`,
      team: `Leader:${dom}. Team:${teamStr}. Missing:${missing.length>0?missing.join(","):"none"}.\nReturn ONLY valid JSON no markdown:\n{"executiveSummary":"2 sentences","teamPersonality":"3 sentences","naturalStrengths":"3 sentences","developmentAreas":"3 sentences","communicationGuide":"2 sentences","recommendations":["r1","r2","r3","r4"]}`,
      leader: `Leader:${dom} ${pStr}. Team:${teamStr}.\nReturn ONLY valid JSON no markdown:\n{"executiveSummary":"2 sentences","leaderStyleProfile":"3 sentences","naturalSynergies":"3 sentences","developmentAreas":"2 sentences","communicationGuide":"3 sentences","recommendations":["r1","r2","r3","r4"]}`,
    };
    return prompts[selected];
  };

  const generate = async () => {
    setGenerating(true); setReport(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800, system:sys, messages:[{role:"user",content:buildPrompt()}] }) });
      const data = await res.json();
      const text = data.content?.find((b:any) => b.type==="text")?.text || "";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setReport({ type:selected, content:parsed });
    } catch(e) { setReport({ error:true }); }
    setGenerating(false);
  };

  const LABELS: any = {
    executiveSummary:"Executive Summary", dominantInPractice:"Dominant Style in Practice", giftToTeam:"Gift to the Team",
    strategicPattern:"Strategic Pattern", strengthsDetail:"Strengths", developmentAreas:"Development Areas",
    communicationGuide:"Communication Guide", howMatters:"How Matters", naturalSalesStyle:"Natural Sales Style",
    readingClientStyles:"Reading Client Styles", strengthsInSales:"Strengths in Sales", watchOuts:"Watch Outs",
    closingStyle:"Closing Style", changeReactionStyle:"Natural Reaction to Change", naturalSynergies:"Natural Synergies",
    naturalTensions:"Natural Tensions", teamPersonality:"Team Personality", naturalStrengths:"Natural Strengths",
    leaderStyleProfile:"Leader Style Profile",
  };

  const Sec = ({ title, content }: any) => (
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
        <div style={{width:3,height:13,borderRadius:2,background:s.color}}/>
        <h4 style={{fontSize:11,fontWeight:"bold",color:"#0F172A",margin:0,textTransform:"uppercase" as const,letterSpacing:1}}>{title}</h4>
      </div>
      <p style={{fontSize:13,color:"#334155",lineHeight:1.7,margin:0}}>{content}</p>
    </div>
  );

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:16}}>
        {REPORT_TYPES.map(r => (
          <button key={r.id} onClick={() => { setSelected(r.id); setReport(null); }} style={{padding:"9px 5px",borderRadius:11,border:"1.5px solid "+(selected===r.id?s.color:G.border),background:selected===r.id?s.light:"#fff",color:selected===r.id?s.color:G.charcoalLight,textAlign:"center" as const,cursor:"pointer",fontFamily:"Georgia,serif"}}>
            <div style={{fontSize:16,marginBottom:2}}>{r.icon}</div>
            <div style={{fontSize:10,fontWeight:"bold",lineHeight:1.3}}>{r.label}</div>
          </button>
        ))}
      </div>
      <div style={{background:G.offWhite,borderRadius:12,padding:"11px 13px",marginBottom:13,display:"flex",alignItems:"center",gap:10}}>
        <Badge style={dom} size="sm"/>
        <div>
          <p style={{fontSize:12,fontWeight:"bold",color:"#0F172A",margin:"0 0 2px"}}>{selRpt?.label}</p>
          <p style={{fontSize:11,color:"#64748B",margin:0}}>RS {profile.RS} · LP {profile.LP} · RI {profile.RI} · HA {profile.HA} (out of 50)</p>
        </div>
      </div>
      <button onClick={generate} disabled={generating} style={{width:"100%",padding:"13px",borderRadius:14,fontSize:14,fontWeight:"bold",background:generating?"#CBD5E1":G.green,color:"#fff",border:"none",cursor:generating?"not-allowed":"pointer",fontFamily:"Georgia,serif",marginBottom:16}}>
        {generating ? "Generating…" : "Generate "+selRpt?.label}
      </button>
      {report && !report.error && (
        <div>
          <div style={{background:"#fff",border:"1.5px solid "+G.border,borderRadius:18,overflow:"hidden"}}>
            <div style={{background:"linear-gradient(135deg,"+G.charcoal+","+G.greenDark+")",padding:"16px 20px 12px"}}>
              <p style={{fontSize:9,color:"rgba(255,255,255,0.5)",textTransform:"uppercase" as const,letterSpacing:2,fontWeight:"bold",margin:"0 0 3px"}}>PeopleGro Insights · {selRpt?.label.toUpperCase()}</p>
              <h3 style={{color:"#fff",fontSize:16,fontWeight:"bold",margin:"0 0 3px"}}>{selRpt?.label}</h3>
              <p style={{color:"rgba(255,255,255,0.4)",fontSize:10,margin:0}}>{new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})} · Powered by I-OPT® · Confidential</p>
            </div>
            <div style={{padding:"9px 18px",background:G.offWhite,borderBottom:"1px solid "+G.border,display:"flex",gap:5,flexWrap:"wrap" as const}}>
              {Object.entries(profile).map(([st,sc]:any) => <span key={st} style={{background:STYLES[st].light,borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:"bold",color:STYLES[st].color}}>{st} {sc}/50</span>)}
            </div>
            <div style={{padding:"16px 18px 4px"}}>
              {Object.entries(report.content).filter(([k]) => k!=="recommendations").map(([key,val]:any) => val && LABELS[key] ? <Sec key={key} title={LABELS[key]} content={val}/> : null)}
              {report.content.recommendations?.length>0 && (
                <div style={{marginBottom:18}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
                    <div style={{width:3,height:13,borderRadius:2,background:G.green}}/>
                    <h4 style={{fontSize:11,fontWeight:"bold",color:"#0F172A",margin:0,textTransform:"uppercase" as const,letterSpacing:1}}>Recommendations</h4>
                  </div>
                  {report.content.recommendations.map((r:string,i:number) => (
                    <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                      <div style={{width:20,height:20,borderRadius:10,background:G.green,color:"#fff",fontSize:10,fontWeight:"bold",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>{i+1}</div>
                      <p style={{fontSize:13,color:"#334155",margin:0,lineHeight:1.6}}>{r}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{padding:"8px 18px",background:G.offWhite,borderTop:"1px solid "+G.border}}>
              <p style={{fontSize:9,color:"#94A3B8",margin:0,textAlign:"center" as const}}>PeopleGro Insights · Powered by I-OPT® (Professional Communications Inc.) · Confidential</p>
            </div>
          </div>
          <button onClick={() => window.print()} style={{width:"100%",marginTop:10,padding:"11px",borderRadius:13,fontSize:13,fontWeight:"bold",background:G.greenPale,color:G.green,border:"1.5px solid "+G.greenBorder,cursor:"pointer",fontFamily:"Georgia,serif"}}>🖨️ Print / Save as PDF</button>
        </div>
      )}
      {report?.error && <div style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:12,padding:14,fontSize:13,color:"#991B1B"}}>Could not generate report. Please try again.</div>}
    </div>
  );
}

function ResourcesTab() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = RESOURCES.filter(r => {
    const a = typeFilter==="all" || r.type===typeFilter;
    const b = styleFilter==="ALL" || r.style===styleFilter || r.style==="ALL";
    const c = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase());
    return a && b && c;
  });
  const noFilter = typeFilter==="all" && styleFilter==="ALL" && !search;

  const RCard = ({ r, featured=false }: any) => (
    <div style={{background:"#fff",border:"1.5px solid "+(featured?G.greenBorder:G.border),borderRadius:14,padding:"12px 14px",marginBottom:8}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
        <div style={{width:36,height:36,borderRadius:10,background:TYPE_COLORS[r.type]+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{TYPE_ICONS[r.type]}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap" as const,marginBottom:3}}>
            <span style={{fontSize:10,fontWeight:"bold",color:TYPE_COLORS[r.type],textTransform:"uppercase" as const,letterSpacing:1}}>{r.type}</span>
            {r.dur && <span style={{fontSize:10,color:"#94A3B8"}}>· {r.dur}</span>}
            {r.style!=="ALL" && <span style={{fontSize:10,fontWeight:"bold",color:STYLES[r.style].color,background:STYLES[r.style].light,borderRadius:10,padding:"1px 7px",border:"1px solid "+STYLES[r.style].border}}>{r.style}</span>}
            {featured && <span style={{fontSize:10,fontWeight:"bold",color:G.green}}>⭐</span>}
          </div>
          <p style={{fontSize:13,fontWeight:"bold",color:G.charcoal,margin:"0 0 3px",lineHeight:1.3}}>{r.title}</p>
          <p style={{fontSize:11,color:G.charcoalLight,margin:"0 0 8px",lineHeight:1.5}}>{r.desc}</p>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:10,color:"#94A3B8",background:"#F1F5F9",borderRadius:8,padding:"2px 8px"}}>{r.cat}</span>
            <a href={r.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,fontWeight:"bold",color:G.green,textDecoration:"none",background:G.greenPale,border:"1px solid "+G.greenBorder,borderRadius:8,padding:"4px 10px"}}>{r.type==="pdf"?"Download":"Open"} →</a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{background:"linear-gradient(135deg,"+G.greenPale+",#fff)",border:"1px solid "+G.greenBorder,borderRadius:16,padding:"14px 16px",marginBottom:14}}>
        <p style={{fontSize:10,color:G.green,fontWeight:"bold",textTransform:"uppercase" as const,letterSpacing:2,margin:"0 0 4px"}}>PeopleGro Content Library</p>
        <p style={{fontSize:13,color:G.charcoal,margin:0,lineHeight:1.5}}>Videos, guides, articles, and tools — all in one place.</p>
      </div>
      <div style={{position:"relative" as const,marginBottom:10}}>
        <span style={{position:"absolute" as const,left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#94A3B8"}}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources…" style={{width:"100%",border:"1.5px solid "+G.border,borderRadius:12,padding:"10px 14px 10px 36px",fontSize:13,outline:"none",fontFamily:"Georgia,serif",boxSizing:"border-box" as const}}/>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:10,overflowX:"auto" as const,paddingBottom:2}}>
        {[["all","All"],["video","🎥 Video"],["pdf","📄 PDF"],["article","📝 Article"],["link","🔗 Link"]].map(([v,l]) => (
          <button key={v} onClick={() => setTypeFilter(v)} style={{flexShrink:0,padding:"5px 12px",borderRadius:20,border:"1.5px solid "+(typeFilter===v?G.green:G.border),background:typeFilter===v?G.green:"#fff",color:typeFilter===v?"#fff":G.charcoal,fontSize:11,fontWeight:"bold",cursor:"pointer",fontFamily:"Georgia,serif"}}>{l}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {["ALL","RS","LP","RI","HA"].map(sf => (
          <button key={sf} onClick={() => setStyleFilter(sf)} style={{flex:1,padding:"6px 4px",borderRadius:10,border:"1.5px solid "+(styleFilter===sf?(sf==="ALL"?G.green:STYLES[sf]?.color):G.border),background:styleFilter===sf?(sf==="ALL"?G.greenPale:STYLES[sf]?.light):"#fff",color:styleFilter===sf?(sf==="ALL"?G.green:STYLES[sf]?.color):G.charcoalLight,fontSize:11,fontWeight:"bold",cursor:"pointer",fontFamily:"Georgia,serif"}}>{sf==="ALL"?"All":sf}</button>
        ))}
      </div>
      {noFilter && (
        <div style={{marginBottom:16}}>
          <p style={{fontSize:10,color:G.green,fontWeight:"bold",textTransform:"uppercase" as const,letterSpacing:2,margin:"0 0 10px"}}>⭐ Featured</p>
          {RESOURCES.filter(r => r.star).map((r,i) => <RCard key={i} r={r} featured/>)}
          <p style={{fontSize:10,color:"#94A3B8",textTransform:"uppercase" as const,letterSpacing:2,margin:"14px 0 10px"}}>All Resources</p>
        </div>
      )}
      {!noFilter && <p style={{fontSize:11,color:G.charcoalLight,margin:"0 0 10px"}}>{filtered.length} resource{filtered.length!==1?"s":""} found</p>}
      {filtered.map((r,i) => <RCard key={i} r={r}/>)}
    </div>
  );
}

function CoachTab({ profile, team }: any) {
  const [messages, setMessages] = useState([{ role:"assistant", content:"Hi! I'm your PeopleGro Insights AI Coach — trained on the full I-OPT framework including all four styles, strategic patterns, and the philosophy that How Matters.\n\nI know your profile and your team. What would you like to explore?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<any>(null);
  const dom = dominant(profile);
  const myPat = getPattern(profile);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const sys = `You are an expert I-OPT certified coach and PeopleGro Insights facilitator. USER: RS${profile.RS}/50 LP${profile.LP}/50 RI${profile.RI}/50 HA${profile.HA}/50. Dominant:${dom}('${STYLES[dom].motto}'). Gift:${STYLES[dom].gift}. Pattern:${myPat?myPat[0]:"Mixed"}. TEAM:${team.length>0?team.map((m:any)=>m.name+"("+m.style+")").join(", "):"No team added"}. RS fast action-first. LP structured quality-first. RI innovative big-picture. HA systemic ponder-first. Patterns: Performer(RS+LP), Conservator(LP+HA), Perfector(HA+RI), Changer(RI+RS). How Matters — self-awareness elevates all skills. Friction inevitable, embrace it. Be practical, specific, 3-5 sentences, never generic.`;

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = { role:"user", content:input.trim() };
    const next = [...messages, msg];
    setMessages(next); setInput(""); setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:600, system:sys, messages:next.map(m => ({ role:m.role, content:m.content })) }) });
      const data = await res.json();
      const reply = data.content?.find((b:any) => b.type==="text")?.text || "Something went wrong.";
      setMessages(p => [...p,{ role:"assistant", content:reply }]);
    } catch(e) { setMessages(p => [...p,{ role:"assistant", content:"Something went wrong. Try again." }]); }
    setLoading(false);
  };

  const suggestions = ["What is my strategic pattern?","How do I manage friction with an LP?","How should I communicate with my team?","What is my biggest blind spot?","How do I sell to an HA client?"];

  return (
    <div style={{display:"flex",flexDirection:"column" as const}}>
      <div style={{overflowY:"auto" as const,maxHeight:340,minHeight:160,marginBottom:10}}>
        {messages.map((m,i) => (
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:10}}>
            {m.role==="assistant" && <div style={{width:26,height:26,borderRadius:13,background:G.green,color:"#fff",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginRight:8,marginTop:2}}>🪷</div>}
            <div style={{maxWidth:"80%",padding:"10px 14px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?G.charcoal:"#F1F5F9",color:m.role==="user"?"#fff":"#1E293B",fontSize:13,lineHeight:1.65,whiteSpace:"pre-line" as const}}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{display:"flex",marginBottom:10}}><div style={{width:26,height:26,borderRadius:13,background:G.green,color:"#fff",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",marginRight:8}}>🪷</div><div style={{background:"#F1F5F9",borderRadius:"18px 18px 18px 4px",padding:"10px 14px",fontSize:13,color:"#94A3B8"}}>Thinking…</div></div>}
        <div ref={bottomRef}/>
      </div>
      {messages.length===1 && (
        <div style={{display:"flex",flexWrap:"wrap" as const,gap:6,marginBottom:10}}>
          {suggestions.map(s => <button key={s} onClick={() => setInput(s)} style={{fontSize:10,border:"1.5px solid "+G.border,borderRadius:20,padding:"5px 10px",color:G.charcoal,background:"#fff",cursor:"pointer",fontFamily:"Georgia,serif"}}>{s}</button>)}
        </div>
      )}
      <div style={{display:"flex",gap:8}}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && send()} placeholder="Ask your PeopleGro Insights coach…" style={{flex:1,border:"1.5px solid "+G.border,borderRadius:14,padding:"11px 14px",fontSize:13,outline:"none",fontFamily:"Georgia,serif"}}/>
        <button onClick={send} disabled={loading||!input.trim()} style={{background:G.green,color:"#fff",border:"none",borderRadius:14,padding:"11px 18px",fontSize:14,fontWeight:"bold",cursor:"pointer",opacity:(!input.trim()||loading)?0.4:1}}>↑</button>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("Profile");
  const [profile, setProfile] = useState({ RS:18, LP:22, RI:32, HA:38 });
  const [team, setTeam] = useState([{ name:"Alex", style:"LP" },{ name:"Jordan", style:"RS" }]);
  const dom = dominant(profile);

  return (
    <div style={{minHeight:"100vh",background:"#F0F4EE",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px 12px",fontFamily:"Georgia,'Times New Roman',serif"}}>
      <div style={{width:"100%",maxWidth:520,background:"#fff",borderRadius:28,boxShadow:"0 16px 64px rgba(0,0,0,0.10)",overflow:"hidden"}}>

        {/* Header */}
        <div style={{background:"#fff",padding:"16px 22px 14px",borderBottom:"2px solid "+G.greenBorder}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <Logo/>
            <div style={{background:STYLES[dom].color,borderRadius:20,padding:"5px 12px",display:"flex",alignItems:"center",gap:5}}>
              <span style={{color:"#fff",fontSize:12,fontWeight:"bold"}}>{dom}</span>
              <span style={{color:"rgba(255,255,255,0.7)",fontSize:9}}>{STYLES[dom].label.split(" ")[0]}</span>
            </div>
          </div>
          <p style={{color:G.charcoalLight,fontSize:10,margin:"7px 0 0",fontStyle:"italic"}}>"{STYLES[dom].motto}" · Powered by I-OPT®</p>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",borderBottom:"1px solid "+G.border,background:G.offWhite,overflowX:"auto" as const}}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{flex:1,padding:"10px 2px",fontSize:9,fontWeight:tab===t?"bold":"normal",color:tab===t?G.charcoal:G.charcoalLight,borderBottom:"2px solid "+(tab===t?G.green:"transparent"),background:"none",border:"none",cursor:"pointer",transition:"all 0.15s",fontFamily:"Georgia,serif",whiteSpace:"nowrap" as const}}>
              <div style={{fontSize:12,marginBottom:1}}>{TAB_ICONS[t]}</div>{t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{padding:"20px 20px 24px",overflowY:"auto" as const,maxHeight:"75vh"}}>
          {tab==="Profile" && <ProfileTab profile={profile} setProfile={setProfile}/>}
          {tab==="Team" && <TeamTab profile={profile} team={team} setTeam={setTeam}/>}
          {tab==="Patterns" && <PatternsTab profile={profile} team={team}/>}
          {tab==="Reports" && <ReportsTab profile={profile} team={team}/>}
          {tab==="Resources" && <ResourcesTab/>}
          {tab==="Coach" && <CoachTab profile={profile} team={team}/>}
        </div>
      </div>
    </div>
  );
}
