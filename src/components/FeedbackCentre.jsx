import { useState } from "react";
import { C, ff, hd, bd, bi } from "./shared";

const CATEGORIES = [
  {key:"briefing",label:"BRIEFING"},
  {key:"concepts",label:"CONCEPTS (IF APPLICABLE)"},
  {key:"consultation",label:"CONSULTATION / REVIEW PROCESS"},
  {key:"updates",label:"UPDATES / CHANGES"},
  {key:"delivery",label:"DELIVERY LEAD TIME"},
  {key:"overall",label:"OVERALL"}
];

export default function FeedbackCentre({ jobNum, brand, title }) {
  const [ratings,setRatings]=useState({});
  const [feedback,setFeedback]=useState("");
  const [submitted,setSubmitted]=useState(false);
  const setR=(key,val)=>setRatings(p=>({...p,[key]:val}));
  const rated=Object.keys(ratings).length;
  const avg=rated>0?Object.values(ratings).reduce((a,b)=>a+b,0)/rated:0;

  if(submitted) return (
    <div style={{background:C.white,border:`1px solid ${C.g88}`,padding:"48px 28px",textAlign:"center"}}>
      <div style={{fontSize:16,...hd,color:C.black,fontFamily:ff,marginBottom:8}}>FEEDBACK SUBMITTED</div>
      <p style={{fontSize:13,...bd,color:C.g50,fontFamily:ff,lineHeight:1.6,maxWidth:400,margin:"0 auto"}}>Thank you for your feedback on {title||"this project"}. Your ratings have been recorded.</p>
      <div style={{marginTop:24,padding:"12px 20px",background:C.g98,display:"inline-block"}}>
        <span style={{fontSize:11,...hd,color:C.g50,fontFamily:ff}}>AVERAGE RATING: </span>
        <span style={{fontSize:11,...hd,color:avg>=4?"#22c55e":avg>=3?"#eab308":"#ef4444",fontFamily:ff}}>{avg.toFixed(1)} / 5</span>
      </div>
    </div>
  );

  return (
    <div style={{background:C.white,border:`1px solid ${C.g88}`,padding:"24px 28px"}}>
      <div style={{fontSize:10,...hd,color:C.g50,fontFamily:ff,marginBottom:16}}>PROJECT DETAILS</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:4}}>
        <div><div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:6}}>JOB NUMBER</div><div style={{...bi,background:C.g94,color:C.g50}}>{jobNum||"—"}</div></div>
        <div><div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:6}}>BRAND</div><div style={{...bi,background:C.g94,color:C.g50}}>{brand||"—"}</div></div>
        <div><div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:6}}>CAMPAIGN TITLE</div><div style={{...bi,background:C.g94,color:C.g50}}>{title||"—"}</div></div>
      </div>
      <div style={{height:1,background:C.g94,margin:"24px 0"}} />
      <div style={{fontSize:14,...hd,color:C.black,fontFamily:ff,marginBottom:4}}>HOW DID IT GO?</div>
      <p style={{fontSize:12,...bd,color:C.g50,fontFamily:ff,lineHeight:1.6,marginBottom:24}}>Rate this project based on the questions below (1 is terrible and 5 is excellent).</p>
      {CATEGORIES.map(cat=>{const active=ratings[cat.key];return(
        <div key={cat.key} style={{marginBottom:12,padding:"16px 20px",border:`1px solid ${C.g88}`,background:active?C.g98:C.white}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <span style={{fontSize:11,...hd,color:C.black,fontFamily:ff}}>{cat.label}</span>
            {active&&<span style={{fontSize:10,...hd,color:active>=4?"#22c55e":active>=3?"#eab308":"#ef4444",fontFamily:ff}}>{active} / 5</span>}
          </div>
          <div style={{display:"flex",gap:6}}>
            {[1,2,3,4,5].map(n=>{const isA=ratings[cat.key]===n;const col=isA?(n<=2?"#ef4444":n===3?"#eab308":"#22c55e"):C.g88;return(
              <button key={n} onClick={()=>setR(cat.key,n)} style={{width:48,height:48,border:isA?`2px solid ${col}`:`1px solid ${C.g88}`,background:isA?col:C.white,color:isA?C.white:C.g50,fontSize:16,fontWeight:600,fontFamily:ff,cursor:"pointer",transition:"all 0.15s"}}>{n}</button>
            );})}
          </div>
        </div>
      );})}
      <div style={{height:1,background:C.g94,margin:"24px 0"}} />
      <div style={{marginBottom:24}}>
        <div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:6}}>LEAVE US ANY OTHER FEEDBACK</div>
        <textarea value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Any additional thoughts, suggestions or recommendations..." rows={5} style={{...bi,resize:"vertical",minHeight:100}}/>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>{rated>0&&<span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>{rated} / {CATEGORIES.length} RATED</span>}</div>
        <button onClick={()=>setSubmitted(true)} style={{padding:"14px 32px",border:"none",background:C.black,color:C.white,fontSize:12,...hd,fontFamily:ff,cursor:"pointer",letterSpacing:"0.08em"}}>SUBMIT FEEDBACK</button>
      </div>
    </div>
  );
}
