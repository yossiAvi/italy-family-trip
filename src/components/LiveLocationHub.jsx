import { useEffect, useMemo, useRef, useState } from 'react';
import { listLiveLocations, sharedCloudConfigured, stopLiveLocation, subscribeLiveLocations, upsertLiveLocation } from '../lib/sharedStore.js';

const members=[
  {id:'yossi',name:'יוסי',avatar:'🧭'},
  {id:'yasmin',name:'יסמין',avatar:'🌸'},
  {id:'sivan',name:'סיון',avatar:'📸'},
  {id:'shiran',name:'שירן',avatar:'✨'},
  {id:'oren',name:'אורן',avatar:'⚽'}
];
const STORAGE_KEY='italy-live-location-member';

function ageLabel(date){
  const seconds=Math.max(0,Math.floor((Date.now()-new Date(date).getTime())/1000));
  if(seconds<20)return 'עכשיו';
  if(seconds<60)return `לפני ${seconds} שניות`;
  const minutes=Math.floor(seconds/60);
  if(minutes<60)return `לפני ${minutes} דקות`;
  return `לפני ${Math.floor(minutes/60)} שעות`;
}
function statusFor(row){
  if(!row.sharing)return {label:'השיתוף הופסק',className:'off'};
  const age=Date.now()-new Date(row.updated_at).getTime();
  if(age<60000)return {label:'פעיל עכשיו',className:'live'};
  if(age<300000)return {label:'לא עודכן לאחרונה',className:'stale'};
  return {label:'מיקום ישן',className:'off'};
}

export default function LiveLocationHub(){
  const [memberId,setMemberId]=useState(()=>localStorage.getItem(STORAGE_KEY)||'yossi');
  const [locations,setLocations]=useState([]);
  const [sharing,setSharing]=useState(false);
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  const watchRef=useRef(null);
  const lastSentRef=useRef({time:0,lat:null,lng:null});
  const member=members.find(m=>m.id===memberId)||members[0];

  const refresh=async()=>{
    try{setLocations(await listLiveLocations())}catch(err){console.error(err);setMessage('לא הצלחנו לטעון את המיקומים כרגע.');}
  };
  useEffect(()=>{
    refresh();
    const unsubscribe=subscribeLiveLocations(refresh);
    const timer=setInterval(()=>setLocations(v=>[...v]),30000);
    return()=>{unsubscribe();clearInterval(timer);if(watchRef.current!==null)navigator.geolocation?.clearWatch(watchRef.current)};
  },[]);
  useEffect(()=>{localStorage.setItem(STORAGE_KEY,memberId)},[memberId]);

  const sendPosition=async position=>{
    const {latitude,longitude,accuracy}=position.coords;
    const now=Date.now();
    const last=lastSentRef.current;
    const moved=last.lat===null?Infinity:Math.hypot(latitude-last.lat,longitude-last.lng)*111000;
    if(now-last.time<12000&&moved<15)return;
    try{
      await upsertLiveLocation({memberId:member.id,memberName:member.name,avatar:member.avatar,latitude,longitude,accuracy});
      lastSentRef.current={time:now,lat:latitude,lng:longitude};
      setMessage(`המיקום של ${member.name} עודכן.`);
      refresh();
    }catch(err){console.error(err);setMessage('לא הצלחנו לסנכרן את המיקום.');}
  };

  const startSharing=()=>{
    if(!sharedCloudConfigured)return setMessage('יש להגדיר Supabase כדי לשתף מיקום בין המכשירים.');
    if(!navigator.geolocation)return setMessage('המכשיר או הדפדפן אינם תומכים בשיתוף מיקום.');
    setBusy(true);setMessage('ממתין לאישור גישה למיקום…');
    watchRef.current=navigator.geolocation.watchPosition(
      async pos=>{setSharing(true);setBusy(false);await sendPosition(pos)},
      err=>{setBusy(false);setSharing(false);setMessage(err.code===1?'גישה למיקום נדחתה. אפשר לאשר אותה בהגדרות האתר.':'לא הצלחנו לקבל מיקום. נסו לעבור לאזור פתוח.')},
      {enableHighAccuracy:true,maximumAge:10000,timeout:20000}
    );
  };
  const stopSharing=async remove=>{
    if(watchRef.current!==null){navigator.geolocation.clearWatch(watchRef.current);watchRef.current=null;}
    setSharing(false);setBusy(true);
    try{await stopLiveLocation(member.id,remove);setMessage(remove?'המיקום נמחק מהמפה.':'שיתוף המיקום הופסק.');await refresh();}
    catch(err){console.error(err);setMessage('לא הצלחנו לעצור את השיתוף כרגע.');}
    finally{setBusy(false)}
  };

  const activeLocations=useMemo(()=>locations.filter(l=>l.sharing),[locations]);
  const mapUrl=activeLocations.length
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(...activeLocations.map(l=>l.longitude))-.01}%2C${Math.min(...activeLocations.map(l=>l.latitude))-.01}%2C${Math.max(...activeLocations.map(l=>l.longitude))+.01}%2C${Math.max(...activeLocations.map(l=>l.latitude))+.01}&layer=mapnik&marker=${activeLocations[0].latitude}%2C${activeLocations[0].longitude}`
    : '';

  return <section id="locations" data-nav-section className="section liveLocationSection">
    <div className="container">
      <div className="sectionHead liveLocationHead"><div><span className="eyebrow">משפחה מחוברת</span><h2>איפה כולם?</h2></div><p>שיתוף מיקום מרצון בזמן שהאתר פתוח. נשמר רק המיקום האחרון — ללא היסטוריית מסלול.</p></div>
      <div className="liveLocationLayout">
        <article className="locationControlCard">
          <div className="locationPrivacy">🔒 כל אחד משתף רק לאחר לחיצה ויכול לעצור או למחוק בכל רגע.</div>
          <label><span>מי משתמש במכשיר הזה?</span><select value={memberId} onChange={e=>{if(sharing)stopSharing(false);setMemberId(e.target.value)}}>{members.map(m=><option key={m.id} value={m.id}>{m.avatar} {m.name}</option>)}</select></label>
          <div className="locationActionRow">
            {!sharing?<button className="button locationStart" disabled={busy} onClick={startSharing}>📍 {busy?'מתחבר…':'התחל שיתוף מיקום'}</button>:<button className="button locationStop" disabled={busy} onClick={()=>stopSharing(false)}>⏸ עצור שיתוף</button>}
            <button className="button locationDelete" disabled={busy} onClick={()=>stopSharing(true)}>🗑 מחיקה מהמפה</button>
          </div>
          {message&&<div className="locationMessage">{message}</div>}
          <small>השיתוף פועל בצורה הטובה ביותר כשהאתר פתוח והמסך פעיל. מערכות ההפעלה עשויות להשהות עדכונים ברקע.</small>
        </article>
        <article className="familyMapCard">
          {mapUrl?<iframe title="מפת מיקומי המשפחה" src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>:<div className="emptyFamilyMap"><span>🗺️</span><b>עדיין אין מיקום פעיל</b><p>אחד מבני המשפחה יכול ללחוץ על „התחל שיתוף מיקום”.</p></div>}
          {activeLocations.length>1&&<div className="mapHint">המפה ממוקדת במשתף הראשון. השתמשו בכפתורי הניווט ברשימה כדי להגיע לכל אחד.</div>}
        </article>
      </div>
      <div className="familyLocationGrid">
        {members.map(m=>{
          const row=locations.find(l=>l.member_id===m.id);
          const state=row?statusFor(row):{label:'לא משתף',className:'off'};
          return <article key={m.id} className={`familyLocationCard ${state.className}`}>
            <div className="memberAvatar">{m.avatar}</div><div><h3>{m.name}</h3><span className="locationStatus"><i/>{state.label}</span>{row&&<small>{ageLabel(row.updated_at)}{row.accuracy?` · דיוק כ־${Math.round(row.accuracy)} מ׳`:''}</small>}</div>
            {row?.sharing&&<a className="button navigateMember" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${row.latitude},${row.longitude}`}>נווטו אליו</a>}
          </article>
        })}
      </div>
    </div>
  </section>;
}
