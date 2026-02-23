import { useState } from "react";

const PAID_SIZE_GROUPS = { "PMAX / PPC": ["1200x300","1200x628","1200x1200","960x1200","300x300"], "PAID SOCIAL": ["1080x1080","1080x1350","1080x1920"], "DISPLAY": ["728x90","970x250","300x250","160x600","300x600"], "AFFILIATES": ["336x280","320x50"] };
const EMAIL_TYPES = ["Launch","Product","Promo","Community"];
const WEB_PLACEMENTS = ["Homepage","PLP","PDP","Other"];
const BANNER_TYPES = ["Full Size Hero","Slim Banners","Secondary Banners","Other"];
const LOCALES = ["UK (ENG)","US (ENG)","CAN (ENG)","CAN (FR)","DE (GER)","FR (FR)"];
const DEFAULT_USERS = ["richard.palmer@pentland.com","farah.yousaf@pentland.com"];
const LANG={"DE (GER)":"German","FR (FR)":"French"};
const tx=async(fields,locale)=>{const lang=LANG[locale];if(!lang)return fields;const filled=Object.entries(fields).filter(([k,v])=>v&&typeof v==="string"&&v.trim());if(!filled.length)return fields;try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:"Translate these marketing content fields to "+lang+". Return ONLY a JSON object with the same keys. Keep brand names, URLs and technical terms unchanged.\n\n"+JSON.stringify(Object.fromEntries(filled))}]})});const d=await r.json();const t=d.content[0].text.replace(/```json|```/g,"").trim();return{...fields,...JSON.parse(t)};}catch(e){return fields;}};
const defaultEmail = () => ({ id: Date.now()+Math.random(), parentId:null, locale:"", name:"", purpose:"", subjectLine:"", preHeader:"", heroImage:"", heading:"", bodyCopy:"", cta:"", secondaryCta:"", notes:"" });
const defaultWebAsset = () => ({ id: Date.now()+Math.random(), parentId:null, locale:"", name:"", heroImage:"", heading:"", subcopy:"", cta:"", secondaryCta:"", notes:"" });

const C = { white:"#FFFFFF", black:"#000000", red:"#ff7276", yellow:"#edf100", blue:"#05c3da", g98:"#fafafa", g94:"#f0f0f0", g88:"#e0e0e0", g70:"#b3b3b3", g50:"#808080" };
const ff = "'ABC Diatype','Suisse Intl','Helvetica Neue',Helvetica,Arial,sans-serif";
const hd = { fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase" };
const bd = { fontWeight:400, letterSpacing:"0.005em" };
const bi = { width:"100%", boxSizing:"border-box", padding:"10px 12px", border:`1px solid ${C.g88}`, borderRadius:0, fontSize:13, fontFamily:ff, color:C.black, background:C.white, outline:"none", transition:"border-color 0.15s", ...bd };

const Field = ({label,required,children,hint}) => (<div><label style={{display:"block",fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:6,lineHeight:1}}>{label}{required&&<span style={{color:C.red,marginLeft:3}}>*</span>}</label>{hint&&<span style={{display:"block",fontSize:11,color:C.g50,marginBottom:5,lineHeight:1.4,fontFamily:ff}}>{hint}</span>}{children}</div>);
const Input = ({value,onChange,placeholder,type="text"}) => { const [f,setF]=useState(false); return <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...bi,borderColor:f?C.black:C.g88}} onFocus={()=>setF(true)} onBlur={()=>setF(false)} />; };
const TextArea = ({value,onChange,placeholder,rows=3}) => { const [f,setF]=useState(false); return <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{...bi,resize:"vertical",minHeight:60,borderColor:f?C.black:C.g88}} onFocus={()=>setF(true)} onBlur={()=>setF(false)} />; };
const Chip = ({label,active,onClick}) => (<button onClick={onClick} style={{padding:"7px 14px",border:`1px solid ${active?C.black:C.g88}`,borderRadius:0,background:active?C.black:C.white,color:active?C.white:C.g50,fontSize:11,...hd,fontFamily:ff,cursor:"pointer",transition:"all 0.15s"}}>{label}</button>);
const CG = ({options,selected,onChange}) => (<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{options.map(o=><Chip key={o} label={o} active={selected.includes(o)} onClick={()=>onChange(selected.includes(o)?selected.filter(s=>s!==o):[...selected,o])} />)}</div>);

const EmailSelect = ({value,onChange,users,onAddUser}) => {
  const [f,setF]=useState(false); const [adding,setAdding]=useState(false); const [ne,setNe]=useState("");
  const doAdd = () => { const em=ne.trim().toLowerCase(); if(em&&em.includes("@")){onAddUser(em);onChange(em);setNe("");setAdding(false);} };
  if(adding) return (<div style={{display:"flex",gap:4}}><input value={ne} onChange={e=>setNe(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doAdd()} placeholder="name@company.com" style={{...bi,flex:1}} autoFocus /><button onClick={doAdd} style={{padding:"8px 14px",border:"none",background:C.black,color:C.white,fontSize:10,...hd,fontFamily:ff,cursor:"pointer",whiteSpace:"nowrap"}}>ADD</button><button onClick={()=>setAdding(false)} style={{padding:"8px 10px",border:`1px solid ${C.g88}`,background:C.white,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>X</button></div>);
  return (<select value={value} onChange={e=>{if(e.target.value==="__add__")setAdding(true);else onChange(e.target.value);}} style={{...bi,borderColor:f?C.black:C.g88,cursor:"pointer"}} onFocus={()=>setF(true)} onBlur={()=>setF(false)}><option value="">— Select —</option>{users.map(u=><option key={u} value={u}>{u}</option>)}<option value="__add__">+ Add new user</option></select>);
};

const CT = ({label,tag,active,onToggle,accent}) => (<button onClick={onToggle} style={{display:"flex",alignItems:"center",gap:14,padding:"20px 22px",border:active?`2px solid ${C.black}`:`2px solid ${C.g88}`,borderLeft:active?`4px solid ${accent}`:`2px solid ${C.g88}`,borderRadius:0,background:C.white,cursor:"pointer",width:"100%",fontFamily:ff,transition:"all 0.15s",boxShadow:active?"0 2px 8px rgba(0,0,0,0.08)":"none"}}><div style={{width:20,height:20,border:`2px solid ${active?C.black:C.g70}`,background:active?C.black:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{active&&<div style={{width:8,height:8,background:accent}} />}</div><span style={{fontSize:14,fontWeight:600,letterSpacing:"0.03em",color:active?C.black:C.g50,fontFamily:ff,flex:1,textAlign:"left"}}>{label}</span><span style={{fontSize:10,...hd,fontWeight:600,color:active?C.black:C.g70,fontFamily:ff,background:C.g94,padding:"3px 10px"}}>{tag}</span></button>);
const Sec = ({title,num,children,collapsed,onToggle,accent,bg}) => (<div style={{background:bg||C.white,border:`1px solid ${C.g88}`,borderTop:accent?`2px solid ${accent}`:`1px solid ${C.g88}`}}><button onClick={onToggle} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"18px 24px",border:"none",background:bg||C.white,cursor:"pointer",fontFamily:ff,borderBottom:collapsed?"none":`1px solid ${bg?"rgba(0,0,0,0.06)":C.g94}`}}><span style={{fontSize:11,...hd,color:C.g70,fontFamily:ff,width:24}}>{num}</span><span style={{fontSize:14,...hd,color:C.black,fontFamily:ff,flex:1,textAlign:"left"}}>{title}</span><span style={{fontSize:16,color:C.g70,transform:collapsed?"rotate(-90deg)":"rotate(0deg)",transition:"transform 0.2s",lineHeight:1}}>&#9662;</span></button>{!collapsed&&<div style={{padding:"20px 24px 28px"}}>{children}</div>}</div>);
const g = (c=2) => ({display:"grid",gridTemplateColumns:`repeat(${c},1fr)`,gap:16});


/*──── MAIN ────*/
export default function CampaignBrief(){
  const [sec,setSec]=useState({channels:false,web:false,email:false,paid:false});
  const tog=k=>setSec(s=>({...s,[k]:!s[k]}));
  const [userList,setUserList]=useState(DEFAULT_USERS);
  const addUser=(email)=>{if(userList.includes(email))return;setUserList(u=>[...u,email]);};
  const [jobNum,setJobNum]=useState(""); const [brand,setBrand]=useState(""); const [title,setTitle]=useState("");
  const [objective,setObj]=useState(""); const [locales,setLoc]=useState([]); const [sd,setSd]=useState(""); const [ed,setEd]=useState(""); const [hd2,setHd2]=useState("");
  const [tkTitle,setTkTitle]=useState(""); const [damLink,setDam]=useState(""); const [abLink,setAb]=useState(""); const [dFiles,setDf]=useState(""); const [cpTk,setCpTk]=useState(""); const [bGuid,setBg]=useState("");
  const [ch,setCh]=useState([]);
  const [wp,setWp]=useState([]); const [wbt,setWbt]=useState([]); const [webAssets,setWebAssets]=useState([defaultWebAsset()]); const [webOwner,setWebOwner]=useState("");
  const addWA=()=>setWebAssets(a=>[...a,defaultWebAsset()]); const rmWA=id=>setWebAssets(a=>a.filter(w=>w.id!==id)); const upWA=(id,f,v)=>setWebAssets(a=>a.map(w=>w.id===id?{...w,[f]:v}:w));
  const dupWA=async(wa,loc)=>{const cid=Date.now()+Math.random();const clone={...wa,id:cid,parentId:wa.parentId||wa.id,locale:loc||""};const idx=webAssets.findIndex(w=>w.id===wa.id);const updated=[...webAssets];updated.splice(idx+1,0,clone);setWebAssets(updated);if(LANG[loc]){const t=await tx({name:wa.name,heading:wa.heading,subcopy:wa.subcopy,cta:wa.cta,secondaryCta:wa.secondaryCta,notes:wa.notes},loc);setWebAssets(a=>a.map(w=>w.id===cid?{...w,...t}:w));}};
  const webNum=(wa,idx)=>{if(!wa.parentId){let n=0;for(let i=0;i<=idx;i++){if(!webAssets[i].parentId)n++;}return String(n).padStart(2,"0");}const pIdx=webAssets.findIndex(w=>w.id===wa.parentId);let pNum=0;for(let i=0;i<=pIdx;i++){if(!webAssets[i].parentId)pNum++;}let sub=1;for(let i=pIdx+1;i<=idx;i++){if(webAssets[i].parentId===wa.parentId)sub++;}return String(pNum).padStart(2,"0")+"."+sub;};
  const [et,setEt]=useState([]); const [emails,setEmails]=useState([defaultEmail()]); const [emailOwner,setEmailOwner]=useState("");
  const addE=()=>setEmails(e=>[...e,defaultEmail()]); const rmE=id=>setEmails(e=>e.filter(em=>em.id!==id)); const upE=(id,f,v)=>setEmails(e=>e.map(em=>em.id===id?{...em,[f]:v}:em));
  const dupE=async(em,loc)=>{const cid=Date.now()+Math.random();const clone={...em,id:cid,parentId:em.parentId||em.id,locale:loc||""};const idx=emails.findIndex(e=>e.id===em.id);const updated=[...emails];updated.splice(idx+1,0,clone);setEmails(updated);if(LANG[loc]){const t=await tx({name:em.name,subjectLine:em.subjectLine,preHeader:em.preHeader,heading:em.heading,bodyCopy:em.bodyCopy,cta:em.cta,secondaryCta:em.secondaryCta,notes:em.notes},loc);setEmails(a=>a.map(e=>e.id===cid?{...e,...t}:e));}};
  const emailNum=(em,idx)=>{if(!em.parentId){let n=0;for(let i=0;i<=idx;i++){if(!emails[i].parentId)n++;}return String(n).padStart(2,"0");}const pIdx=emails.findIndex(e=>e.id===em.parentId);let pNum=0;for(let i=0;i<=pIdx;i++){if(!emails[i].parentId)pNum++;}let sub=1;for(let i=pIdx+1;i<=idx;i++){if(emails[i].parentId===em.parentId)sub++;}return String(pNum).padStart(2,"0")+"."+sub;};
  const [ps,setPs]=useState({}); const [os,setOs]=useState(""); const [phi,setPhi]=useState(""); const [pc,setPc]=useState(""); const [pv,setPv]=useState(""); const [paidOwner,setPaidOwner]=useState("");
  const tps=(gr,sz)=>setPs(p=>{const a=p[gr]||[];return{...p,[gr]:a.includes(sz)?a.filter(s=>s!==sz):[...a,sz]};});
  const [dl,setDl]=useState(""); const [cl,setCl]=useState(""); const [crl,setCrl]=useState(""); const [pl,setPl]=useState("");
  const [pdl,setPdl]=useState(""); const [pcl,setPcl]=useState(""); const [pcrl,setPcrl]=useState(""); const [ppl,setPpl]=useState(""); const [pfa,setPfa]=useState("");
  const [es,setEs]=useState(null); const [ho,setHo]=useState("");
  const [view,setView]=useState("landing"); const [searchJob,setSearchJob]=useState("");
  const tch=c=>setCh(a=>a.includes(c)?a.filter(x=>x!==c):[...a,c]);
  const tLoc=l=>setLoc(a=>a.includes(l)?a.filter(x=>x!==l):[...a,l]);
  const save=()=>{setEs("saved");setTimeout(()=>setEs(null),3000);};
  let si=0;
  const modules = [{key:"playground",label:"PROJECT PLAYGROUND",sub:"Collaborative Kick Off"},{key:"overview",label:"CAMPAIGN OVERVIEW",sub:"The Admin Bit"},{key:"resources",label:"RESOURCE MANAGEMENT",sub:"Who Needs Access"},{key:"toolkit",label:"CAMPAIGN TOOLKIT",sub:"Shared Resources and Essential Info"},{key:"brief",label:"PROJECT BRIEF",sub:"Multi-Channel Briefing Hub"},{key:"approval",label:"APPROVAL CENTRE",sub:"Project Complete"},{key:"delivery",label:"ASSET DELIVERY",sub:"Downloads and DAM Links"},{key:"feedback",label:"FEEDBACK CENTRE",sub:"How Did It Go?"}];
  if(view==="landing") return (<div style={{minHeight:"100vh",background:C.g98,fontFamily:ff}}>
    <div style={{background:C.black,padding:"40px 0 36px"}}><div style={{maxWidth:900,margin:"0 auto",padding:"0 28px"}}><div><div style={{fontSize:10,...hd,color:C.g50,fontFamily:ff,marginBottom:10}}>PENTLAND C&C</div><h1 style={{fontSize:32,...hd,color:C.white,fontFamily:ff,lineHeight:1.1}}>PROJECT HUB</h1></div><div style={{width:48,height:2,background:C.red,marginTop:20}} /><p style={{fontSize:12,...bd,color:C.g70,fontFamily:ff,marginTop:12,maxWidth:520,lineHeight:1.6}}>End-to-end project tracking from conception to delivery.</p></div></div>
    <div style={{maxWidth:600,margin:"0 auto",padding:"32px 28px 60px"}}>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <button onClick={()=>{setJobNum("NEW-"+Date.now().toString(36).toUpperCase().slice(-6));setView("project");}} style={{width:"100%",padding:"22px 24px",border:`1px solid ${C.g88}`,background:C.white,cursor:"pointer",fontFamily:ff,transition:"all 0.15s",textAlign:"left"}}><div style={{fontSize:13,...hd,color:C.g50,letterSpacing:"0.08em"}}>CREATE NEW PROJECT</div><div style={{fontSize:11,...bd,color:C.g70,marginTop:4}}>Let's Go</div></button>
        <div style={{display:"flex",flexDirection:"column"}}><button onClick={()=>{if(searchJob.trim()){setJobNum(searchJob.trim());setView("project");}}} style={{width:"100%",padding:"22px 24px",border:`1px solid ${C.g88}`,background:C.white,cursor:"pointer",fontFamily:ff,transition:"all 0.15s",textAlign:"left"}}><div style={{fontSize:13,...hd,color:C.g50,letterSpacing:"0.08em"}}>ENTER JOB NUMBER</div><div style={{fontSize:11,...bd,color:C.g70,marginTop:4}}>Continue Your Project</div></button><input value={searchJob} onChange={e=>setSearchJob(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&searchJob.trim()){setJobNum(searchJob.trim());setView("project");}}} placeholder="Enter Job Number..." style={{...bi,border:`1px solid ${C.g88}`,borderTop:"none",textAlign:"center",padding:"12px",fontSize:12,color:C.g50}} /></div>
      </div>
    </div>
  </div>);
  if(view==="project") return (<div style={{minHeight:"100vh",background:C.g98,fontFamily:ff}}>
    <div style={{background:C.black,padding:"40px 0 36px"}}><div style={{maxWidth:900,margin:"0 auto",padding:"0 28px"}}><div><div style={{fontSize:10,...hd,color:C.g50,fontFamily:ff,marginBottom:10}}>PENTLAND C&C</div><h1 style={{fontSize:32,...hd,color:C.white,fontFamily:ff,lineHeight:1.1}}>PROJECT HUB</h1></div><div style={{width:48,height:2,background:C.red,marginTop:20}} /><p style={{fontSize:12,...bd,color:C.g70,fontFamily:ff,marginTop:12}}>End-to-end project tracking from conception to delivery.</p></div></div>
    <div style={{maxWidth:600,margin:"0 auto",padding:"32px 28px 60px"}}>
      <div style={{background:C.g94,padding:"20px 24px",marginBottom:16}}><div style={{fontSize:10,...hd,color:C.g50,fontFamily:ff,marginBottom:4}}>JOB NUMBER</div><div style={{fontSize:24,...hd,color:C.black,fontFamily:ff,letterSpacing:"0.04em"}}>{jobNum}</div></div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {modules.map(m=>(<button key={m.key} onClick={()=>setView(m.key==="brief"?"form":m.key)} style={{width:"100%",padding:"22px 24px",border:`1px solid ${C.g88}`,background:C.white,cursor:"pointer",fontFamily:ff,transition:"all 0.15s",textAlign:"left"}}><div style={{fontSize:13,...hd,color:C.g50,letterSpacing:"0.08em"}}>{m.label}</div><div style={{fontSize:11,...bd,color:C.g70,marginTop:4}}>{m.sub}</div></button>))}
      </div>
    </div>
  </div>);
  const modPage = modules.find(m=>m.key===view&&m.key!=="brief"&&m.key!=="overview"&&m.key!=="toolkit"&&m.key!=="approval");
  const modDescs = {playground:"Gather inspo, upload screenshots, link to media or videos, try out some copy.",resources:"Manage team access and roles.",delivery:"Final assets, downloads and DAM links.",feedback:"Post-project feedback and learnings."};
  const ML=({sub,label,children})=>(<div style={{minHeight:"100vh",background:C.g98,fontFamily:ff}}>
    <div style={{background:C.black,padding:"32px 0 28px"}}><div style={{maxWidth:1200,margin:"0 auto",padding:"0 28px"}}><div style={{fontSize:10,...hd,color:C.g50,fontFamily:ff,marginBottom:8}}>{sub}</div><h1 style={{fontSize:28,...hd,color:C.white,fontFamily:ff,lineHeight:1.1}}>{label}</h1><div style={{width:48,height:2,background:C.red,marginTop:16}} /></div></div>
    <div style={{maxWidth:1200,margin:"0 auto",padding:"20px 28px 60px",display:"flex",gap:20}}>
      <div style={{width:200,flexShrink:0}}>
        <div style={{position:"sticky",top:20,display:"flex",flexDirection:"column",gap:3}}>
          <button onClick={()=>setView("project")} style={{padding:"8px 12px",border:`1px solid ${C.g88}`,background:C.white,cursor:"pointer",fontFamily:ff,textAlign:"left",marginBottom:6}}><span style={{fontSize:9,...hd,color:C.g50,fontFamily:ff}}>BACK TO HUB</span></button>
          {modules.map(m=>{const vk=m.key==="brief"?"form":m.key;const active=view===vk;return(<button key={m.key} onClick={()=>setView(vk)} style={{padding:"8px 12px",border:"none",background:active?C.black:C.white,color:active?C.white:C.g50,cursor:"pointer",fontFamily:ff,textAlign:"left",fontSize:9,...hd,borderLeft:active?`3px solid ${C.red}`:`3px solid transparent`,transition:"all 0.15s"}}>{m.label}</button>);})}
        </div>
      </div>
      <div style={{flex:1,minWidth:0}}>{children}</div>
    </div>
  </div>);
  if(view==="overview") return (<ML sub="THE ADMIN BIT" label="CAMPAIGN OVERVIEW">
    <div style={{background:C.white,border:`1px solid ${C.g88}`,padding:"24px 28px"}}>
      <div style={g(3)}><Field label="JOB NUMBER" required><Input value={jobNum} onChange={setJobNum} placeholder="e.g. PEN-001"/></Field><Field label="BRAND" required><Input value={brand} onChange={setBrand} placeholder="e.g. Speedo"/></Field><Field label="CAMPAIGN TITLE" required><Input value={title} onChange={setTitle} placeholder="e.g. Summer 25"/></Field></div>
      <div style={{...g(1),marginTop:16}}><Field label="CAMPAIGN OBJECTIVE" required><TextArea value={objective} onChange={setObj} placeholder="Describe the key objective..."/></Field></div>
      <div style={{marginTop:16}}><Field label="LOCALES / REGIONS"><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{LOCALES.map(l=><Chip key={l} label={l} active={locales.includes(l)} onClick={()=>tLoc(l)}/>)}</div></Field></div>
      <div style={{...g(3),marginTop:16}}><Field label="CAMPAIGN START DATE" required><Input type="date" value={sd} onChange={setSd}/></Field><Field label="CAMPAIGN END DATE" required><Input type="date" value={ed} onChange={setEd}/></Field><Field label="HANDOVER DATE" required><Input type="date" value={hd2} onChange={setHd2}/></Field></div>
    </div>
  </ML>);
  if(view==="toolkit") return (<ML sub="SHARED RESOURCES" label="CAMPAIGN TOOLKIT">
    <div style={{background:C.white,border:`1px solid ${C.g88}`,padding:"24px 28px"}}>
      <div style={g(2)}><Field label="TOOLKIT TITLE"><Input value={tkTitle} onChange={setTkTitle} placeholder="e.g. SS25 Toolkit"/></Field><Field label="DAM TOOLKIT LINK"><Input value={damLink} onChange={setDam} placeholder="https://..."/></Field></div>
      <div style={{...g(2),marginTop:16}}><Field label="ASSET BANK LINK" hint="Approved imagery and logos"><Input value={abLink} onChange={setAb} placeholder="https://..."/></Field><Field label="DESIGN FILES" hint="Design file link"><Input value={dFiles} onChange={setDf} placeholder="https://figma.com/..."/></Field></div>
      <div style={{...g(2),marginTop:16}}><Field label="COPY TOOLKIT"><Input value={cpTk} onChange={setCpTk} placeholder="https://..."/></Field><Field label="BRAND GUIDELINES"><Input value={bGuid} onChange={setBg} placeholder="https://..."/></Field></div>
      <div style={{marginTop:20,padding:"12px 16px",background:C.black,color:C.white,fontSize:11,...bd,fontFamily:ff,lineHeight:1.5}}>All channels must use assets from this toolkit.</div>
    </div>
  </ML>);
  if(view==="approval") return (<ML sub="PROJECT COMPLETE" label="APPROVAL CENTRE">
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{background:C.white,border:`1px solid ${C.g88}`,padding:"24px 28px"}}>
        <div style={{fontSize:14,...hd,color:C.black,fontFamily:ff,marginBottom:16}}>BRIEF APPROVAL</div>
        <div style={g(2)}><Field label="DIGITAL ASSET LEAD"><EmailSelect value={dl} onChange={setDl} users={userList} onAddUser={addUser}/></Field><Field label="CREATIVE LEAD"><EmailSelect value={cl} onChange={setCl} users={userList} onAddUser={addUser}/></Field><Field label="CRM LEAD"><EmailSelect value={crl} onChange={setCrl} users={userList} onAddUser={addUser}/></Field><Field label="PAID MEDIA LEAD"><EmailSelect value={pl} onChange={setPl} users={userList} onAddUser={addUser}/></Field></div>
        <div style={{height:1,background:C.g94,margin:"20px 0"}} />
        <div style={{fontSize:12,...hd,color:C.black,fontFamily:ff,marginBottom:12}}>HAND BRIEF OVER TO DESIGNER</div>
        <div style={{display:"flex",gap:12,alignItems:"flex-end"}}><div style={{flex:1}}><Field label="DESIGNER"><EmailSelect value={ho} onChange={setHo} users={userList} onAddUser={addUser}/></Field></div><button onClick={()=>{if(ho){setEs("brief");setTimeout(()=>setEs(null),3000);}}} style={{padding:"10px 24px",border:"none",background:C.black,color:C.white,fontSize:11,...hd,fontFamily:ff,cursor:"pointer",whiteSpace:"nowrap"}}>HAND OVER</button></div>
        {es==="brief"&&<div style={{marginTop:8,fontSize:10,...hd,color:"#22c55e",fontFamily:ff}}>BRIEF HANDED OVER</div>}
      </div>
      <div style={{background:C.white,border:`1px solid ${C.g88}`,padding:"24px 28px"}}>
        <div style={{fontSize:14,...hd,color:C.black,fontFamily:ff,marginBottom:16}}>PROJECT APPROVAL</div>
        <div style={g(2)}><Field label="DIGITAL ASSET LEAD"><EmailSelect value={pdl} onChange={setPdl} users={userList} onAddUser={addUser}/></Field><Field label="CREATIVE LEAD"><EmailSelect value={pcl} onChange={setPcl} users={userList} onAddUser={addUser}/></Field><Field label="CRM LEAD"><EmailSelect value={pcrl} onChange={setPcrl} users={userList} onAddUser={addUser}/></Field><Field label="PAID MEDIA LEAD"><EmailSelect value={ppl} onChange={setPpl} users={userList} onAddUser={addUser}/></Field></div>
        <div style={{height:1,background:C.g94,margin:"20px 0"}} />
        <Field label="FINAL APPROVAL"><EmailSelect value={pfa} onChange={setPfa} users={userList} onAddUser={addUser}/></Field>
        <div style={{marginTop:20}}><button onClick={()=>{if(pfa){setEs("signed");setTimeout(()=>setEs(null),3000);}}} style={{width:"100%",padding:"12px 24px",border:"none",background:C.black,color:C.white,fontSize:11,...hd,fontFamily:ff,cursor:"pointer",letterSpacing:"0.08em"}}>SIGN OFF AND MOVE TO FINAL DELIVERY</button></div>
        {es==="signed"&&<div style={{marginTop:8,textAlign:"center",fontSize:10,...hd,color:"#22c55e",fontFamily:ff}}>PROJECT SIGNED OFF</div>}
      </div>
    </div>
  </ML>);
  if(modPage) return (<ML sub={modPage.sub.toUpperCase()} label={modPage.label}>
    <div style={{background:C.white,border:`1px solid ${C.g88}`,padding:"32px 28px"}}><p style={{fontSize:13,...bd,color:C.g50,fontFamily:ff,lineHeight:1.7}}>{modDescs[modPage.key]||"Coming soon."}</p><div style={{marginTop:24,padding:"14px",background:C.g94,fontSize:10,...hd,color:C.g70,fontFamily:ff,textAlign:"center"}}>COMING SOON</div></div>
  </div>);
  return (<ML sub="MULTI-CHANNEL CAMPAIGN" label="PROJECT BRIEF">
    <div style={{display:"flex",flexDirection:"column",gap:8,paddingBottom:80}}>

      <Sec title="CHANNEL DELIVERABLES" num={String(++si).padStart(2,"0")} collapsed={sec.channels} onToggle={()=>tog("channels")} bg="#e8e8e8">
        <div style={g(3)}><CT label="Web Assets" tag="ECOMM" active={ch.includes("web")} onToggle={()=>tch("web")} accent={C.red}/><CT label="Email Assets" tag="CRM" active={ch.includes("email")} onToggle={()=>tch("email")} accent={C.yellow}/><CT label="Paid Media" tag="PAID" active={ch.includes("paid")} onToggle={()=>tch("paid")} accent={C.blue}/></div>
      </Sec>

      {ch.includes("web")&&<Sec title="WEB ASSETS (ECOMM)" num={String(++si).padStart(2,"0")} collapsed={sec.web} onToggle={()=>tog("web")} accent={C.red}>
        <Field label="SECTION OWNER"><EmailSelect value={webOwner} onChange={setWebOwner} users={userList} onAddUser={addUser}/></Field>
        <div style={{height:1,background:C.g94,margin:"20px 0"}} />
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}><span style={{fontSize:12,...hd,color:C.black,fontFamily:ff}}>INDIVIDUAL WEB ASSET BRIEFS</span><button onClick={addWA} style={{padding:"8px 18px",border:"none",background:C.black,color:C.white,fontSize:11,...hd,fontFamily:ff,cursor:"pointer"}}>+ ADD WEB ASSET</button></div>
        {webAssets.map((wa,idx)=>(<div key={wa.id} style={{border:`1px solid ${C.g88}`,padding:20,marginBottom:8,background:C.white,borderLeft:wa.parentId?`3px solid ${C.red}`:`1px solid ${C.g88}`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}><span style={{fontSize:12,...hd,color:C.black,fontFamily:ff}}>WEB ASSET {webNum(wa,idx)}{wa.locale?` — ${wa.locale}`:""}</span><div style={{display:"flex",gap:4}}>{webAssets.length>1&&<button onClick={()=>rmWA(wa.id)} style={{padding:"4px 12px",border:`1px solid ${C.g88}`,background:C.white,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>REMOVE</button>}</div></div>
          <div style={{marginBottom:12}}><Field label="LOCALE / LANGUAGE"><CG options={LOCALES} selected={wa.locale?[wa.locale]:[]} onChange={v=>upWA(wa.id,"locale",v.length?v[v.length-1]:"")}/></Field></div>
          <div style={g(2)}><Field label="KEY PLACEMENTS"><CG options={WEB_PLACEMENTS} selected={wp} onChange={setWp}/></Field><Field label="BANNER SIZES"><CG options={BANNER_TYPES} selected={wbt} onChange={setWbt}/></Field></div>
          <div style={{...g(2),marginTop:12}}><Field label="ASSET NAME"><Input value={wa.name} onChange={v=>upWA(wa.id,"name",v)} placeholder="e.g. Hero Banner"/></Field><Field label="HERO IMAGE (LINK)"><Input value={wa.heroImage} onChange={v=>upWA(wa.id,"heroImage",v)} placeholder="https://..."/></Field></div>
          <div style={{...g(2),marginTop:12}}><Field label="MAIN HEADING"><Input value={wa.heading} onChange={v=>upWA(wa.id,"heading",v)} placeholder="Main headline"/></Field><Field label="SUBCOPY"><Input value={wa.subcopy} onChange={v=>upWA(wa.id,"subcopy",v)} placeholder="Supporting copy"/></Field></div>
          <div style={{...g(2),marginTop:12}}><Field label="CTA"><Input value={wa.cta} onChange={v=>upWA(wa.id,"cta",v)} placeholder="e.g. Shop Now"/></Field><Field label="SECONDARY CTA"><Input value={wa.secondaryCta} onChange={v=>upWA(wa.id,"secondaryCta",v)} placeholder="e.g. Learn More"/></Field></div>
          <div style={{marginTop:12}}><Field label="ADDITIONAL NOTES"><TextArea value={wa.notes} onChange={v=>upWA(wa.id,"notes",v)} placeholder="Any additional notes..." rows={2}/></Field></div>
          <div style={{marginTop:16,display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>DUPLICATE FOR:</span><select onChange={e=>{if(e.target.value){dupWA(wa,e.target.value);e.target.value="";}}} style={{padding:"6px 12px",border:`1px solid ${C.g88}`,fontSize:10,...hd,color:C.g50,fontFamily:ff,cursor:"pointer"}}><option value="">Select locale...</option>{LOCALES.map(l=><option key={l} value={l}>{l}{LANG[l]?" (auto-translate)":""}</option>)}</select></div>
        </div>))}
      </Sec>}

      {ch.includes("email")&&<Sec title="EMAIL ASSETS (CRM)" num={String(++si).padStart(2,"0")} collapsed={sec.email} onToggle={()=>tog("email")} accent={C.yellow}>
        <Field label="SECTION OWNER"><EmailSelect value={emailOwner} onChange={setEmailOwner} users={userList} onAddUser={addUser}/></Field>
        <div style={{height:1,background:C.g94,margin:"20px 0"}} />
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}><span style={{fontSize:12,...hd,color:C.black,fontFamily:ff}}>INDIVIDUAL EMAIL BRIEFS</span><button onClick={addE} style={{padding:"8px 18px",border:"none",background:C.black,color:C.white,fontSize:11,...hd,fontFamily:ff,cursor:"pointer"}}>+ ADD EMAIL</button></div>
        {emails.map((em,idx)=>(<div key={em.id} style={{border:`1px solid ${C.g88}`,padding:20,marginBottom:8,background:C.white,borderLeft:em.parentId?`3px solid ${C.yellow}`:`1px solid ${C.g88}`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}><span style={{fontSize:12,...hd,color:C.black,fontFamily:ff}}>EMAIL {emailNum(em,idx)}{em.locale?` — ${em.locale}`:""}</span><div style={{display:"flex",gap:4}}>{emails.length>1&&<button onClick={()=>rmE(em.id)} style={{padding:"4px 12px",border:`1px solid ${C.g88}`,background:C.white,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>REMOVE</button>}</div></div>
          <div style={{marginBottom:12}}><Field label="EMAIL TYPE"><CG options={EMAIL_TYPES} selected={et} onChange={setEt}/></Field></div>
          <div style={{marginBottom:12}}><Field label="LOCALE / LANGUAGE"><CG options={LOCALES} selected={em.locale?[em.locale]:[]} onChange={v=>upE(em.id,"locale",v.length?v[v.length-1]:"")}/></Field></div>
          <div style={g(2)}><Field label="EMAIL NAME"><Input value={em.name} onChange={v=>upE(em.id,"name",v)} placeholder="e.g. Launch Email"/></Field><Field label="EMAIL PURPOSE"><Input value={em.purpose} onChange={v=>upE(em.id,"purpose",v)} placeholder="Type of email"/></Field></div>
          <div style={{...g(2),marginTop:12}}><Field label="SUBJECT LINE"><Input value={em.subjectLine} onChange={v=>upE(em.id,"subjectLine",v)} placeholder="Email subject line"/></Field><Field label="PRE-HEADER"><Input value={em.preHeader} onChange={v=>upE(em.id,"preHeader",v)} placeholder="Pre-header text"/></Field></div>
          <div style={{...g(2),marginTop:12}}><Field label="HERO IMAGE (LINK)"><Input value={em.heroImage} onChange={v=>upE(em.id,"heroImage",v)} placeholder="https://..."/></Field><Field label="MAIN HEADING (H1)"><Input value={em.heading} onChange={v=>upE(em.id,"heading",v)} placeholder="Main headline"/></Field></div>
          <div style={{marginTop:12}}><Field label="BODY COPY" hint="Full copy or link to doc"><TextArea value={em.bodyCopy} onChange={v=>upE(em.id,"bodyCopy",v)} placeholder="Body copy..." rows={3}/></Field></div>
          <div style={{...g(2),marginTop:12}}><Field label="CTA"><Input value={em.cta} onChange={v=>upE(em.id,"cta",v)} placeholder="e.g. Shop Now"/></Field><Field label="SECONDARY CTA"><Input value={em.secondaryCta} onChange={v=>upE(em.id,"secondaryCta",v)} placeholder="e.g. Learn More"/></Field></div>
          <div style={{marginTop:12}}><Field label="ADDITIONAL NOTES" hint="Build notes"><TextArea value={em.notes} onChange={v=>upE(em.id,"notes",v)} placeholder="Any additional notes..." rows={2}/></Field></div>
          <div style={{marginTop:16,display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>DUPLICATE FOR:</span><select onChange={e=>{if(e.target.value){dupE(em,e.target.value);e.target.value="";}}} style={{padding:"6px 12px",border:`1px solid ${C.g88}`,fontSize:10,...hd,color:C.g50,fontFamily:ff,cursor:"pointer"}}><option value="">Select locale...</option>{LOCALES.map(l=><option key={l} value={l}>{l}{LANG[l]?" (auto-translate)":""}</option>)}</select></div>
        </div>))}
      </Sec>}

      {ch.includes("paid")&&<Sec title="PAID MEDIA ASSETS" num={String(++si).padStart(2,"0")} collapsed={sec.paid} onToggle={()=>tog("paid")} accent={C.blue}>
        <Field label="SECTION OWNER"><EmailSelect value={paidOwner} onChange={setPaidOwner} users={userList} onAddUser={addUser}/></Field>
        <div style={{height:1,background:C.g94,margin:"20px 0"}} />
        <div style={{fontSize:11,...hd,color:C.black,fontFamily:ff,marginBottom:16}}>SIZES REQUIRED</div>
        {Object.entries(PAID_SIZE_GROUPS).map(([group,sizes])=>(<div key={group} style={{marginBottom:16}}><div style={{fontSize:10,...hd,color:C.g50,fontFamily:ff,marginBottom:6}}>{group}</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{sizes.map(size=>{const active=(ps[group]||[]).includes(size);return <button key={size} onClick={()=>tps(group,size)} style={{padding:"7px 12px",border:`1px solid ${active?C.black:C.g88}`,borderRadius:0,background:active?C.black:C.white,color:active?C.white:C.g50,fontSize:11,...hd,fontFamily:ff,cursor:"pointer",fontVariantNumeric:"tabular-nums"}}>{size}</button>;})}</div></div>))}
        <div style={g(1)}><Field label="OTHER SIZES"><Input value={os} onChange={setOs} placeholder="e.g. 320x480, custom..."/></Field><Field label="HERO IMAGE (LINK)"><Input value={phi} onChange={setPhi} placeholder="https://..."/></Field><Field label="COPY REQUIREMENTS"><TextArea value={pc} onChange={setPc} placeholder="Headlines, CTAs..." rows={3}/></Field><Field label="VIDEO / GIF CONTENT"><TextArea value={pv} onChange={setPv} placeholder="Video or animated content..." rows={2}/></Field></div>
      </Sec>}

    </div>

    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(255,255,255,0.96)",backdropFilter:"blur(10px)",borderTop:`1px solid ${C.g88}`,padding:"12px 28px",display:"flex",alignItems:"center",justifyContent:"center",gap:8,zIndex:100}}>
      {es&&<div style={{position:"absolute",top:-36,left:"50%",transform:"translateX(-50%)",background:C.black,color:C.white,padding:"6px 16px",fontSize:11,...hd,fontFamily:ff,animation:"fu .2s ease"}}>{es==="handed"?"BRIEF SUBMITTED":"MODULE SAVED"}</div>}
      <button onClick={()=>{setEs("saved");setTimeout(()=>setEs(null),3000);}} style={{padding:"10px 24px",border:`1px solid ${C.g88}`,background:C.white,color:C.black,fontSize:11,...hd,fontFamily:ff,cursor:"pointer"}}>SAVE MODULE</button>
      <button onClick={save} style={{padding:"10px 24px",border:"none",background:C.black,color:C.white,fontSize:11,...hd,fontFamily:ff,cursor:"pointer"}}>SUBMIT BRIEF</button>
    </div>

    <style>{`@keyframes fu{from{opacity:0;transform:translateX(-50%) translateY(6px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}::placeholder{color:${C.g70}}button:hover{opacity:.85}input::-webkit-calendar-picker-indicator{cursor:pointer}`}</style>
  </ML>);
}
