import { useEffect, useMemo, useRef, useState } from 'react';

const tripStart = new Date('2026-07-27T00:00:00');
const tripEnd = new Date('2026-08-06T23:59:59');

const family = [
  {id:'yossi',name:'יוסי',emoji:'🧭',role:'מנהל הניווט'},
  {id:'yasmin',name:'יסמין',emoji:'🍦',role:'אלופת הטעמים'},
  {id:'sivan',name:'סיון',emoji:'📸',role:'צלמת המשפחה'},
  {id:'shiran',name:'שירן',emoji:'🛍️',role:'מומחית השופינג'},
  {id:'oren',name:'אורן',emoji:'🏰',role:'מגלה המבצרים'}
];

const missions = [
  {id:'family-selfie',icon:'🤳',title:'סלפי משפחתי',text:'צלמו תמונה שבה כל המשפחה נכנסת לפריים.',points:20},
  {id:'local-word',icon:'🇮🇹',title:'מילה באיטלקית',text:'השתמשו היום במילה איטלקית חדשה עם אדם מקומי.',points:15},
  {id:'funny-pose',icon:'😄',title:'תנוחה מצחיקה',text:'צלמו תמונה קבוצתית בתנוחה יצירתית.',points:15},
  {id:'hidden-detail',icon:'🔍',title:'הפרט הנסתר',text:'מצאו פרט מעניין שאחרים כמעט לא שמים לב אליו.',points:20},
  {id:'new-flavor',icon:'🍨',title:'טעם חדש',text:'נסו גלידה, מאפה או מאכל חדש.',points:15},
  {id:'post-story',icon:'✍️',title:'סיפור מהיום',text:'הוסיפו תמונה והסבר ל־Story Line.',points:25}
];

function dateKey(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
function dayDate(index){const d=new Date(tripStart);d.setDate(d.getDate()+index);return d}
function mapsLink(query){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}

function useStoredState(key, initial){
  const [value,setValue]=useState(()=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):initial}catch{return initial}});
  const update=next=>setValue(old=>{const resolved=typeof next==='function'?next(old):next;localStorage.setItem(key,JSON.stringify(resolved));return resolved});
  return [value,update];
}

function SmartToday({days,onOpenDay,onAddStory}){
  const currentIndex=useMemo(()=>{
    const now=new Date();
    if(now<tripStart)return 0;
    if(now>tripEnd)return days.length-1;
    return Math.max(0,Math.min(days.length-1,Math.floor((new Date(now.getFullYear(),now.getMonth(),now.getDate())-tripStart)/86400000)));
  },[days.length]);
  const [selected,setSelected]=useState(currentIndex);
  const day=days[selected];
  const now=new Date();
  const status=now<tripStart?'לפני הטיול':now>tripEnd?'הטיול הסתיים':'היום בטיול';
  const nextItem=day.schedule?.find(([time])=>{const [h,m]=time.split(':').map(Number);return !Number.isNaN(h)&&(h*60+m)>(now.getHours()*60+now.getMinutes())})||day.schedule?.[0];
  return <article className="smartToday premiumCard">
    <div className="todayImage" style={{backgroundImage:`linear-gradient(0deg,rgba(7,29,36,.78),rgba(7,29,36,.08)),url(${day.image})`}}>
      <span className="liveChip">● {status}</span>
      <div><small>{day.weekday} · {day.date}</small><h3>{day.title}</h3><p>{day.summary}</p></div>
    </div>
    <div className="todayBody">
      <div className="dayPicker"><button disabled={selected===0} onClick={()=>setSelected(v=>v-1)}>→</button><select value={selected} onChange={e=>setSelected(Number(e.target.value))}>{days.map((d,i)=><option key={d.date} value={i}>{d.date} · {d.title}</option>)}</select><button disabled={selected===days.length-1} onClick={()=>setSelected(v=>v+1)}>←</button></div>
      <div className="todayHighlights">
        <div><span>🧭</span><b>איך מתניידים</b><p>{day.transport?.mode}</p></div>
        <div><span>🅿️</span><b>חניה</b><p>{day.parking?.needed?day.parking.name:'לא משתמשים ברכב'}</p></div>
        <div><span>⏱️</span><b>{now>=tripStart&&now<=tripEnd?'התחנה הבאה':'תחנה מומלצת'}</b><p>{nextItem?`${nextItem[0]} · ${nextItem[1]}`:'פתחו את המסלול המלא'}</p></div>
      </div>
      <div className="todayActions"><button className="button premiumPrimary" onClick={()=>onOpenDay(day.date)}>פתיחת היום המלא</button>{day.parking?.link&&<a className="button premiumSoft" target="_blank" rel="noreferrer" href={day.parking.link}>ניווט לחניה</a>}<button className="button premiumSoft" onClick={onAddStory}>＋ הוספת רגע</button></div>
    </div>
  </article>
}

function KidsMode({days,onAddStory}){
  const [activeDay,setActiveDay]=useState(0);
  const key=`kidMissions:${days[activeDay]?.date}`;
  const [done,setDone]=useStoredState(key,[]);
  useEffect(()=>{try{setDone(JSON.parse(localStorage.getItem(key)||'[]'))}catch{setDone([])}},[key]);
  const toggle=id=>setDone(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]);
  const points=missions.filter(m=>done.includes(m.id)).reduce((s,m)=>s+m.points,0);
  const badge=points>=100?'🏆 אלופי היום':points>=60?'🌟 חוקרי איטליה':points>=30?'🎒 הרפתקנים':'🚀 מתחילים';
  return <article className="kidsMode premiumCard">
    <header><div><span className="premiumEyebrow">מצב ילדים</span><h3>האתגר המשפחתי של היום</h3><p>משימות קצרות שהופכות כל יום למשחק משותף.</p></div><div className="pointsBubble"><strong>{points}</strong><small>נקודות</small></div></header>
    <div className="kidsDaySelect"><span>היום שנבחר:</span><select value={activeDay} onChange={e=>setActiveDay(Number(e.target.value))}>{days.map((d,i)=><option key={d.date} value={i}>{d.date} · {d.title}</option>)}</select></div>
    <div className="missionGrid">{missions.map(m=><button key={m.id} className={`missionCard ${done.includes(m.id)?'complete':''}`} onClick={()=>toggle(m.id)}><span>{done.includes(m.id)?'✓':m.icon}</span><div><b>{m.title}</b><p>{m.text}</p><small>+{m.points} נקודות</small></div></button>)}</div>
    <footer><div><b>{badge}</b><span>{done.length} מתוך {missions.length} משימות</span></div><button className="button premiumPrimary" onClick={onAddStory}>הוספת התמונה לבלוג</button></footer>
  </article>
}

function ParkingCard(){
  const [parking,setParking]=useStoredState('smartParking',{name:'',level:'',spot:'',note:'',lat:null,lng:null,photo:'',savedAt:null,reminder:''});
  const fileRef=useRef(null);
  const update=(field,value)=>setParking(old=>({...old,[field]:value}));
  const captureLocation=()=>navigator.geolocation?.getCurrentPosition(pos=>setParking(old=>({...old,lat:pos.coords.latitude,lng:pos.coords.longitude,savedAt:new Date().toISOString()})),()=>alert('לא ניתן לקבל מיקום. בדקו הרשאת מיקום.'));
  const addPhoto=e=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>update('photo',reader.result);reader.readAsDataURL(file);e.target.value=''};
  const clear=()=>confirm('למחוק את כרטיס החניה?')&&setParking({name:'',level:'',spot:'',note:'',lat:null,lng:null,photo:'',savedAt:null,reminder:''});
  return <article className="smartParkingCard premiumCard">
    <header><div><span className="premiumEyebrow">איפה הרכב?</span><h3>כרטיס חניה חכם</h3><p>שומרים תמונה, קומה, מקום ו־GPS — וחוזרים לרכב בלי לחץ.</p></div><span className="parkingIcon">🚗</span></header>
    {parking.photo&&<button className="parkingPhoto" onClick={()=>fileRef.current?.click()}><img src={parking.photo} alt="מקום החניה"/><span>החלפת תמונה</span></button>}
    <div className="parkingFields"><label><span>שם החניון</span><input value={parking.name} onChange={e=>update('name',e.target.value)} placeholder="לדוגמה: Garage Marina Piccola"/></label><label><span>קומה / אזור</span><input value={parking.level} onChange={e=>update('level',e.target.value)} placeholder="קומה 2"/></label><label><span>מספר מקום</span><input value={parking.spot} onChange={e=>update('spot',e.target.value)} placeholder="148"/></label><label><span>שעת חזרה</span><input type="time" value={parking.reminder} onChange={e=>update('reminder',e.target.value)}/></label><label className="wideField"><span>הערה</span><input value={parking.note} onChange={e=>update('note',e.target.value)} placeholder="ליד המעלית / כניסה צפונית"/></label></div>
    <div className="parkingActions"><button className="button premiumPrimary" onClick={captureLocation}>📍 שמירת מיקום</button><button className="button premiumSoft" onClick={()=>fileRef.current?.click()}>📷 {parking.photo?'החלפת תמונה':'צילום החניה'}</button>{parking.lat&&<a className="button premiumSoft" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${parking.lat},${parking.lng}`}>ניווט חזרה לרכב</a>}<button className="textDanger" onClick={clear}>איפוס</button><input ref={fileRef} hidden type="file" accept="image/*" capture="environment" onChange={addPhoto}/></div>
  </article>
}

function FamilyRatings({days}){
  const [dayIndex,setDayIndex]=useState(0);
  const [ratings,setRatings]=useStoredState('familyRatings',{});
  const day=days[dayIndex];
  const dayRatings=ratings[day.date]||{};
  const setRating=(person,category,value)=>setRatings(old=>({...old,[day.date]:{...(old[day.date]||{}),[person]:{...((old[day.date]||{})[person]||{}),[category]:value}}}));
  const categories=[['fun','כיף'],['food','אוכל'],['place','המקום']];
  const emojis=['😐','🙂','😄','🤩','🏆'];
  const averages=categories.map(([id,label])=>{const vals=family.flatMap(p=>dayRatings[p.id]?.[id]?[dayRatings[p.id][id]]:[]);return {id,label,value:vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0}});
  return <article className="ratingsCard premiumCard">
    <header><div><span className="premiumEyebrow">סיכום משפחתי</span><h3>איך היה לנו היום?</h3><p>כל אחד מדרג בלחיצה — ובסוף נגלה מה היה המקום המנצח.</p></div><select value={dayIndex} onChange={e=>setDayIndex(Number(e.target.value))}>{days.map((d,i)=><option key={d.date} value={i}>{d.date} · {d.title}</option>)}</select></header>
    <div className="ratingPeople">{family.map(person=><section key={person.id}><div className="personTitle"><span>{person.emoji}</span><div><b>{person.name}</b><small>{person.role}</small></div></div>{categories.map(([id,label])=><div className="ratingRow" key={id}><span>{label}</span><div>{emojis.map((emoji,index)=><button key={emoji} className={dayRatings[person.id]?.[id]===index+1?'active':''} onClick={()=>setRating(person.id,id,index+1)} title={`${label}: ${index+1}`}>{emoji}</button>)}</div></div>)}</section>)}</div>
    <footer>{averages.map(a=><div key={a.id}><span>{a.label}</span><b>{a.value?`${a.value.toFixed(1)} / 5`:'ממתין לדירוג'}</b></div>)}</footer>
  </article>
}

function MemoryMap({destinations}){
  const [stories,setStories]=useState(()=>{try{return JSON.parse(localStorage.getItem('tripStoriesCache')||'[]')}catch{return[]}});
  useEffect(()=>{const handler=e=>setStories(e.detail||[]);addEventListener('trip-stories-updated',handler);return()=>removeEventListener('trip-stories-updated',handler)},[]);
  const points=stories.filter(s=>s.latitude&&s.longitude);
  return <article className="memoryMap premiumCard">
    <header><div><span className="premiumEyebrow">מפת הזיכרונות</span><h3>המקומות שבהם נוצר הסיפור שלנו</h3><p>כל סיפור עם GPS הופך לנקודה חיה על מפת המסע.</p></div><b>{points.length} נקודות זיכרון</b></header>
    <div className="memoryMapCanvas">
      <div className="italyRouteLine"/>
      {destinations.map((d,i)=><a key={d.id} className={`memoryPoint planned point-${i}`} href={mapsLink(`${d.lat},${d.lng}`)} target="_blank" rel="noreferrer" title={d.name}><span>{i+1}</span><b>{d.name}</b></a>)}
      {points.slice(0,12).map((s,i)=><a key={s.id||i} className={`memoryPoint lived lived-${i%6}`} href={`https://www.google.com/maps/search/?api=1&query=${s.latitude},${s.longitude}`} target="_blank" rel="noreferrer" title={s.title||s.locationName}><span>★</span><b>{s.locationName||'זיכרון'}</b></a>)}
    </div>
    <div className="memoryLegend"><span><i className="plannedDot"/> המסלול המתוכנן</span><span><i className="livedDot"/> זיכרונות עם GPS</span></div>
  </article>
}

function FamilyPassports(){
  const [stories,setStories]=useState(()=>{try{return JSON.parse(localStorage.getItem('tripStoriesCache')||'[]')}catch{return[]}});
  useEffect(()=>{const handler=e=>setStories(e.detail||[]);addEventListener('trip-stories-updated',handler);return()=>removeEventListener('trip-stories-updated',handler)},[]);
  return <article className="passports premiumCard"><header><div><span className="premiumEyebrow">הדרכון המשפחתי</span><h3>משפחת אביטן חוקרת את איטליה</h3><p>הפרופיל מתמלא אוטומטית לפי הסיפורים והתמונות שכל אחד מוסיף.</p></div></header><div className="passportGrid">{family.map((person,index)=>{const mine=stories.filter(s=>(s.author||'').includes(person.name));const photos=mine.reduce((n,s)=>n+(s.images?.length||0),0);const places=new Set(mine.map(s=>s.locationName).filter(Boolean)).size;return <div className="passport" key={person.id}><span className="passportEmoji">{person.emoji}</span><h4>{person.name}</h4><p>{person.role}</p><div><b>{mine.length}</b><small>סיפורים</small></div><div><b>{photos}</b><small>תמונות</small></div><div><b>{places}</b><small>מקומות</small></div><em>{photos>=10?'🏅 צלם/ת זהב':photos>=3?'⭐ כוכב/ת המסע':'🎒 יוצאים לדרך'}</em></div>})}</div></article>
}


function AccessibilityBar(){
  const [large,setLarge]=useState(localStorage.getItem('a11yLarge')==='1');
  const [contrast,setContrast]=useState(localStorage.getItem('a11yContrast')==='1');
  const [calm,setCalm]=useState(localStorage.getItem('a11yCalm')==='1');
  useEffect(()=>{document.body.classList.toggle('largeText',large);localStorage.setItem('a11yLarge',large?'1':'0')},[large]);
  useEffect(()=>{document.body.classList.toggle('highContrast',contrast);localStorage.setItem('a11yContrast',contrast?'1':'0')},[contrast]);
  useEffect(()=>{document.body.classList.toggle('reducedMotion',calm);localStorage.setItem('a11yCalm',calm?'1':'0')},[calm]);
  const speak=()=>{speechSynthesis.cancel();const text=document.querySelector('.premiumPanel')?.innerText?.slice(0,3500)||'';const utterance=new SpeechSynthesisUtterance(text);utterance.lang='he-IL';utterance.rate=.92;speechSynthesis.speak(utterance)};
  return <div className="accessibilityBar"><b>נגישות:</b><button className={large?'active':''} onClick={()=>setLarge(v=>!v)}>A+ טקסט</button><button className={contrast?'active':''} onClick={()=>setContrast(v=>!v)}>◐ ניגודיות</button><button className={calm?'active':''} onClick={()=>setCalm(v=>!v)}>≈ ללא תנועה</button><button onClick={speak}>🔊 הקראה</button></div>
}

function JourneyPlayer(){
  const [open,setOpen]=useState(false);
  const [index,setIndex]=useState(0);
  const stories=useMemo(()=>{try{return JSON.parse(localStorage.getItem('tripStoriesCache')||'[]').filter(s=>s.images?.length)}catch{return[]}},[open]);
  const slides=stories.flatMap(story=>story.images.map(image=>({image,title:story.title||story.locationName||'רגע מהטיול',body:story.body,author:story.author,place:story.locationName,date:story.visitDate})));
  useEffect(()=>{if(!open||slides.length<2)return;const timer=setInterval(()=>setIndex(v=>(v+1)%slides.length),6000);return()=>clearInterval(timer)},[open,slides.length]);
  const current=slides[index];
  const speak=()=>{if(!current)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance([current.title,current.body].filter(Boolean).join('. '));u.lang='he-IL';speechSynthesis.speak(u)};
  return <><div className="journeyPlayerCallout"><div><span>🎬</span><div><h3>נגן את הטיול שלנו</h3><p>מצגת אוטומטית של התמונות והסיפורים שהמשפחה הוסיפה.</p></div></div><button className="button premiumPrimary" disabled={!slides.length} onClick={()=>{setIndex(0);setOpen(true)}}>{slides.length?`הפעלת ${slides.length} רגעים`:'הוסיפו תמונות כדי להתחיל'}</button></div>{open&&current&&<div className="journeyPlayer" role="dialog" aria-modal="true"><button className="playerClose" onClick={()=>setOpen(false)}>×</button><img src={current.image} alt={current.title}/><div className="playerShade"/><div className="playerContent"><small>{current.place}{current.author?` · ${current.author}`:''}</small><h2>{current.title}</h2>{current.body&&<p>{current.body}</p>}<div><button onClick={()=>setIndex(v=>(v-1+slides.length)%slides.length)}>→ הקודם</button><button onClick={speak}>🔊 הקראה</button><span>{index+1} / {slides.length}</span><button onClick={()=>setIndex(v=>(v+1)%slides.length)}>הבא ←</button></div></div></div>}</>
}

function InstallCard(){
  const [prompt,setPrompt]=useState(null);
  const [installed,setInstalled]=useState(window.matchMedia?.('(display-mode: standalone)').matches||window.navigator.standalone);
  useEffect(()=>{const before=e=>{e.preventDefault();setPrompt(e)};const done=()=>{setInstalled(true);setPrompt(null)};addEventListener('beforeinstallprompt',before);addEventListener('appinstalled',done);return()=>{removeEventListener('beforeinstallprompt',before);removeEventListener('appinstalled',done)}},[]);
  const install=async()=>{if(prompt){await prompt.prompt();setPrompt(null)}else alert('באייפון: לחצו על שיתוף ואז “הוספה למסך הבית”. באנדרואיד: פתחו את תפריט הדפדפן ובחרו “התקנת אפליקציה”.')};
  return <article className="installCard premiumCard"><div><span>📲</span><div><h3>{installed?'האפליקציה מותקנת בטלפון':'התקינו את הטיול כאפליקציה'}</h3><p>גישה מהירה מהמסך הראשי, תצוגה מלאה וחוויה נוחה יותר במהלך הטיול.</p></div></div><button className="button premiumPrimary" disabled={installed} onClick={install}>{installed?'מותקן ✓':'התקנה לטלפון'}</button></article>
}

export default function PremiumExperience({days,destinations,onOpenDay,onAddStory}){
  const [tab,setTab]=useState('today');
  const tabs=[['today','⚡','עכשיו'],['kids','🎯','ילדים'],['parking','🚗','חניה'],['ratings','🏆','דירוגים'],['memories','🗺️','זיכרונות']];
  return <section className="premiumExperience section" id="experience"><div className="container">
    <div className="sectionHead premiumHead"><div><span className="eyebrow">Avitan Travel Club</span><h2>מרכז החוויה המשפחתי</h2></div><p>כל מה שצריך בזמן אמת — מה עושים עכשיו, משימות לילדים, חניה, דירוגים וזיכרונות.</p></div>
    <InstallCard/>
    <AccessibilityBar/>
    <div className="premiumTabs">{tabs.map(([id,icon,label])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><span>{icon}</span><b>{label}</b></button>)}</div>
    <div className="premiumPanel">{tab==='today'?<SmartToday days={days} onOpenDay={onOpenDay} onAddStory={onAddStory}/>:tab==='kids'?<KidsMode days={days} onAddStory={onAddStory}/>:tab==='parking'?<ParkingCard/>:tab==='ratings'?<FamilyRatings days={days}/>:<><JourneyPlayer/><MemoryMap destinations={destinations}/><FamilyPassports/></>}</div>
  </div></section>
}
