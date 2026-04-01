import { useState } from "react";
import { Sun, Moon, Leaf, AlertTriangle, ShoppingBag, X, Check, Activity, Shield, ChevronRight } from "lucide-react";

// Design Tokens
const C = {
  bg: "#F8F6F1",
  card: "#FFFFFF",
  green: "#4F7942",
  greenLight: "#EDF3EB",
  greenMid: "#C5D9C2",
  bamboo: "#C4956A",
  bambooLight: "#F7EEE4",
  text: "#2D3030",
  sub: "#7A7A6E",
  border: "#E5E2DA",
  danger: "#B94040",
  dangerLight: "#FDF2F2",
  warn: "#A07020",
  warnLight: "#FDF8EE",
};

const PRODUCTS = [
  { id: 1, brand: "The Ordinary", name: "Squalane Cleanser", tier: "$", category: "Cleanser", actives: ["Squalane"], link: "https://amzn.to/link1", usage: "AM/PM", tip: "Gentle oil-based cleanse - perfect first step or solo wash" },
  { id: 2, brand: "Fresh", name: "Soy Face Cleanser", tier: "$$", category: "Cleanser", actives: ["Soy", "Botanicals"], link: "https://amzn.to/link2", usage: "AM/PM", tip: "Botanical gel cleanser - melts makeup without stripping" },
  { id: 3, brand: "Paula's Choice", name: "BHA Liquid Exfoliant", tier: "$", category: "Active", actives: ["Salicylic Acid", "BHA"], link: "https://amzn.to/link3", usage: "AM/PM", tip: "2% salicylic acid unclogs pores - ideal for oily & acne-prone" },
  { id: 4, brand: "Drunk Elephant", name: "Framboos Glycolic Night Serum", tier: "$$", category: "Active", actives: ["AHA", "BHA"], link: "https://amzn.to/link4", usage: "PM only", tip: "Powerful AHA/BHA blend - start 2x/week, PM only" },
  { id: 5, brand: "The Ordinary", name: "Hyaluronic Acid 2% + B5", tier: "$", category: "Serum", actives: ["Hyaluronic Acid"], link: "https://amzn.to/link5", usage: "AM/PM", tip: "Apply on damp skin - pulls moisture deep into dermis" },
  { id: 6, brand: "Estée Lauder", name: "Advanced Night Repair", tier: "$$", category: "Serum", actives: ["Bifida Ferment"], link: "https://amzn.to/link6", usage: "PM", tip: "Overnight repair serum - the gold standard for anti-aging" },
  { id: 7, brand: "The Ordinary", name: "Retinol 0.5%", tier: "$", category: "Active", actives: ["Retinol"], link: "https://amzn.to/link7", usage: "PM only", tip: "Start 2x/week - PM only. SPF next morning is mandatory." },
  { id: 8, brand: "Tatcha", name: "Dewy Skin Cream", tier: "$$", category: "Moisturizer", actives: ["Ceramides", "Botanicals"], link: "https://amzn.to/link8", usage: "AM/PM", tip: "Rich occlusive moisturizer seals in every layer beneath it" },
  { id: 9, brand: "Neutrogena", name: "Hydro Boost Water Gel", tier: "$", category: "Moisturizer", actives: ["Hyaluronic Acid"], link: "https://amzn.to/link9", usage: "AM/PM", tip: "Lightweight gel moisture - ideal for oily or combo skin" },
  { id: 10, brand: "Supergoop!", name: "Unseen Sunscreen SPF 40", tier: "$", category: "SPF", actives: ["Chemical SPF"], link: "https://amzn.to/link10", usage: "AM only", tip: "Invisible, weightless finish - non-negotiable final AM step" }
];

const CONFLICT_RULES = [
  {
    test: o => o.some(p => p.actives.includes("Retinol")) && o.some(p => p.actives.includes("Salicylic Acid")),
    a: "The Ordinary Retinol 0.5%", b: "Paula's Choice BHA Liquid Exfoliant",
    severity: "high", title: "Retinol + Salicylic Acid",
    reason: "Both are potent actives that accelerate cell turnover. Combined, they can severely compromise your skin barrier.",
    solution: "Use BHA in AM and Retinol strictly in PM."
  },
  {
    test: o => o.some(p => p.actives.includes("Retinol")) && o.some(p => p.actives.includes("AHA")),
    a: "The Ordinary Retinol 0.5%", b: "Drunk Elephant Framboos",
    severity: "high", title: "Retinol + AHA/BHA Blend",
    reason: "Combining these significantly amplifies irritation risk and over-exfoliation.",
    solution: "Alternate nights only. Never apply both in the same session."
  }
];

const CAT_META = {
  Cleanser: { color: "#4A90C4", bg: "#EDF4FB" },
  Serum: { color: "#8B5CF6", bg: "#F5F0FF" },
  Active: { color: "#C04040", bg: "#FDF2F2" },
  Moisturizer: { color: "#4F7942", bg: "#EDF3EB" },
  SPF: { color: "#B07020", bg: "#FDF8EE" },
};

function buildRoutine(ownedIds) {
  const owned = PRODUCTS.filter(p => ownedIds.has(p.id));
  const conflicts = CONFLICT_RULES.filter(r => r.test(owned));
  const get = cat => owned.find(p => p.category === cat);

  const amCleanser = get("Cleanser") || PRODUCTS[0];
  const amSerum = owned.find(p => p.category === "Serum" && !p.actives.includes("Bifida Ferment")) || PRODUCTS[4];
  const amSPF = get("SPF") || PRODUCTS[9];

  const pmCleanser = get("Cleanser") || PRODUCTS[1];
  const pmSerum = get("Serum") || PRODUCTS[5];
  const pmActive = get("Active");
  const pmMoisturizer = get("Moisturizer") || PRODUCTS[7];

  const am = [
    { step: 1, label: "Cleanse", product: amCleanser, isOwned: ownedIds.has(amCleanser.id), note: amCleanser.tip },
    { step: 2, label: "Serum", product: amSerum, isOwned: ownedIds.has(amSerum.id), note: amSerum.tip },
    { step: 3, label: "Protect", product: amSPF, isOwned: ownedIds.has(amSPF.id), note: "Last step every morning.", required: true }
  ];

  const pm = [
    { step: 1, label: "Cleanse", product: pmCleanser, isOwned: ownedIds.has(pmCleanser.id), note: pmCleanser.tip },
    { step: 2, label: "Serum", product: pmSerum, isOwned: ownedIds.has(pmSerum.id), note: pmSerum.tip }
  ];

  if (pmActive) pm.push({ step: 3, label: "Active Treatment", product: pmActive, isOwned: ownedIds.has(pmActive.id), note: pmActive.tip });
  pm.push({ step: pm.length + 1, label: "Moisturize", product: pmMoisturizer, isOwned: ownedIds.has(pmMoisturizer.id), note: pmMoisturizer.tip });

  return { am, pm, conflicts };
}

function TierBadge({ tier }) {
  return <span style={{ fontSize: 10, fontWeight: 700, color: C.bamboo, background: C.bambooLight, padding: "1px 7px", borderRadius: 999 }}>{tier}</span>;
}

function CatBadge({ category }) {
  const m = CAT_META[category] || {};
  return <span style={{ fontSize: 9, fontWeight: 700, color: m.color, background: m.bg, padding: "2px 7px", borderRadius: 999, letterSpacing: 0.6, textTransform: "uppercase" }}>{category}</span>;
}

function StepCard({ item, isAM }) {
  const accent = isAM ? C.bamboo : C.green;
  const accentLight = isAM ? C.bambooLight : C.greenLight;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "13px 14px", marginBottom: 8, borderLeft: `3px solid ${item.isOwned || item.required ? accent : C.border}` }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: accent }}>{item.step}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: accent, textTransform: "uppercase" }}>{item.label}</span>
            <a href={item.product.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.green, textDecoration: "none", fontWeight: 600 }}>Shop</a>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{item.product.brand}</div>
          <div style={{ fontSize: 12, color: C.sub, marginBottom: 6 }}>{item.product.name}</div>
          <div style={{ display: "flex", gap: 5 }}>
            <TierBadge tier={item.product.tier} />
            <CatBadge category={item.product.category} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ skinType: "", goal: "", workedOut: null });
  const [owned, setOwned] = useState(new Set());
  const [routine, setRoutine] = useState(null);
  const [showConflict, setShowConflict] = useState(false);

  const toggle = id => setOwned(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  const handleBuild = () => {
    const r = buildRoutine(owned);
    setRoutine(r);
    setStep(3);
    if (r.conflicts.length > 0) setTimeout(() => setShowConflict(true), 350);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "sans-serif", padding: "28px 16px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Leaf size={22} color={C.green} />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text }}>Zen Skincare Garden</h1>
        </div>

        {step === 1 && (
          <div style={{ background: C.card, borderRadius: 22, padding: "28px 26px" }}>
            <h2>Step 1: Your Profile</h2>
            <button onClick={() => setStep(2)}>Continue</button>
          </div>
        )}

        {step === 2 && (
          <div style={{ background: C.card, borderRadius: 22, padding: "24px 22px" }}>
            <h2>Step 2: Your Shelf</h2>
            {PRODUCTS.map(p => (
              <div key={p.id} onClick={() => toggle(p.id)} style={{ padding: 10, border: `1px solid ${owned.has(p.id) ? C.green : C.border}`, cursor: "pointer", marginBottom: 5 }}>
                {p.brand} - {p.name}
              </div>
            ))}
            <button onClick={handleBuild}>Build Routine</button>
          </div>
        )}

        {step === 3 && routine && (
          <div>
            <h3>Morning Routine</h3>
            {routine.am.map((item, i) => <StepCard key={i} item={item} isAM={true} />)}
            <h3>Evening Routine</h3>
            {routine.pm.map((item, i) => <StepCard key={i} item={item} isAM={false} />)}
            <button onClick={() => setStep(1)}>Restart</button>
          </div>
        )}
      </div>
    </div>
  );
}
