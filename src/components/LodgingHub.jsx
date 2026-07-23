import { useState } from 'react';

const stays=[
  {id:'rome',icon:'🏛️',area:'רומא · 27–30.7',name:'Rome Down Town 2 by Ghor',address:'118 Via del Boschetto, Rione Monti, 00184 Rome, Italy',phone:'מופיע באישור ההזמנה ב־Booking',check:'צ׳ק־אין 15:00–22:00 · צ׳ק־אאוט 08:00–10:00',note:'דירה במרכז Monti, כ־3 דקות ממטרו Cavour ובמרחק הליכה מהקולוסיאום.',booking:'https://www.booking.com/hotel/it/rome-downtown-2.html'},
  {id:'south',icon:'🌊',area:'Vico Equense · 30.7–5.8',name:"L’Antica Pigna Chateau",address:'Via Della Porta Giovanni Battista 24, 80069 Vico Equense, Italy',phone:'+39 331 735 6786',phone2:'+39 081 802 8039',email:'lanticapigna@gmail.com',check:'צ׳ק־אין 14:00–21:00 · צ׳ק־אאוט 09:30–11:00',note:'חניה פרטית, מטבחון, גינה ונוף למפרץ. כדאי לעדכן מראש את שעת ההגעה.',booking:'https://www.booking.com/hotel/it/l-39-antica-pigna-chateau.html'},
  {id:'airport',icon:'✈️',area:'פיומיצ׳ינו · 5–6.8',name:'הלינה ליד שדה התעופה',address:'טרם הוזנה כתובת',phone:'טרם הוזן מספר טלפון',check:'להוסיף לאחר סגירת ההזמנה',note:'בחרו מקום עם חניה ושאטל או החזירו את הרכב בערב שלפני הטיסה.',booking:''}
];
const maps=q=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export default function LodgingHub(){
  const [copied,setCopied]=useState('');
  const copy=async(text,id)=>{try{await navigator.clipboard.writeText(text);setCopied(id);setTimeout(()=>setCopied(''),1500)}catch{}};
  return <section className="section lodgingSection" id="stays" data-nav-section><div className="container">
    <div className="sectionHead"><div><span className="eyebrow">הבית שלנו בדרך</span><h2>כל מקומות הלינה במקום אחד</h2></div><p>כתובות, טלפונים, ניווט ופתיחת ההזמנה — נגישים גם באמצע הנסיעה.</p></div>
    <div className="lodgingGrid">{stays.map(stay=><article className="lodgingCard" key={stay.id}>
      <header><span>{stay.icon}</span><div><small>{stay.area}</small><h3>{stay.name}</h3></div></header>
      <div className="lodgingDetails"><button onClick={()=>copy(stay.address,`${stay.id}-address`)}><span>📍</span><div><small>כתובת</small><b>{stay.address}</b></div><em>{copied===`${stay.id}-address`?'הועתק':'העתקה'}</em></button><a href={stay.phone.startsWith('+')?`tel:${stay.phone.replace(/\s/g,'')}`:undefined}><span>☎️</span><div><small>טלפון</small><b>{stay.phone}</b>{stay.phone2&&<i>{stay.phone2}</i>}</div></a>{stay.email&&<a href={`mailto:${stay.email}`}><span>✉️</span><div><small>אימייל</small><b>{stay.email}</b></div></a>}<div><span>🕐</span><div><small>כניסה ויציאה</small><b>{stay.check}</b></div></div></div>
      <p>{stay.note}</p>
      <footer><a className="button lodgingNav" target="_blank" rel="noreferrer" href={maps(stay.address)}>ניווט למקום</a>{stay.booking?<a className="button bookingButton" target="_blank" rel="noreferrer" href={stay.booking}>פתיחה ב־Booking</a>:<button className="button bookingButton disabled" disabled>Booking טרם הוזן</button>}</footer>
    </article>)}</div>
    <div className="lodgingNotice">🔐 מספר הטלפון של הדירה ברומא לא מופיע בדף הציבורי של Booking. לאחר שתעתיק אותו מאישור ההזמנה אפשר להחליף את הטקסט בכרטיס.</div>
  </div></section>
}
