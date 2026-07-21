import { useState } from 'react';

export default function DestinationGallery({destinations}){
  const [selected,setSelected]=useState(null);
  return <section className="section container">
    <div className="sectionHead"><div><span className="eyebrow">טעימה מהמסע</span><h2>המקומות שמחכים לנו</h2></div><p>לחצו על יעד כדי לפתוח תמונה וניווט.</p></div>
    <div className="destinationGrid">
      {destinations.map((d,i)=><button key={d.id} className={`destinationCard card-${i+1}`} onClick={()=>setSelected(d)}>
        <img src={d.image} alt={d.name}/><span className="imageShade"/><div><h3>{d.name}</h3><p>{d.subtitle}</p></div>
      </button>)}
    </div>
    {selected && <div className="modal" onClick={()=>setSelected(null)}>
      <div className="photoModal" onClick={e=>e.stopPropagation()}>
        <button className="close" onClick={()=>setSelected(null)}>×</button>
        <img src={selected.image} alt={selected.name}/>
        <div className="photoCaption"><div><h3>{selected.name}</h3><p>{selected.subtitle}</p></div><a className="button primary" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.name+' Italy')}`}>ניווט</a></div>
      </div>
    </div>}
  </section>
}
