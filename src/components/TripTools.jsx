import { useEffect, useMemo, useState } from 'react';
import { weatherCities } from '../data/tripData.js';

function Weather(){
  const [data,setData]=useState([]);
  useEffect(()=>{Promise.all(weatherCities.map(async c=>{
    try{const url=`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lng}&current=temperature_2m,wind_speed_10m&timezone=auto`;const r=await fetch(url);const j=await r.json();return {...c,temp:Math.round(j.current.temperature_2m),wind:Math.round(j.current.wind_speed_10m)}}catch{return {...c,error:true}}
  })).then(setData)},[]);
  return <div className="weatherGrid">{(data.length?data:weatherCities).map(c=><div className="weatherCard" key={c.name}><b>{c.name}</b><strong>{c.temp!==undefined?`${c.temp}°`:'--°'}</strong><small>{c.error?'לא נטען':c.wind!==undefined?`רוח ${c.wind} קמ״ש`:'טוען נתון חי…'}</small></div>)}</div>
}

const budgetFields=['טיסות','לינה ברומא','לינה בדרום','רכב ודלק','מעבורות ושיט','אטרקציות','אוכל','שופינג','אחר'];
function Budget(){
  const [values,setValues]=useState(()=>Object.fromEntries(budgetFields.map(k=>[k,Number(localStorage.getItem(`budget:${k}`)||0)])));
  const total=useMemo(()=>Object.values(values).reduce((a,b)=>a+Number(b||0),0),[values]);
  const update=(k,v)=>{setValues(old=>({...old,[k]:v}));localStorage.setItem(`budget:${k}`,v)};
  return <div className="budgetLayout"><div className="budgetFields">{budgetFields.map(k=><label key={k}><span>{k}</span><input type="number" value={values[k]} onChange={e=>update(k,e.target.value)}/></label>)}</div><div className="budgetTotal"><span>תקציב משפחתי</span><strong>{total.toLocaleString('he-IL')} ₪</strong><small>{Math.round(total/5).toLocaleString('he-IL')} ₪ לאדם</small></div></div>
}

const tasks=['לינה 5–6.8 ליד פיומיצ׳ינו','קולוסיאום לשעה מוקדמת','מעבורות פוזיטנו–אמאלפי','מעבורת ושיט קפרי','שולחן ב־Capri Kosher','הצטיידות כשרה ברומא','ביטוח נסיעות','רישיון נהיגה בינלאומי','נעלי מים לכל המשפחה','סוללות ניידות'];
function Checklist(){
  const [done,setDone]=useState(()=>new Set(JSON.parse(localStorage.getItem('tripTasks')||'[]')));
  const toggle=t=>{const next=new Set(done);next.has(t)?next.delete(t):next.add(t);setDone(next);localStorage.setItem('tripTasks',JSON.stringify([...next]))};
  return <div className="checklist"><div className="progress"><span style={{width:`${done.size/tasks.length*100}%`}}/></div><p>{done.size} מתוך {tasks.length} הושלמו</p>{tasks.map(t=><label className={done.has(t)?'done':''} key={t}><input type="checkbox" checked={done.has(t)} onChange={()=>toggle(t)}/><span>{t}</span></label>)}</div>
}

export default function TripTools(){
  const [tab,setTab]=useState('weather');
  return <section className="section container" id="tools">
    <div className="sectionHead"><div><span className="eyebrow">כלים חכמים</span><h2>מרכז השליטה של הטיול</h2></div><p>מזג אוויר חי, תקציב משפחתי וצ׳קליסט שנשמר במכשיר.</p></div>
    <div className="toolTabs"><button className={tab==='weather'?'active':''} onClick={()=>setTab('weather')}>מזג אוויר</button><button className={tab==='budget'?'active':''} onClick={()=>setTab('budget')}>תקציב</button><button className={tab==='check'?'active':''} onClick={()=>setTab('check')}>צ׳קליסט</button></div>
    <div className="toolPanel">{tab==='weather'?<Weather/>:tab==='budget'?<Budget/>:<Checklist/>}</div>
  </section>
}
