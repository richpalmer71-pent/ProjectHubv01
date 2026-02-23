import { useState } from "react";
import { C, ff, hd, bd, bi, rad, g, Field, Card } from "./shared";

const Sel = ({value,onChange,users,onAdd,off}) => {
  const [adding,setAdding]=useState(false);
  const [ne,setNe]=useState("");
  const doAdd=()=>{const e=ne.trim().toLowerCase();if(e&&e.includes("@")){onAdd(e);onChange(e);setNe("");setAdding(false);}};
  if(adding) return(<div style={{display:"flex",gap:4}}>
    <input value={ne} onChange={e=>setNe(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doAdd()} placeholder="name@company.com" style={{...bi,flex:1}} autoFocus/>
    <button onClick={doAdd} style={{padding:"8px 14px",border:"none",...rad,background:C.black,color:C.card,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>ADD</button>
    <button onClick={()=>setAdding(false)} style={{padding:"8px 10px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>X</button>
  </div>);
  return(<select disabled={off} value={value} onChange={e=>{if(e.target.value==="__add__")setAdding(true);else onChange(e.target.value);}} style={{...bi,cursor:off?"default":"pointer",opacity:off?0.6:1,background:off?C.g94:C.card}}>
    <option value="">Select...</option>
    {users.map(u=><option key={u} value={u}>{u}</option>)}
    {!off&&<option value="__add__">+ Add new user</option>}
  </select>);
};

const ROLES = ["BRIEF OWNER","C&C OWNER","CRM MANAGER","ECOMM MANAGER","PAID MEDIA MANAGER","LEAD DESIGNER","ARTWORKER","OTHER"];

export default function ResourceManagement({ userList, addUser }) {
  const [roles,setRoles]=useState({});
  const upR=(k,v)=>setRoles(r=>({...r,[k]:v}));
  const [editing,setEditing]=useState(true);
  const [saved,setSaved]=useState(false);
  const doSave=()=>{setEditing(false);setSaved(true);setTimeout(()=>setSaved(false),3000);};
  const assigned=Object.values(roles).filter(Boolean).length;
  const [showNew,setShowNew]=useState(false);
  const [newRole,setNewRole]=useState("");
  const [newE,setNewE]=useState("");
  const [customUsers,setCustomUsers]=useState([]);
  const doAddNew=()=>{const e=newE.trim().toLowerCase();const r=newRole.trim();if(e&&e.includes("@")){addUser(e);if(r)setCustomUsers(p=>[...p,{role:r,email:e}]);setNewE("");setNewRole("");}};
  const rmCustom=(idx)=>setCustomUsers(p=>p.filter((_,i)=>i!==idx));

  return (<div style={{display:"flex",flexDirection:"column",gap:14}}>
    <Card>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <span style={{fontSize:11,...hd,color:C.g50,fontFamily:ff}}>TEAM ALLOCATION</span>
        <div style={{padding:"5px 14px",...rad,background:assigned+customUsers.length>=ROLES.length?C.green+"18":C.g94,fontSize:11,fontWeight:600,color:assigned+customUsers.length>=ROLES.length?C.green:C.g50,fontFamily:ff}}>{assigned+customUsers.length} ASSIGNED</div>
      </div>
      <div style={g(2)}>
        {ROLES.map(role=>(<div key={role} style={{marginBottom:4}}>
          <Field label={role}><Sel value={roles[role]||""} onChange={v=>upR(role,v)} users={userList} onAdd={addUser} off={!editing}/></Field>
          {roles[role]&&!editing&&<div style={{marginTop:4,fontSize:12,...bd,color:C.g50,fontFamily:ff,display:"flex",alignItems:"center",gap:4}}><span style={{color:C.green,fontSize:13}}>&#10003;</span>{roles[role]}</div>}
        </div>))}
      </div>
      {customUsers.length>0&&<div style={{marginTop:16}}>
        <div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:10}}>ADDITIONAL TEAM MEMBERS</div>
        <div style={g(2)}>{customUsers.map((cu,idx)=>(<div key={idx} style={{border:`1px solid ${C.g88}`,padding:"12px 16px",background:C.g94,...rad,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff}}>{cu.role}</div><div style={{fontSize:13,...bd,color:C.black,fontFamily:ff,marginTop:2}}>{cu.email}</div></div>
          {editing&&<button onClick={()=>rmCustom(idx)} style={{padding:"4px 10px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>REMOVE</button>}
        </div>))}</div>
      </div>}
    </Card>

    {editing&&<Card>
      {!showNew?(<button onClick={()=>setShowNew(true)} style={{padding:"10px 20px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:12,...hd,fontFamily:ff,cursor:"pointer"}}>+ NEW USER</button>
      ):(<div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff}}>ADD NEW USER</div>
          <button onClick={()=>{setShowNew(false);setNewE("");setNewRole("");}} style={{padding:"4px 12px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>CLOSE</button>
        </div>
        <div style={g(2)}>
          <Field label="POSITION / ROLE"><input value={newRole} onChange={e=>setNewRole(e.target.value)} placeholder="e.g. Content Manager" style={bi}/></Field>
          <Field label="EMAIL ADDRESS"><input value={newE} onChange={e=>setNewE(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doAddNew()} placeholder="name@company.com" style={bi}/></Field>
        </div>
        <button onClick={doAddNew} style={{marginTop:12,padding:"10px 20px",border:"none",...rad,background:C.black,color:C.card,fontSize:12,...hd,fontFamily:ff,cursor:"pointer"}}>ADD USER</button>
      </div>)}
    </Card>}

    <div style={{display:"flex",gap:10,position:"relative"}}>
      {saved&&<div style={{position:"absolute",top:-40,left:"50%",transform:"translateX(-50%)",background:C.black,color:C.card,padding:"6px 16px",...rad,fontSize:11,...hd,fontFamily:ff,whiteSpace:"nowrap"}}>CHANGES SAVED</div>}
      {editing?(<button onClick={doSave} style={{flex:1,padding:"13px 24px",border:"none",...rad,background:C.black,color:C.card,fontSize:13,...hd,fontFamily:ff,cursor:"pointer"}}>SAVE CHANGES</button>
      ):(<button onClick={()=>setEditing(true)} style={{flex:1,padding:"13px 24px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:13,...hd,fontFamily:ff,cursor:"pointer"}}>EDIT DETAILS</button>)}
    </div>
  </div>);
}
