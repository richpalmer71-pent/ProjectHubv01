import { useState } from "react";
import { C, ff, hd, bd, bi, rad, Card } from "./shared";

const STATUSES = [
  {key:"draft",label:"DRAFT",color:C.g70},
  {key:"briefing",label:"BRIEFING",color:C.blue},
  {key:"in_progress",label:"IN PROGRESS",color:"#f59e0b"},
  {key:"review",label:"REVIEW",color:"#8b5cf6"},
  {key:"approved",label:"APPROVED",color:C.green},
  {key:"delivered",label:"DELIVERED",color:C.black},
  {key:"overdue",label:"OVERDUE",color:"#ef4444"},
];

const TODAY = new Date().toISOString().slice(0,10);

const MOCK_PROJECTS = [
  {id:"PEN-2025-0042",brand:"Speedo",title:"Summer 25 Launch",status:"in_progress",start:"2025-03-01",end:"2026-06-15",modules:{overview:true,toolkit:true,brief:true,resources:true,approval:false,delivery:false,feedback:false},rating:null},
  {id:"PEN-2025-0038",brand:"Berghaus",title:"AW25 Digital Campaign",status:"review",start:"2025-02-15",end:"2026-04-30",modules:{overview:true,toolkit:true,brief:true,resources:true,approval:true,delivery:false,feedback:false},rating:null},
  {id:"PEN-2025-0035",brand:"Canterbury",title:"Six Nations Promo",status:"delivered",start:"2025-01-10",end:"2025-03-20",modules:{overview:true,toolkit:true,brief:true,resources:true,approval:true,delivery:true,feedback:true},rating:4.2},
  {id:"PEN-2025-0031",brand:"Speedo",title:"Fastskin Launch",status:"in_progress",start:"2025-01-05",end:"2025-12-01",modules:{overview:true,toolkit:true,brief:true,resources:true,approval:true,delivery:false,feedback:false},rating:null},
  {id:"PEN-2025-0029",brand:"Ellesse",title:"SS25 Social Push",status:"briefing",start:"2025-03-10",end:"2026-07-01",modules:{overview:true,toolkit:false,brief:false,resources:false,approval:false,delivery:false,feedback:false},rating:null},
  {id:"PEN-2024-0112",brand:"Berghaus",title:"Winter 24 Wrap-Up",status:"delivered",start:"2024-09-01",end:"2024-12-15",modules:{overview:true,toolkit:true,brief:true,resources:true,approval:true,delivery:true,feedback:true},rating:3.8},
  {id:"PEN-2025-0044",brand:"Mitre",title:"Grassroots Kit Launch",status:"draft",start:"2025-04-01",end:"2026-08-01",modules:{overview:false,toolkit:false,brief:false,resources:false,approval:false,delivery:false,feedback:false},rating:null},
  {id:"PEN-2025-0048",brand:"Ellesse",title:"Heritage Collection",status:"review",start:"2025-06-01",end:"2026-01-15",modules:{overview:true,toolkit:true,brief:true,resources:true,approval:false,delivery:false,feedback:false},rating:null},
  {id:"PEN-2025-0050",brand:"Canterbury",title:"Lions Tour Kit",status:"in_progress",start:"2025-05-01",end:"2026-03-15",modules:{overview:true,toolkit:true,brief:false,resources:true,approval:false,delivery:false,feedback:false},rating:null},
];

const getEffectiveStatus = (p) => {
  if(p.status==="delivered") return "delivered";
  if(p.end < TODAY && p.status !== "delivered") return "overdue";
  return p.status;
};

const BRANDS = [...new Set(MOCK_PROJECTS.map(p=>p.brand))].sort();

function StatusBadge({status}){
  const s=STATUSES.find(x=>x.key===status)||STATUSES[0];
  return <span style={{padding:"4px 12px",...rad,background:s.color+"18",color:s.color,fontSize:10,...hd,fontFamily:ff,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:4}}>
    {status==="overdue"&&<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
    {s.label}
  </span>;
}

function ProgressBar({modules}){
  const total=Object.keys(modules).length;
  const done=Object.values(modules).filter(Boolean).length;
  const pct=Math.round((done/total)*100);
  return(
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{flex:1,height:6,background:C.g88,...rad,overflow:"hidden"}}>
        <div style={{height:"100%",width:pct+"%",background:pct===100?C.green:pct>50?C.blue:C.g70,...rad,transition:"width 0.3s"}}/>
      </div>
      <span style={{fontSize:11,fontWeight:600,color:pct===100?C.green:C.g50,fontFamily:ff,minWidth:32}}>{pct}%</span>
    </div>
  );
}

function DaysLabel({end, status}){
  if(status==="delivered") return <span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>COMPLETE</span>;
  const diff=Math.ceil((new Date(end)-new Date(TODAY))/86400000);
  if(diff<0) return <span style={{fontSize:10,...hd,color:"#ef4444",fontFamily:ff}}>{Math.abs(diff)}d OVERDUE</span>;
  if(diff<=14) return <span style={{fontSize:10,...hd,color:"#f59e0b",fontFamily:ff}}>{diff}d LEFT</span>;
  return <span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>{diff}d LEFT</span>;
}

export default function Dashboard({ setView, setJobNum }) {
  const [filter,setFilter]=useState("all");
  const [brandFilter,setBrandFilter]=useState("all");
  const [dateSort,setDateSort]=useState("end_asc");
  const [search,setSearch]=useState("");

  const withStatus=MOCK_PROJECTS.map(p=>({...p,effectiveStatus:getEffectiveStatus(p)}));

  const filtered=withStatus.filter(p=>{
    if(filter!=="all"&&p.effectiveStatus!==filter) return false;
    if(brandFilter!=="all"&&p.brand!==brandFilter) return false;
    if(search){const s=search.toLowerCase();return p.id.toLowerCase().includes(s)||p.brand.toLowerCase().includes(s)||p.title.toLowerCase().includes(s);}
    return true;
  }).sort((a,b)=>{
    if(dateSort==="end_asc") return a.end.localeCompare(b.end);
    if(dateSort==="end_desc") return b.end.localeCompare(a.end);
    if(dateSort==="start_asc") return a.start.localeCompare(b.start);
    if(dateSort==="start_desc") return b.start.localeCompare(a.start);
    return 0;
  });

  const stats={
    total:withStatus.length,
    active:withStatus.filter(p=>!["delivered","draft","overdue"].includes(p.effectiveStatus)).length,
    delivered:withStatus.filter(p=>p.effectiveStatus==="delivered").length,
    overdue:withStatus.filter(p=>p.effectiveStatus==="overdue").length,
    avgRating:(()=>{const r=MOCK_PROJECTS.filter(p=>p.rating);return r.length?(r.reduce((a,b)=>a+b.rating,0)/r.length).toFixed(1):"—";})(),
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div className="hub-grid-4" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12}}>
        <Card style={{padding:"16px 18px",textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:C.black,fontFamily:ff}}>{stats.total}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:4}}>TOTAL</div></Card>
        <Card style={{padding:"16px 18px",textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:C.blue,fontFamily:ff}}>{stats.active}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:4}}>ACTIVE</div></Card>
        <Card style={{padding:"16px 18px",textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:C.green,fontFamily:ff}}>{stats.delivered}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:4}}>DELIVERED</div></Card>
        <Card style={{padding:"16px 18px",textAlign:"center",border:stats.overdue>0?"1px solid #ef444433":`1px solid ${C.g88}`}}><div style={{fontSize:26,fontWeight:700,color:stats.overdue>0?"#ef4444":C.g70,fontFamily:ff}}>{stats.overdue}</div><div style={{fontSize:9,...hd,color:stats.overdue>0?"#ef4444":C.g70,fontFamily:ff,marginTop:4}}>OVERDUE</div></Card>
        <Card style={{padding:"16px 18px",textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:"#f59e0b",fontFamily:ff}}>{stats.avgRating}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:4}}>AVG RATING</div></Card>
      </div>

      <Card style={{padding:"14px 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects..." style={{...bi,width:200,fontSize:13}}/>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>BRAND:</span>
            <select value={brandFilter} onChange={e=>setBrandFilter(e.target.value)} style={{...bi,width:"auto",fontSize:12,cursor:"pointer",padding:"8px 12px"}}><option value="all">All Brands</option>{BRANDS.map(b=><option key={b} value={b}>{b}</option>)}</select>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>DATE:</span>
            <select value={dateSort} onChange={e=>setDateSort(e.target.value)} style={{...bi,width:"auto",fontSize:12,cursor:"pointer",padding:"8px 12px"}}><option value="end_asc">Due Date (Soonest)</option><option value="end_desc">Due Date (Latest)</option><option value="start_asc">Start Date (Earliest)</option><option value="start_desc">Start Date (Latest)</option></select>
          </div>
          <div style={{height:24,width:1,background:C.g88}}/>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            <button onClick={()=>setFilter("all")} style={{padding:"6px 14px",border:`1px solid ${filter==="all"?C.black:C.g88}`,...rad,background:filter==="all"?C.black:C.card,color:filter==="all"?C.card:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>ALL</button>
            {STATUSES.map(s=>(<button key={s.key} onClick={()=>setFilter(f=>f===s.key?"all":s.key)} style={{padding:"6px 14px",border:`1px solid ${filter===s.key?s.color:C.g88}`,...rad,background:filter===s.key?s.color+"18":C.card,color:filter===s.key?s.color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>{s.label}</button>))}
          </div>
        </div>
      </Card>

      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"130px 90px 1fr 110px 90px 130px 40px",padding:"12px 20px",background:C.g94,borderBottom:`1px solid ${C.g88}`,gap:10}}>
          <span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>JOB NUMBER</span>
          <span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>BRAND</span>
          <span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>PROJECT</span>
          <span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>STATUS</span>
          <span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>DUE</span>
          <span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>PROGRESS</span>
          <span></span>
        </div>
        {filtered.length===0&&<div style={{padding:"40px 20px",textAlign:"center"}}><div style={{fontSize:13,color:C.g50,fontFamily:ff,...bd}}>No projects match your filters.</div></div>}
        {filtered.map((p,idx)=>{const sc=STATUSES.find(x=>x.key===p.effectiveStatus);const tabCol=sc?sc.color:C.g88;return(
          <div key={p.id} style={{display:"grid",gridTemplateColumns:"130px 90px 1fr 110px 90px 130px 40px",padding:"14px 20px",borderBottom:idx<filtered.length-1?`1px solid ${C.g94}`:"none",alignItems:"center",gap:10,cursor:"pointer",transition:"background 0.1s",borderLeft:`3px solid ${tabCol}`}}
            onClick={()=>{if(setJobNum){setJobNum(p.id);setView("project");}}}
            onMouseEnter={e=>e.currentTarget.style.background=C.g94}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{fontSize:13,fontWeight:600,color:C.black,fontFamily:ff}}>{p.id}</div>
            <div style={{fontSize:12,color:C.g50,fontFamily:ff,...bd}}>{p.brand}</div>
            <div><div style={{fontSize:13,fontWeight:500,color:C.black,fontFamily:ff}}>{p.title}</div><div style={{fontSize:11,color:C.g70,fontFamily:ff,...bd,marginTop:1}}>{p.start} → {p.end}</div></div>
            <StatusBadge status={p.effectiveStatus}/>
            <DaysLabel end={p.end} status={p.effectiveStatus}/>
            <ProgressBar modules={p.modules}/>
            <div style={{textAlign:"right",color:C.g70,fontSize:16}}>›</div>
          </div>
        );})}
      </Card>

      <div style={{display:"flex",gap:16,flexWrap:"wrap",padding:"4px 0"}}>
        {STATUSES.map(s=>(<div key={s.key} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:4,background:s.color}}/><span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>{s.label}</span></div>))}
      </div>
    </div>
  );
}
