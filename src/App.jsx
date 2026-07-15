import { useEffect, useState } from 'react';
import Hero from './components/Hero.jsx';
import DestinationGallery from './components/DestinationGallery.jsx';
import DayPlanner from './components/DayPlanner.jsx';
import FoodExplorer from './components/FoodExplorer.jsx';
import ShoppingGuide from './components/ShoppingGuide.jsx';
import RouteMap from './components/RouteMap.jsx';
import TripTools from './components/TripTools.jsx';
import Storyline from './components/Storyline.jsx';
import { days, destinations, restaurants, shopping } from './data/tripData.js';

const nav=[
  ['home','בית'],['itinerary','מסלול'],['story','יומן'],['food','אוכל'],['shopping','שופינג'],['tools','כלים']
];

export default function App(){
  const [active,setActive]=useState('home');
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(visible?.target?.id)setActive(visible.target.id);
    },{threshold:[.25,.5,.75]});
    document.querySelectorAll('[data-nav-section]').forEach(el=>observer.observe(el));
    return ()=>observer.disconnect();
  },[]);
  const go=id=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  return <>
    <div id="home" data-nav-section><Hero onStart={()=>go('itinerary')}/></div>
    <nav className="topNav"><div className="container navInner">
      <a className="brand" href="#home"><span>🇮🇹</span><b>ITALY 2026</b></a>
      <div>{nav.map(([id,label])=><button key={id} className={active===id?'active':''} onClick={()=>go(id)}>{label}</button>)}</div>
    </div></nav>
    <main>
      <section className="introBand"><div className="container introGrid">
        <div><span>11</span><small>ימים</small></div><div><span>5</span><small>מטיילים</small></div><div><span>7</span><small>יעדים מרכזיים</small></div><div><span>2</span><small>בסיסי לינה</small></div>
      </div></section>
      <DestinationGallery destinations={destinations}/>
      <div id="itinerary" data-nav-section><DayPlanner days={days} restaurants={restaurants} shopping={shopping}/></div>
      <RouteMap destinations={destinations}/>
      <div id="story" data-nav-section><Storyline days={days}/></div>
      <div id="food" data-nav-section><FoodExplorer restaurants={restaurants}/></div>
      <div id="shopping" data-nav-section><ShoppingGuide shopping={shopping}/></div>
      <div id="tools" data-nav-section><TripTools/></div>
      <section className="section container">
        <div className="finalCallout"><div><span className="eyebrow">כלל הזהב</span><h2>בחוף אמאלפי — הים הוא הכביש שלכם</h2><p>פוזיטנו, אמאלפי, מינורי ומאיורי במעבורות. לפומפיי נוסעים ברכב וחונים ליד האתר; לנאפולי ממשיכים ברכבת. כך חוסכים שעות של פקקים, לחץ וחניה.</p></div><button className="button primary" onClick={()=>window.print()}>שמירה כ־PDF</button></div>
      </section>
    </main>
    <nav className="bottomNav">{nav.map(([id,label])=><button key={id} className={active===id?'active':''} onClick={()=>go(id)}><span>{id==='home'?'⌂':id==='itinerary'?'☷':id==='story'?'✦':id==='food'?'◉':id==='shopping'?'◇':'✓'}</span>{label}</button>)}</nav>
    <footer><div className="container"><div><b>Italy Family Trip 2026</b><p>המסלול המשפחתי שלנו לרומא, סורנטו וחוף אמאלפי.</p></div><p>יש לבדוק סמוך לנסיעה שעות פתיחה, מעבורות, הזמנות ומגבלות כביש.</p></div></footer>
  </>
}
