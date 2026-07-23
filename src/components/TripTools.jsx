import { useEffect, useMemo, useRef, useState } from 'react';
import { weatherCities } from '../data/tripData.js';
import useSharedTripData from '../lib/useSharedTripData.js';
import { exportAllSharedData, importAllSharedData } from '../lib/sharedStore.js';

function Weather(){
  const [data,setData]=useState([]);
  useEffect(()=>{Promise.all(weatherCities.map(async c=>{
    try{const url=`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lng}&current=temperature_2m,wind_speed_10m&timezone=auto`;const r=await fetch(url);const j=await r.json();return {...c,temp:Math.round(j.current.temperature_2m),wind:Math.round(j.current.wind_speed_10m)}}catch{return {...c,error:true}}
  })).then(setData)},[]);
  return <div className="weatherGrid">{(data.length?data:weatherCities).map(c=><div className="weatherCard" key={c.name}><b>{c.name}</b><strong>{c.temp!==undefined?`${c.temp}°`:'--°'}</strong><small>{c.error?'לא נטען':c.wind!==undefined?`רוח ${c.wind} קמ״ש`:'טוען נתון חי…'}</small></div>)}</div>
}

const budgetFields=['טיסות','לינה ברומא','לינה בדרום','רכב ודלק','מעבורות ושיט','אטרקציות','אוכל','שופינג','אחר'];
const expenseCategories=['אוכל','שופינג','תחבורה','אטרקציות','לינה','רכב ודלק','סופר וכשרות','אחר'];

function CurrencyConverter(){
  const [rate,setRate]=useState(()=>Number(localStorage.getItem('eurIlsRate')||0));
  const [rateDate,setRateDate]=useState(localStorage.getItem('eurIlsRateDate')||'');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [direction,setDirection]=useState('ILS_EUR');
  const [amount,setAmount]=useState('100');
  const loadRate=async()=>{
    setLoading(true);setError('');
    try{
      const response=await fetch('https://api.frankfurter.dev/v2/rate/EUR/ILS');
      if(!response.ok)throw new Error('rate');
      const data=await response.json();
      const next=Number(data.rate);
      if(!next)throw new Error('rate');
      setRate(next);setRateDate(data.date||new Date().toISOString().slice(0,10));
      localStorage.setItem('eurIlsRate',String(next));localStorage.setItem('eurIlsRateDate',data.date||'');
    }catch{setError('לא ניתן לעדכן כרגע. מוצג השער האחרון שנשמר במכשיר.')}finally{setLoading(false)}
  };
  useEffect(()=>{loadRate()},[]);
  const value=Number(amount||0);
  const converted=rate?(direction==='ILS_EUR'?value/rate:value*rate):0;
  return <section className="currencyCard">
    <header><div><span>💱</span><div><h3>מחשבון שקל ↔ אירו</h3><small>{rate?`שער עדכני: €1 = ₪${rate.toFixed(4)} · ${rateDate||'עדכון אחרון'}`:'טוען שער עדכני…'}</small></div></div><button className="softButton" onClick={loadRate} disabled={loading}>{loading?'מעדכן…':'רענון שער'}</button></header>
    <div className="currencyBody"><label><span>סכום</span><input type="number" inputMode="decimal" min="0" value={amount} onChange={e=>setAmount(e.target.value)}/></label><button className="currencySwap" onClick={()=>setDirection(v=>v==='ILS_EUR'?'EUR_ILS':'ILS_EUR')} aria-label="החלפת כיוון">⇄</button><div className="currencyResult"><small>{direction==='ILS_EUR'?'שקלים לאירו':'אירו לשקלים'}</small><strong>{direction==='ILS_EUR'?'€':'₪'}{converted.toLocaleString('he-IL',{maximumFractionDigits:2})}</strong></div></div>
    <p className="currencyDisclaimer">שער ייחוס אונליין; חברת האשראי או הצ׳יינג׳ עשויים לחייב בשער שונה ובעמלה.</p>{error&&<p className="currencyError">{error}</p>}
  </section>
}

function Budget(){
  const [values,setValues,budgetSync]=useSharedTripData('budget-plan',()=>Object.fromEntries(budgetFields.map(k=>[k,0])),()=>Object.fromEntries(budgetFields.map(k=>[k,Number(localStorage.getItem(`budget:${k}`)||0)])));
  const [expenses,setExpenses,expensesSync]=useSharedTripData('expenses',[],()=>JSON.parse(localStorage.getItem('tripExpenses')||'[]'));
  const [form,setForm]=useState({item:'',store:'',category:'אוכל',price:'',currency:'EUR',payment:'אשראי',note:''});
  const rate=Number(localStorage.getItem('eurIlsRate')||4);
  const planned=useMemo(()=>Object.values(values).reduce((a,b)=>a+Number(b||0),0),[values]);
  const spent=useMemo(()=>expenses.reduce((sum,e)=>sum+(e.currency==='EUR'?Number(e.price||0)*rate:Number(e.price||0)),0),[expenses,rate]);
  const update=(k,v)=>setValues(old=>({...old,[k]:Number(v||0)}));
  const persist=list=>setExpenses(list);
  const addExpense=e=>{e.preventDefault();if(!form.item.trim()||!Number(form.price))return;persist([{...form,id:Date.now(),createdAt:new Date().toISOString()},...expenses]);setForm({...form,item:'',store:'',price:'',note:''})};
  const remove=id=>persist(expenses.filter(e=>e.id!==id));
  const exportCsv=()=>{const rows=[['פריט','מקום קנייה','קטגוריה','מחיר','מטבע','אמצעי תשלום','הערה'],...expenses.map(e=>[e.item,e.store,e.category,e.price,e.currency,e.payment,e.note])];const csv='\ufeff'+rows.map(r=>r.map(v=>`"${String(v||'').replaceAll('"','""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='italy-trip-expenses.csv';a.click();URL.revokeObjectURL(a.href)};
  return <div className="budgetHub"><div className={`sharedDataBadge ${budgetSync==='synced'&&expensesSync==='synced'?'synced':'saving'}`}>{budgetSync==='synced'&&expensesSync==='synced'?'☁️ התקציב מסונכרן למשפחה':'↻ מסנכרן נתונים…'}</div>
    <CurrencyConverter/>
    <div className="budgetLayout"><div className="budgetFields">{budgetFields.map(k=><label key={k}><span>{k}</span><input type="number" inputMode="numeric" min="0" value={values[k]} onChange={e=>update(k,e.target.value)}/></label>)}</div><div className="budgetTotal"><span>תקציב מתוכנן</span><strong>{planned.toLocaleString('he-IL')} ₪</strong><small>הוצאות שתועדו: {Math.round(spent).toLocaleString('he-IL')} ₪</small><b className={planned-spent<0?'overBudget':''}>{planned-spent>=0?'נותרו':'חריגה'} {Math.abs(Math.round(planned-spent)).toLocaleString('he-IL')} ₪</b></div></div>
    <section className="expenseLedger"><header><div><span className="eyebrow">יומן הוצאות</span><h3>מה קנינו, איפה וכמה שילמנו</h3></div>{expenses.length>0&&<button className="softButton" onClick={exportCsv}>ייצוא CSV</button>}</header>
      <form className="expenseForm" onSubmit={addExpense}><input required placeholder="מה קנינו?" value={form.item} onChange={e=>setForm({...form,item:e.target.value})}/><input placeholder="מאיפה קנינו?" value={form.store} onChange={e=>setForm({...form,store:e.target.value})}/><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{expenseCategories.map(c=><option key={c}>{c}</option>)}</select><input required type="number" inputMode="decimal" min="0" step="0.01" placeholder="מחיר" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/><select value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})}><option>EUR</option><option>ILS</option></select><select value={form.payment} onChange={e=>setForm({...form,payment:e.target.value})}><option>אשראי</option><option>מזומן</option><option>Apple/Google Pay</option></select><input className="expenseNote" placeholder="הערה (אופציונלי)" value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/><button className="button taskAdd" type="submit">＋ הוספת הוצאה</button></form>
      <div className="expenseList">{expenses.length===0?<div className="emptyExpenses">ההוצאות שתוסיפו במהלך הטיול יופיעו כאן.</div>:expenses.map(e=><article key={e.id}><div><span className="expenseIcon">{e.category==='אוכל'?'🍝':e.category==='שופינג'?'🛍️':e.category==='תחבורה'?'🚕':'🧾'}</span><div><b>{e.item}</b><small>{e.store||'ללא מקום'} · {e.category} · {e.payment}</small>{e.note&&<p>{e.note}</p>}</div></div><strong>{e.currency==='EUR'?'€':'₪'}{Number(e.price).toLocaleString('he-IL')}</strong><button aria-label="מחיקת הוצאה" onClick={()=>remove(e.id)}>×</button></article>)}</div>
    </section>
  </div>
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
  const [doneArray,setDoneArray,checkSync]=useSharedTripData('checklist-done',[],()=>JSON.parse(localStorage.getItem('tripChecklistDone')||localStorage.getItem('tripTasks')||'[]'));
  const done=new Set(doneArray);
  const [custom,setCustom]=useSharedTripData('checklist-custom',[],()=>JSON.parse(localStorage.getItem('tripChecklistCustom')||'[]'));
  const [activeGroup,setActiveGroup]=useState('all');
  const [newTask,setNewTask]=useState('');
  const [newGroup,setNewGroup]=useState('documents');

  const tasks=useMemo(()=>[...allDefaultTasks,...custom],[custom]);
  const visible=activeGroup==='all'?tasks:tasks.filter(t=>t.group===activeGroup);
  const complete=tasks.filter(t=>done.has(t.id)).length;
  const percent=tasks.length?Math.round(complete/tasks.length*100):0;

  const persistDone=next=>setDoneArray([...next]);
  const toggle=id=>{const next=new Set(done);next.has(id)?next.delete(id):next.add(id);persistDone(next)};
  const resetGroup=group=>{const ids=new Set(tasks.filter(t=>t.group===group).map(t=>t.id));persistDone(new Set([...done].filter(id=>!ids.has(id))))};
  const addTask=e=>{e.preventDefault();const text=newTask.trim();if(!text)return;const item={id:`custom:${Date.now()}`,group:newGroup,text,custom:true};const next=[...custom,item];setCustom(next);setNewTask('')};
  const removeCustom=id=>{const next=custom.filter(t=>t.id!==id);setCustom(next);const doneNext=new Set(done);doneNext.delete(id);persistDone(doneNext)};

  return <div className="checklistHub"><div className={`sharedDataBadge ${checkSync==='synced'?'synced':'saving'}`}>{checkSync==='synced'?'☁️ הצ׳ק־ליסט משותף לכולם':'↻ מסנכרן צ׳ק־ליסט…'}</div>
    <div className="checklistOverview">
      <div><strong>{percent}%</strong><span>{complete} מתוך {tasks.length} משימות הושלמו</span></div>
      <div className="progress" aria-label={`התקדמות ${percent}%`}><span style={{width:`${percent}%`}}/></div>
    </div>
    <div className="checklistFilterBar">
      <label className="filterField"><span>הצגת קטגוריה</span><select value={activeGroup} onChange={e=>setActiveGroup(e.target.value)}><option value="all">כל הקטגוריות</option>{checklistGroups.map(g=><option value={g.id} key={g.id}>{g.icon} {g.title}</option>)}</select></label>
      <div className="filterSummary"><b>{visible.length}</b><small>פריטים מוצגים</small></div>
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
  const [notes,setNotes,notesSync]=useSharedTripData('quick-notes','',()=>localStorage.getItem('tripQuickNotes')||'');
  const [contacts,setContacts,contactsSync]=useSharedTripData('trip-contacts',()=>Object.fromEntries(contactFields.map(([id])=>[id,''])),()=>Object.fromEntries(contactFields.map(([id])=>[id,localStorage.getItem(`tripContact:${id}`)||''])));
  const [draftNotes,setDraftNotes]=useState(notes);
  const [notesDirty,setNotesDirty]=useState(false);
  const [notesMessage,setNotesMessage]=useState('');
  const fileRef=useRef(null), notesTimer=useRef(null);
  useEffect(()=>{if(!notesDirty)setDraftNotes(notes)},[notes,notesDirty]);
  useEffect(()=>()=>clearTimeout(notesTimer.current),[]);
  const saveNotes=()=>{
    clearTimeout(notesTimer.current);
    if(draftNotes===notes){setNotesDirty(false);setNotesMessage('הפתק מעודכן');return;}
    setNotes(draftNotes);setNotesDirty(false);setNotesMessage('נשמר ומסתנכרן…');
    setTimeout(()=>setNotesMessage(''),2200);
  };
  const updateNotes=value=>{
    setDraftNotes(value);setNotesDirty(true);setNotesMessage('ממתין להפסקת כתיבה…');
    clearTimeout(notesTimer.current);
    notesTimer.current=setTimeout(()=>{
      setNotes(value);setNotesDirty(false);setNotesMessage('נשמר אוטומטית');
      setTimeout(()=>setNotesMessage(''),2200);
    },3000);
  };
  const updateContact=(id,value)=>setContacts(old=>({...old,[id]:value}));
  const exportData=async()=>{try{if(notesDirty){clearTimeout(notesTimer.current);setNotes(draftNotes)}const data=await exportAllSharedData()||{version:2,exportedAt:new Date().toISOString(),shared:{'quick-notes':draftNotes,'trip-contacts':contacts}};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='italy-trip-shared-backup.json';a.click();URL.revokeObjectURL(url)}catch{alert('לא הצלחנו ליצור גיבוי כרגע')}};
  const importData=async e=>{const file=e.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());await importAllSharedData(data.shared||{});location.reload()}catch{alert('קובץ הגיבוי אינו תקין')}finally{e.target.value=''}};
  const notesStatus=notesDirty?'יש שינויים שטרם נשמרו':notesSync==='saving'?'מסנכרן לענן…':notesSync==='error'?'השמירה בענן נכשלה':'הפתק מסונכרן';
  return <div className="notesLayout"><div className={`sharedDataBadge wideSync ${!notesDirty&&notesSync==='synced'&&contactsSync==='synced'?'synced':'saving'}`}>{!notesDirty&&notesSync==='synced'&&contactsSync==='synced'?'☁️ הפתקים ופרטי הקשר משותפים לכולם':notesDirty?'✍️ יש שינויים שלא נשמרו':'↻ מסנכרן מידע…'}</div>
    <div className="notesCard"><h3>פתקים משפחתיים</h3><p>השינויים נשמרים 3 שניות אחרי שמפסיקים להקליד, או מיד בלחיצה על „עדכן עכשיו”.</p><textarea rows="10" value={draftNotes} onChange={e=>updateNotes(e.target.value)} placeholder="מספרי הזמנה, דברים לקנות, שינויי תוכנית..."/><div className="notesSaveBar"><span className={notesDirty?'pending':''}>{notesMessage||notesStatus}</span><button className="button notesSaveButton" type="button" disabled={!notesDirty} onClick={saveNotes}>עדכן עכשיו</button></div></div>
    <div className="contactsCard"><h3>פרטי קשר והזמנות</h3>{contactFields.map(([id,label])=><label key={id}><span>{label}</span><input value={contacts[id]} onChange={e=>updateContact(id,e.target.value)} placeholder="מספר, כתובת או הערה"/></label>)}</div>
    <div className="backupCard"><h3>גיבוי כלי הטיול</h3><p>הורידו גיבוי של כל הנתונים המשותפים ב־Supabase: צ׳ק־ליסט, תקציב, הוצאות, פתקים, דירוגים, חניה ומשימות. תמונות ה־Story Line נשמרות בענן בנפרד.</p><div><button className="button backupButton" onClick={exportData}>הורדת גיבוי</button><button className="softButton" onClick={()=>fileRef.current?.click()}>שחזור גיבוי</button><input ref={fileRef} hidden type="file" accept="application/json" onChange={importData}/></div></div>
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
    <div className="sectionHead"><div><span className="eyebrow">כלים חכמים</span><h2>מרכז השליטה של הטיול</h2></div><p>מזג אוויר חי, מחשבון אירו, תקציב מפורט, רשימת הכנות, פתקים וגיבוי מקומי.</p></div>
    <ConnectionStatus/>
    <div className="toolTabs"><button className={tab==='weather'?'active':''} onClick={()=>setTab('weather')}><span>☀️</span><b>מזג אוויר</b></button><button className={tab==='budget'?'active':''} onClick={()=>setTab('budget')}><span>💶</span><b>תקציב</b></button><button className={tab==='check'?'active':''} onClick={()=>setTab('check')}><span>✅</span><b>צ׳ק־ליסט</b></button><button className={tab==='notes'?'active':''} onClick={()=>setTab('notes')}><span>📝</span><b>פתקים וגיבוי</b></button></div>
    <div className="toolPanel">{tab==='weather'?<Weather/>:tab==='budget'?<Budget/>:tab==='check'?<Checklist/>:<NotesAndBackup/>}</div>
  </section>
}
