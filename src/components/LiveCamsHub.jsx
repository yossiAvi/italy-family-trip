import { useMemo, useState } from 'react';
import { imageBank } from '../data/tripData.js';

const cameras = [
  {id:'rome-trevi', area:'רומא', title:'מזרקת טרווי', subtitle:'מבט חי על המזרקה והכיכר', image:imageBank.romeStreet, url:'https://www.skylinewebcams.com/en/webcam/italia/lazio/roma/fontana-di-trevi.html', source:'SkylineWebcams'},
  {id:'rome-pantheon', area:'רומא', title:'הפנתאון', subtitle:'Piazza della Rotonda בזמן אמת', image:imageBank.rome, url:'https://www.skylinewebcams.com/en/webcam/italia/lazio/roma/pantheon.html', source:'SkylineWebcams'},
  {id:'rome-campo', area:'רומא', title:"Campo de’ Fiori", subtitle:'בדקו מראש את האווירה והעומס בכיכר', image:imageBank.rome, url:'https://www.skylinewebcams.com/en/webcam/italia/lazio/roma/campo-de-fiori.html', source:'SkylineWebcams'},
  {id:'sorrento-marina', area:'סורנטו', title:'Marina Grande', subtitle:'הנמל העתיק, הים ומצב השמיים', image:imageBank.sorrento, url:'https://www.skylinewebcams.com/en/webcam/italia/campania/napoli/sorrento.html', source:'SkylineWebcams'},
  {id:'sorrento-panorama', area:'סורנטו', title:'פנורמה של סורנטו', subtitle:'מבט רחב אל מפרץ נאפולי', image:imageBank.sorrento, url:'https://www.bristolsorrento.com/en/panorama-live-webcam', source:'Hotel Bristol Sorrento'},
  {id:'positano-beach', area:'פוזיטנו', title:'Spiaggia Grande', subtitle:'החוף המרכזי והעומס באזור', image:imageBank.positano, url:'https://www.skylinewebcams.com/en/webcam/italia/campania/salerno/spiaggia-positano.html', source:'SkylineWebcams'},
  {id:'positano-dock', area:'פוזיטנו', title:'רציף המעבורות', subtitle:'מבט חי על הרציף והים', image:imageBank.positano, url:'https://www.skylinewebcams.com/en/webcam/italia/campania/salerno/molo-positano.html', source:'SkylineWebcams'},
  {id:'amalfi-official', area:'אמאלפי', title:'כיכר הדואומו והנמל', subtitle:'עמוד מצלמות רשמי עם כמה זוויות', image:imageBank.amalfi, url:'https://www.leganavaleamalfi.it/webcams/', source:'Lega Navale Italiana Amalfi'},
  {id:'amalfi-beach', area:'אמאלפי', title:'חוף אמאלפי', subtitle:'החוף, הכפר ומצב הים', image:imageBank.amalfi, url:'https://www.skylinewebcams.com/en/webcam/italia/campania/salerno/spiaggia-di-amalfi.html', source:'SkylineWebcams'},
  {id:'ravello', area:'רוולו', title:'תצפית רוולו', subtitle:'מבט פנורמי לכיוון מאיורי והחוף', image:imageBank.amalfi, url:'https://www.skylinewebcams.com/en/webcam/italia/campania/salerno/ravello.html', source:'SkylineWebcams'},
  {id:'capri', area:'קפרי', title:'פנורמה של קפרי', subtitle:'מבט חי על האי והים', image:imageBank.capri, url:'https://www.skylinewebcams.com/en/webcam/italia/campania/napoli/capri-skyline.html', source:'SkylineWebcams'},
  {id:'capri-faraglioni', area:'קפרי', title:'סלעי Faraglioni', subtitle:'אחד הנופים המזוהים ביותר עם קפרי', image:imageBank.capri, url:'https://www.skylinewebcams.com/en/webcam/italia/campania/napoli/capri-i-faraglioni.html', source:'SkylineWebcams'},
  {id:'vesuvius', area:'פומפיי ונאפולי', title:'הר הווזוב', subtitle:'בדקו עננות וראות לפני יום פומפיי', image:imageBank.pompeii, url:'https://www.skylinewebcams.com/en/webcam/italia/campania/napoli/vesuvio.html', source:'SkylineWebcams'},
  {id:'naples', area:'פומפיי ונאפולי', title:'נאפולי והר הווזוב', subtitle:'קו החוף וההר ברקע בזמן אמת', image:imageBank.naples, url:'https://www.skylinewebcams.com/en/webcam/italia/campania/napoli/napoli-vesuvio.html', source:'SkylineWebcams'}
];

export default function LiveCamsHub(){
  const [area,setArea]=useState('הכול');
  const areas=['הכול',...new Set(cameras.map(c=>c.area))];
  const visible=useMemo(()=>area==='הכול'?cameras:cameras.filter(c=>c.area===area),[area]);
  return <section id="livecams" data-nav-section className="section liveCamsSection">
    <div className="container">
      <div className="sectionHead liveCamsHead"><div><span className="eyebrow">לפני שיוצאים</span><h2>מצלמות לייב מהטיול</h2></div><p>פתחו מצלמות חיצוניות כדי לראות עומס, ים, עננות ואווירה בזמן אמת. השידור נפתח באתר המקור ולא מוטמע כאן.</p></div>
      <div className="liveCamToolbar">
        <label><span>בחירת אזור</span><select value={area} onChange={e=>setArea(e.target.value)}>{areas.map(item=><option key={item}>{item}</option>)}</select></label>
        <div className="liveCamHint"><span>🔴</span><div><b>שידור חיצוני</b><small>זמינות המצלמה תלויה באתר המפעיל.</small></div></div>
      </div>
      <div className="liveCamGrid">{visible.map(cam=><article className="liveCamCard" key={cam.id}>
        <div className="liveCamImage" style={{backgroundImage:`url(${cam.image})`}}><span className="liveBadge">● LIVE</span><div className="liveCamShade"/></div>
        <div className="liveCamBody"><span className="liveCamArea">{cam.area}</span><h3>{cam.title}</h3><p>{cam.subtitle}</p><small>מקור: {cam.source}</small><a className="button liveCamButton" href={cam.url} target="_blank" rel="noopener noreferrer">פתיחת המצלמה ↗</a></div>
      </article>)}</div>
    </div>
  </section>;
}
