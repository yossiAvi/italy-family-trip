import { useMemo, useState } from 'react';

export default function FoodExplorer({restaurants}){
  const cities=['הכול',...new Set(restaurants.map(r=>r.city))];
  const categories=['הכול',...new Set(restaurants.map(r=>r.category).filter(Boolean))];
  const [city,setCity]=useState('הכול');
  const [category,setCategory]=useState('הכול');
  const [kosherOnly,setKosherOnly]=useState(false);
  const list=useMemo(()=>restaurants.filter(r=>(city==='הכול'||r.city===city)&&(category==='הכול'||r.category===category)&&(!kosherOnly||r.kosher.startsWith('כשר'))),[restaurants,city,category,kosherOnly]);
  return <section className="section container" id="food">
    <div className="sectionHead"><div><span className="eyebrow">אוכל</span><h2>הטעימות של משפחת אביטן</h2></div><p>ארוחות בוקר, פיצה, פסטה, ג׳לטו וטירמיסו ששולבו במסלול לפי האזור. שעות, ימי סגירה וכשרות דורשים אימות סמוך לביקור.</p></div>
    <div className="filters foodFilters">
      <div><small>אזור</small><div className="filterScroller">{cities.map(c=><button className={city===c?'active':''} onClick={()=>setCity(c)} key={c}>{c}</button>)}</div></div>
      <div><small>סוג</small><div className="filterScroller">{categories.map(c=><button className={category===c?'active':''} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div></div>
      <label className="toggle"><input type="checkbox" checked={kosherOnly} onChange={e=>setKosherOnly(e.target.checked)}/><span/>כשר בלבד</label>
    </div>
    <div className="restaurantGrid">{list.map(r=><article className="restaurantCard" key={`${r.city}-${r.name}`}>
      <div className="restaurantTop"><span className={`kosherTag ${r.kosher.startsWith('כשר')?'yes':'no'}`}>{r.kosher}</span><span>{r.price}</span></div>
      {r.category&&<span className="foodCategory">{r.category}</span>}
      <h3>{r.name}</h3><p className="restaurantType">{r.city} · {r.type}</p><p>{r.note}</p>
      <div className="restaurantFooter"><span>{r.reserve?'מומלץ להזמין':'אפשר ספונטני'}</span><a target="_blank" rel="noreferrer" href={r.link}>ניווט ←</a></div>
    </article>)}</div>
    <div className="kosherNotice"><b>תכנון כשרות:</b> ברומא כדאי לאכול ולהצטייד ברובע היהודי. המקומות שסומנו “לא כשר” או “יש לבדוק כשרות” מופיעים כהמלצות קולינריות בלבד, בהתאם לשיקול האישי שלכם. מנות צמחוניות במטבח רגיל אינן הופכות אותו לכשר.</div>
  </section>
}
