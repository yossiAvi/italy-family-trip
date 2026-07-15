import { useEffect, useMemo, useRef, useState } from 'react';
import {
  cloudConfigured, storyMode, loadStories, createStory, updateStory, deleteStory,
  subscribeStories, exportStories, importLocalStories
} from '../lib/storyStore.js';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function toLocalDateTimeValue(date = new Date()) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

async function compressImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('אפשר לצרף קובצי תמונה בלבד.');
  const source = await (async () => {
    if ('createImageBitmap' in window) {
      try { return await createImageBitmap(file); } catch { /* fallback below */ }
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
  const width = Math.round(sourceWidth * scale);
  const height = Math.round(sourceHeight * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(source, 0, 0, width, height);
  source.close?.();
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .82));
  if (!blob) throw new Error('לא הצלחנו לעבד את התמונה. נסו לבחור תמונת JPG או PNG.');
  return new File([blob], `${file.name.replace(/\.[^.]+$/, '') || 'photo'}.jpg`, { type: 'image/jpeg' });
}

function StoryComposer({ days, editing, onCancel, onSaved }) {
  const [author, setAuthor] = useState(() => localStorage.getItem('storyAuthor') || '');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [dayKey, setDayKey] = useState(days[0]?.date || '');
  const [visitDate, setVisitDate] = useState(toLocalDateTimeValue());
  const [locationName, setLocationName] = useState('');
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!editing) return;
    setAuthor(editing.author || '');
    setTitle(editing.title || '');
    setBody(editing.body || '');
    setDayKey(editing.dayKey || days[0]?.date || '');
    setVisitDate(toLocalDateTimeValue(new Date(editing.visitDate)));
    setLocationName(editing.locationName || '');
    setCoords({ lat: editing.lat ?? null, lng: editing.lng ?? null });
    setFiles([]);
    setPreviews(editing.images || []);
  }, [editing, days]);

  useEffect(() => () => {
    previews.filter(p => p.startsWith('blob:')).forEach(URL.revokeObjectURL);
    recognitionRef.current?.stop?.();
  }, []);

  const chooseFiles = async event => {
    setMessage('');
    const picked = [...event.target.files].slice(0, Math.max(0, 6 - files.length));
    try {
      const compressed = [];
      for (const file of picked) compressed.push(await compressImage(file));
      const nextFiles = [...files, ...compressed].slice(0, 6);
      previews.filter(p => p.startsWith('blob:')).forEach(URL.revokeObjectURL);
      setFiles(nextFiles);
      setPreviews([...(editing?.images || []), ...nextFiles.map(URL.createObjectURL)]);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const removeNewPhoto = index => {
    if (editing?.images?.length && index < editing.images.length) {
      setMessage('בגרסה זו ניתן לערוך את הטקסט והמיקום. מחיקת תמונות קיימות תתווסף בשדרוג הבא.');
      return;
    }
    const existingCount = editing?.images?.length || 0;
    const fileIndex = index - existingCount;
    const next = files.filter((_, i) => i !== fileIndex);
    previews[index]?.startsWith('blob:') && URL.revokeObjectURL(previews[index]);
    setFiles(next);
    setPreviews([...(editing?.images || []), ...next.map(URL.createObjectURL)]);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return setMessage('המכשיר אינו תומך בזיהוי מיקום.');
    setLocating(true); setMessage('');
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude: lat, longitude: lng } = position.coords;
      setCoords({ lat, lng });
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=he`);
        const data = await response.json();
        setLocationName(data.name || data.address?.town || data.address?.city || data.display_name?.split(',').slice(0, 2).join(', ') || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      } catch {
        setLocationName(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      } finally { setLocating(false); }
    }, error => {
      setLocating(false);
      setMessage(error.code === 1 ? 'יש לאשר לאתר גישה למיקום.' : 'לא הצלחנו לזהות את המיקום. נסו שוב במקום פתוח.');
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  };

  const toggleDictation = () => {
    if (!SpeechRecognition) return setMessage('הכתבה קולית אינה נתמכת בדפדפן הזה. מומלץ להשתמש ב‑Chrome באנדרואיד או במחשב.');
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'he-IL';
    recognition.continuous = true;
    recognition.interimResults = true;
    let finalText = '';
    recognition.onresult = event => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalText += `${event.results[i][0].transcript} `;
        else interim += event.results[i][0].transcript;
      }
      setBody(current => {
        const clean = current.replace(/\s*\[מקשיב:.*\]$/, '');
        return `${clean}${finalText}${interim ? ` [מקשיב: ${interim}]` : ''}`;
      });
      finalText = '';
    };
    recognition.onerror = () => { setListening(false); setMessage('ההכתבה הופסקה. בדקו שהמיקרופון מאושר ונסו שוב.'); };
    recognition.onend = () => { setListening(false); setBody(current => current.replace(/\s*\[מקשיב:.*\]$/, '')); };
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const submit = async event => {
    event.preventDefault();
    if (!author.trim()) return setMessage('כתבו מי מוסיף את הסיפור.');
    if (!title.trim() && !body.trim() && !files.length && !editing?.images?.length) return setMessage('הוסיפו תמונה, כותרת או הסבר.');
    if (!editing && !files.length) return setMessage('מומלץ לצרף לפחות תמונה אחת ליומן המסע.');
    setBusy(true); setMessage('');
    localStorage.setItem('storyAuthor', author.trim());
    const day = days.find(d => d.date === dayKey);
    const payload = {
      author: author.trim(), title: title.trim(), body: body.trim(), dayKey,
      dayTitle: day?.title || '', locationName: locationName.trim(),
      lat: coords.lat, lng: coords.lng, visitDate: new Date(visitDate).toISOString()
    };
    try {
      if (editing) await updateStory(editing, payload);
      else await createStory(payload, files);
      setTitle(''); setBody(''); setLocationName(''); setCoords({ lat: null, lng: null });
      setFiles([]); setPreviews([]); setVisitDate(toLocalDateTimeValue());
      inputRef.current && (inputRef.current.value = '');
      onSaved();
    } catch (error) {
      setMessage(`לא הצלחנו לשמור: ${error.message}`);
    } finally { setBusy(false); }
  };

  return <form className="storyComposer" onSubmit={submit}>
    <div className="composerHeader"><div><span className="eyebrow">{editing ? 'עריכת סיפור' : 'רגע חדש מהטיול'}</span><h3>{editing ? 'עדכון הרשומה' : 'הוסיפו תמונה וסיפור'}</h3></div><span className={`syncBadge ${storyMode}`}>{cloudConfigured ? '☁️ מסונכרן למשפחה' : '📱 נשמר במכשיר'}</span></div>
    <div className="composerGrid">
      <label><span>מי מוסיף?</span><input value={author} onChange={e => setAuthor(e.target.value)} placeholder="לדוגמה: יוסי, יסמית, סיון…" /></label>
      <label><span>יום בטיול</span><select value={dayKey} onChange={e => setDayKey(e.target.value)}>{days.map(day => <option key={day.date} value={day.date}>{day.date} · {day.title}</option>)}</select></label>
      <label><span>תאריך ושעה</span><input type="datetime-local" value={visitDate} onChange={e => setVisitDate(e.target.value)} /></label>
      <label className="locationField"><span>מיקום</span><div><input value={locationName} onChange={e => setLocationName(e.target.value)} placeholder="שם המקום" /><button type="button" className="softButton" onClick={detectLocation} disabled={locating}>{locating ? 'מזהה…' : '⌖ זיהוי מיקום'}</button></div></label>
    </div>
    <label className="wideField"><span>כותרת</span><input value={title} onChange={e => setTitle(e.target.value)} placeholder="לדוגמה: השקיעה הראשונה שלנו בסורנטו" /></label>
    <label className="wideField"><span>הסיפור שלנו</span><textarea value={body} onChange={e => setBody(e.target.value)} rows="5" placeholder="מה ראינו? מה היה מצחיק? מה הילדים אהבו? טיפ שנרצה לזכור…" /></label>
    <div className="composerActions">
      <button type="button" className={`softButton voiceButton ${listening ? 'recording' : ''}`} onClick={toggleDictation}>{listening ? '■ עצירת הכתבה' : '🎙️ הכתבה קולית'}</button>
      {!editing && <label className="softButton fileButton">📷 צילום / הוספת תמונות<input ref={inputRef} type="file" accept="image/*" capture="environment" multiple onChange={chooseFiles} /></label>}
      <small>עד 6 תמונות. התמונות מוקטנות אוטומטית כדי לחסוך נפח.</small>
    </div>
    {previews.length > 0 && <div className="storyPreviewGrid">{previews.map((src, i) => <figure key={`${src}-${i}`}><img src={src} alt="תצוגה מקדימה" /><button type="button" onClick={() => removeNewPhoto(i)}>×</button></figure>)}</div>}
    {coords.lat && <div className="coordsNote">📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</div>}
    {message && <p className="formMessage">{message}</p>}
    <div className="submitRow"><button className="button storySave" disabled={busy}>{busy ? 'שומר…' : editing ? 'שמירת שינויים' : 'הוספה ל־Story Line'}</button>{editing && <button type="button" className="button cancelButton" onClick={onCancel}>ביטול</button>}</div>
  </form>;
}

function StoryGallery({ images, onOpen }) {
  if (!images?.length) return null;
  return <div className={`storyPhotos count-${Math.min(images.length, 4)}`}>{images.slice(0, 4).map((src, i) => <button key={src} onClick={() => onOpen(i)}><img loading="lazy" src={src} alt="תמונה מיומן הטיול" />{i === 3 && images.length > 4 && <span>+{images.length - 4}</span>}</button>)}</div>;
}

function StoryCard({ story, onEdit, onDelete, onOpenImages }) {
  const speak = () => {
    if (!('speechSynthesis' in window)) return alert('הקראת טקסט אינה נתמכת במכשיר הזה.');
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance([story.title, story.body].filter(Boolean).join('. '));
    utterance.lang = 'he-IL'; utterance.rate = .95;
    speechSynthesis.speak(utterance);
  };
  const mapUrl = story.lat && story.lng ? `https://www.google.com/maps/search/?api=1&query=${story.lat},${story.lng}` : '';
  return <article className="storyCard">
    <div className="storyRail"><span /></div>
    <div className="storyCardInner">
      <div className="storyMeta"><div className="storyAvatar">{story.author?.trim()?.[0] || '♥'}</div><div><b>{story.author || 'המשפחה'}</b><small>{new Date(story.visitDate).toLocaleString('he-IL', { dateStyle: 'medium', timeStyle: 'short' })}</small></div><span className="dayStoryBadge">{story.dayKey} · {story.dayTitle}</span></div>
      <StoryGallery images={story.images} onOpen={onOpenImages} />
      <div className="storyText">{story.title && <h3>{story.title}</h3>}{story.body && <p>{story.body}</p>}</div>
      {(story.locationName || mapUrl) && <div className="storyLocation">📍 {mapUrl ? <a target="_blank" rel="noreferrer" href={mapUrl}>{story.locationName || 'פתיחה במפה'}</a> : story.locationName}</div>}
      <div className="storyCardActions">{story.body && <button onClick={speak}>🔊 הקראה</button>}{story.mine && <button onClick={onEdit}>✎ עריכה</button>}{story.mine && <button className="dangerText" onClick={onDelete}>⌫ מחיקה</button>}</div>
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

export default function Storyline({ days }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');
  const [dayFilter, setDayFilter] = useState('all');
  const [sort, setSort] = useState('desc');
  const [lightbox, setLightbox] = useState(null);
  const importRef = useRef(null);

  const refresh = async () => {
    setLoading(true); setError('');
    try { setStories(await loadStories(localStorage.getItem('storyAuthor') || '')); }
    catch (e) { setError(`שגיאת סנכרון: ${e.message}`); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    refresh();
    const unsubscribe = subscribeStories(() => refresh());
    return unsubscribe;
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stories.filter(s => (dayFilter === 'all' || s.dayKey === dayFilter) && (!q || [s.author, s.title, s.body, s.locationName, s.dayTitle].join(' ').toLowerCase().includes(q)))
      .sort((a, b) => (new Date(a.visitDate) - new Date(b.visitDate)) * (sort === 'asc' ? 1 : -1));
  }, [stories, query, dayFilter, sort]);

  const remove = async story => {
    if (!confirm('למחוק את הסיפור והתמונות שלו?')) return;
    try { await deleteStory(story); await refresh(); }
    catch (e) { setError(`לא הצלחנו למחוק: ${e.message}`); }
  };

  const importJson = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const json = JSON.parse(await file.text());
      await importLocalStories(json.stories || []);
      await refresh();
    } catch (e) { setError(`ייבוא נכשל: ${e.message}`); }
    event.target.value = '';
  };

  const moveLightbox = direction => {
    setLightbox(current => current ? { ...current, index: (current.index + direction + current.story.images.length) % current.story.images.length } : current);
  };

  return <section className="storySection" id="storyContent"><div className="container section">
    <div className="sectionHead storyHead"><div><span className="eyebrow">הבלוג המשפחתי שלנו</span><h2>Story Line של הטיול</h2></div><div><p>תמונות, מיקום, סיפורים והקראה — כל הזיכרונות מצטברים לציר זמן אחד.</p><button className="button addStoryButton" onClick={() => { setEditing(null); setShowComposer(true); }}>＋ הוספת רגע</button></div></div>
    {!cloudConfigured && <div className="storyModeNotice"><b>מצב מקומי פעיל:</b> היומן נשמר כרגע במכשיר הזה. כדי שכל המשפחה תראה ותוסיף מכל טלפון, חברו Supabase לפי <a target="_blank" rel="noreferrer" href="/STORYLINE_SETUP_HE.md">הוראות ההפעלה המצורפות</a>.</div>}
    {cloudConfigured && <div className="storyModeNotice cloudNotice"><b>סנכרון משפחתי פעיל:</b> כל רשומה חדשה תופיע אצל בני המשפחה בזמן אמת.</div>}

    {(showComposer || editing) && <StoryComposer days={days} editing={editing} onCancel={() => { setEditing(null); setShowComposer(false); }} onSaved={async () => { setEditing(null); setShowComposer(false); await refresh(); }} />}

    <div className="storyToolbar">
      <div className="storySearch">⌕<input value={query} onChange={e => setQuery(e.target.value)} placeholder="חיפוש בסיפורים, מיקום או שם…" /></div>
      <select value={dayFilter} onChange={e => setDayFilter(e.target.value)}><option value="all">כל הימים</option>{days.map(day => <option key={day.date} value={day.date}>{day.date} · {day.title}</option>)}</select>
      <button className="softButton" onClick={() => setSort(sort === 'desc' ? 'asc' : 'desc')}>{sort === 'desc' ? '↓ החדש קודם' : '↑ מההתחלה'}</button>
      <button className="softButton" onClick={() => exportStories(stories)}>⇩ גיבוי JSON</button>
      {!cloudConfigured && <><button className="softButton" onClick={() => importRef.current?.click()}>⇧ שחזור</button><input ref={importRef} hidden type="file" accept="application/json" onChange={importJson} /></>}
    </div>

    {error && <div className="storyError">{error}</div>}
    {loading ? <div className="storyEmpty">טוען את יומן המסע…</div> : visible.length ? <div className="storyTimeline">{visible.map(story => <StoryCard key={story.id} story={story} onEdit={() => { setEditing(story); setShowComposer(true); }} onDelete={() => remove(story)} onOpenImages={index => setLightbox({ story, index })} />)}</div> : <div className="storyEmpty"><span>📷</span><h3>הסיפור הראשון עדיין מחכה לכם</h3><p>הוסיפו תמונה, הפעילו זיהוי מיקום וספרו מה קרה באותו רגע.</p><button className="button addStoryButton" onClick={() => setShowComposer(true)}>הוספת הסיפור הראשון</button></div>}
  </div>
  <Lightbox story={lightbox?.story} index={lightbox?.index || 0} onClose={() => setLightbox(null)} onMove={moveLightbox} />
  </section>;
}
