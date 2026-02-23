import { useState } from "react";

// V4 Design Tokens
export const C = {
  bg:"#ECEEF1", panel:"#F6F7F9", card:"#FFFFFF", black:"#1A1D23",
  red:"#ff7276", yellow:"#edf100", blue:"#05c3da", green:"#34d399",
  g50:"#6B7280", g70:"#9CA3AF", g88:"#E5E7EB", g94:"#F3F4F6",
};
export const ff = "'Helvetica Neue',Helvetica,Arial,sans-serif";
export const hd = { fontWeight:600, letterSpacing:"0.04em", textTransform:"uppercase" };
export const bd = { fontWeight:400 };
export const rad = { borderRadius:10 };
export const bi = { width:"100%", boxSizing:"border-box", padding:"11px 14px", border:`1px solid ${C.g88}`, ...rad, fontSize:14, fontFamily:ff, color:C.black, background:C.card, outline:"none", transition:"border-color 0.2s, box-shadow 0.2s", ...bd };
export const g = (cols) => ({ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:16 });

export const LOCALES = ["UK (ENG)","US (ENG)","CAN (ENG)","CAN (FR)","DE (GER)","FR (FR)"];
export const DEFAULT_USERS = ["richard.palmer@pentland.com","farah.yousaf@pentland.com"];
export const LANG = {"DE (GER)":"German","FR (FR)":"French","CAN (FR)":"French"};

export const tx = async (fields, locale, apiKey) => {
  const lang = LANG[locale]; if (!lang) return fields;
  const filled = Object.entries(fields).filter(([k,v]) => v && typeof v === "string" && v.trim());
  if (!filled.length) return fields;
  const headers = {"Content-Type":"application/json","x-api-key":apiKey||"","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"};
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers,body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:"Translate these marketing content fields to "+lang+". Return ONLY a JSON object with the same keys, no markdown. Keep brand names, URLs and technical terms unchanged.\n\n"+JSON.stringify(Object.fromEntries(filled))}]})});
    const d = await r.json(); const t = d.content[0].text.replace(/```json|```/g,"").trim();
    return {...fields, ...JSON.parse(t)};
  } catch(e) { return fields; }
};

// Icons
export const ICN = {
  playground:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  overview:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  resources:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  toolkit:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  brief:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  approval:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  delivery:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  feedback:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
};

export const MODULES = [
  {key:"playground",label:"PLAYGROUND",sub:"Collaborative Kick Off"},
  {key:"overview",label:"CAMPAIGN OVERVIEW",sub:"The Admin Bit"},
  {key:"resources",label:"RESOURCE MANAGEMENT",sub:"Who Needs Access"},
  {key:"toolkit",label:"CAMPAIGN TOOLKIT",sub:"Shared Resources"},
  {key:"brief",label:"PROJECT BRIEF",sub:"Multi-Channel Hub"},
  {key:"approval",label:"APPROVAL CENTRE",sub:"Project Sign-Off"},
  {key:"delivery",label:"ASSET DELIVERY",sub:"Downloads & DAM"},
  {key:"feedback",label:"FEEDBACK CENTRE",sub:"How Did It Go?"},
];

// Shared Components
export const Card = ({children, style:s}) => (<div style={{background:C.card, border:`1px solid ${C.g88}`, ...rad, padding:"24px 28px", ...s}}>{children}</div>);

export const Field = ({label, required, hint, children}) => (
  <div>
    <label style={{display:"block",fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:7}}>{label}{required&&<span style={{color:C.red,marginLeft:3}}>*</span>}</label>
    {hint&&<span style={{display:"block",fontSize:12,color:C.g70,marginBottom:5,fontFamily:ff,...bd}}>{hint}</span>}
    {children}
  </div>
);

export const Input = ({value, onChange, placeholder, type="text"}) => {
  const [f,setF] = useState(false);
  return <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...bi,borderColor:f?C.blue:C.g88,boxShadow:f?`0 0 0 3px ${C.blue}22`:"none"}} onFocus={()=>setF(true)} onBlur={()=>setF(false)} />;
};

export const TextArea = ({value, onChange, placeholder, rows=3}) => {
  const [f,setF] = useState(false);
  return <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{...bi,resize:"vertical",minHeight:70,borderColor:f?C.blue:C.g88,boxShadow:f?`0 0 0 3px ${C.blue}22`:"none"}} onFocus={()=>setF(true)} onBlur={()=>setF(false)} />;
};

export const Chip = ({label, active, onClick, accent}) => (
  <button onClick={onClick} style={{padding:"8px 16px",border:`1px solid ${active?(accent||C.black):C.g88}`,...rad,background:active?(accent||C.black):C.card,color:active?C.card:C.g50,fontSize:12,fontWeight:500,fontFamily:ff,cursor:"pointer",transition:"all 0.15s"}}>{label}</button>
);

export const CG = ({options, selected, onChange, accent}) => (
  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{options.map(o=><Chip key={o} label={o} active={selected.includes(o)} onClick={()=>onChange(selected.includes(o)?selected.filter(s=>s!==o):[...selected,o])} accent={accent}/>)}</div>
);

export const EmailSelect = ({value, onChange, users, onAddUser}) => {
  const [f,setF] = useState(false);
  const [adding,setAdding] = useState(false);
  const [ne,setNe] = useState("");
  const doAdd = () => { const em=ne.trim().toLowerCase(); if(em&&em.includes("@")){onAddUser(em);onChange(em);setNe("");setAdding(false);} };
  if(adding) return (
    <div style={{display:"flex",gap:4}}>
      <input value={ne} onChange={e=>setNe(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doAdd()} placeholder="name@company.com" style={{...bi,flex:1}} autoFocus />
      <button onClick={doAdd} style={{padding:"8px 14px",border:"none",...rad,background:C.black,color:C.card,fontSize:11,...hd,fontFamily:ff,cursor:"pointer"}}>ADD</button>
      <button onClick={()=>setAdding(false)} style={{padding:"8px 10px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:11,...hd,fontFamily:ff,cursor:"pointer"}}>X</button>
    </div>
  );
  return (
    <select value={value} onChange={e=>{if(e.target.value==="__add__")setAdding(true);else onChange(e.target.value);}} style={{...bi,borderColor:f?C.blue:C.g88,cursor:"pointer"}} onFocus={()=>setF(true)} onBlur={()=>setF(false)}>
      <option value="">Select...</option>
      {users.map(u=><option key={u} value={u}>{u}</option>)}
      <option value="__add__">+ Add new user</option>
    </select>
  );
};

export const Sec = ({title, num, collapsed, onToggle, accent, children}) => (
  <Card>
    <button onClick={onToggle} style={{width:"100%",padding:0,display:"flex",alignItems:"center",justifyContent:"space-between",border:"none",background:"transparent",cursor:"pointer",fontFamily:ff}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {accent&&<div style={{width:4,height:20,...rad,background:accent}}/>}
        <span style={{fontSize:13,...hd,color:C.black,fontFamily:ff}}>{num&&<span style={{color:C.g70,marginRight:8}}>{num}</span>}{title}</span>
      </div>
      <span style={{fontSize:16,color:C.g70,transform:collapsed?"rotate(0)":"rotate(180deg)",transition:"transform 0.2s"}}>&#9660;</span>
    </button>
    {!collapsed&&<div style={{paddingTop:20}}>{children}</div>}
  </Card>
);

export const CT = ({label, tag, active, onToggle, accent}) => (
  <button onClick={onToggle} style={{padding:"18px 16px",border:`1px solid ${active?C.black:C.g88}`,...rad,background:active?C.black:C.card,cursor:"pointer",fontFamily:ff,transition:"all 0.15s",textAlign:"left",position:"relative",overflow:"hidden"}}>
    {active&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:accent,...rad}}/>}
    <div style={{fontSize:13,...hd,color:active?C.card:C.g50,fontFamily:ff}}>{label}</div>
    <div style={{fontSize:10,...hd,color:active?accent:C.g70,fontFamily:ff,marginTop:4}}>{tag}</div>
  </button>
);

export const PageTitle = ({title, sub, accent}) => (
  <div style={{marginBottom:24}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
      {accent&&<div style={{width:7,height:7,borderRadius:4,background:accent}}/>}
      <span style={{fontSize:11,...hd,color:C.g70,fontFamily:ff}}>{sub}</span>
    </div>
    <h1 style={{fontSize:24,...hd,color:C.black,fontFamily:ff,lineHeight:1.2,margin:0,letterSpacing:"0.03em"}}>{title}</h1>
  </div>
);

export const Sidebar = ({view, setView, jobNum}) => (
  <div style={{width:250,flexShrink:0,background:C.card,borderRight:`1px solid ${C.g88}`,display:"flex",flexDirection:"column",minHeight:"100vh",position:"fixed",left:0,top:0,bottom:0,zIndex:10}}>
    <div style={{padding:"28px 22px 20px"}}>
      <div style={{fontSize:10,...hd,color:C.red,fontFamily:ff,letterSpacing:"0.1em"}}>PENTLAND C&C</div>
      <div style={{fontSize:16,...hd,color:C.black,fontFamily:ff,marginTop:2,letterSpacing:"0.02em"}}>PROJECT HUB</div>
    </div>
    {jobNum&&<div style={{margin:"0 14px 14px",padding:"10px 14px",background:C.panel,...rad,border:`1px solid ${C.g88}`}}>
      <div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff}}>CURRENT PROJECT</div>
      <div style={{fontSize:13,fontWeight:600,color:C.black,fontFamily:ff,marginTop:2}}>{jobNum}</div>
    </div>}
    <div style={{padding:"0 10px",flex:1,overflowY:"auto"}}>
      <div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,padding:"8px 12px 6px"}}>MODULES</div>
      {MODULES.map(m=>{const vk=m.key==="brief"?"form":m.key;const active=view===vk;return(
        <button key={m.key} onClick={()=>setView(vk)} style={{width:"100%",padding:"9px 12px",border:"none",borderRadius:8,background:active?C.bg:"transparent",cursor:"pointer",fontFamily:ff,textAlign:"left",display:"flex",alignItems:"center",gap:10,transition:"all 0.15s",marginBottom:1}}>
          <span style={{color:active?C.red:C.g70,display:"flex",flexShrink:0}}>{ICN[m.key]}</span>
          <span style={{fontSize:12,fontWeight:active?600:400,color:active?C.black:C.g50,fontFamily:ff}}>{m.label}</span>
          {active&&<div style={{marginLeft:"auto",width:5,height:5,borderRadius:3,background:C.red,flexShrink:0}}/>}
        </button>
      );})}
    </div>
    <div style={{padding:14,borderTop:`1px solid ${C.g88}`}}>
      <button onClick={()=>setView("project")} style={{width:"100%",padding:"10px",border:`1px solid ${C.g88}`,...rad,background:C.card,cursor:"pointer",fontFamily:ff,fontSize:12,fontWeight:500,color:C.g50}}>BACK TO HUB</button>
    </div>
  </div>
);
