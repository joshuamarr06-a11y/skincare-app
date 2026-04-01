1 -import { useState } from 'react'                             
        2 -import reactLogo from './assets/react.svg'            
        3 -import viteLogo from '/vite.svg'                             
        4 -import './App.css'                                     
        1 +import { useState } from "react";                            
        2 +import { Sun, Moon, Leaf, AlertTriangle, ShoppingBag, 
          + X, Check, Activity, Shield, ChevronRight } from             
          +"lucide-react";                                        
        3                                                        
        4 -function App() {                                      
        5 -  const [count, setCount] = useState(0)               
        4 +// ── Design Tokens ──                                
        5 +const C = {                                           
        6 +  bg:          "#F8F6F1",                             
        7 +  card:        "#FFFFFF",                             
        8 +  green:       "#4F7942",                             
        9 +  greenLight:  "#EDF3EB",                             
       10 +  greenMid:    "#C5D9C2",                             
       11 +  bamboo:      "#C4956A",                             
       12 +  bambooLight: "#F7EEE4",                             
       13 +  text:        "#2D3030",                             
       14 +  sub:         "#7A7A6E",                             
       15 +  border:      "#E5E2DA",                             
       16 +  danger:      "#B94040",                             
       17 +  dangerLight: "#FDF2F2",                             
       18 +  warn:        "#A07020",                             
       19 +  warnLight:   "#FDF8EE",                             
       20 +};                                                    
       21
       22 +// ── Data ──                                         
       23 +const PRODUCTS = [                                    
       24 +  { id:1,  brand:"The Ordinary",  name:"Squalane      
          +Cleanser",            tier:"$",                       
          +category:"Cleanser",    actives:["Squalane"],         
          +   link:"https://amzn.to/link1",  usage:"AM/PM",      
          +tip:"Gentle oil-based cleanse — perfect first step or 
          + solo wash" },                                        
       25 +  { id:2,  brand:"Fresh",         name:"Soy Face      
          +Cleanser",            tier:"$$", category:"Cleanser", 
          +    actives:["Soy","Botanicals"],                     
          +link:"https://amzn.to/link2",  usage:"AM/PM",         
          +tip:"Botanical gel cleanser — melts makeup without    
          +stripping" },                                         
       26 +  { id:3,  brand:"Paula's Choice",name:"BHA Liquid    
          +Exfoliant",         tier:"$",  category:"Active",     
          +  actives:["Salicylic                                 
          +Acid","BHA"],link:"https://amzn.to/link3",            
          +usage:"AM/PM",  tip:"2% salicylic acid unclogs pores  
          +— ideal for oily & acne-prone" },                     
       27 +  { id:4,  brand:"Drunk Elephant",name:"Framboos      
          +Glycolic Night Serum",tier:"$$", category:"Active",   
          +    actives:["AHA","BHA"],                            
          +link:"https://amzn.to/link4",  usage:"PM              
          +only",tip:"Powerful AHA/BHA blend — start 2x/week, PM 
          + only" },                                             
       28 +  { id:5,  brand:"The Ordinary",  name:"Hyaluronic    
          +Acid 2%+B5",        tier:"$",   category:"Serum",     
          +   actives:["Hyaluronic Acid"],                       
          +link:"https://amzn.to/link5",  usage:"AM/PM",         
          +tip:"Apply on damp skin — pulls moisture deep into    
          +dermis" },                                            
       29 +  { id:6,  brand:"Estée Lauder",  name:"Advanced      
          +Night Repair",        tier:"$$", category:"Serum",    
          +    actives:["Bifida Ferment"],                       
          +link:"https://amzn.to/link6",  usage:"PM",            
          +tip:"Overnight repair serum — the gold standard for   
          +anti-aging" },                                        
       30 +  { id:7,  brand:"The Ordinary",  name:"Retinol       
          +0.5%",                 tier:"$",   category:"Active", 
          +      actives:["Retinol"],                            
          +link:"https://amzn.to/link7",  usage:"PM              
          +only",tip:"Start 2x/week — PM only. SPF next morning  
          +is mandatory." },                                     
       31 +  { id:8,  brand:"Tatcha",        name:"Dewy Skin     
          +Cream",              tier:"$$",                       
          +category:"Moisturizer", actives:["Ceramides","Botanic 
          +als"],link:"https://amzn.to/link8", usage:"AM/PM",    
          +tip:"Rich occlusive moisturizer — seals in every      
          +layer beneath it" },                                  
       32 +  { id:9,  brand:"Neutrogena",    name:"Hydro Boost   
          +Water Gel",        tier:"$",                          
          +category:"Moisturizer", actives:["Hyaluronic Acid"],  
          +    link:"https://amzn.to/link9",  usage:"AM/PM",     
          +tip:"Lightweight gel moisture — ideal for oily or     
          +combo skin" },                                        
       33 +  { id:10, brand:"Supergoop!",    name:"Unseen        
          +Sunscreen SPF 40",      tier:"$",  category:"SPF",    
          +      actives:["Chemical SPF"],                       
          +link:"https://amzn.to/link10", usage:"AM              
          +only",tip:"Invisible, weightless finish —             
          +non-negotiable final AM step" },                      
       34 +];                                                    
       35 +                                                      
       36 +const CONFLICT_RULES = [                              
       37 +  {                                                   
       38 +    test: o => o.some(p =>                            
          +p.actives.includes("Retinol")) && o.some(p =>         
          +p.actives.includes("Salicylic Acid")),                
       39 +    a: "The Ordinary Retinol 0.5%", b: "Paula's       
          +Choice BHA Liquid Exfoliant",                         
       40 +    severity: "high", title: "Retinol + Salicylic     
          +Acid",                                                
       41 +    reason: "Both are potent actives that accelerate  
          +cell turnover. Combined, they can severely compromise 
          + your skin barrier — causing peeling, burning, and    
          +lasting sensitivity.",                                
       42 +    solution: "Use Paula's Choice BHA in AM (or       
          +alternate evenings). Keep Retinol strictly PM. Never  
          +apply both in the same session."                      
       43 +  },                                                  
       44 +  {                                                   
       45 +    test: o => o.some(p =>                            
          +p.actives.includes("Retinol")) && o.some(p =>         
          +p.actives.includes("AHA")),                           
       46 +    a: "The Ordinary Retinol 0.5%", b: "Drunk         
          +Elephant Framboos Glycolic Night Serum",              
       47 +    severity: "high", title: "Retinol + AHA/BHA       
          +Blend",                                               
       48 +    reason: "Combining a retinoid with an AHA/BHA     
          +exfoliant significantly amplifies irritation risk,    
          +over-exfoliation, and photosensitivity.",             
       49 +    solution: "Alternate nights only: Framboos on     
          +Mon/Wed/Fri — Retinol on Tue/Thu/Sat. Always follow   
          +with SPF the next morning."                           
       50 +  },                                                  
       51 +  {                                                   
       52 +    test: o => o.some(p =>                            
          +p.actives.includes("Salicylic Acid")) && o.some(p =>  
          +p.actives.includes("AHA")),                           
       53 +    a: "Paula's Choice BHA Liquid Exfoliant", b:      
          +"Drunk Elephant Framboos Glycolic Night Serum",       
       54 +    severity: "medium", title: "Double Exfoliant",    
       55 +    reason: "Using two exfoliating actives together   
          +risks over-exfoliation — redness, tightness, and a    
          +damaged moisture barrier.",                           
       56 +    solution: "Use only one exfoliant per session.    
          +BHA in AM, Framboos in PM — or alternate days."       
       57 +  },                                                  
       58 +];                                                    
       59 +                                                      
       60 +const CAT_META = {                                    
       61 +  Cleanser:    { color:"#4A90C4", bg:"#EDF4FB" },     
       62 +  Serum:       { color:"#8B5CF6", bg:"#F5F0FF" },     
       63 +  Active:      { color:"#C04040", bg:"#FDF2F2" },     
       64 +  Moisturizer: { color:"#4F7942", bg:"#EDF3EB" },     
       65 +  SPF:         { color:"#B07020", bg:"#FDF8EE" },     
       66 +};                                                    
       67 +                                                      
       68 +// ── Algorithm ──                                    
       69 +function buildRoutine(ownedIds) {                     
       70 +  const owned = PRODUCTS.filter(p =>                  
          +ownedIds.has(p.id));                                  
       71 +  const conflicts = CONFLICT_RULES.filter(r =>        
          +r.test(owned));                                       
       72 +  const get = cat => owned.find(p => p.category ===   
          +cat);                                                 
       73 +                                                      
       74 +  const amCleanser   = get("Cleanser")    ||          
          +PRODUCTS[0];                                          
       75 +  const amSerum      = owned.find(p => p.category === 
          + "Serum" && !p.actives.includes("Bifida Ferment")) || 
          + PRODUCTS[4];                                         
       76 +  const amSPF        = get("SPF")          ||         
          +PRODUCTS[9];                                          
       77 +  const pmCleanser   = get("Cleanser")    ||          
          +PRODUCTS[1];                                          
       78 +  const pmSerum      = get("Serum")       ||          
          +PRODUCTS[5];                                          
       79 +  const pmActive     = get("Active");                 
       80 +  const pmMoisturizer= get("Moisturizer") ||          
          +PRODUCTS[7];                                          
       81 +                                                      
       82 +  const am = [                                        
       83 +    { step:1, label:"Cleanse",  product:amCleanser,   
          +  isOwned:ownedIds.has(amCleanser.id),                
          +note:amCleanser.tip },                                
       84 +    { step:2, label:"Serum",    product:amSerum,      
          +  isOwned:ownedIds.has(amSerum.id),                   
          +note:amSerum.tip },                                   
       85 +    { step:3, label:"Protect",  product:amSPF,        
          +  isOwned:ownedIds.has(amSPF.id),         note:"Last  
          +step every single morning — never skip",              
          +required:true },                                      
       86 +  ];                                                  
       87 +                                                      
       88 +  const pm = [                                        
       89 +    { step:1, label:"Cleanse",  product:pmCleanser,   
          +  isOwned:ownedIds.has(pmCleanser.id),                
          +note:pmCleanser.tip },                                
       90 +    { step:2, label:"Serum",    product:pmSerum,      
          +  isOwned:ownedIds.has(pmSerum.id),                   
          +note:pmSerum.tip },                                   
       91 +  ];                                                  
       92 +  if (pmActive) pm.push({ step:3, label:"Active       
          +Treatment", product:pmActive,                         
          +isOwned:ownedIds.has(pmActive.id),                    
          +note:`${pmActive.tip} — PM only, never AM` });        
       93 +  pm.push({ step:pm.length+1, label:"Moisturize",     
          +product:pmMoisturizer,                                
          +isOwned:ownedIds.has(pmMoisturizer.id),               
          +note:pmMoisturizer.tip });                            
       94 +                                                      
       95 +  return { am, pm, conflicts };                       
       96 +}                                                     
       97 +                                                      
       98 +// ── UI Components ──                                
       99 +function TierBadge({ tier }) {                        
      100 +  return <span style={{ fontSize:10, fontWeight:700,  
          +color:C.bamboo, background:C.bambooLight,             
          +padding:"1px 7px", borderRadius:999 }}>{tier}</span>; 
      101 +}                                                     
      102 +                                                      
      103 +function CatBadge({ category }) {                     
      104 +  const m = CAT_META[category] || {};                 
      105 +  return <span style={{ fontSize:9, fontWeight:700,   
          +color:m.color, background:m.bg, padding:"2px 7px",    
          +borderRadius:999, letterSpacing:0.6,                  
          +textTransform:"uppercase" }}>{category}</span>;       
      106 +}                                                     
      107 +                                                      
      108 +function StepCard({ item, isAM }) {                   
      109 +  const accent = isAM ? C.bamboo : C.green;           
      110 +  const accentLight = isAM ? C.bambooLight :          
          +C.greenLight;                                         
      111    return (
      112 -    <>                                                
      113 -      <div>                                           
      114 -        <a href="https://vitejs.dev" target="_blank"> 
      115 -          <img src={viteLogo} className="logo"        
          -alt="Vite logo" />                                    
      116 -        </a>                                          
      117 -        <a href="https://react.dev" target="_blank">  
      118 -          <img src={reactLogo} className="logo react" 
          - alt="React logo" />                                  
      119 -        </a>                                          
      112 +    <div style={{ background:C.card, border:`1px      
          +solid ${C.border}`, borderRadius:14, padding:"13px    
          +14px",                                                
      113 +      marginBottom:8, boxShadow:"0 1px 6px            
          +rgba(0,0,0,0.04)",                                    
      114 +      borderLeft:`3px solid ${item.isOwned ||         
          +item.required ? accent : C.border}` }}>               
      115 +      <div style={{ display:"flex", gap:10,           
          +alignItems:"flex-start" }}>                           
      116 +        <div style={{ width:26, height:26,            
          +borderRadius:"50%", background:accentLight,           
          +flexShrink:0,                                         
      117 +          display:"flex", alignItems:"center",        
          +justifyContent:"center", fontSize:11, fontWeight:800, 
          + color:accent, marginTop:1 }}>                        
      118 +          {item.step}                                 
      119 +        </div>                                        
      120 +        <div style={{ flex:1 }}>                      
      121 +          <div style={{ display:"flex",               
          +justifyContent:"space-between", alignItems:"center",  
          +marginBottom:3 }}>                                    
      122 +            <div style={{ display:"flex",             
          +alignItems:"center", gap:5 }}>                        
      123 +              <span style={{ fontSize:9,              
          +fontWeight:700, color:accent, letterSpacing:1.1,      
          +textTransform:"uppercase" }}>{item.label}</span>      
      124 +              {!item.isOwned && <span style={{        
          +fontSize:8, color:C.bamboo, background:C.bambooLight, 
          + padding:"1px 5px", borderRadius:999, fontWeight:700  
          +}}>Rec.</span>}                                       
      125 +            </div>                                    
      126 +            <a href={item.product.link}               
          +target="_blank" rel="noopener noreferrer"             
      127 +              style={{ display:"flex",                
          +alignItems:"center", gap:3, fontSize:11,              
          +color:C.green, textDecoration:"none", fontWeight:600  
          +}}>                                                   
      128 +              <ShoppingBag size={11}/> Shop           
      129 +            </a>                                      
      130 +          </div>                                      
      131 +          <div style={{ fontSize:13, fontWeight:700,  
          +color:C.text, marginBottom:1                          
          +}}>{item.product.brand}</div>                         
      132 +          <div style={{ fontSize:12, color:C.sub,     
          +marginBottom:6 }}>{item.product.name}</div>           
      133 +          <div style={{ display:"flex", gap:5,        
          +marginBottom:6 }}>                                    
      134 +            <TierBadge tier={item.product.tier}/>     
      135 +            <CatBadge                                 
          +category={item.product.category}/>                    
      136 +          </div>                                      
      137 +          <div style={{ fontSize:11, color:C.sub,     
          +lineHeight:1.55, fontStyle:"italic"                   
          +}}>{item.note}</div>                                  
      138 +        </div>                                        
      139        </div>
      140 -      <h1>Vite + React</h1>                           
      141 -      <div className="card">                          
      142 -        <button onClick={() => setCount((count) =>    
          -count + 1)}>                                          
      143 -          count is {count}                            
      140 +    </div>                                            
      141 +  );                                                  
      142 +}                                                     
      143 +                                                      
      144 +function ConflictModal({ conflicts, onClose }) {      
      145 +  return (                                            
      146 +    <div style={{ position:"fixed", inset:0,          
          +background:"rgba(20,20,15,0.50)", display:"flex",     
      147 +      alignItems:"center", justifyContent:"center",   
          +zIndex:1000, padding:16 }}>                           
      148 +      <div style={{ background:C.card,                
          +borderRadius:22, padding:"26px 22px", maxWidth:460,   
          +width:"100%",                                         
      149 +        boxShadow:"0 24px 64px rgba(0,0,0,0.18)" }}>  
      150 +        <div style={{ display:"flex",                 
          +justifyContent:"space-between",                       
          +alignItems:"flex-start", marginBottom:18 }}>          
      151 +          <div style={{ display:"flex", gap:10,       
          +alignItems:"center" }}>                               
      152 +            <div style={{ width:38, height:38,        
          +borderRadius:"50%", background:C.dangerLight,         
      153 +              display:"flex", alignItems:"center",    
          +justifyContent:"center", flexShrink:0 }}>             
      154 +              <AlertTriangle size={18}                
          +color={C.danger}/>                                    
      155 +            </div>                                    
      156 +            <div>                                     
      157 +              <div style={{ fontSize:16,              
          +fontWeight:800, color:C.text }}>Conflicts             
          +Detected</div>                                        
      158 +              <div style={{ fontSize:12, color:C.sub  
          +}}>{conflicts.length}                                 
          +issue{conflicts.length>1?"s":""} found on your        
          +shelf</div>                                           
      159 +            </div>                                    
      160 +          </div>                                      
      161 +          <button onClick={onClose} style={{          
          +background:"transparent", border:"none",              
          +cursor:"pointer", color:C.sub, padding:4 }}>          
      162 +            <X size={20}/>                            
      163 +          </button>                                   
      164 +        </div>                                        
      165 +                                                      
      166 +        {conflicts.map((c,i) => (                     
      167 +          <div key={i} style={{ background:c.severity 
          +==="high"?C.dangerLight:C.warnLight,                  
      168 +            border:`1px solid                         
          +${c.severity==="high"?"#F0BABA":"#EDD59A"}`,          
      169 +            borderRadius:14, padding:"14px 15px",     
          +marginBottom:10 }}>                                   
      170 +            <div style={{ display:"flex",             
          +justifyContent:"space-between", alignItems:"center",  
          +marginBottom:7 }}>                                    
      171 +              <div style={{ fontSize:13,              
          +fontWeight:700,                                       
          +color:c.severity==="high"?C.danger:C.warn }}>         
      172 +                {c.title}                             
      173 +              </div>                                  
      174 +              <span style={{ fontSize:9,              
          +fontWeight:700, padding:"2px 8px", borderRadius:999,  
      175 +                                                      
          +background:c.severity==="high"?C.danger:C.warn,       
          +color:"#fff", letterSpacing:0.8 }}>                   
      176 +                {c.severity==="high"?"HIGH            
          +RISK":"MODERATE"}                                     
      177 +              </span>                                 
      178 +            </div>                                    
      179 +            <div style={{ fontSize:12, color:C.sub,   
          +lineHeight:1.65, marginBottom:10 }}>{c.reason}</div>  
      180 +            <div style={{ display:"flex", gap:6,      
          +alignItems:"flex-start" }}>                           
      181 +              <Check size={13} color={C.green}        
          +style={{ flexShrink:0, marginTop:1 }}/>               
      182 +              <div style={{ fontSize:12,              
          +fontWeight:600, color:C.green, lineHeight:1.55        
          +}}>{c.solution}</div>                                 
      183 +            </div>                                    
      184 +          </div>                                      
      185 +        ))}                                           
      186 +                                                      
      187 +        <button onClick={onClose} style={{            
          +width:"100%", background:C.green, color:"#fff",       
          +border:"none",                                        
      188 +          borderRadius:12, padding:"13px 0",          
          +fontWeight:700, fontSize:14, cursor:"pointer",        
          +marginTop:4,                                          
      189 +          fontFamily:"inherit" }}>                    
      190 +          Understood — I'll follow the guidance       
      191          </button>
      192 -        <p>                                           
      193 -          Edit <code>src/App.jsx</code> and save to   
          -test HMR                                              
      194 -        </p>                                          
      192        </div>
      193 -      <p className="read-the-docs">                   
      194 -        Click on the Vite and React logos to learn    
          -more                                                  
      195 -      </p>                                            
      196 -    </>                                               
      197 -  )                                                   
      193 +    </div>                                            
      194 +  );                                                  
      195  }
      196
      197 -export default App                                    
      197 +// ── Main App ──                                     
      198 +export default function App() {                       
      199 +  const [step, setStep] = useState(1);                
      200 +  const [profile, setProfile] = useState({            
          +skinType:"", goal:"", workedOut:null });              
      201 +  const [owned, setOwned] = useState(new Set());      
      202 +  const [routine, setRoutine] = useState(null);       
      203 +  const [showConflict, setShowConflict] =             
          +useState(false);                                      
      204 +                                                      
      205 +  const toggle = id => setOwned(prev => { const s=new 
          + Set(prev); s.has(id)?s.delete(id):s.add(id); return  
          +s; });                                                
      206 +                                                      
      207 +  const handleBuild = () => {                         
      208 +    const r = buildRoutine(owned);                    
      209 +    setRoutine(r);                                    
      210 +    setStep(3);                                       
      211 +    if (r.conflicts.length > 0)                       
          +setTimeout(()=>setShowConflict(true), 350);           
      212 +  };                                                  
      213 +                                                      
      214 +  const canStep1 = profile.skinType && profile.goal   
          +&& profile.workedOut !== null;                        
      215 +                                                      
      216 +  const Btn = ({ onClick, disabled, children, outline 
          + }) => (                                              
      217 +    <button onClick={onClick} disabled={disabled}     
          +style={{                                              
      218 +      background:                                     
          +outline?"transparent":disabled?"#E5E2DA":C.green,     
      219 +      color: outline?C.sub:disabled?C.sub:"#fff",     
      220 +      border: outline?`1.5px solid                    
          +${C.border}`:"none",                                  
      221 +      borderRadius:13, padding:"13px 0",              
          +width:"100%", fontWeight:700, fontSize:14,            
      222 +      cursor:disabled?"default":"pointer",            
          +fontFamily:"inherit", transition:"opacity 0.15s",     
      223 +      display:"flex", alignItems:"center",            
          +justifyContent:"center", gap:6                        
      224 +    }}>{children}</button>                            
      225 +  );                                                  
      226 +                                                      
      227 +  return (                                            
      228 +    <div style={{ minHeight:"100vh", background:C.bg, 
          + fontFamily:"'Inter','Segoe UI',sans-serif",          
          +padding:"28px 16px" }}>                               
      229 +      <div style={{ maxWidth:680, margin:"0 auto" }}> 
      230 +                                                      
      231 +        {/* Header */}                                
      232 +        <div style={{ textAlign:"center",             
          +marginBottom:28 }}>                                   
      233 +          <div style={{ display:"flex",               
          +alignItems:"center", justifyContent:"center", gap:8,  
          +marginBottom:5 }}>                                    
      234 +            <Leaf size={22} color={C.green}/>         
      235 +            <h1 style={{ fontSize:24, fontWeight:800, 
          + color:C.text, margin:0, letterSpacing:-0.5 }}>Zen    
          +Skincare Garden</h1>                                  
      236 +          </div>                                      
      237 +          <p style={{ color:C.sub, fontSize:13,       
          +margin:0, letterSpacing:0.2 }}>Your ritual, rooted in 
          + science</p>                                          
      238 +        </div>                                        
      239 +                                                      
      240 +        {/* Progress Indicator */}                    
      241 +        {step < 3 && (                                
      242 +          <div style={{ display:"flex",               
          +alignItems:"center", justifyContent:"center", gap:6,  
          +marginBottom:24 }}>                                   
      243 +            {[{n:1,label:"Your                        
          +Profile"},{n:2,label:"Your                            
          +Shelf"}].map(({n,label},i)=>(                         
      244 +              <div key={n} style={{ display:"flex",   
          +alignItems:"center", gap:6 }}>                        
      245 +                <div style={{ display:"flex",         
          +alignItems:"center", gap:6 }}>                        
      246 +                  <div style={{ width:28, height:28,  
          +borderRadius:"50%", display:"flex",                   
          +alignItems:"center",                                  
      247 +                    justifyContent:"center",          
          +fontSize:12, fontWeight:700, transition:"all 0.25s",  
      248 +                                                      
          +background:step>=n?C.green:C.border,                  
          +color:step>=n?"#fff":C.sub }}>                        
      249 +                    {step>n ? <Check size={13}/> : n} 
      250 +                  </div>                              
      251 +                  <span style={{ fontSize:12,         
          +color:step>=n?C.green:C.sub,                          
          +fontWeight:step>=n?600:400 }}>{label}</span>          
      252 +                </div>                                
      253 +                {i<1&&<div style={{ width:28,         
          +height:1.5, background:step>n?C.green:C.border,       
          +margin:"0 2px" }}/>}                                  
      254 +              </div>                                  
      255 +            ))}                                       
      256 +          </div>                                      
      257 +        )}                                            
      258 +                                                      
      259 +        {/* ── STEP 1: Profile ── */}                 
      260 +        {step===1 && (                                
      261 +          <div style={{ background:C.card,            
          +borderRadius:22, padding:"28px 26px",                 
      262 +            boxShadow:"0 2px 24px                     
          +rgba(70,90,70,0.09)" }}>                              
      263 +            <h2 style={{ fontSize:22, fontWeight:800, 
          + color:C.text, margin:"0 0 6px" }}>Tell us about your 
          + skin</h2>                                            
      264 +            <p style={{ color:C.sub, fontSize:13,     
          +margin:"0 0 26px", lineHeight:1.6 }}>                 
      265 +              We'll craft a routine that works with   
          +your skin, not against it.                            
      266 +            </p>                                      
      267 +                                                      
      268 +            {[                                        
      269 +              { key:"skinType", label:"Skin Type",    
          +options:["Oily","Dry","Combination","Sensitive"],     
          +accent:C.green, accentLight:C.greenLight },           
      270 +              { key:"goal",     label:"Primary Goal", 
          + options:["Acne                                       
          +Control","Anti-Aging","Glow","Hydration"],            
          +accent:C.bamboo, accentLight:C.bambooLight },         
      271 +            ].map(({ key, label, options, accent,     
          +accentLight })=>(                                     
      272 +              <div key={key} style={{ marginBottom:22 
          + }}>                                                  
      273 +                <div style={{ fontSize:10,            
          +fontWeight:700, color:accent, letterSpacing:1.4,      
      274 +                  textTransform:"uppercase",          
          +marginBottom:10 }}>{label}</div>                      
      275 +                <div style={{ display:"flex",         
          +flexWrap:"wrap", gap:8 }}>                            
      276 +                  {options.map(opt=>(                 
      277 +                    <button key={opt}                 
          +onClick={()=>setProfile(p=>({...p,[key]:opt}))}       
      278 +                      style={{ padding:"9px 18px",    
          +borderRadius:999, fontSize:13, cursor:"pointer",      
          +fontFamily:"inherit",                                 
      279 +                                                      
          +fontWeight:profile[key]===opt?700:400,                
          +transition:"all 0.15s",                               
      280 +                        border:`1.5px solid           
          +${profile[key]===opt?accent:C.border}`,               
      281 +                        background:profile[key]===opt 
          +?accentLight:"transparent",                           
      282 +                                                      
          +color:profile[key]===opt?accent:C.sub }}>             
      283 +                      {opt}                           
      284 +                    </button>                         
      285 +                  ))}                                 
      286 +                </div>                                
      287 +              </div>                                  
      288 +            ))}                                       
      289 +                                                      
      290 +            <div style={{ marginBottom:28 }}>         
      291 +              <div style={{ fontSize:10,              
          +fontWeight:700, color:C.green, letterSpacing:1.4,     
      292 +                textTransform:"uppercase",            
          +marginBottom:10 }}>Did you work out today?</div>      
      293 +              <div style={{ display:"flex", gap:8 }}> 
      294 +                {[{label:"Yes — I worked              
          +out",val:true},{label:"No workout                     
          +today",val:false}].map(({label,val})=>(               
      295 +                  <button key={String(val)}           
          +onClick={()=>setProfile(p=>({...p,workedOut:val}))}   
      296 +                    style={{ flex:1, padding:"11px    
          +0", borderRadius:12, fontSize:13, cursor:"pointer",   
          +fontFamily:"inherit",                                 
      297 +                                                      
          +fontWeight:profile.workedOut===val?700:400,           
          +transition:"all 0.15s",                               
      298 +                      border:`1.5px solid             
          +${profile.workedOut===val?C.green:C.border}`,         
      299 +                      background:profile.workedOut=== 
          +val?C.greenLight:"transparent",                       
      300 +                                                      
          +color:profile.workedOut===val?C.green:C.sub }}>       
      301 +                    {label}                           
      302 +                  </button>                           
      303 +                ))}                                   
      304 +              </div>                                  
      305 +            </div>                                    
      306 +                                                      
      307 +            <Btn onClick={()=>setStep(2)}             
          +disabled={!canStep1}>                                 
      308 +              <span>Continue to Your Shelf</span>     
      309 +              <ChevronRight size={15}/>               
      310 +            </Btn>                                    
      311 +          </div>                                      
      312 +        )}                                            
      313 +                                                      
      314 +        {/* ── STEP 2: Checklist ── */}               
      315 +        {step===2 && (                                
      316 +          <>                                          
      317 +            <div style={{ background:C.card,          
          +borderRadius:22, padding:"24px 22px",                 
      318 +              boxShadow:"0 2px 24px                   
          +rgba(70,90,70,0.09)", marginBottom:12 }}>             
      319 +              <h2 style={{ fontSize:22,               
          +fontWeight:800, color:C.text, margin:"0 0 5px"        
          +}}>Your Current Shelf</h2>                            
      320 +              <p style={{ color:C.sub, fontSize:13,   
          +margin:"0 0 20px", lineHeight:1.6 }}>                 
      321 +                Check every product you already own.  
          +We'll build your routine around them and fill the     
          +gaps.                                                 
      322 +              </p>                                    
      323 +                                                      
      324 +              <div style={{ display:"grid",           
          +gridTemplateColumns:"1fr 1fr", gap:8 }}>              
      325 +                {PRODUCTS.map(p=>{                    
      326 +                  const checked = owned.has(p.id);    
      327 +                  return (                            
      328 +                    <div key={p.id}                   
          +onClick={()=>toggle(p.id)} style={{                   
      329 +                                                      
          +background:checked?C.greenLight:C.bg,                 
          +borderRadius:14, padding:"13px 14px",                 
      330 +                      cursor:"pointer",               
          +transition:"all 0.15s",                               
      331 +                      border:`1.5px solid             
          +${checked?C.green:C.border}`,                         
      332 +                      boxShadow:checked?"0 2px 10px   
          +rgba(79,121,66,0.12)":"none" }}>                      
      333 +                      <div style={{ display:"flex",   
          +justifyContent:"space-between",                       
          +alignItems:"flex-start", marginBottom:7 }}>           
      334 +                        <CatBadge                     
          +category={p.category}/>                               
      335 +                        <div style={{ width:18,       
          +height:18, borderRadius:"50%", flexShrink:0,          
      336 +                          border:`2px solid           
          +${checked?C.green:C.border}`,                         
      337 +                                                      
          +background:checked?C.green:"transparent",             
      338 +                          display:"flex",             
          +alignItems:"center", justifyContent:"center" }}>      
      339 +                          {checked && <Check          
          +size={11} color="#fff"/>}                             
      340 +                        </div>                        
      341 +                      </div>                          
      342 +                      <div style={{ fontSize:13,      
          +fontWeight:700, color:C.text, marginBottom:1,         
          +lineHeight:1.3 }}>{p.brand}</div>                     
      343 +                      <div style={{ fontSize:11,      
          +color:C.sub, lineHeight:1.4, marginBottom:7           
          +}}>{p.name}</div>                                     
      344 +                      <TierBadge tier={p.tier}/>      
      345 +                    </div>                            
      346 +                  );                                  
      347 +                })}                                   
      348 +              </div>                                  
      349 +            </div>                                    
      350 +                                                      
      351 +            <div style={{ display:"flex", gap:8 }}>   
      352 +              <div style={{ flex:1 }}><Btn outline    
          +onClick={()=>setStep(1)}>Back</Btn></div>             
      353 +              <div style={{ flex:2 }}>                
      354 +                <Btn onClick={handleBuild}>           
      355 +                  <Leaf size={14}/>                   
      356 +                  <span>Grow My Routine</span>        
      357 +                </Btn>                                
      358 +              </div>                                  
      359 +            </div>                                    
      360 +          </>                                         
      361 +        )}                                            
      362 +                                                      
      363 +        {/* ── STEP 3: Dashboard ── */}               
      364 +        {step===3 && routine && (                     
      365 +          <>                                          
      366 +            {/* Profile Bar */}                       
      367 +            <div style={{ background:C.card,          
          +borderRadius:16, padding:"15px 18px",                 
          +marginBottom:12,                                      
      368 +              boxShadow:"0 2px 12px                   
          +rgba(70,90,70,0.07)",                                 
      369 +              display:"flex",                         
          +justifyContent:"space-between", alignItems:"center"   
          +}}>                                                   
      370 +              <div>                                   
      371 +                <div style={{ fontSize:9,             
          +color:C.green, fontWeight:700, letterSpacing:1.4,     
          +marginBottom:3 }}>YOUR RITUAL GARDEN</div>            
      372 +                <div style={{ fontSize:14,            
          +fontWeight:600, color:C.text }}>                      
      373 +                  {profile.skinType} skin             
          +&nbsp;·&nbsp; {profile.goal}                          
      374 +                </div>                                
      375 +              </div>                                  
      376 +              <div style={{ display:"flex", gap:7 }}> 
      377 +                {routine.conflicts.length>0&&(        
      378 +                  <button                             
          +onClick={()=>setShowConflict(true)}                   
      379 +                    style={{ display:"flex",          
          +alignItems:"center", gap:5, padding:"7px 11px",       
          +borderRadius:8,                                       
      380 +                      background:C.dangerLight,       
          +border:`1px solid #F0C0C0`, color:C.danger,           
      381 +                      fontSize:11, fontWeight:700,    
          +cursor:"pointer", fontFamily:"inherit" }}>            
      382 +                    <AlertTriangle size={13}/>        
          +{routine.conflicts.length}                            
          +Conflict{routine.conflicts.length>1?"s":""}           
      383 +                  </button>                           
      384 +                )}                                    
      385 +                <button                               
          +onClick={()=>{setStep(1);setProfile({skinType:"",goal 
          +:"",workedOut:null});setOwned(new                     
          +Set());setRoutine(null);}}                            
      386 +                  style={{ padding:"7px 11px",        
          +borderRadius:8, border:`1px solid ${C.border}`,       
      387 +                    background:"transparent",         
          +color:C.sub, fontSize:11, cursor:"pointer",           
          +fontFamily:"inherit" }}>                              
      388 +                  Restart                             
      389 +                </button>                             
      390 +              </div>                                  
      391 +            </div>                                    
      392 +                                                      
      393 +            {/* Post-Workout */}                      
      394 +            {profile.workedOut && (                   
      395 +              <div style={{ background:"#F0F7FF",     
          +border:"1px solid #C0D8F0", borderRadius:14,          
      396 +                padding:"13px 16px", marginBottom:12, 
          + display:"flex", gap:10 }}>                           
      397 +                <Activity size={16} color="#3A7AC0"   
          +style={{ flexShrink:0, marginTop:1 }}/>               
      398 +                <div>                                 
      399 +                  <div style={{ fontSize:13,          
          +fontWeight:700, color:"#2A5A90", marginBottom:3       
          +}}>Post-Workout Protocol</div>                        
      400 +                  <div style={{ fontSize:12,          
          +color:"#3A6A90", lineHeight:1.65 }}>                  
      401 +                    Rinse sweat from your face        
          +immediately with lukewarm water — sweat left on skin  
          +clogs pores and disrupts your barrier.                
      402 +                    <br/><strong>Daytime:</strong>    
          +Proceed with your AM Routine — finish with SPF.&nbsp; 
      403 +                    <strong>Evening:</strong> Proceed 
          + with your full PM Routine.                           
      404 +                  </div>                              
      405 +                </div>                                
      406 +              </div>                                  
      407 +            )}                                        
      408 +                                                      
      409 +            {/* AM / PM Grid */}                      
      410 +            <div style={{ display:"grid",             
          +gridTemplateColumns:"1fr 1fr", gap:12,                
          +marginBottom:14 }}>                                   
      411 +              {[                                      
      412 +                { label:"Morning Routine", tag:"AM",  
          +icon:<Sun size={15} color={C.bamboo}/>,               
          +bg:C.bambooLight, accent:C.bamboo, steps:routine.am,  
          +isAM:true },                                          
      413 +                { label:"Evening Routine", tag:"PM",  
          +icon:<Moon size={15} color={C.green}/>,               
          +bg:C.greenLight,  accent:C.green,  steps:routine.pm,  
          +isAM:false },                                         
      414 +              ].map(({ label, tag, icon, bg, accent,  
          +steps, isAM })=>(                                     
      415 +                <div key={tag}>                       
      416 +                  <div style={{ display:"flex",       
          +alignItems:"center", gap:8, marginBottom:10 }}>       
      417 +                    <div style={{ width:32,           
          +height:32, borderRadius:"50%", background:bg,         
      418 +                      display:"flex",                 
          +alignItems:"center", justifyContent:"center" }}>      
      419 +                      {icon}                          
      420 +                    </div>                            
      421 +                    <div>                             
      422 +                      <div style={{ fontSize:14,      
          +fontWeight:700, color:C.text }}>{label}</div>         
      423 +                      <div style={{ fontSize:10,      
          +color:C.sub, letterSpacing:0.5 }}>{tag}               
          +Protocol</div>                                        
      424 +                    </div>                            
      425 +                  </div>                              
      426 +                  {steps.map((item,i)=><StepCard      
          +key={i} item={item} isAM={isAM}/>)}                   
      427 +                </div>                                
      428 +              ))}                                     
      429 +            </div>                                    
      430 +                                                      
      431 +            {/* Garden Rules */}                      
      432 +            <div style={{ background:C.card,          
          +borderRadius:16, padding:"18px 20px",                 
      433 +              boxShadow:"0 2px 12px                   
          +rgba(70,90,70,0.07)", borderLeft:`3px solid           
          +${C.bamboo}` }}>                                      
      434 +              <div style={{ fontSize:10,              
          +fontWeight:700, color:C.bamboo, letterSpacing:1.4,    
      435 +                marginBottom:12,                      
          +textTransform:"uppercase" }}>The Garden Rules</div>   
      436 +              {[                                      
      437 +                "SPF is the most important anti-aging 
          + step — wear it every single morning without          
          +exception.",                                          
      438 +                "Introduce one new product at a time. 
          + Wait 2 weeks before adding another.",                
      439 +                "Start actives (Retinol, AHA, BHA) at 
          + 2x per week and build up slowly.",                   
      440 +                "Always layer thinnest to thickest —  
          +water serums before creams, creams before oils.",     
      441 +                "If skin feels tight, stinging, or    
          +red — pull back. Barrier health is everything."       
      442 +              ].map((rule,i)=>(                       
      443 +                <div key={i} style={{ display:"flex", 
          + gap:9, marginBottom:8, alignItems:"flex-start" }}>   
      444 +                  <Leaf size={12} color={C.green}     
          +style={{ flexShrink:0, marginTop:2 }}/>               
      445 +                  <span style={{ fontSize:12,         
          +color:C.sub, lineHeight:1.65 }}>{rule}</span>         
      446 +                </div>                                
      447 +              ))}                                     
      448 +            </div>                                    
      449 +                                                      
      450 +            <p style={{ textAlign:"center",           
          +fontSize:10, color:"#C0BDB5", marginTop:18,           
          +lineHeight:1.6 }}>                                    
      451 +              For informational purposes only.        
          +Consult a licensed dermatologist for medical skin     
          +concerns.                                             
      452 +            </p>                                      
      453 +          </>                                         
      454 +        )}                                            
      455 +                                                      
      456 +        {/* Conflict Modal */}                        
      457 +        {showConflict && routine && (                 
      458 +          <ConflictModal                              
          +conflicts={routine.conflicts}                         
          +onClose={()=>setShowConflict(false)}/>                
      459 +        )}                                            
      460 +      </div>                                          
      461 +    </div>                                            
      462 +  );                                                  
      463 +}                  
