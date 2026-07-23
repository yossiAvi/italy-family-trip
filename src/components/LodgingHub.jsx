import { useState } from 'react';

const stays=[
  {id:'rome',icon:'🏛️',area:'רומא · 27–30.7',name:'Rome Down Town 2 by Ghor',address:'118 Via del Boschetto, Rione Monti, 00184 Roma, Italy',phone:'המספר מופיע באישור ההזמנה ב־Booking',check:'צ׳ק־אין 15:00–22:00 · צ׳ק־אאוט 08:00–10:00',note:'דירה במרכז שכונת Monti, ליד מטרו Cavour ובמרחק הליכה מהקולוסיאום.',booking:'https://www.booking.com/hotel/it/rome-downtown-2.html'},
  {id:'south',icon:'🌊',area:'Vico Equense · 30.7–5.8',name:"L’Antica Pigna Chateau",address:'Via Della Porta Giovanni Battista, 24, 80069 Vico Equense, Italy',phone:'+39 331 735 6786',phone2:'+39 081 802 8039',email:'info@frantoioferraro.it',check:'צ׳ק־אין 14:00–21:00 · צ׳ק־אאוט 09:30–11:00',note:'חניה פרטית, מטבחון, גינה ונוף למפרץ. כדאי לעדכן מראש את שעת ההגעה.',booking:'https://www.booking.com/hotel/it/l-39-antica-pigna-chateau.html',website:'https://www.frantoioferraro.it/'},
  {id:'airport',icon:'✈️',area:'פיומיצ׳ינו · 5–6.8',name:'Da Vinci Apartment Fiumicino',address:'Via Hermada, 46, Piano terra, 00054 Fiumicino, Italy',phone:'+39 351 828 7108',check:'את שעות הכניסה המדויקות יש לבדוק באישור ההזמנה',note:'דירה מרווחת עם שני חדרי שינה, מטבחון וחניה, כ־3 ק״מ משדה התעופה פיומיצ׳ינו.',booking:'https://www.booking.com/hotel/it/casa-mia-apartment-fiumicino.html',website:'https://www.davinciapartmentfiumicino.it/'}
];
const maps=q=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export default function LodgingHub(){
  const [copied,setCopied]=useState('');
  const copy=async(text,id)=>{try{await navigator.clipboard.writeText(text);setCopied(id);setTimeout(()=>setCopied(''),1500)}catch{}};
  return <section className="section lodgingSection" id="stays" data-nav-section><div className="container">
    <div className="sectionHead"><div><span className="eyebrow">הבית שלנו בדרך</span><h2>כל מקומות הלינה במקום אחד</h2></div><p>כתובות, טלפונים, ניווט, אתר וקישור להזמנה — נגישים במהירות מהטלפון.</p></div>
    <div className="lodgingGrid">{stays.map(stay=><article className="lodgingCard" key={stay.id}>
      <header><span>{stay.icon}</span><div><small>{stay.area}</small><h3>{stay.name}</h3></div></header>
      <div className="lodgingDetails"><button onClick={()=>copy(stay.address,`${stay.id}-address`)}><span>📍</span><div><small>כתובת</small><b>{stay.address}</b></div><em>{copied===`${stay.id}-address`?'הועתק':'העתקה'}</em></button><a href={stay.phone.startsWith('+')?`tel:${stay.phone.replace(/\s/g,'')}`:undefined}><span>☎️</span><div><small>טלפון</small><b>{stay.phone}</b>{stay.phone2&&<i>{stay.phone2}</i>}</div></a>{stay.email&&<a href={`mailto:${stay.email}`}><span>✉️</span><div><small>אימייל</small><b>{stay.email}</b></div></a>}<div><span>🕐</span><div><small>כניסה ויציאה</small><b>{stay.check}</b></div></div></div>
      <p>{stay.note}</p>
      <footer><a className="button lodgingNav" target="_blank" rel="noreferrer" href={maps(stay.address)}>ניווט</a><a className="button bookingButton" target="_blank" rel="noreferrer" href={stay.booking}>Booking</a>{stay.website&&<a className="button lodgingSite" target="_blank" rel="noreferrer" href={stay.website}>אתר המקום</a>}</footer>
    </article>)}</div>
    <div className="lodgingNotice">🔐 בדירת Rome Down Town 2 by Ghor מספר הטלפון אינו מופיע בעמוד הציבורי. מומלץ לשמור אותו באזור הפתקים מתוך אישור ההזמנה שלכם.</div>
  </div></section>
}
