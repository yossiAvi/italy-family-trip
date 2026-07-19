import { useEffect, useMemo, useRef, useState } from 'react';
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
  return <div className="budgetLayout"><div className="budgetFields">{budgetFields.map(k=><label key={k}><span>{k}</span><input type="number" inputMode="numeric" min="0" value={values[k]} onChange={e=>update(k,e.target.value)}/></label>)}</div><div className="budgetTotal"><span>תקציב משפחתי</span><strong>{total.toLocaleString('he-IL')} ₪</strong><small>{Math.round(total/5).toLocaleString('he-IL')} ₪ לאדם</small></div></div>
}

const checklistGroups=[
  {id:'documents',title:'מסמכים וכסף',icon:'🪪',items:[
    'דרכונים בתוקף לכל בני המשפחה','צילומי דרכונים בענן ובטלפון','כרטיסי טיסה ואישורי הזמנה','ביטוח נסיעות ומספר מוקד הביטוח','רישיון נהיגה ישראלי','רישיון נהיגה בינלאומי','שובר הזמנת הרכב','כרטיסי אשראי ופרטי PIN','כרטיס אשראי חלופי שמוחזק בנפרד','מעט מזומן באירו','כתובות ומספרי טלפון של מקומות הלינה'
  ]},
  {id:'bookings',title:'הזמנות לפני הטיול',icon:'🎟️',items:[
    'לינה ברומא מאושרת','לינה בדרום מאושרת','לינה 5–6.8 ליד פיומיצ׳ינו','רכב לחמישה עם תא מטען מתאים','בדיקת מדיניות מזוודות בטיסה','קולוסיאום לשעה מוקדמת','מעבורות פוזיטנו–אמאלפי','מעבורת הלוך וחזור לקפרי','שיט סביב קפרי','שולחן ב־Capri Kosher','מסעדות כשרות ברומא לפי הצורך','חניה בנמל סורנטו לימי המעבורות','בדיקת שעות מעבורות סמוך לנסיעה'
  ]},
  {id:'clothes',title:'ביגוד והנעלה',icon:'👕',items:[
    'בגדים קלים לכל יום','לבנים וגרביים','פיג׳מות','בגדי ים לכל המשפחה','כובעים','משקפי שמש','נעלי הליכה נוחות','נעלי מים','סנדלים או כפכפים','עליונית קלה למזגן ולערב','בגדים להחלפה בתיק יד','שק כביסה לבגדים מלוכלכים'
  ]},
  {id:'health',title:'בריאות וטיפוח',icon:'🩹',items:[
    'תרופות קבועות בכמות מספקת','מרשמים או אישורים לתרופות חשובות','משכך כאבים ומוריד חום','תרופה לבחילות בנסיעות או בשיט','פלסטרים וחומר חיטוי','קרם הגנה','תכשיר נגד יתושים','אלכוג׳ל ומגבונים','מוצרי רחצה והיגיינה','מברשות ומשחת שיניים','תרופות לאלרגיה לפי הצורך','מדחום קטן','עדשות מגע או משקפיים חלופיים'
  ]},
  {id:'kosher',title:'כשרות ואוכל לדרך',icon:'✡️',items:[
    'הצטיידות במוצרים כשרים ברומא','חטיפים ומזון סגור לימים ארוכים','לחם או קרקרים ארוזים','טונה וממרחים סגורים','כלים חד־פעמיים','סכין וכלי הכנה מותאמים לפי הצורך','תיק קירור וקרחומים','בקבוקי שתייה רב־פעמיים','רשימת מסעדות כשרות שמורה בטלפון','תיאום ארוחות כשרות בדרום אם נדרש','בדיקה אם בלינה יש מקרר או מטבחון'
  ]},
  {id:'electronics',title:'אלקטרוניקה',icon:'🔌',items:[
    'טלפונים','מטענים לכל הטלפונים','מתאמי חשמל מתאימים לאיטליה','סוללות ניידות טעונות','כבל טעינה לרכב','מטען לרכב','אוזניות','מצלמה וכרטיס זיכרון לפי הצורך','כבלי טעינה נוספים','הורדת מפות אופליין','התקנת eSIM או חבילת גלישה','בדיקת מקום פנוי לתמונות בטלפונים'
  ]},
  {id:'car',title:'רכב ונהיגה',icon:'🚗',items:[
    'בדיקת תנאי הביטוח וההשתתפות העצמית','בדיקת מדיניות הדלק','צילום הרכב מכל הצדדים בעת האיסוף','צילום מד הדלק והקילומטרים','בדיקת שריטות, צמיגים ומראות','בדיקת מושבי בטיחות או בוסטר לפי הצורך','שמירת קישורי החניונים באפליקציה','בדיקת ZTL ומגבלות לוחיות לפני נסיעה','שמירת מספר שירות הדרך של חברת ההשכרה','מטבעות או אמצעי תשלום לחניה','הגדרת Google Maps ו־Waze','לא להשאיר ציוד גלוי ברכב'
  ]},
  {id:'daily',title:'תיק יום — לאפס בכל בוקר',icon:'🎒',daily:true,items:[
    'מים לכל בני המשפחה','כובעים','קרם הגנה','משקפי שמש','כרטיסים והזמנות של היום','צילום דרכונים','מעט מזומן וכרטיס אשראי','טלפון טעון','סוללה ניידת','חטיפים או אוכל כשר','בגדי ים לפי התוכנית','מגבות מיקרופייבר','נעלי מים','תרופה לבחילה ביום שיט','טישו ומגבונים','שקית לבגדים רטובים','בדיקת מזג האוויר ומצב הים','בדיקת שעת החזרה האחרונה','צילום או שמירת מיקום החניה'
  ]},
  {id:'home',title:'לפני שיוצאים מהבית',icon:'🏠',items:[
    'ריקון פחי אשפה','בדיקת מקרר ומזון שעלול להתקלקל','סגירת מים וגז לפי הצורך','כיבוי מכשירי חשמל שאינם נחוצים','נעילת חלונות ודלתות','סידור השקיית עציצים','תיאום טיפול בדואר או בחיות מחמד','השארת מפתח אצל אדם קרוב','הפעלת אזעקה','בדיקת משקל המזוודות','ווידוא שכולם לקחו דרכון'
  ]}
];

const allDefaultTasks=checklistGroups.flatMap(g=>g.items.map((text,index)=>({id:`${g.id}:${index}`,group:g.id,text,custom:false})));

function Checklist(){
  const [done,setDone]=useState(()=>new Set(JSON.parse(localStorage.getItem('tripChecklistDone')||localStorage.getItem('tripTasks')||'[]')));
  const [custom,setCustom]=useState(()=>JSON.parse(localStorage.getItem('tripChecklistCustom')||'[]'));
  const [activeGroup,setActiveGroup]=useState('all');
  const [newTask,setNewTask]=useState('');
  const [newGroup,setNewGroup]=useState('documents');

  const tasks=useMemo(()=>[...allDefaultTasks,...custom],[custom]);
  const visible=activeGroup==='all'?tasks:tasks.filter(t=>t.group===activeGroup);
  const complete=tasks.filter(t=>done.has(t.id)).length;
  const percent=tasks.length?Math.round(complete/tasks.length*100):0;

  const persistDone=next=>{setDone(next);localStorage.setItem('tripChecklistDone',JSON.stringify([...next]))};
  const toggle=id=>{const next=new Set(done);next.has(id)?next.delete(id):next.add(id);persistDone(next)};
  const resetGroup=group=>{const ids=new Set(tasks.filter(t=>t.group===group).map(t=>t.id));persistDone(new Set([...done].filter(id=>!ids.has(id))))};
  const addTask=e=>{e.preventDefault();const text=newTask.trim();if(!text)return;const item={id:`custom:${Date.now()}`,group:newGroup,text,custom:true};const next=[...custom,item];setCustom(next);localStorage.setItem('tripChecklistCustom',JSON.stringify(next));setNewTask('')};
  const removeCustom=id=>{const next=custom.filter(t=>t.id!==id);setCustom(next);localStorage.setItem('tripChecklistCustom',JSON.stringify(next));const doneNext=new Set(done);doneNext.delete(id);persistDone(doneNext)};

  return <div className="checklistHub">
    <div className="checklistOverview">
      <div><strong>{percent}%</strong><span>{complete} מתוך {tasks.length} משימות הושלמו</span></div>
      <div className="progress" aria-label={`התקדמות ${percent}%`}><span style={{width:`${percent}%`}}/></div>
    </div>
    <div className="checklistFilters" role="tablist">
      <button className={activeGroup==='all'?'active':''} onClick={()=>setActiveGroup('all')}>הכול</button>
      {checklistGroups.map(g=><button className={activeGroup===g.id?'active':''} onClick={()=>setActiveGroup(g.id)} key={g.id}>{g.icon} {g.title}</button>)}
    </div>
    {checklistGroups.filter(g=>activeGroup==='all'||activeGroup===g.id).map(group=>{
      const groupTasks=visible.filter(t=>t.group===group.id);
      const groupDone=groupTasks.filter(t=>done.has(t.id)).length;
      return <section className="checklistGroup" key={group.id}>
        <header><div><span>{group.icon}</span><div><h3>{group.title}</h3><small>{groupDone} מתוך {groupTasks.length}</small></div></div>{group.daily&&<button className="softButton" onClick={()=>resetGroup(group.id)}>איפוס תיק יום</button>}</header>
        <div className="checklistItems">{groupTasks.map(task=><div className={`checklistRow ${done.has(task.id)?'done':''}`} key={task.id}>
          <label><input type="checkbox" checked={done.has(task.id)} onChange={()=>toggle(task.id)}/><span>{task.text}</span></label>
          {task.custom&&<button className="removeTask" aria-label={`מחיקת ${task.text}`} onClick={()=>removeCustom(task.id)}>×</button>}
        </div>)}</div>
      </section>
    })}
    <form className="customTaskForm" onSubmit={addTask}>
      <h3>הוספת פריט אישי</h3>
      <div><input value={newTask} onChange={e=>setNewTask(e.target.value)} placeholder="לדוגמה: לקחת מתנה למשפחה"/><select value={newGroup} onChange={e=>setNewGroup(e.target.value)}>{checklistGroups.map(g=><option value={g.id} key={g.id}>{g.title}</option>)}</select><button className="button taskAdd" type="submit">הוספה</button></div>
    </form>
  </div>
}

const contactFields=[
  ['airline','חברת תעופה / מספר טיסה'],['insurance','ביטוח נסיעות / מוקד'],['rental','חברת השכרת רכב'],['romeHotel','לינה ברומא'],['southHotel','לינה בדרום'],['lastHotel','לינה ליד פיומיצ׳ינו']
];
function NotesAndBackup(){
  const [notes,setNotes]=useState(()=>localStorage.getItem('tripQuickNotes')||'');
  const [contacts,setContacts]=useState(()=>Object.fromEntries(contactFields.map(([id])=>[id,localStorage.getItem(`tripContact:${id}`)||''])));
  const fileRef=useRef(null);
  const updateNotes=value=>{setNotes(value);localStorage.setItem('tripQuickNotes',value)};
  const updateContact=(id,value)=>{setContacts(old=>({...old,[id]:value}));localStorage.setItem(`tripContact:${id}`,value)};
  const exportData=()=>{
    const data={version:1,exportedAt:new Date().toISOString(),checklistDone:JSON.parse(localStorage.getItem('tripChecklistDone')||'[]'),checklistCustom:JSON.parse(localStorage.getItem('tripChecklistCustom')||'[]'),notes:localStorage.getItem('tripQuickNotes')||'',contacts:Object.fromEntries(contactFields.map(([id])=>[id,localStorage.getItem(`tripContact:${id}`)||''])),budget:Object.fromEntries(budgetFields.map(k=>[k,localStorage.getItem(`budget:${k}`)||'0']))};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='italy-trip-backup.json';a.click();URL.revokeObjectURL(url)
  };
  const importData=async e=>{const file=e.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());localStorage.setItem('tripChecklistDone',JSON.stringify(data.checklistDone||[]));localStorage.setItem('tripChecklistCustom',JSON.stringify(data.checklistCustom||[]));localStorage.setItem('tripQuickNotes',data.notes||'');Object.entries(data.contacts||{}).forEach(([id,value])=>localStorage.setItem(`tripContact:${id}`,value));Object.entries(data.budget||{}).forEach(([k,value])=>localStorage.setItem(`budget:${k}`,value));location.reload()}catch{alert('קובץ הגיבוי אינו תקין')}finally{e.target.value=''}};
  return <div className="notesLayout">
    <div className="notesCard"><h3>פתקים משפחתיים</h3><p>רשמו כאן דברים שחשוב לזכור. הפתק נשמר אוטומטית במכשיר.</p><textarea rows="10" value={notes} onChange={e=>updateNotes(e.target.value)} placeholder="מספרי הזמנה, דברים לקנות, שינויי תוכנית..."/></div>
    <div className="contactsCard"><h3>פרטי קשר והזמנות</h3>{contactFields.map(([id,label])=><label key={id}><span>{label}</span><input value={contacts[id]} onChange={e=>updateContact(id,e.target.value)} placeholder="מספר, כתובת או הערה"/></label>)}</div>
    <div className="backupCard"><h3>גיבוי כלי הטיול</h3><p>הורידו קובץ גיבוי של הצ׳ק־ליסט, התקציב, הפתקים ופרטי הקשר. תמונות ה־Story Line מגובות בנפרד דרך Supabase.</p><div><button className="button backupButton" onClick={exportData}>הורדת גיבוי</button><button className="softButton" onClick={()=>fileRef.current?.click()}>שחזור גיבוי</button><input ref={fileRef} hidden type="file" accept="application/json" onChange={importData}/></div></div>
  </div>
}

function ConnectionStatus(){
  const [online,setOnline]=useState(navigator.onLine);
  useEffect(()=>{const on=()=>setOnline(true),off=()=>setOnline(false);addEventListener('online',on);addEventListener('offline',off);return()=>{removeEventListener('online',on);removeEventListener('offline',off)}},[]);
  return <div className={`connectionStatus ${online?'online':'offline'}`}><span>{online?'●':'○'}</span>{online?'מחובר לאינטרנט':'מצב לא מקוון — מידע שנשמר במכשיר עדיין זמין'}</div>
}

export default function TripTools(){
  const [tab,setTab]=useState('weather');
  return <section className="section container" id="tools">
    <div className="sectionHead"><div><span className="eyebrow">כלים חכמים</span><h2>מרכז השליטה של הטיול</h2></div><p>מזג אוויר חי, תקציב, רשימת הכנות מלאה, פתקים וגיבוי מקומי.</p></div>
    <ConnectionStatus/>
    <div className="toolTabs"><button className={tab==='weather'?'active':''} onClick={()=>setTab('weather')}>מזג אוויר</button><button className={tab==='budget'?'active':''} onClick={()=>setTab('budget')}>תקציב</button><button className={tab==='check'?'active':''} onClick={()=>setTab('check')}>צ׳ק־ליסט</button><button className={tab==='notes'?'active':''} onClick={()=>setTab('notes')}>פתקים וגיבוי</button></div>
    <div className="toolPanel">{tab==='weather'?<Weather/>:tab==='budget'?<Budget/>:tab==='check'?<Checklist/>:<NotesAndBackup/>}</div>
  </section>
}
