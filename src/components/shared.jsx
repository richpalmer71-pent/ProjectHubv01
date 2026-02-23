import { useState } from "react";

export const C = { white:"#FFFFFF", black:"#000000", red:"#ff7276", yellow:"#edf100", blue:"#05c3da", g98:"#fafafa", g94:"#f0f0f0", g88:"#e0e0e0", g70:"#b3b3b3", g50:"#808080" };
export const ff = "'ABC Diatype','Suisse Intl','Helvetica Neue',Helvetica,Arial,sans-serif";
export const hd = { fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase" };
export const bd = { fontWeight:400, letterSpacing:"0.005em" };
export const bi = { width:"100%", boxSizing:"border-box", padding:"10px 12px", border:`1px solid ${C.g88}`, borderRadius:0, fontSize:13, fontFamily:ff, color:C.black, background:C.white, outline:"none", transition:"border-color 0.15s", fontWeight:400, letterSpacing:"0.005em" };
export const g = (cols) => ({ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:16 });

export const LOCALES = ["UK (ENG)","US (ENG)","CAN (ENG)","CAN (FR)","DE (GER)","FR (FR)"];
export const DEFAULT_USERS = ["richard.palmer@pentland.com","farah.yousaf@pentland.com"];
export const LANG = {"DE (GER)":"German","FR (FR)":"French","CAN (FR)":"French"};

export const tx = async (fields, locale) => {
  const lang = LANG[locale];
  if (!lang) return fields;
  const filled = Object.entries(fields).filter(([k,v]) => v && typeof v === "string" && v.trim());
  if (!filled.length) return fields;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
        messages:[{role:"user",content:"Translate these marketing content fields to "+lang+". Return ONLY a JSON object with the same keys. Keep brand names, URLs and technical terms unchanged.\n\n"+JSON.stringify(Object.fromEntries(filled))}]
      })
    });
    const d = await r.json();
    const t = d.content[0].text.replace(/```json|```/g,"").trim();
    return {...fields, ...JSON.parse(t)};
  } catch(e) { return fields; }
};

export const Field = ({label, required, hint, children}) => (
  <div>
    <label style={{display:"block",fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:6,lineHeight:1}}>
      {label}{required && <span style={{color:C.red,marginLeft:3}}>*</span>}
    </label>
    {hint && <span style={{display:"block",fontSize:11,color:C.g50,marginBottom:5,lineHeight:1.4,fontFamily:ff}}>{hint}</span>}
    {children}
  </div>
);

export const Input = ({value, onChange, placeholder, type="text"}) => {
  const [f,setF] = useState(false);
  return <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...bi,borderColor:f?C.black:C.g88}} onFocus={()=>setF(true)} onBlur={()=>setF(false)} />;
};

export const TextArea = ({value, onChange, placeholder, rows=3}) => {
  const [f,setF] = useState(false);
  return <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{...bi,resize:"vertical",minHeight:60,borderColor:f?C.black:C.g88}} onFocus={()=>setF(true)} onBlur={()=>setF(false)} />;
};

export const Chip = ({label, active, onClick}) => (
  <button onClick={onClick} style={{padding:"7px 14px",border:`1px solid ${active?C.black:C.g88}`,borderRadius:0,background:active?C.black:C.white,color:active?C.white:C.g50,fontSize:11,...hd,fontFamily:ff,cursor:"pointer",transition:"all 0.15s"}}>{label}</button>
);

export const CG = ({options, selected, onChange}) => (
  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
    {options.map(o => <Chip key={o} label={o} active={selected.includes(o)} onClick={()=>onChange(selected.includes(o)?selected.filter(s=>s!==o):[...selected,o])} />)}
  </div>
);

export const EmailSelect = ({value, onChange, users, onAddUser}) => {
  const [f,setF] = useState(false);
  const [adding,setAdding] = useState(false);
  const [ne,setNe] = useState("");
  const doAdd = () => { const em=ne.trim().toLowerCase(); if(em&&em.includes("@")){onAddUser(em);onChange(em);setNe("");setAdding(false);} };
  if(adding) return (
    <div style={{display:"flex",gap:4}}>
      <input value={ne} onChange={e=>setNe(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doAdd()} placeholder="name@company.com" style={{...bi,flex:1}} autoFocus />
      <button onClick={doAdd} style={{padding:"8px 14px",border:"none",background:C.black,color:C.white,fontSize:10,...hd,fontFamily:ff,cursor:"pointer",whiteSpace:"nowrap"}}>ADD</button>
      <button onClick={()=>setAdding(false)} style={{padding:"8px 10px",border:`1px solid ${C.g88}`,background:C.white,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>X</button>
    </div>
  );
  return (
    <select value={value} onChange={e=>{if(e.target.value==="__add__")setAdding(true);else onChange(e.target.value);}} style={{...bi,borderColor:f?C.black:C.g88,cursor:"pointer"}} onFocus={()=>setF(true)} onBlur={()=>setF(false)}>
      <option value="">— Select —</option>
      {users.map(u=><option key={u} value={u}>{u}</option>)}
      <option value="__add__">+ Add new user</option>
    </select>
  );
};

export const Sec = ({title, num, collapsed, onToggle, accent, bg, children}) => (
  <div style={{border:`1px solid ${C.g88}`,background:bg||C.white}}>
    <button onClick={onToggle} style={{width:"100%",padding:"18px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",border:"none",background:"transparent",cursor:"pointer",fontFamily:ff}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {accent && <div style={{width:3,height:20,background:accent,borderRadius:1}} />}
        <span style={{fontSize:12,...hd,color:C.black,fontFamily:ff}}>{num && <span style={{color:C.g50,marginRight:8}}>{num}</span>}{title}</span>
      </div>
      <span style={{fontSize:18,color:C.g50,transform:collapsed?"rotate(0)":"rotate(180deg)",transition:"transform 0.2s"}}>&#9660;</span>
    </button>
    {!collapsed && <div style={{padding:"0 24px 24px"}}>{children}</div>}
  </div>
);

export const CT = ({label, tag, active, onToggle, accent}) => (
  <button onClick={onToggle} style={{padding:"20px 16px",border:`1px solid ${active?C.black:C.g88}`,background:active?C.black:C.white,cursor:"pointer",fontFamily:ff,transition:"all 0.15s",textAlign:"left",position:"relative",overflow:"hidden"}}>
    {active && <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:accent}} />}
    <div style={{fontSize:12,...hd,color:active?C.white:C.g50,fontFamily:ff}}>{label}</div>
    <div style={{fontSize:9,...hd,color:active?accent:C.g70,fontFamily:ff,marginTop:4}}>{tag}</div>
  </button>
);

export const PageHeader = ({sub, label, desc}) => (
  <div style={{background:C.black,padding:"32px 0 28px"}}>
    <div style={{maxWidth:1200,margin:"0 auto",padding:"0 28px"}}>
      <div style={{fontSize:10,...hd,color:C.g50,fontFamily:ff,marginBottom:8}}>{sub}</div>
      <h1 style={{fontSize:28,...hd,color:C.white,fontFamily:ff,lineHeight:1.1}}>{label}</h1>
      <div style={{width:48,height:2,background:C.red,marginTop:16}} />
      {desc && <p style={{fontSize:12,...bd,color:C.g70,fontFamily:ff,marginTop:12,maxWidth:520,lineHeight:1.6}}>{desc}</p>}
    </div>
  </div>
);
