import { useMemo, useState } from 'react';

const phraseGroups = [
  {name:'בסיסי', icon:'👋', phrases:[
    ['שלום','Ciao'],['בוקר טוב','Buongiorno'],['ערב טוב','Buonasera'],['תודה רבה','Grazie mille'],['בבקשה','Per favore'],['סליחה','Mi scusi'],['אני לא מדבר/ת איטלקית','Non parlo italiano'],['האם אתה מדבר אנגלית?','Parla inglese?']
  ]},
  {name:'מסעדה ואוכל', icon:'🍝', phrases:[
    ['אפשר לקבל תפריט באנגלית?','Possiamo avere un menù in inglese?'],['אנחנו חמישה אנשים','Siamo cinque persone'],['בלי בשר חזיר, בבקשה','Senza carne di maiale, per favore'],['האם יש במנה פירות ים?','Ci sono frutti di mare nel piatto?'],['מים ללא גז','Acqua naturale'],['מים מוגזים','Acqua frizzante'],['את החשבון, בבקשה','Il conto, per favore'],['זה טעים מאוד','È molto buono']
  ]},
  {name:'ניווט ותחבורה', icon:'🧭', phrases:[
    ['איפה תחנת הרכבת?','Dov\'è la stazione ferroviaria?'],['איפה תחנת האוטובוס?','Dov\'è la fermata dell\'autobus?'],['איך מגיעים לכאן?','Come si arriva qui?'],['כמה זמן זה לוקח?','Quanto tempo ci vuole?'],['אנחנו צריכים מונית','Abbiamo bisogno di un taxi'],['איפה החניון?','Dov\'è il parcheggio?'],['האם זה במרחק הליכה?','È raggiungibile a piedi?']
  ]},
  {name:'קניות', icon:'🛍️', phrases:[
    ['כמה זה עולה?','Quanto costa?'],['יש מידה אחרת?','Avete un\'altra taglia?'],['אפשר למדוד?','Posso provarlo?'],['האם אפשר לשלם בכרטיס?','Posso pagare con la carta?'],['זה יקר מדי','È troppo caro'],['יש הנחה?','C\'è uno sconto?']
  ]},
  {name:'חירום ובריאות', icon:'🩹', phrases:[
    ['אנחנו צריכים עזרה','Abbiamo bisogno di aiuto'],['איפה בית המרקחת הקרוב?','Dov\'è la farmacia più vicina?'],['אני צריך רופא','Ho bisogno di un medico'],['הילד לא מרגיש טוב','Il bambino non si sente bene'],['יש לי אלרגיה ל…','Sono allergico a…'],['התקשרו לאמבולנס','Chiamate un\'ambulanza']
  ]}
];

const speak = (text, lang) => {
  if (!text || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = .88;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.toLowerCase().startsWith(lang.slice(0,2).toLowerCase()));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
};

export default function TranslatorHub(){
  const [source,setSource]=useState('he');
  const [text,setText]=useState('');
  const [activeGroup,setActiveGroup]=useState('בסיסי');
  const [saved,setSaved]=useState(()=>{
    try{return JSON.parse(localStorage.getItem('avitan-saved-phrases')||'[]')}catch{return []}
  });
  const target=source==='he'?'it':'he';
  const sourceLabel=source==='he'?'עברית':'איטלקית';
  const targetLabel=target==='it'?'איטלקית':'עברית';
  const googleUrl=useMemo(()=>`https://translate.google.com/?sl=${source}&tl=${target}&text=${encodeURIComponent(text)}&op=translate`,[source,target,text]);
  const group=phraseGroups.find(g=>g.name===activeGroup)||phraseGroups[0];
  const savePhrase=(he,it)=>{
    const item={he,it};
    const exists=saved.some(x=>x.he===he&&x.it===it);
    const next=exists?saved.filter(x=>!(x.he===he&&x.it===it)):[item,...saved].slice(0,20);
    setSaved(next);localStorage.setItem('avitan-saved-phrases',JSON.stringify(next));
  };
  const usePhrase=(he,it)=>{setSource('he');setText(he);setTimeout(()=>window.open(`https://translate.google.com/?sl=he&tl=it&text=${encodeURIComponent(he)}&op=translate`,'_blank','noopener,noreferrer'),50)};
  return <section id="translator" data-nav-section className="section translatorSection">
    <div className="container">
      <div className="sectionHead translatorHead"><div><span className="eyebrow">Parliamo italiano 🇮🇹</span><h2>המתרגם המשפחתי</h2></div><p>משפטים שימושיים, הקראה באיטלקית ופתיחה מיידית ב־Google Translate.</p></div>
      <div className="translatorHero">
        <div className="translateComposer">
          <header><div><b>{sourceLabel}</b><span>לתרגום אל {targetLabel}</span></div><button onClick={()=>setSource(v=>v==='he'?'it':'he')} aria-label="החלפת שפות">⇄</button></header>
          <textarea dir={source==='he'?'rtl':'ltr'} value={text} onChange={e=>setText(e.target.value)} placeholder={source==='he'?'כתבו מילה או משפט בעברית…':'Scrivi una parola o una frase…'} />
          <div className="translateActions">
            <button className="speakButton" disabled={!text} onClick={()=>speak(text,source==='he'?'he-IL':'it-IT')}>🔊 שמיעה</button>
            <a className={`button googleTranslateButton ${!text?'disabled':''}`} href={text?googleUrl:undefined} target="_blank" rel="noreferrer">פתיחה ותרגום ב־Google Translate ↗</a>
          </div>
          <small>התרגום עצמו נפתח בשירות Google Translate; ההקראה פועלת ישירות מהמכשיר.</small>
        </div>
        <aside className="italianTip"><span>💬</span><div><small>משפט היום</small><strong>Un gelato, per favore!</strong><p>גלידה אחת, בבקשה!</p></div><button onClick={()=>speak('Un gelato, per favore!','it-IT')}>▶</button></aside>
      </div>
      <div className="phraseTabs">{phraseGroups.map(g=><button key={g.name} className={g.name===activeGroup?'active':''} onClick={()=>setActiveGroup(g.name)}><span>{g.icon}</span>{g.name}</button>)}</div>
      <div className="phraseGrid">{group.phrases.map(([he,it])=>{
        const isSaved=saved.some(x=>x.he===he&&x.it===it);
        return <article key={he}><div><b>{he}</b><strong>{it}</strong></div><div><button title="שמיעה באיטלקית" onClick={()=>speak(it,'it-IT')}>🔊</button><button title="פתיחה ב-Google Translate" onClick={()=>usePhrase(he,it)}>G</button><button className={isSaved?'saved':''} title="שמירה למועדפים" onClick={()=>savePhrase(he,it)}>{isSaved?'★':'☆'}</button></div></article>
      })}</div>
      {saved.length>0&&<div className="savedPhrases"><header><div><span>⭐</span><div><h3>המשפטים ששמרנו</h3><p>גישה מהירה גם בזמן אמת.</p></div></div><button onClick={()=>{setSaved([]);localStorage.removeItem('avitan-saved-phrases')}}>ניקוי</button></header><div>{saved.map(({he,it})=><button key={`${he}-${it}`} onClick={()=>speak(it,'it-IT')}><b>{he}</b><span>{it}</span><i>🔊</i></button>)}</div></div>}
    </div>
  </section>
}
