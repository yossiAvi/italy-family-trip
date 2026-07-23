const json=(statusCode,body)=>({statusCode,headers:{'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=300'},body:JSON.stringify(body)});
const pad=n=>String(n).padStart(2,'0');
const iso=d=>`${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`;
function rangeDates(range){
  const start=new Date();start.setUTCHours(0,0,0,0);
  const end=new Date(start);
  if(range==='tomorrow'){start.setUTCDate(start.getUTCDate()+1);end.setUTCDate(end.getUTCDate()+2)}
  else if(range==='week')end.setUTCDate(end.getUTCDate()+7);
  else end.setUTCDate(end.getUTCDate()+1);
  return [iso(start),iso(end)];
}
function distanceKm(a,b){const r=x=>x*Math.PI/180,R=6371,dLat=r(b.lat-a.lat),dLng=r(b.lng-a.lng),q=Math.sin(dLat/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(q));}
export async function handler(event){
  const key=process.env.TICKETMASTER_API_KEY;
  if(!key)return json(200,{configured:false,events:[]});
  const lat=Number(event.queryStringParameters?.lat),lng=Number(event.queryStringParameters?.lng),radius=Math.min(100,Math.max(1,Number(event.queryStringParameters?.radius)||10));
  if(!Number.isFinite(lat)||!Number.isFinite(lng))return json(400,{error:'Invalid location'});
  const [startDateTime,endDateTime]=rangeDates(event.queryStringParameters?.range||'today');
  const params=new URLSearchParams({apikey:key,latlong:`${lat},${lng}`,radius:String(radius),unit:'km',countryCode:'IT',startDateTime,endDateTime,size:'20',sort:'date,asc'});
  try{
    const response=await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${params}`);
    if(!response.ok)return json(response.status,{error:'Ticketmaster request failed'});
    const data=await response.json();
    const rows=data?._embedded?.events||[];
    const events=rows.map(row=>{
      const venue=row._embedded?.venues?.[0]||{},loc=venue.location||{},eventLat=Number(loc.latitude),eventLng=Number(loc.longitude);
      const date=row.dates?.start?.dateTime||row.dates?.start?.localDate;
      return {id:row.id,name:row.name,url:row.url,image:row.images?.sort((a,b)=>(b.width||0)-(a.width||0))[0]?.url||'',category:row.classifications?.[0]?.segment?.name||row.classifications?.[0]?.genre?.name||'אירוע',venue:venue.name||'',city:venue.city?.name||'',lat:Number.isFinite(eventLat)?eventLat:null,lng:Number.isFinite(eventLng)?eventLng:null,distance:Number.isFinite(eventLat)&&Number.isFinite(eventLng)?Number(distanceKm({lat,lng},{lat:eventLat,lng:eventLng}).toFixed(1)):null,dateLabel:date?new Date(date).toLocaleString('he-IL',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):''};
    });
    return json(200,{configured:true,events});
  }catch(error){return json(500,{error:error.message||'Events request failed'});}
}
