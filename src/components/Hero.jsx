import { useEffect, useMemo, useState } from 'react';
import { imageBank } from '../data/tripData.js';

const slides = [
  {image:imageBank.rome, label:'רומא'},
  {image:imageBank.positano, label:'פוזיטנו'},
  {image:imageBank.amalfi, label:'חוף אמאלפי'},
  {image:imageBank.capri, label:'קפרי'}
];

export default function Hero({onStart}) {
  const [index,setIndex] = useState(0);
  useEffect(()=>{
    const timer = setInterval(()=>setIndex(v=>(v+1)%slides.length),5500);
    return ()=>clearInterval(timer);
  },[]);
  const countdown = useMemo(()=>{
    const trip = new Date('2026-07-27T00:00:00');
    const days = Math.ceil((trip-Date.now())/86400000);
    if(days>1) return `עוד ${days} ימים`;
    if(days===1) return 'מחר יוצאים';
    if(days===0) return 'היום יוצאים';
    return 'הטיול התחיל';
  },[]);
  return <header className="hero">
    <div className="heroMedia">
      {slides.map((s,i)=><div key={s.label} className={`heroSlide ${i===index?'active':''}`} style={{backgroundImage:`url(${s.image})`}} />)}
      <div className="heroShade" />
    </div>
    <div className="container heroContent">
      <div className="heroCopy">
        <span className="pill light">🇮🇹 קיץ 2026 · משפחה של 5</span>
        <h1>המסע המשפחתי<br/><em>שלנו לאיטליה</em></h1>
        <p>רומא, סורנטו, פוזיטנו, אמאלפי, רוולו, קפרי, פומפיי ונאפולי — עם מסלול מדויק, אוכל, כשרות, קניות וניווט.</p>
        <div className="heroButtons">
          <button className="button primary" onClick={onStart}>פתחו את המסלול</button>
          <button className="button glass" onClick={()=>navigator.share?.({title:document.title,url:location.href})}>שיתוף למשפחה</button>
        </div>
        <div className="heroDots">{slides.map((s,i)=><button key={s.label} aria-label={s.label} className={i===index?'active':''} onClick={()=>setIndex(i)} />)}</div>
      </div>
      <aside className="journeyCard">
        <div className="countdown">{countdown}</div>
        <h2>27.7–6.8.2026</h2>
        <div className="journeyRows">
          <div><span>🏛️</span><b>3 לילות ברומא</b><small>עתיקות, אוכל ושופינג</small></div>
          <div><span>🚗</span><b>6 לילות בדרום</b><small>בסיס ליד סורנטו</small></div>
          <div><span>⛴️</span><b>החוף דרך הים</b><small>פחות פקקים, יותר חוויה</small></div>
          <div><span>✡️</span><b>כשרות מתוכננת</b><small>רומא, קפרי והצטיידות</small></div>
        </div>
      </aside>
    </div>
  </header>
}
