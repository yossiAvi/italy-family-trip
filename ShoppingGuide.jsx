import { useMemo, useState } from 'react';

export default function FoodExplorer({restaurants}){
  const cities=['הכול',...new Set(restaurants.map(r=>r.city))];
  const [city,setCity]=useState('הכול');
  const [kosherOnly,setKosherOnly]=useState(false);
  const list=useMemo(()=>restaurants.filter(r=>(city==='הכול'||r.city===city)&&(!kosherOnly||r.kosher.startsWith('כשר'))),[restaurants,city,kosherOnly]);
  return <section className="section container" id="food">
    <div className="sectionHead"><div><span className="eyebrow">אוכל</span><h2>מסעדות לפי אזור</h2></div><p>שמות, סגנון, רמת מחיר, כשרות וקישור ניווט. יש לוודא שעות והזמנות סמוך לביקור.</p></div>
    <div className="filters"><div className="filterScroller">{cities.map(c=><button className={city===c?'active':''} onClick={()=>setCity(c)} key={c}>{c}</button>)}</div><label className="toggle"><input type="checkbox" checked={kosherOnly} onChange={e=>setKosherOnly(e.target.checked)}/><span/>כשר בלבד</label></div>
    <div className="restaurantGrid">{list.map(r=><article className="restaurantCard" key={`${r.city}-${r.name}`}>
      <div className="restaurantTop"><span className={`kosherTag ${r.kosher.startsWith('כשר')?'yes':'no'}`}>{r.kosher}</span><span>{r.price}</span></div>
      <h3>{r.name}</h3><p className="restaurantType">{r.city} · {r.type}</p><p>{r.note}</p>
      <div className="restaurantFooter"><span>{r.reserve?'מומלץ להזמין':'אפשר ספונטני'}</span><a target="_blank" rel="noreferrer" href={r.link}>ניווט ←</a></div>
    </article>)}</div>
    <div className="kosherNotice"><b>תכנון כשרות:</b> ברומא כדאי לאכול ולהצטייד ברובע היהודי. בקפרי להזמין מראש את Capri Kosher. בדרום אין להסתמך על מסעדה כשרה מזדמנת; קחו מוצרים סגורים או תאמו ארוחה מראש. מנות צמחוניות במסעדה רגילה אינן הופכות את המטבח לכשר.</div>
  </section>
}
