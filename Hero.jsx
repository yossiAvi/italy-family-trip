import { useEffect, useMemo, useState } from 'react';

function StopCard({stop,index}){
  return <article className="stopCard detailedStop">
    <div className="stopTop">
      <div className="stopHeading"><span className="stopNumber">{String(index + 1).padStart(2,'0')}</span><h4>{stop.name}</h4></div>
      <span>{stop.time}</span>
    </div>
    <p><b>למה שווה להגיע:</b> {stop.why}</p>
    {stop.what && <p><b>מה רואים ועושים:</b> {stop.what}</p>}
    {stop.access && <p className="accessLine"><b>איך מגיעים:</b> {stop.access}</p>}
    <div className="stopMeta">
      <div><span>📷</span><p><b>נקודת צילום</b>{stop.photo}</p></div>
      {stop.practical && <div><span>💡</span><p><b>מידע מעשי</b>{stop.practical}</p></div>}
    </div>
    <a target="_blank" rel="noreferrer" href={stop.link}>ניווט ישיר ב־Google Maps ←</a>
  </article>
}

function TransportPanel({day}){
  const t=day.transport;
  const p=day.parking;
  if(!t && !p) return null;
  return <div className="logisticsSection">
    <h4>איך מגיעים, איך מתניידים ואיפה מחנים</h4>
    <div className="logisticsGrid">
      {t && <article className="transportCard">
        <div className="logisticsTitle"><span>{t.icon || '🧭'}</span><div><small>דרך ההגעה המומלצת</small><h5>{t.mode}</h5></div></div>
        <p>{t.overview}</p>
        {t.fromBase?.length>0 && <div className="routeSteps"><b>מהלינה אל היעד</b>{t.fromBase.map((step,i)=><div key={step}><span>{i+1}</span><p>{step}</p></div>)}</div>}
        {t.local?.length>0 && <div className="routeSteps localSteps"><b>התניידות במהלך היום</b>{t.local.map((step,i)=><div key={step}><span>{i+1}</span><p>{step}</p></div>)}</div>}
        {t.fallback && <div className="fallbackNote"><b>תוכנית חלופית:</b> {t.fallback}</div>}
      </article>}
      {p && <article className={`parkingCard ${p.needed?'hasParking':'noParking'}`}>
        <div className="logisticsTitle"><span>{p.needed?'🅿️':'🚫'}</span><div><small>{p.needed?'החניה המומלצת':'מצב הרכב'}</small><h5>{p.name}</h5></div></div>
        {p.address && <p className="parkingAddress">{p.address}</p>}
        <p>{p.note}</p>
        {p.link && <a className="mapButton" target="_blank" rel="noreferrer" href={p.link}>ניווט לחניה ←</a>}
        {day.secondaryParking?.length>0 && <div className="alternativeParking"><b>חלופות חניה</b>{day.secondaryParking.map(item=><a key={item.name} target="_blank" rel="noreferrer" href={item.link}><span>{item.name}</span><small>{item.note}</small></a>)}</div>}
      </article>}
    </div>
  </div>
}

export default function DayPlanner({days,restaurants,shopping}){
  const [open,setOpen]=useState(0);
  const [query,setQuery]=useState('');
  useEffect(()=>{
    const openDay=e=>{const index=days.findIndex(d=>d.date===e.detail);if(index>=0){setQuery('');setOpen(index);setTimeout(()=>document.querySelectorAll('.dayCard')[index]?.scrollIntoView({behavior:'smooth',block:'start'}),80)}};
    addEventListener('open-trip-day',openDay);
    return()=>removeEventListener('open-trip-day',openDay);
  },[days]);
  const visible=useMemo(()=>{
    const q=query.trim();
    if(!q) return days;
    return days.filter(d=>{
      const searchable=[
        d.date,d.weekday,d.title,d.summary,d.transport?.mode,d.transport?.overview,d.parking?.name,d.parking?.address,
        ...(d.stops||[]).flatMap(s=>[s.name,s.why,s.what,s.access,s.practical]),
        ...(d.tips||[])
      ].filter(Boolean).join(' ');
      return searchable.includes(q);
    });
  },[days,query]);
  const restaurantMap=Object.fromEntries(restaurants.map(r=>[r.name,r]));
  const shoppingMap=Object.fromEntries(shopping.map(s=>[s.name,s]));

  return <section className="section container" id="itinerary">
    <div className="sectionHead"><div><span className="eyebrow">יום אחר יום</span><h2>המסלול המפורט</h2></div><p>בכל יום: דרך הגעה, חניה, מעבר בין התחנות, מה רואים, כמה זמן להקדיש, אוכל, שופינג והערות חשובות.</p></div>
    <div className="searchBox"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="חיפוש יום, יעד, חניה או אטרקציה…"/></div>
    <div className="dayList">
      {visible.map(day=>{
        const originalIndex=days.indexOf(day); const active=open===originalIndex;
        return <article className={`dayCard ${active?'open':''}`} key={day.date}>
          <button className="daySummary" onClick={()=>setOpen(active?-1:originalIndex)}>
            <img src={day.image} alt=""/><span className="imageShade"/>
            <div className="dayDate"><b>{day.date}</b><small>{day.weekday}</small></div>
            <div className="dayTitle"><span className="pill">{day.intensity}</span><h3>{day.title}</h3><p>{day.summary}</p><div className="dayLogistics"><span>{day.transport?.icon} {day.transport?.mode}</span><span>{day.parking?.needed?'🅿️ חניה מוגדרת':'🚫 ללא רכב'}</span></div></div>
            <span className="expand">{active?'−':'+'}</span>
          </button>
          {active && <div className="dayDetails expandedDetails">
            <aside className="schedulePanel"><h4>לוח זמנים מומלץ</h4>{day.schedule.map(([time,text])=><div className="scheduleRow" key={`${time}-${text}`}><b>{time}</b><span>{text}</span></div>)}</aside>
            <div className="detailsMain">
              <TransportPanel day={day}/>
              {day.stops.length>0 && <section className="daySection"><h4>מקומות ששווה לבקר — לפי סדר המסלול</h4><div className="stopsGrid expandedStops">{day.stops.map((s,i)=><StopCard key={s.name} stop={s} index={i}/>)}</div></section>}
              {day.food.length>0 && <section className="daySection"><h4>איפה לאכול ביום הזה</h4><div className="miniCards richMiniCards">{day.food.map(name=>restaurantMap[name]).filter(Boolean).map(r=><a target="_blank" rel="noreferrer" className="miniCard" href={r.link} key={r.name}><div className="miniTitle"><b>{r.name}</b><span className={`miniKosher ${r.kosher.includes('כשר')&&!r.kosher.includes('לא')?'yes':'no'}`}>{r.kosher}</span></div><span>{r.type} · {r.price}</span><small>{r.note}</small><em>{r.reserve?'מומלץ להזמין מראש':'בדרך כלל אפשר להגיע ללא הזמנה'}</em></a>)}</div></section>}
              {day.shopping.length>0 && <section className="daySection"><h4>שופינג ביום הזה</h4><div className="miniCards richMiniCards">{day.shopping.map(name=>shoppingMap[name]).filter(Boolean).map(s=><a target="_blank" rel="noreferrer" className="miniCard shoppingMini" href={s.link} key={s.name}><b>{s.name}</b><span>{s.type} · {s.duration}</span><small>{s.brands}</small><em>{s.tip}</em></a>)}</div></section>}
              <div className="tipsBox"><h4>הערות וטיפים חשובים ליום הזה</h4>{day.tips.map(t=><p key={t}>✓ {t}</p>)}</div>
            </div>
          </div>}
        </article>
      })}
      {visible.length===0 && <div className="emptySearch">לא נמצאו תוצאות. נסו לחפש שם מקום, חניון או עיר.</div>}
    </div>
  </section>
}
