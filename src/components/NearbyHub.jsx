import { useMemo, useState } from 'react';
import useSharedTripData from '../lib/useSharedTripData.js';

const members=['יוסי','יסמין','סיון','שירן','אורן'];
const zones=[
  {id:'rome',name:'רומא',lat:41.9028,lng:12.4964,eventLinks:[['אירועי Roma Live','https://www.turismoroma.it/en/tipo-evento/events'],['אירועי יולי ברומא','https://www.turismoroma.it/en/page/july-2026-rome-discover-and-experience-rome-1-31-july-2026']],shopping:[
    {name:'Rinascente Roma Tritone',type:'כלבו וקניות במרכז',lat:41.9023,lng:12.4835,url:'https://www.rinascente.it/en/store-roma-via-del-tritone',offers:'https://www.rinascente.it/en/promotions'},
    {name:'Valmontone Outlet',type:'אאוטלט ומבצעים רשמיים',lat:41.7735,lng:12.9148,url:'https://www.valmontoneoutlet.com/en/',offers:'https://www.valmontoneoutlet.com/en/promotions/'},
    {name:'Castel Romano Designer Outlet',type:'אאוטלט מותגים',lat:41.7176,lng:12.4478,url:'https://www.mcarthurglen.com/en/outlets/it/designer-outlet-castel-romano/',offers:'https://www.mcarthurglen.com/en/outlets/it/designer-outlet-castel-romano/offers/'}
  ]},
  {id:'sorrento',name:'סורנטו והסביבה',lat:40.6263,lng:14.3758,eventLinks:[['אירועים בסורנטו','https://www.comune.sorrento.na.it/novita/eventi'],['אירועים בקמפניה','https://www.incampania.com/en/events/']],shopping:[
    {name:'Corso Italia Sorrento',type:'רחוב הקניות המרכזי',lat:40.6266,lng:14.3755,url:'https://www.google.com/maps/search/?api=1&query=Corso+Italia+Sorrento',offers:'https://www.google.com/search?q=Corso+Italia+Sorrento+saldi+offerte'},
    {name:'La Reggia Designer Outlet',type:'אאוטלט גדול ליד נאפולי',lat:41.0176,lng:14.3270,url:'https://www.mcarthurglen.com/en/outlets/it/designer-outlet-la-reggia/',offers:'https://www.mcarthurglen.com/en/outlets/it/designer-outlet-la-reggia/offers/'}
  ]},
  {id:'amalfi',name:'חוף אמאלפי',lat:40.6340,lng:14.6027,eventLinks:[['אירועי אמאלפי','https://www.visitamalfi.info/en/eventi/'],['אירועים בקמפניה','https://www.incampania.com/en/events/']],shopping:[
    {name:'מרכז אמאלפי',type:'לימונצ׳לו, קרמיקה ומוצרים מקומיים',lat:40.6342,lng:14.6028,url:'https://www.google.com/maps/search/?api=1&query=shopping+Amalfi+Italy',offers:'https://www.google.com/search?q=Amalfi+shops+sales+offers'},
    {name:'פוזיטנו – Via dei Mulini',type:'אופנה, סנדלים וקרמיקה',lat:40.6281,lng:14.4847,url:'https://www.google.com/maps/search/?api=1&query=Via+dei+Mulini+Positano',offers:'https://www.google.com/search?q=Positano+shops+sales+offers'}
  ]},
  {id:'capri',name:'קפרי',lat:40.5507,lng:14.2223,eventLinks:[['אירועי קפרי','https://www.capri.com/en/events'],['אירועים בקמפניה','https://www.incampania.com/en/events/']],shopping:[
    {name:'Via Camerelle',type:'רחוב מותגים בקפרי',lat:40.5505,lng:14.2432,url:'https://www.google.com/maps/search/?api=1&query=Via+Camerelle+Capri',offers:'https://www.google.com/search?q=Via+Camerelle+Capri+sales'},
    {name:'Anacapri',type:'חנויות מקומיות ומזכרות',lat:40.5558,lng:14.2210,url:'https://www.google.com/maps/search/?api=1&query=shopping+Anacapri',offers:'https://www.google.com/search?q=Anacapri+shops+offers'}
  ]},
  {id:'naples',name:'נאפולי ופומפיי',lat:40.8518,lng:14.2681,eventLinks:[['אירועים בנאפולי','https://www.visitnaples.eu/en/neapolitanity/events-in-naples'],['אירועים בקמפניה','https://www.incampania.com/en/events/']],shopping:[
    {name:'Via Toledo',type:'רחוב קניות מרכזי בנאפולי',lat:40.8422,lng:14.2490,url:'https://www.google.com/maps/search/?api=1&query=Via+Toledo+Naples',offers:'https://www.google.com/search?q=Via+Toledo+Naples+sales+offers'},
    {name:'La Reggia Designer Outlet',type:'אאוטלט מותגים',lat:41.0176,lng:14.3270,url:'https://www.mcarthurglen.com/en/outlets/it/designer-outlet-la-reggia/',offers:'https://www.mcarthurglen.com/en/outlets/it/designer-outlet-la-reggia/offers/'}
  ]}
];

const rad=x=>x*Math.PI/180;
function distanceKm(a,b){
  const R=6371,dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng);
  const q=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(q));
}
function fmtDistance(km){return km<1?`${Math.round(km*1000)} מטר`:`${km.toFixed(km<10?1:0)} ק״מ`;}
function localDateTime(value){try{return new Date(value).toLocaleString('he-IL',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}catch{return ''}}

export default function NearbyHub(){
  const [position,setPosition]=useState(null);
  const [zoneId,setZoneId]=useState('rome');
  const [radius,setRadius]=useState(10);
  const [eventRange,setEventRange]=useState('today');
  const [events,setEvents]=useState([]);
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState('');
  const [deals,setDeals,dealsSync]=useSharedTripData('family-nearby-deals',[],()=>[]);
  const [form,setForm]=useState({title:'',store:'',details:'',expires:'',url:'',addedBy:'יוסי'});
  const zone=zones.find(z=>z.id===zoneId)||zones[0];
  const origin=position||{lat:zone.lat,lng:zone.lng};
  const shopping=useMemo(()=>zone.shopping.map(item=>({...item,distance:distanceKm(origin,item)})).sort((a,b)=>a.distance-b.distance),[zone,origin.lat,origin.lng]);

  const locate=()=>{
    if(!navigator.geolocation)return setMessage('המכשיר אינו תומך בזיהוי מיקום.');
    setMessage('מזהה את המיקום…');
    navigator.geolocation.getCurrentPosition(pos=>{
      const point={lat:pos.coords.latitude,lng:pos.coords.longitude};
      setPosition(point);
      const nearest=[...zones].sort((a,b)=>distanceKm(point,a)-distanceKm(point,b))[0];
      setZoneId(nearest.id);setMessage(`זוהה האזור: ${nearest.name}`);
    },()=>setMessage('לא התקבל אישור מיקום. אפשר לבחור אזור ידנית.'),{enableHighAccuracy:true,timeout:15000,maximumAge:60000});
  };

  const loadEvents=async()=>{
    setLoading(true);setMessage('מחפש אירועים קרובים…');
    try{
      const params=new URLSearchParams({lat:String(origin.lat),lng:String(origin.lng),radius:String(radius),range:eventRange});
      const res=await fetch(`/.netlify/functions/nearby-events?${params}`);
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||'אירעה שגיאה');
      setEvents(data.events||[]);
      setMessage(data.events?.length?`נמצאו ${data.events.length} אירועים`:(data.configured===false?'לא הוגדר עדיין מפתח Ticketmaster. השתמשו בקישורי האירועים הרשמיים.':'לא נמצאו אירועים בטווח שנבחר.'));
    }catch(err){setEvents([]);setMessage('החיפוש החי לא זמין כרגע. קישורי האירועים הרשמיים עדיין זמינים.');}
    finally{setLoading(false)}
  };

  const addDeal=e=>{
    e.preventDefault();
    if(!form.title.trim()||!form.store.trim())return setMessage('יש למלא שם מבצע ושם חנות.');
    const item={...form,id:crypto.randomUUID(),createdAt:new Date().toISOString(),lat:position?.lat||null,lng:position?.lng||null,zone:zone.name};
    setDeals(old=>[item,...old]);
    setForm({title:'',store:'',details:'',expires:'',url:'',addedBy:form.addedBy});
    setMessage('המבצע נוסף ומשותף עם המשפחה.');
  };

  return <section id="nearby" data-nav-section className="section nearbySection">
    <div className="container">
      <div className="sectionHead nearbyHead"><div><span className="eyebrow">חכם לפי מיקום</span><h2>מה קורה סביבנו?</h2></div><p>אירועים קרובים, מרכזי קניות, מבצעים רשמיים ומציאות שבני המשפחה מצאו.</p></div>
      <div className="nearbyControls">
        <button className="button nearbyLocate" onClick={locate}>◎ השתמשו במיקום שלי</button>
        <label><span>אזור</span><select value={zoneId} onChange={e=>{setZoneId(e.target.value);setPosition(null)}}>{zones.map(z=><option key={z.id} value={z.id}>{z.name}</option>)}</select></label>
        <label><span>רדיוס אירועים</span><select value={radius} onChange={e=>setRadius(Number(e.target.value))}><option value="5">5 ק״מ</option><option value="10">10 ק״מ</option><option value="25">25 ק״מ</option><option value="50">50 ק״מ</option></select></label>
        <label><span>מתי</span><select value={eventRange} onChange={e=>setEventRange(e.target.value)}><option value="today">היום</option><option value="tomorrow">מחר</option><option value="week">7 ימים</option></select></label>
      </div>
      {message&&<div className="nearbyMessage">{message}</div>}

      <div className="nearbyFeatureGrid">
        <article className="nearbyPanel eventsPanel">
          <div className="nearbyPanelHead"><div><span>🎟️</span><div><h3>אירועים והופעות</h3><p>חיפוש חי לפי המיקום והרדיוס</p></div></div><button className="button" disabled={loading} onClick={loadEvents}>{loading?'מחפש…':'חיפוש אירועים'}</button></div>
          {events.length>0?<div className="eventCards">{events.map(event=><article key={event.id} className="nearbyEventCard">
            {event.image&&<img src={event.image} alt="" loading="lazy"/>}<div><span>{event.category||'אירוע'}</span><h4>{event.name}</h4><p>{event.dateLabel}{event.venue?` · ${event.venue}`:''}</p><small>{event.distance?`${event.distance} ק״מ ממכם`:event.city||''}</small><div><a href={event.url} target="_blank" rel="noopener noreferrer">פרטים וכרטיסים ↗</a>{event.lat&&<a href={`https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`} target="_blank" rel="noopener noreferrer">ניווט</a>}</div></div>
          </article>)}</div>:<div className="officialEventLinks"><b>מקורות אירועים רשמיים באזור</b>{zone.eventLinks.map(([name,url])=><a key={url} href={url} target="_blank" rel="noopener noreferrer">{name} ↗</a>)}</div>}
        </article>

        <article className="nearbyPanel shoppingPanel">
          <div className="nearbyPanelHead"><div><span>🛍️</span><div><h3>קניות ומבצעים</h3><p>המקורות הרשמיים הקרובים ביותר</p></div></div></div>
          <div className="nearbyShopList">{shopping.map(shop=><article key={shop.name}><div><h4>{shop.name}</h4><p>{shop.type}</p><small>{fmtDistance(shop.distance)} מהנקודה שנבחרה</small></div><div><a href={shop.offers} target="_blank" rel="noopener noreferrer">מבצעים ↗</a><a href={`https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`} target="_blank" rel="noopener noreferrer">ניווט</a></div></article>)}</div>
        </article>
      </div>

      <div className="familyDealsBlock">
        <div className="familyDealsHead"><div><span>💡</span><div><h3>מבצעים שהמשפחה מצאה</h3><p>מצאתם מחיר טוב בחנות? שתפו אותו כאן עם כולם.</p></div></div><small>{dealsSync==='synced'?'☁️ מסונכרן למשפחה':'📱 נשמר במכשיר'}</small></div>
        <form className="dealForm" onSubmit={addDeal}>
          <label><span>שם המבצע</span><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="למשל: 30% הנחה על נעליים"/></label>
          <label><span>חנות / מקום</span><input value={form.store} onChange={e=>setForm({...form,store:e.target.value})} placeholder="שם החנות"/></label>
          <label><span>מי מצא?</span><select value={form.addedBy} onChange={e=>setForm({...form,addedBy:e.target.value})}>{members.map(m=><option key={m}>{m}</option>)}</select></label>
          <label><span>בתוקף עד</span><input type="date" value={form.expires} onChange={e=>setForm({...form,expires:e.target.value})}/></label>
          <label className="wide"><span>פרטים</span><textarea value={form.details} onChange={e=>setForm({...form,details:e.target.value})} placeholder="תנאים, קומה, דגם או כל פרט שימושי"/></label>
          <label className="wide"><span>קישור (לא חובה)</span><input type="url" value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://..."/></label>
          <button className="button" type="submit">＋ הוספת מבצע</button>
        </form>
        <div className="familyDealCards">{deals.length?deals.map(deal=><article key={deal.id}><div><span>{deal.zone||'מהטיול'}</span><h4>{deal.title}</h4><p><b>{deal.store}</b>{deal.details?` · ${deal.details}`:''}</p><small>נוסף על ידי {deal.addedBy} · {localDateTime(deal.createdAt)}{deal.expires?` · בתוקף עד ${new Date(deal.expires).toLocaleDateString('he-IL')}`:''}</small></div><div>{deal.url&&<a href={deal.url} target="_blank" rel="noopener noreferrer">פתיחה ↗</a>}{deal.lat&&<a href={`https://www.google.com/maps/search/?api=1&query=${deal.lat},${deal.lng}`} target="_blank" rel="noopener noreferrer">מפה</a>}<button onClick={()=>setDeals(old=>old.filter(x=>x.id!==deal.id))}>מחיקה</button></div></article>):<div className="emptyDeals">עוד לא נוספו מבצעים משפחתיים.</div>}</div>
      </div>
    </div>
  </section>;
}
