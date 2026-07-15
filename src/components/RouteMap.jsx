export default function RouteMap({destinations}){
  const points=[
    {id:'rome',x:18,y:18},{id:'naples',x:42,y:59},{id:'pompeii',x:53,y:66},{id:'sorrento',x:62,y:76},{id:'positano',x:71,y:70},{id:'amalfi',x:79,y:66},{id:'capri',x:60,y:89}
  ];
  const byId=Object.fromEntries(destinations.map(d=>[d.id,d]));
  return <section className="section container">
    <div className="sectionHead"><div><span className="eyebrow">מפת מסע</span><h2>מרומא אל מפרץ נאפולי</h2></div><p>לחצו על נקודה לניווט. התרשים נועד להמחיש את רצף היעדים ולא קנה מידה מדויק.</p></div>
    <div className="routeMap">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M18 18 C25 35,32 48,42 59 S55 75,62 76 S72 70,79 66 M62 76 Q60 83 60 89"/></svg>
      {points.map((p,i)=>{const d=byId[p.id];return <a key={p.id} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.name+' Italy')}`} target="_blank" rel="noreferrer" style={{left:`${p.x}%`,top:`${p.y}%`}} className="mapPoint"><span>{i+1}</span><b>{d.name}</b></a>})}
      <div className="mapLegend"><b>🚗 רומא → דרום</b><span>⛴️ חוף אמאלפי וקפרי</span><span>🚆 פומפיי ונאפולי</span></div>
    </div>
  </section>
}
