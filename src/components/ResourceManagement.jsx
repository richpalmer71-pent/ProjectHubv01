import { useState } from "react";
import { C, ff, hd, bd, bi, g, Field } from "./shared";

const g2 = {display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16};

const ROLES = [
  {key:"briefOwner",label:"BRIEF OWNER"},
  {key:"ccOwner",label:"C&C OWNER"},
  {key:"crmManager",label:"CRM MANAGER"},
  {key:"ecommManager",label:"ECOMM MANAGER"},
  {key:"paidManager",label:"PAID MEDIA MANAGER"},
  {key:"leadDesigner",label:"LEAD DESIGNER"},
  {key:"artworker",label:"ARTWORKER"},
  {key:"other",label:"OTHER"}
];

const Sel = ({value,onChange,users,onAdd,off}) => {
  const [adding,setAdding]=useState(false);
  const [ne,setNe]=useState("");
  const doAdd=()=>{const e=ne.trim().toLowerCase();if(e&&e.includes("@")){onAdd(e);onChange(e);setNe("");setAdding(false);}};
  if(adding) return(<div style={{display:"flex",gap:4}}>
    <input value={ne} onChange={e=>setNe(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doAdd()} placeholder="name@company.com" style={{...bi,flex:1}} autoFocus/>
    <button onClick={doAdd} style={{padding:"8px 14px",border:"none",background:C.black,color:C.white,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>ADD</button>
    <button onClick={()=>setAdding(false)} style={{padding:"8px 10px",border:`1px solid ${C.g88}`,background:C.white,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>X</button>
  </div>);
  return(<select disabled={off} value={value} onChange={e=>{if(e.target.value==="__add__")setAdding(true);else onChange(e.target.value);}} style={{...bi,cursor:off?"default":"pointer",opacity:off?0.6:1,background:off?C.g94:C.white}}>
    <option value="">Select...</option>
    {users.map(u=><option key={u} value={u}>{u}</option>)}
    {!off&&<option value="__add__">+ Add new user</option>}
  </select>);
};

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

  return (
    <div style={{background:C.white,border:`1px solid ${C.g88}`,padding:"24px 28px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>TEAM ALLOCATION</span>
        <span style={{fontSize:10,...hd,color:assigned+customUsers.length>=ROLES.length?"#22c55e":C.g50,fontFamily:ff}}>{assigned+customUsers.length} ASSIGNED</span>
      </div>
      <div style={g2}>
        {ROLES.map(role=>(<div key={role.key} style={{marginBottom:8}}>
          <Field label={role.label}><Sel value={roles[role.key]||""} onChange={v=>upR(role.key,v)} users={userList} onAdd={addUser} off={!editing}/></Field>
          {roles[role.key]&&!editing&&<div style={{marginTop:4,fontSize:11,...bd,color:C.g50,fontFamily:ff,display:"flex",alignItems:"center",gap:4}}><span style={{color:"#22c55e",fontSize:12}}>&#10003;</span>{roles[role.key]}</div>}
        </div>))}
      </div>
      {customUsers.length>0&&<div style={{marginTop:16}}>
        <div style={{fontSize:10,...hd,color:C.g50,fontFamily:ff,marginBottom:10}}>ADDITIONAL TEAM MEMBERS</div>
        <div style={g2}>{customUsers.map((cu,idx)=>(<div key={idx} style={{border:`1px solid ${C.g88}`,padding:"12px 16px",background:C.g98,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff}}>{cu.role}</div><div style={{fontSize:12,...bd,color:C.black,fontFamily:ff,marginTop:2}}>{cu.email}</div></div>
          {editing&&<button onClick={()=>rmCustom(idx)} style={{padding:"3px 10px",border:`1px solid ${C.g88}`,background:C.white,color:C.g50,fontSize:9,...hd,fontFamily:ff,cursor:"pointer"}}>REMOVE</button>}
        </div>))}</div>
      </div>}
      <div style={{height:1,background:C.g94,margin:"24px 0"}} />
      {editing&&<div style={{marginBottom:24}}>
        {!showNew?(<button onClick={()=>setShowNew(true)} style={{padding:"10px 20px",border:`1px solid ${C.g88}`,background:C.white,color:C.g50,fontSize:11,...hd,fontFamily:ff,cursor:"pointer"}}>+ NEW USER</button>
        ):(<div style={{border:`1px solid ${C.g88}`,padding:16,background:C.g98}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>ADD NEW USER</div>
            <button onClick={()=>{setShowNew(false);setNewE("");setNewRole("");}} style={{padding:"4px 12px",border:`1px solid ${C.g88}`,background:C.white,color:C.g50,fontSize:9,...hd,fontFamily:ff,cursor:"pointer"}}>CLOSE</button>
          </div>
          <div style={g2}>
            <div><div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:6}}>POSITION / ROLE</div><input value={newRole} onChange={e=>setNewRole(e.target.value)} placeholder="e.g. Content Manager" style={bi}/></div>
            <div><div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:6}}>EMAIL ADDRESS</div><input value={newE} onChange={e=>setNewE(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doAddNew()} placeholder="name@company.com" style={bi}/></div>
          </div>
          <button onClick={doAddNew} style={{marginTop:12,padding:"10px 20px",border:"none",background:C.black,color:C.white,fontSize:11,...hd,fontFamily:ff,cursor:"pointer"}}>ADD USER</button>
          {userList.length>0&&<div style={{marginTop:16}}><div style={{fontSize:10,...hd,color:C.g50,fontFamily:ff,marginBottom:6}}>CURRENT USERS</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{userList.map(u=>(<span key={u} style={{padding:"4px 10px",background:C.white,border:`1px solid ${C.g88}`,fontSize:11,...bd,color:C.g50,fontFamily:ff}}>{u}</span>))}</div></div>}
        </div>)}
      </div>}
      <div style={{display:"flex",gap:8,position:"relative"}}>
        {saved&&<div style={{position:"absolute",top:-40,left:"50%",transform:"translateX(-50%)",background:C.black,color:C.white,padding:"6px 16px",fontSize:11,...hd,fontFamily:ff,whiteSpace:"nowrap"}}>CHANGES SAVED</div>}
        {editing?(<button onClick={doSave} style={{flex:1,padding:"12px 24px",border:"none",background:C.black,color:C.white,fontSize:11,...hd,fontFamily:ff,cursor:"pointer",letterSpacing:"0.08em"}}>SAVE CHANGES</button>
        ):(<button onClick={()=>setEditing(true)} style={{flex:1,padding:"12px 24px",border:`1px solid ${C.g88}`,background:C.white,color:C.g50,fontSize:11,...hd,fontFamily:ff,cursor:"pointer",letterSpacing:"0.08em"}}>EDIT DETAILS</button>)}
      </div>
    </div>
  );
}
