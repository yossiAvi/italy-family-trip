import { useState } from 'react';

export default function ShoppingGuide({shopping}){
  const cities=['הכול',...new Set(shopping.map(s=>s.city))]; const [city,setCity]=useState('הכול');
  const items=shopping.filter(s=>city==='הכול'||s.city===city);
  return <section className="section shoppingSection" id="shopping"><div className="container">
    <div className="sectionHead"><div><span className="eyebrow">שופינג</span><h2>איפה כדאי לקנות</h2></div><p>רשתות, אאוטלטים, בוטיקים, קרמיקה, אופנת חוף ומזכרות איכותיות.</p></div>
    <div className="shoppingFilterBar"><label className="filterField darkField"><span>בחרו אזור קניות</span><select value={city} onChange={e=>setCity(e.target.value)}>{cities.map(c=><option key={c}>{c}</option>)}</select></label><div className="filterSummary darkSummary"><b>{items.length}</b><small>המלצות באזור</small></div></div>
    <div className="shoppingGrid">{items.map((s,i)=><a href={s.link} target="_blank" rel="noreferrer" className="shoppingCard" key={s.name}>
      <span className="shopNumber">{String(i+1).padStart(2,'0')}</span><div><small>{s.city} · {s.type}</small><h3>{s.name}</h3><p>{s.tip}</p><span>{s.brands}</span></div><b>{s.duration}</b>
    </a>)}</div>
  </div></section>
}
