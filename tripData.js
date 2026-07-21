import { useEffect, useMemo, useRef, useState } from 'react';
import {
  cloudConfigured, storyMode, loadStories, createStory, updateStory, deleteStory,
  subscribeStories, exportStories, importLocalStories
} from '../lib/storyStore.js';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const MAX_PHOTOS = 6;

const EXTRA_PLACES = [
  { id:'vico', name:'Vico Equense', aliases:['vico equense','ויקו','montechiaro','l’antica pigna','lantica pigna'], icon:'🌅' },
  { id:'ravello', name:'רוולו', aliases:['רוולו','ravello','villa cimbrone','villa rufolo'], icon:'🌿' },
  { id:'minori', name:'מינורי', aliases:['מינורי','minori'], icon:'🍋' },
  { id:'maiori', name:'מאיורי', aliases:['מאיורי','maiori'], icon:'🏖️' },
  { id:'fiumicino', name:'פיומיצ׳ינו', aliases:['פיומיצינו','פיומיצ׳ינו','fiumicino'], icon:'✈️' }
];

const DESTINATION_ALIASES = {
  rome:['רומא','rome','roma','וותיקן','vatican','san pietro','קולוסיאום','colosseum','trevi','טרווי','pantheon','פנתאון','campo de fiori','קמפו די פיורי'],
  sorrento:['סורנטו','sorrento','regina giovanna','marina grande'],
  positano:['פוזיטנו','positano'],
  amalfi:['אמאלפי','amalfi','atrani','אטראני'],
  capri:['קפרי','capri','anacapri','אנאקפרי','monte solaro'],
  pompeii:['פומפיי','pompeii','pompei'],
  naples:['נאפולי','naples','napoli']
};

function toLocalDateTimeValue(date = new Date()) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

function normalizeText(value = '') {
  return value.toLowerCase().normalize('NFKD').replace(/[’'`״׳]/g, '').replace(/[^a-z0-9\u0590-\u05ff]+/g, ' ').trim();
}

function getPlaceCatalog(destinations = []) {
  const primary = destinations.map(destination => ({
    ...destination,
    aliases:[destination.name, destination.id, ...(DESTINATION_ALIASES[destination.id] || [])],
    icon:'📍'
  }));
  return [...primary, ...EXTRA_PLACES];
}

function resolvePlace(story, destinations) {
  const haystack = normalizeText([story.locationName, story.dayTitle, story.title, story.body].filter(Boolean).join(' '));
  const catalog = getPlaceCatalog(destinations);
  const matched = catalog.find(place => place.aliases.some(alias => haystack.includes(normalizeText(alias))));
  if (matched) return matched;

  const fallbackName = story.locationName?.split(',')[0]?.trim() || story.dayTitle?.split('—')[0]?.trim() || 'מקום נוסף בטיול';
  return { id:`custom-${normalizeText(fallbackName) || 'other'}`, name:fallbackName, aliases:[fallbackName], icon:'📌' };
}

async function compressImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('אפשר לצרף קובצי תמונה בלבד.');
  const source = await (async () => {
    if ('createImageBitmap' in window) {
      try { return await createImageBitmap(file); } catch { /* fallback */ }
    }
    const url = URL.createObjectURL(file);
    try {
      const image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
      return image;
    } finally { URL.revokeObjectURL(url); }
  })();
  const max = 1600;
  const sourceWidth = source.width || source.naturalWidth;
  const sourceHeight = source.height || source.naturalHeight;
  const scale = Math.min(1, max / Math.max(sourceWidth, sourceHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(sourceWidth * scale);
  canvas.height = Math.round(sourceHeight * scale);
  canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
  source.close?.();
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .82));
  if (!blob) throw new Error('לא הצלחנו לעבד את התמונה. נסו לבחור תמונת JPG או PNG.');
  return new File([blob], `${file.name.replace(/\.[^.]+$/, '') || 'photo'}.jpg`, { type:'image/jpeg' });
}

function existingMedia(story) {
  return (story?.images || []).map((src, index) => ({
    id:`existing-${story.id}-${index}`,
    kind:'existing',
    src,
    path:story.imagePaths?.[index] || ''
  }));
}

function StoryComposer({ days, editing, onCancel, onSaved }) {
  const [author, setAuthor] = useState(() => localStorage.getItem('storyAuthor') || '');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [dayKey, setDayKey] = useState(days[0]?.date || '');
  const [visitDate, setVisitDate] = useState(toLocalDateTimeValue());
  const [locationName, setLocationName] = useState('');
  const [coords, setCoords] = useState({ lat:null, lng:null });
  const [media, setMedia] = useState([]);
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const replaceIndexRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaRef = useRef(media);

  useEffect(() => { mediaRef.current = media; }, [media]);

  useEffect(() => {
    if (editing) {
      setAuthor(editing.author || '');
      setTitle(editing.title || '');
      setBody(editing.body || '');
      setDayKey(editing.dayKey || days[0]?.date || '');
      setVisitDate(toLocalDateTimeValue(new Date(editing.visitDate)));
      setLocationName(editing.locationName || '');
      setCoords({ lat:editing.lat ?? null, lng:editing.lng ?? null });
      setMedia(existingMedia(editing));
    } else {
      setTitle(''); setBody(''); setDayKey(days[0]?.date || '');
      setVisitDate(toLocalDateTimeValue()); setLocationName('');
      setCoords({ lat:null, lng:null }); setMedia([]);
    }
    setMessage('');
  }, [editing, days]);

  useEffect(() => () => {
    mediaRef.current.filter(item => item.kind === 'new' && item.src?.startsWith('blob:')).forEach(item => URL.revokeObjectURL(item.src));
    recognitionRef.current?.stop?.();
  }, []);

  const makeNewItem = file => ({ id:`new-${crypto.randomUUID()}`, kind:'new', file, src:URL.createObjectURL(file), path:'' });

  const chooseFiles = async event => {
    setMessage('');
    const available = Math.max(0, MAX_PHOTOS - media.length);
    const picked = [...(event.target.files || [])].slice(0, available);
    try {
      const additions = [];
      for (const file of picked) additions.push(makeNewItem(await compressImage(file)));
      setMedia(current => [...current, ...additions].slice(0, MAX_PHOTOS));
    } catch (error) { setMessage(error.message); }
    event.target.value = '';
  };

  const replacePhoto = index => {
    replaceIndexRef.current = index;
    replaceInputRef.current?.click();
  };

  const handleReplacement = async event => {
    const file = event.target.files?.[0];
    const index = replaceIndexRef.current;
    event.target.value = '';
    if (!file || index === null) return;
    setMessage('');
    try {
      const nextItem = makeNewItem(await compressImage(file));
      setMedia(current => current.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        if (item.kind === 'new' && item.src?.startsWith('blob:')) URL.revokeObjectURL(item.src);
        return nextItem;
      }));
    } catch (error) { setMessage(error.message); }
    finally { replaceIndexRef.current = null; }
  };

  const removePhoto = index => setMedia(current => {
    const item = current[index];
    if (item?.kind === 'new' && item.src?.startsWith('blob:')) URL.revokeObjectURL(item.src);
    return current.filter((_, itemIndex) => itemIndex !== index);
  });

  const movePhoto = (index, direction) => setMedia(current => {
    const target = index + direction;
    if (target < 0 || target >= current.length) return current;
    const next = [...current];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  });

  const setCover = index => setMedia(current => {
    if (index === 0) return current;
    const next = [...current];
    const [selected] = next.splice(index, 1);
    next.unshift(selected);
    return next;
  });

  const detectLocation = () => {
    if (!navigator.geolocation) return setMessage('המכשיר אינו תומך בזיהוי מיקום.');
    setLocating(true); setMessage('');
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude:lat, longitude:lng } = position.coords;
      setCoords({ lat, lng });
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=he`);
        const data = await response.json();
        setLocationName(data.name || data.address?.town || data.address?.city || data.display_name?.split(',').slice(0, 2).join(', ') || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      } catch { setLocationName(`${lat.toFixed(5)}, ${lng.toFixed(5)}`); }
      finally { setLocating(false); }
    }, error => {
      setLocating(false);
      setMessage(error.code === 1 ? 'יש לאשר לאתר גישה למיקום.' : 'לא הצלחנו לזהות את המיקום. נסו שוב במקום פתוח.');
    }, { enableHighAccuracy:true, timeout:15000, maximumAge:60000 });
  };

  const toggleDictation = () => {
    if (!SpeechRecognition) return setMessage('הכתבה קולית אינה נתמכת בדפדפן הזה. מומלץ להשתמש ב־Chrome.');
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'he-IL'; recognition.continuous = true; recognition.interimResults = true;
    let finalText = '';
    recognition.onresult = event => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalText += `${event.results[i][0].transcript} `;
        else interim += event.results[i][0].transcript;
      }
      setBody(current => `${current.replace(/\s*\[מקשיב:.*\]$/, '')}${finalText}${interim ? ` [מקשיב: ${interim}]` : ''}`);
      finalText = '';
    };
    recognition.onerror = () => { setListening(false); setMessage('ההכתבה הופסקה. בדקו שהמיקרופון מאושר ונסו שוב.'); };
    recognition.onend = () => { setListening(false); setBody(current => current.replace(/\s*\[מקשיב:.*\]$/, '')); };
    recognitionRef.current = recognition; recognition.start(); setListening(true);
  };

  const submit = async event => {
    event.preventDefault();
    if (!author.trim()) return setMessage('כתבו מי מוסיף את הסיפור.');
    if (!title.trim() && !body.trim() && !media.length) return setMessage('הוסיפו תמונה, כותרת או הסבר.');
    if (!editing && !media.length) return setMessage('מומלץ לצרף לפחות תמונה אחת ליומן המסע.');
    setBusy(true); setMessage('');
    localStorage.setItem('storyAuthor', author.trim());
    const day = days.find(d => d.date === dayKey);
    const payload = {
      author:author.trim(), title:title.trim(), body:body.trim(), dayKey,
      dayTitle:day?.title || '', locationName:locationName.trim(),
      lat:coords.lat, lng:coords.lng, visitDate:new Date(visitDate).toISOString()
    };
    try {
      if (editing) await updateStory(editing, payload, media);
      else await createStory(payload, media.map(item => item.file));
      media.filter(item => item.kind === 'new' && item.src?.startsWith('blob:')).forEach(item => URL.revokeObjectURL(item.src));
      setMedia([]); inputRef.current && (inputRef.current.value = '');
      onSaved();
    } catch (error) { setMessage(`לא הצלחנו לשמור: ${error.message}`); }
    finally { setBusy(false); }
  };

  return <form className="storyComposer" onSubmit={submit}>
    <div className="composerHeader"><div><span className="eyebrow">{editing ? 'עריכת סיפור וגלריה' : 'רגע חדש מהטיול'}</span><h3>{editing ? 'עדכון הרשומה והתמונות' : 'הוסיפו תמונה וסיפור'}</h3></div><span className={`syncBadge ${storyMode}`}>{cloudConfigured ? '☁️ מסונכרן למשפחה' : '📱 נשמר במכשיר'}</span></div>
    <div className="composerGrid">
      <label><span>מי מוסיף?</span><input value={author} onChange={e => setAuthor(e.target.value)} placeholder="לדוגמה: יוסי, יסמית, סיון…" /></label>
      <label><span>יום בטיול</span><select value={dayKey} onChange={e => setDayKey(e.target.value)}>{days.map(day => <option key={day.date} value={day.date}>{day.date} · {day.title}</option>)}</select></label>
      <label><span>תאריך ושעה</span><input type="datetime-local" value={visitDate} onChange={e => setVisitDate(e.target.value)} /></label>
      <label className="locationField"><span>מיקום</span><div><input value={locationName} onChange={e => setLocationName(e.target.value)} placeholder="שם המקום — חשוב לאלבום המקומות" /><button type="button" className="softButton" onClick={detectLocation} disabled={locating}>{locating ? 'מזהה…' : '⌖ זיהוי מיקום'}</button></div></label>
    </div>
    <label className="wideField"><span>כותרת</span><input value={title} onChange={e => setTitle(e.target.value)} placeholder="לדוגמה: השקיעה הראשונה שלנו בסורנטו" /></label>
    <label className="wideField"><span>הסיפור שלנו</span><textarea value={body} onChange={e => setBody(e.target.value)} rows="5" placeholder="מה ראינו? מה היה מצחיק? מה הילדים אהבו? טיפ שנרצה לזכור…" /></label>
    <div className="composerActions">
      <button type="button" className={`softButton voiceButton ${listening ? 'recording' : ''}`} onClick={toggleDictation}>{listening ? '■ עצירת הכתבה' : '🎙️ הכתבה קולית'}</button>
      <label className={`softButton fileButton ${media.length >= MAX_PHOTOS ? 'disabled' : ''}`}>📷 {editing ? 'הוספת תמונות' : 'צילום / הוספת תמונות'}<input ref={inputRef} type="file" accept="image/*" capture="environment" multiple disabled={media.length >= MAX_PHOTOS} onChange={chooseFiles} /></label>
      <small>עד {MAX_PHOTOS} תמונות. התמונה הראשונה משמשת כתמונת השער.</small>
      <input ref={replaceInputRef} hidden type="file" accept="image/*" capture="environment" onChange={handleReplacement} />
    </div>
    {media.length > 0 && <div className="storyMediaEditor">
      {media.map((item, index) => <figure key={item.id} className={index === 0 ? 'coverPhoto' : ''}>
        <img src={item.src} alt={`תמונה ${index + 1}`} />
        {index === 0 && <span className="coverBadge">★ תמונת שער</span>}
        <div className="mediaEditActions">
          <button type="button" title="החלפת תמונה" onClick={() => replacePhoto(index)}>↻</button>
          <button type="button" title="הזזה ימינה" disabled={index === 0} onClick={() => movePhoto(index, -1)}>→</button>
          <button type="button" title="הזזה שמאלה" disabled={index === media.length - 1} onClick={() => movePhoto(index, 1)}>←</button>
          {index > 0 && <button type="button" title="הגדרה כתמונת שער" onClick={() => setCover(index)}>★</button>}
          <button type="button" className="deletePhoto" title="מחיקת תמונה" onClick={() => removePhoto(index)}>×</button>
        </div>
      </figure>)}
    </div>}
    {editing && <p className="galleryEditHint">אפשר להחליף, למחוק ולסדר מחדש גם תמונות שכבר נשמרו. מחיקה תתבצע בענן רק לאחר לחיצה על “שמירת שינויים”.</p>}
    {coords.lat && <div className="coordsNote">📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</div>}
    {message && <p className="formMessage">{message}</p>}
    <div className="submitRow"><button className="button storySave" disabled={busy}>{busy ? 'שומר…' : editing ? 'שמירת הטקסט והגלריה' : 'הוספה ל־Story Line'}</button>{editing && <button type="button" className="button cancelButton" onClick={onCancel}>ביטול</button>}</div>
  </form>;
}

function StoryGallery({ images, onOpen }) {
  if (!images?.length) return null;
  return <div className={`storyPhotos count-${Math.min(images.length, 4)}`}>{images.slice(0, 4).map((src, i) => <button key={`${src}-${i}`} onClick={() => onOpen(i)}><img loading="lazy" src={src} alt="תמונה מיומן הטיול" />{i === 3 && images.length > 4 && <span>+{images.length - 4}</span>}</button>)}</div>;
}

function StoryCard({ story, onEdit, onDelete, onOpenImages }) {
  const speak = () => {
    if (!('speechSynthesis' in window)) return alert('הקראת טקסט אינה נתמכת במכשיר הזה.');
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance([story.title, story.body].filter(Boolean).join('. '));
    utterance.lang = 'he-IL'; utterance.rate = .95; speechSynthesis.speak(utterance);
  };
  const mapUrl = story.lat && story.lng ? `https://www.google.com/maps/search/?api=1&query=${story.lat},${story.lng}` : '';
  return <article className="storyCard">
    <div className="storyRail"><span /></div>
    <div className="storyCardInner">
      <div className="storyMeta"><div className="storyAvatar">{story.author?.trim()?.[0] || '♥'}</div><div><b>{story.author || 'המשפחה'}</b><small>{new Date(story.visitDate).toLocaleString('he-IL', { dateStyle:'medium', timeStyle:'short' })}</small></div><span className="dayStoryBadge">{story.dayKey} · {story.dayTitle}</span></div>
      <StoryGallery images={story.images} onOpen={onOpenImages} />
      <div className="storyText">{story.title && <h3>{story.title}</h3>}{story.body && <p>{story.body}</p>}</div>
      {(story.locationName || mapUrl) && <div className="storyLocation">📍 {mapUrl ? <a target="_blank" rel="noreferrer" href={mapUrl}>{story.locationName || 'פתיחה במפה'}</a> : story.locationName}</div>}
      <div className="storyCardActions">{story.body && <button onClick={speak}>🔊 הקראה</button>}{story.mine && <button onClick={onEdit}>✎ עריכה ותמונות</button>}{story.mine && <button className="dangerText" onClick={onDelete}>⌫ מחיקה</button>}</div>
    </div>
  </article>;
}

function Lightbox({ story, index, onClose, onMove }) {
  if (!story) return null;
  return <div className="storyLightbox" onClick={e => e.target === e.currentTarget && onClose()}>
    <button className="lightboxClose" onClick={onClose}>×</button>
    <button className="lightboxArrow prev" onClick={() => onMove(-1)}>‹</button>
    <figure><img src={story.images[index]} alt="תמונה מוגדלת" /><figcaption><b>{story.title || story.locationName || 'רגע מהטיול'}</b><span>{index + 1} / {story.images.length}</span></figcaption></figure>
    <button className="lightboxArrow next" onClick={() => onMove(1)}>›</button>
  </div>;
}

function PlaceBoard({ groups, onOpen }) {
  return <div className="placeBoard">{groups.map(group => {
    const photos = group.stories.flatMap(story => story.images || []);
    const cover = photos[0] || group.place.image;
    const people = [...new Set(group.stories.map(story => story.author).filter(Boolean))];
    return <button key={group.place.id} className="placeAlbumCard" onClick={() => onOpen(group)}>
      <div className="placeAlbumCover">{cover ? <img src={cover} alt={group.place.name} /> : <span>{group.place.icon || '📍'}</span>}<div className="placeAlbumShade" /></div>
      <div className="placeAlbumContent"><span className="placeAlbumIcon">{group.place.icon || '📍'}</span><h3>{group.place.name}</h3><p>{group.stories.length} סיפורים · {photos.length} תמונות</p><small>{people.length ? `מאת ${people.slice(0, 3).join(', ')}${people.length > 3 ? ' ועוד' : ''}` : 'האלבום המשפחתי'}</small><b>פתיחת האלבום ←</b></div>
      {photos.length > 1 && <div className="placeMiniStack">{photos.slice(1, 4).map((src, index) => <img key={`${src}-${index}`} src={src} alt="" />)}</div>}
    </button>;
  })}</div>;
}

function PlaceAlbum({ group, onClose, onOpenImages, onEdit }) {
  if (!group) return null;
  const stories = [...group.stories].sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate));
  const photos = stories.flatMap(story => (story.images || []).map((src, index) => ({ src, story, index })));
  const people = [...new Set(stories.map(story => story.author).filter(Boolean))];
  const cover = photos[0]?.src || group.place.image;
  const firstCoordinates = stories.find(story => story.lat && story.lng);
  return <div className="placeAlbumModal" onClick={event => event.target === event.currentTarget && onClose()}>
    <article className="placeAlbumSheet">
      <button className="placeAlbumClose" onClick={onClose}>×</button>
      <header className="placeAlbumHero">{cover && <img src={cover} alt={group.place.name} />}<div /><section><span>{group.place.icon || '📍'} אלבום מקום</span><h2>{group.place.name}</h2><p>{stories.length} סיפורים · {photos.length} תמונות · {people.length} משתתפים</p>{firstCoordinates && <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${firstCoordinates.lat},${firstCoordinates.lng}`}>פתיחה במפה ↗</a>}</section></header>
      <div className="placeAlbumBody">
        {photos.length > 0 && <section><div className="placeSectionTitle"><h3>כל התמונות מהמקום</h3><span>לחצו להגדלה</span></div><div className="placePhotoWall">{photos.map((photo, index) => <button key={`${photo.story.id}-${photo.index}`} className={`wallPhoto wall-${index % 7}`} onClick={() => onOpenImages(photo.story, photo.index)}><img loading="lazy" src={photo.src} alt={photo.story.title || group.place.name} /><span>{photo.story.author}</span></button>)}</div></section>}
        <section><div className="placeSectionTitle"><h3>הסיפורים שלנו ב־{group.place.name}</h3><span>{people.join(' · ')}</span></div><div className="placeStoryList">{stories.map(story => <article key={story.id}><time>{new Date(story.visitDate).toLocaleDateString('he-IL', { day:'numeric', month:'long' })}</time><div><h4>{story.title || story.locationName || 'רגע מהטיול'}</h4>{story.body && <p>{story.body}</p>}<small>מאת {story.author || 'המשפחה'}{story.locationName ? ` · ${story.locationName}` : ''}</small></div>{story.mine && <button onClick={() => { onClose(); onEdit(story); }}>✎ עריכה</button>}</article>)}</div></section>
      </div>
    </article>
  </div>;
}

export default function Storyline({ days, destinations = [] }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');
  const [dayFilter, setDayFilter] = useState('all');
  const [sort, setSort] = useState('desc');
  const [view, setView] = useState('timeline');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const importRef = useRef(null);

  const refresh = async () => {
    setLoading(true); setError('');
    try { const loaded=await loadStories(localStorage.getItem('storyAuthor') || ''); setStories(loaded); localStorage.setItem('tripStoriesCache',JSON.stringify(loaded)); dispatchEvent(new CustomEvent('trip-stories-updated',{detail:loaded})); }
    catch (e) { setError(`שגיאת סנכרון: ${e.message}`); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    refresh();
    const quickAdd=()=>{setEditing(null);setShowComposer(true);setTimeout(()=>document.querySelector('.storyComposer')?.scrollIntoView({behavior:'smooth',block:'start'}),80)};
    addEventListener('open-story-composer',quickAdd);
    const unsubscribe = subscribeStories(() => refresh());
    return ()=>{unsubscribe?.();removeEventListener('open-story-composer',quickAdd)};
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stories.filter(story => (dayFilter === 'all' || story.dayKey === dayFilter) && (!q || [story.author, story.title, story.body, story.locationName, story.dayTitle].join(' ').toLowerCase().includes(q)))
      .sort((a, b) => (new Date(a.visitDate) - new Date(b.visitDate)) * (sort === 'asc' ? 1 : -1));
  }, [stories, query, dayFilter, sort]);

  const placeGroups = useMemo(() => {
    const map = new Map();
    visible.forEach(story => {
      const place = resolvePlace(story, destinations);
      if (!map.has(place.id)) map.set(place.id, { place, stories:[] });
      map.get(place.id).stories.push(story);
    });
    return [...map.values()].sort((a, b) => {
      const photoDiff = b.stories.reduce((sum, story) => sum + (story.images?.length || 0), 0) - a.stories.reduce((sum, story) => sum + (story.images?.length || 0), 0);
      return photoDiff || b.stories.length - a.stories.length;
    });
  }, [visible, destinations]);

  const remove = async story => {
    if (!confirm('למחוק את הסיפור ואת כל התמונות שלו?')) return;
    try { await deleteStory(story); await refresh(); }
    catch (e) { setError(`לא הצלחנו למחוק: ${e.message}`); }
  };

  const startEdit = story => { setEditing(story); setShowComposer(true); setTimeout(() => document.querySelector('.storyComposer')?.scrollIntoView({ behavior:'smooth', block:'start' }), 50); };

  const importJson = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try { const json = JSON.parse(await file.text()); await importLocalStories(json.stories || []); await refresh(); }
    catch (e) { setError(`ייבוא נכשל: ${e.message}`); }
    event.target.value = '';
  };

  const moveLightbox = direction => setLightbox(current => current ? { ...current, index:(current.index + direction + current.story.images.length) % current.story.images.length } : current);

  return <section className="storySection" id="storyContent"><div className="container section">
    <div className="sectionHead storyHead"><div><span className="eyebrow">הבלוג המשפחתי שלנו</span><h2>Story Line של הטיול</h2></div><div><p>ציר זמן חי או אלבומים חכמים לפי המקומות שבהם היינו.</p><button className="button addStoryButton" onClick={() => { setEditing(null); setShowComposer(true); }}>＋ הוספת רגע</button></div></div>
    {!cloudConfigured && <div className="storyModeNotice"><b>מצב מקומי פעיל:</b> היומן נשמר כרגע במכשיר הזה. לחיבור משפחתי השתמשו ב־Supabase.</div>}
    {cloudConfigured && <div className="storyModeNotice cloudNotice"><b>סנכרון משפחתי פעיל:</b> כל רשומה ועדכון גלריה מופיעים אצל בני המשפחה בזמן אמת.</div>}

    {(showComposer || editing) && <StoryComposer days={days} editing={editing} onCancel={() => { setEditing(null); setShowComposer(false); }} onSaved={async () => { setEditing(null); setShowComposer(false); await refresh(); }} />}

    <div className="storyViewSwitch"><button className={view === 'timeline' ? 'active' : ''} onClick={() => setView('timeline')}><span>☷</span><b>ציר זמן</b><small>הסיפורים לפי תאריך</small></button><button className={view === 'places' ? 'active' : ''} onClick={() => setView('places')}><span>◉</span><b>אלבומים לפי מקום</b><small>רומא, קפרי, אמאלפי ועוד</small></button></div>

    <div className="storyToolbar">
      <div className="storySearch">⌕<input value={query} onChange={e => setQuery(e.target.value)} placeholder="חיפוש בסיפורים, מיקום או שם…" /></div>
      <select value={dayFilter} onChange={e => setDayFilter(e.target.value)}><option value="all">כל הימים</option>{days.map(day => <option key={day.date} value={day.date}>{day.date} · {day.title}</option>)}</select>
      <button className="softButton" onClick={() => setSort(sort === 'desc' ? 'asc' : 'desc')}>{sort === 'desc' ? '↓ החדש קודם' : '↑ מההתחלה'}</button>
      <button className="softButton" onClick={() => exportStories(stories)}>⇩ גיבוי JSON</button>
      {!cloudConfigured && <><button className="softButton" onClick={() => importRef.current?.click()}>⇧ שחזור</button><input ref={importRef} hidden type="file" accept="application/json" onChange={importJson} /></>}
    </div>

    {error && <div className="storyError">{error}</div>}
    {loading ? <div className="storyEmpty">טוען את יומן המסע…</div> : visible.length ? (view === 'timeline' ? <div className="storyTimeline">{visible.map(story => <StoryCard key={story.id} story={story} onEdit={() => startEdit(story)} onDelete={() => remove(story)} onOpenImages={index => setLightbox({ story, index })} />)}</div> : <><div className="placeViewIntro"><div><span>🗺️</span><h3>הטיול שלנו, מקום אחרי מקום</h3><p>האפליקציה מאגדת אוטומטית את הסיפורים והתמונות לפי שם המיקום, היום במסלול וה־GPS.</p></div><b>{placeGroups.length} אלבומים · {visible.reduce((sum, story) => sum + (story.images?.length || 0), 0)} תמונות</b></div><PlaceBoard groups={placeGroups} onOpen={setSelectedPlace} /></>) : <div className="storyEmpty"><span>📷</span><h3>הסיפור הראשון עדיין מחכה לכם</h3><p>הוסיפו תמונה, הפעילו זיהוי מיקום וספרו מה קרה באותו רגע.</p><button className="button addStoryButton" onClick={() => setShowComposer(true)}>הוספת הסיפור הראשון</button></div>}
  </div>
  <PlaceAlbum group={selectedPlace} onClose={() => setSelectedPlace(null)} onEdit={startEdit} onOpenImages={(story, index) => setLightbox({ story, index })} />
  <Lightbox story={lightbox?.story} index={lightbox?.index || 0} onClose={() => setLightbox(null)} onMove={moveLightbox} />
  </section>;
}
