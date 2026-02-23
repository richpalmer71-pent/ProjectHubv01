import { useState } from "react";
import { C, ff, hd, bd, bi, Field } from "./shared";

const g2 = {display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16};
const Inp = ({value,onChange,placeholder}) => { const [f,setF]=useState(false); return <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...bi,borderColor:f?C.black:C.g88}} onFocus={()=>setF(true)} onBlur={()=>setF(false)} />; };
const TA = ({value,onChange,placeholder,rows=3}) => { const [f,setF]=useState(false); return <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{...bi,resize:"vertical",minHeight:60,borderColor:f?C.black:C.g88}} onFocus={()=>setF(true)} onBlur={()=>setF(false)} />; };
const Fld = ({label,children,hint}) => (<div><label style={{display:"block",fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:6,lineHeight:1}}>{label}</label>{hint&&<span style={{display:"block",fontSize:11,color:C.g50,marginBottom:5,lineHeight:1.4,fontFamily:ff}}>{hint}</span>}{children}</div>);

const mkLink = () => ({ id:Date.now()+Math.random(), type:"link", url:"", label:"", notes:"" });
const mkImg = () => ({ id:Date.now()+Math.random(), type:"image", imgUrl:"", caption:"" });
const mkNote = () => ({ id:Date.now()+Math.random(), type:"text", title:"", content:"" });

export default function Playground() {
  const [cards, setCards] = useState([]);
  const addCard = () => setCards(c => [...c, { id:Date.now()+Math.random(), title:"", saved:false, sections:[] }]);
  const rmCard = id => setCards(c => c.filter(x => x.id !== id));
  const upCard = (id, f, v) => setCards(c => c.map(x => x.id === id ? {...x, [f]:v, saved:false} : x));
  const addSec = (cardId, creator) => setCards(c => c.map(x => x.id === cardId ? {...x, sections:[...x.sections, creator()], saved:false} : x));
  const rmSec = (cardId, secId) => setCards(c => c.map(x => x.id === cardId ? {...x, sections:x.sections.filter(s=>s.id!==secId), saved:false} : x));
  const upSec = (cardId, secId, f, v) => setCards(c => c.map(x => x.id === cardId ? {...x, sections:x.sections.map(s=>s.id===secId?{...s,[f]:v}:s), saved:false} : x));
  const saveCard = id => setCards(c => c.map(x => x.id === id ? {...x, saved:true} : x));
  const onFile = (cardId, secId, e) => { const f=e.target.files[0]; if(f){const r=new FileReader();r.onload=ev=>upSec(cardId,secId,"imgUrl",ev.target.result);r.readAsDataURL(f);} };
  const addBtn = (cardId, creator, label, accent) => (<button onClick={()=>addSec(cardId,creator)} style={{flex:1,padding:"12px 12px",border:`1px solid ${C.g88}`,background:C.white,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer",borderBottom:`3px solid ${accent}`,transition:"all 0.15s"}}>{label}</button>);
  const secHead = (cardId, secId, label, accent, num) => (<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
    <span style={{fontSize:10,...hd,color:accent,fontFamily:ff}}>{label} {String(num).padStart(2,"0")}</span>
    <button onClick={()=>rmSec(cardId,secId)} style={{padding:"3px 10px",border:`1px solid ${C.g88}`,background:C.white,color:C.g50,fontSize:9,...hd,fontFamily:ff,cursor:"pointer"}}>REMOVE</button>
  </div>);

  return (
    <div>
      <button onClick={addCard} style={{width:"100%",padding:"16px 24px",border:`1px solid ${C.g88}`,background:C.white,color:C.g50,fontSize:13,...hd,fontFamily:ff,cursor:"pointer",letterSpacing:"0.08em",marginBottom:24,transition:"all 0.15s"}}>+ SOMETHING COOL!</button>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {cards.map((card, idx) => {
          let linkN=0, imgN=0, noteN=0;
          return (
          <div key={card.id} style={{background:C.white,border:`1px solid ${C.g88}`,padding:"20px 24px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>ITEM {String(idx+1).padStart(2,"0")}</span>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                {card.saved&&<span style={{fontSize:10,...hd,color:"#22c55e",fontFamily:ff}}>&#10003; SAVED</span>}
                <button onClick={()=>rmCard(card.id)} style={{padding:"4px 12px",border:`1px solid ${C.g88}`,background:C.white,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>REMOVE</button>
              </div>
            </div>
            <div style={{marginBottom:16}}><Fld label="CARD TITLE"><Inp value={card.title} onChange={v=>upCard(card.id,"title",v)} placeholder="Name this item..." /></Fld></div>
            <div style={{display:"flex",gap:8,marginBottom:card.sections.length?16:0}}>
              {addBtn(card.id,mkLink,"+ LINK",C.blue)}
              {addBtn(card.id,mkImg,"+ IMAGE / VIDEO",C.yellow)}
              {addBtn(card.id,mkNote,"+ NOTES / COPY",C.red)}
            </div>
            {card.sections.map(sec => {
              if(sec.type==="link"){ linkN++;
                return (<div key={sec.id} style={{borderLeft:`3px solid ${C.blue}`,paddingLeft:16,marginTop:12,paddingBottom:4}}>
                  {secHead(card.id,sec.id,"LINK",C.blue,linkN)}
                  <div style={{...g2,marginBottom:12}}><Fld label="LABEL"><Inp value={sec.label} onChange={v=>upSec(card.id,sec.id,"label",v)} placeholder="What is this link?" /></Fld><Fld label="URL"><Inp value={sec.url} onChange={v=>upSec(card.id,sec.id,"url",v)} placeholder="https://..." /></Fld></div>
                  <Fld label="NOTES"><TA value={sec.notes} onChange={v=>upSec(card.id,sec.id,"notes",v)} placeholder="Why is this relevant?" rows={2} /></Fld>
                  {sec.url&&<div style={{marginTop:8}}><a href={sec.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,...hd,color:C.blue,fontFamily:ff,textDecoration:"none"}}>OPEN LINK &#8599;</a></div>}
                </div>);
              }
              if(sec.type==="image"){ imgN++;
                return (<div key={sec.id} style={{borderLeft:`3px solid ${C.yellow}`,paddingLeft:16,marginTop:12,paddingBottom:4}}>
                  {secHead(card.id,sec.id,"IMAGE / VIDEO","#c5a800",imgN)}
                  <div style={{marginBottom:12}}><Fld label="UPLOAD FILE" hint="Image, screenshot or video"><div onClick={()=>document.getElementById("up-"+sec.id).click()} style={{border:`1px dashed ${C.g88}`,padding:14,textAlign:"center",background:C.g98,cursor:"pointer"}}><input id={"up-"+sec.id} type="file" accept="image/*,video/*" onChange={e=>onFile(card.id,sec.id,e)} style={{display:"none"}} /><div style={{fontSize:10,color:C.g50,...hd,fontFamily:ff}}>CLICK TO UPLOAD</div><div style={{fontSize:9,color:C.g70,marginTop:3,fontFamily:ff}}>PNG, JPG, GIF, MP4</div></div></Fld></div>
                  <div style={{marginBottom:12}}><Fld label="OR PASTE URL"><Inp value={sec.imgUrl} onChange={v=>upSec(card.id,sec.id,"imgUrl",v)} placeholder="https://..." /></Fld></div>
                  <Fld label="CAPTION"><Inp value={sec.caption} onChange={v=>upSec(card.id,sec.id,"caption",v)} placeholder="Describe this reference..." /></Fld>
                  {sec.imgUrl&&(sec.imgUrl.startsWith("data:video")?<div style={{marginTop:10}}><video src={sec.imgUrl} controls style={{width:"100%",maxHeight:220}} /></div>:<div style={{marginTop:10,border:`1px solid ${C.g88}`,padding:6,background:C.g98}}><img src={sec.imgUrl} alt={sec.caption||"Ref"} style={{width:"100%",maxHeight:220,objectFit:"contain",display:"block"}} onError={e=>{e.target.style.display="none"}} /></div>)}
                </div>);
              }
              if(sec.type==="text"){ noteN++;
                return (<div key={sec.id} style={{borderLeft:`3px solid ${C.red}`,paddingLeft:16,marginTop:12,paddingBottom:4}}>
                  {secHead(card.id,sec.id,"NOTES / COPY",C.red,noteN)}
                  <div style={{marginBottom:12}}><Fld label="TITLE"><Inp value={sec.title} onChange={v=>upSec(card.id,sec.id,"title",v)} placeholder="Give this a title..." /></Fld></div>
                  <Fld label="CONTENT"><TA value={sec.content} onChange={v=>upSec(card.id,sec.id,"content",v)} placeholder="Write your thoughts, copy ideas, campaign angles..." rows={5} /></Fld>
                </div>);
              }
              return null;
            })}
            {card.sections.length>0&&<div style={{marginTop:16}}><button onClick={()=>saveCard(card.id)} style={{width:"100%",padding:"10px 24px",border:"none",background:C.black,color:C.white,fontSize:11,...hd,fontFamily:ff,cursor:"pointer"}}>SAVE</button></div>}
          </div>);
        })}
      </div>
    </div>
  );
}
