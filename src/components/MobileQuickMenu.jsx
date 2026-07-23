import { useEffect, useMemo, useRef, useState } from 'react';

const shortcuts = [
  {id:'home', label:'מסך הבית', icon:'🏠', group:'תכנון', hint:'פתיחת האתר'},
  {id:'experience', label:'מה עושים עכשיו', icon:'⚡', group:'תכנון', hint:'היום והתחנה הבאה'},
  {id:'itinerary', label:'מסלול יומי', icon:'🗓️', group:'תכנון', hint:'כל ימי הטיול'},
  {id:'stays', label:'מקומות לינה', icon:'🛏️', group:'תכנון', hint:'כתובות, טלפונים וניווט'},
  {id:'food', label:'אוכל ברומא', icon:'🍕', group:'בילוי', hint:'מסעדות, מאפים וג׳לטו'},
  {id:'shopping', label:'איפה כדאי לקנות', icon:'🛍️', group:'בילוי', hint:'שופינג לפי אזור'},
  {id:'nearby', label:'מה קורה סביבנו', icon:'🎉', group:'בילוי', hint:'אירועים ומבצעים קרובים'},
  {id:'livecams', label:'מצלמות לייב', icon:'📹', group:'בילוי', hint:'צפייה ביעדים בזמן אמת'},
  {id:'story', label:'Story Line', icon:'📸', group:'משפחה', hint:'תמונות וסיפורי הטיול'},
  {id:'locations', label:'איפה כולם?', icon:'📍', group:'משפחה', hint:'שיתוף מיקום משפחתי'},
  {id:'translator', label:'עברית–איטלקית', icon:'🗣️', group:'שימושי', hint:'תרגום, דיבור והשמעה'},
  {id:'tools', toolTab:'weather', label:'מזג אוויר', icon:'☀️', group:'שימושי', hint:'תחזית חיה'},
  {id:'tools', toolTab:'budget', label:'תקציב ומחשבון', icon:'💶', group:'שימושי', hint:'הוצאות והמרת מטבע'},
  {id:'tools', toolTab:'check', label:'צ׳ק־ליסט', icon:'✅', group:'שימושי', hint:'כל מה שצריך לקחת'},
  {id:'tools', toolTab:'notes', label:'פתקים וגיבוי', icon:'📝', group:'שימושי', hint:'מידע משותף למשפחה'}
];

const groups=['תכנון','בילוי','משפחה','שימושי'];

export default function MobileQuickMenu({open,onClose,onNavigate}){
  const [query,setQuery]=useState('');
  const [recent,setRecent]=useState(()=>JSON.parse(localStorage.getItem('mobileQuickRecent')||'[]'));
  const inputRef=useRef(null);
  useEffect(()=>{
    if(!open)return;
    document.body.classList.add('quickMenuOpen');
    const timer=setTimeout(()=>inputRef.current?.focus(),180);
    return()=>{clearTimeout(timer);document.body.classList.remove('quickMenuOpen')};
  },[open]);
  useEffect(()=>{
    const esc=e=>{if(e.key==='Escape')onClose()};
    addEventListener('keydown',esc);return()=>removeEventListener('keydown',esc);
  },[onClose]);
  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    return q?shortcuts.filter(item=>`${item.label} ${item.hint} ${item.group}`.toLowerCase().includes(q)):shortcuts;
  },[query]);
  const recentItems=recent.map(key=>shortcuts.find(item=>`${item.id}:${item.toolTab||''}`===key)).filter(Boolean).slice(0,4);
  const choose=item=>{
    const key=`${item.id}:${item.toolTab||''}`;
    const next=[key,...recent.filter(v=>v!==key)].slice(0,6);
    setRecent(next);localStorage.setItem('mobileQuickRecent',JSON.stringify(next));
    onNavigate(item);setQuery('');onClose();
  };
  if(!open)return null;
  return <div className="mobileQuickLayer" role="dialog" aria-modal="true" aria-label="כל אזורי האתר">
    <button className="quickBackdrop" onClick={onClose} aria-label="סגירת התפריט"/>
    <div className="mobileQuickSheet">
      <header className="quickSheetHeader"><div><span className="eyebrow">ניווט מהיר</span><h2>לאן קופצים?</h2><p>כל האזורים של הטיול במקום אחד</p></div><button className="quickClose" onClick={onClose} aria-label="סגירה">×</button></header>
      <label className="quickSearch"><span>⌕</span><input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)} placeholder="חיפוש: תקציב, לינות, מצלמות…"/><button type="button" onClick={()=>setQuery('')} className={query?'visible':''}>×</button></label>
      {!query&&recentItems.length>0&&<section className="quickRecent"><div className="quickGroupTitle"><h3>נפתחו לאחרונה</h3><small>קפיצה אחת</small></div><div className="quickRecentRow">{recentItems.map(item=><button key={`${item.id}:${item.toolTab||''}`} onClick={()=>choose(item)}><span>{item.icon}</span><b>{item.label}</b></button>)}</div></section>}
      <div className="quickMenuScroll">
        {groups.map(group=>{
          const items=filtered.filter(item=>item.group===group);
          if(!items.length)return null;
          return <section className="quickGroup" key={group}><div className="quickGroupTitle"><h3>{group}</h3><small>{items.length} קיצורים</small></div><div className="quickGrid">{items.map(item=><button key={`${item.id}:${item.toolTab||''}`} onClick={()=>choose(item)}><span className="quickIcon">{item.icon}</span><span><b>{item.label}</b><small>{item.hint}</small></span><i>←</i></button>)}</div></section>;
        })}
        {!filtered.length&&<div className="quickEmpty"><span>🔎</span><h3>לא מצאנו אזור כזה</h3><p>נסו מילת חיפוש אחרת.</p></div>}
      </div>
    </div>
  </div>;
}
