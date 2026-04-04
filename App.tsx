import { useState } from "react";
import { Sun, Moon, Leaf, AlertTriangle, ShoppingBag, X, Check, Activity, Shield, ChevronRight } from "lucide-react";

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
  { id: 1, brand: "The Ordinary", name: "Squalane Cleanser", tier: "$", category: "Cleanser", actives: ["Squalane"], link: "https://amzn.to/3VjLpXk", usage: "AM/PM", tip: "Gentle oil-based cleanse - perfect first step or solo wash" },
  { id: 2, brand: "Fresh", name: "Soy Face Cleanser", tier: "$$", category: "Cleanser", actives: ["Soy", "Botanicals"], link: "https://amzn.to/3Vi0mKz", usage: "AM/PM", tip: "Botanical gel cleanser - melts makeup without stripping" },
  { id: 3, brand: "Paula's Choice", name: "BHA Liquid Exfoliant", tier: "$", category: "Active", actives: ["Salicylic Acid", "BHA"], link: "https://amzn.to/49ZzT1e", usage: "AM/PM", tip: "2% salicylic acid unclogs pores - ideal for oily & acne-prone" },
  { id: 4, brand: "Drunk Elephant", name: "Framboos Glycolic Night Serum", tier: "$$", category: "Active", actives: ["AHA", "BHA"], link: "https://amzn.to/3VjLpXk", usage: "PM only", tip: "Powerful AHA/BHA blend - start 2x/week, PM only" },
  { id: 5, brand: "The Ordinary", name: "Hyaluronic Acid 2% + B5", tier: "$", category: "Serum", actives: ["Hyaluronic Acid"], link: "https://amzn.to/49ZzT1e", usage: "AM/PM", tip: "Apply on damp skin - pulls moisture deep into dermis" },
  { id: 6, brand: "Estée Lauder", name: "Advanced Night Repair", tier: "$$", category: "Serum", actives: ["Bifida Ferment"], link: "https://amzn.to/3Vi0mKz", usage: "PM", tip: "Overnight repair serum - the gold standard for anti-aging" },
  { id: 7, brand: "The Ordinary", name: "Retinol 0.5%", tier: "$", category: "Active", actives: ["Retinol"], link: "https://amzn.to/3VjLpXk", usage: "PM only", tip: "Start 2x/week - PM only. SPF next morning is mandatory." },
  { id: 8, brand: "Tatcha", name: "Dewy Skin Cream", tier: "$$", category: "Moisturizer", actives: ["Ceramides", "Botanicals"], link: "https://amzn.to/3Vi0mKz", usage: "AM/PM", tip: "Rich occlusive moisturizer seals in every layer beneath it" },
  { id: 9, brand: "Neutrogena", name: "Hydro Boost Water Gel", tier: "$", category: "Moisturizer", actives: ["Hyaluronic Acid"], link: "https://amzn.to/49ZzT1e", usage: "AM/PM", tip: "Lightweight gel moisture - ideal for oily or combo skin" },
  { id: 10, brand: "Supergoop!", name: "Unseen Sunscreen SPF 40", tier: "$", category: "SPF", actives: ["Chemical SPF"], link: "https://amzn.to/49ZzT1e", usage: "AM only", tip: "Invisible, weightless finish - non-negotiable final AM step" }
];

const CONFLICT_RULES = [
  {
    test: o => o.some(p => p.actives.includes("Retinol")) && o.some(p => p.actives.includes("Salicylic Acid")),
    severity: "high", title: "Retinol + Salicylic Acid",
    reason: "Both are potent actives. Combined, they can severely compromise your skin barrier.",
    solution: "Use BHA in AM and Retinol strictly in PM."
  },
  {
    test: o => o.some(p => p.actives.includes("Retinol")) && o.some(p => p.actives.includes("AHA")),
    severity: "high", title: "Retinol + AHA/BHA Blend",
    reason: "Combining these significantly amplifies irritation risk.",
    solution: "Alternate nights only. Never apply both in the same session."
  }
];

function StepCard({ item, isAM }) {
  const accent = isAM ? C.bamboo : C.green;
  const accentLight = isAM ? C.bambooLight : C.greenLight;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "13px 14px", marginBottom: 8, borderLeft: `3px solid ${item.isOwned ? accent : C.border}` }}>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: accent }}>{item.step}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: accent, textTransform: "uppercase" }}>{item.label}</span>
            <a href={item.product.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.green, textDecoration: "none", fontWeight: 600 }}>Shop</a>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{item.product.brand}</div>
          <div style={{ fontSize: 12, color: C.sub }}>{item.product.name}</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(1);
  const [owned, setOwned] = useState(new Set());

  const toggle = id => setOwned(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  const ownedProducts = PRODUCTS.filter(p => owned.has(p.id));
  const activeConflicts = CONFLICT_RULES.filter(r => r.test(ownedProducts));

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "sans-serif", padding: "20px" }}>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Leaf size={24} color={C.green} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text }}>Zen Skincare Garden</h1>
        </div>

        {step === 1 && (
          <div style={{ background: C.card, borderRadius: 20, padding: "20px" }}>
            <h2 style={{ fontSize: 18, marginBottom: 15 }}>Select Products You Own</h2>
            {PRODUCTS.map(p => (
              <div key={p.id} onClick={() => toggle(p.id)} style={{ padding: "10px", border: `1px solid ${owned.has(p.id) ? C.green : C.border}`, borderRadius: "10px", marginBottom: "8px", cursor: "pointer", background: owned.has(p.id) ? C.greenLight : "transparent" }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.brand}</div>
                <div style={{ fontSize: 12, color: C.sub }}>{p.name}</div>
              </div>
            ))}
            <button onClick={() => setStep(2)} style={{ width: "100%", padding: "12px", background: C.green, color: "white", border: "none", borderRadius: "10px", fontWeight: 700, marginTop: "10px" }}>Generate Routine</button>
          </div>
        )}

        {step === 2 && (
          <div>
            {activeConflicts.length > 0 && (
              <div style={{ background: C.dangerLight, border: `1px solid ${C.danger}`, borderRadius: "10px", padding: "15px", marginBottom: "20px" }}>
                <div style={{ color: C.danger, fontWeight: 700, display: "flex", alignItems: "center", gap: "5px" }}><AlertTriangle size={16}/> Conflict Alert</div>
                <div style={{ fontSize: 12, marginTop: "5px" }}>{activeConflicts[0].reason}</div>
              </div>
            )}
            <h3 style={{ color: C.bamboo }}>Morning</h3>
            {PRODUCTS.filter(p => p.usage.includes("AM")).map((p, i) => <StepCard key={p.id} item={{step: i+1, label: p.category, product: p, isOwned: owned.has(p.id)}} isAM={true} />)}
            <h3 style={{ color: C.green, marginTop: "20px" }}>Evening</h3>
            {PRODUCTS.filter(p => p.usage.includes("PM")).map((p, i) => <StepCard key={p.id} item={{step: i+1, label: p.category, product: p, isOwned: owned.has(p.id)}} isAM={false} />)}
            <button onClick={() => setStep(1)} style={{ width: "100%", padding: "12px", background: C.border, color: C.text, border: "none", borderRadius: "10px", fontWeight: 700, marginTop: "20px" }}>Back to Shelf</button>
          </div>
        )}
      </div>
    </div>
  );
}
