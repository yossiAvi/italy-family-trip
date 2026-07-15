import { createClient } from '@supabase/supabase-js';

const DB_NAME = 'italy-family-trip-storyline';
const STORE_NAME = 'stories';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const TRIP_ID = import.meta.env.VITE_TRIP_ID || 'italy-family-trip-2026';
const BUCKET = import.meta.env.VITE_STORY_BUCKET || 'trip-story-images';

export const cloudConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const storyMode = cloudConfigured ? 'cloud' : 'local';

const supabase = cloudConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
}) : null;

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('visitDate', 'visitDate');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function localGetAll() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function localPut(story) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(story);
    tx.oncomplete = () => resolve(story);
    tx.onerror = () => reject(tx.error);
  });
}

async function localDelete(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function ensureCloudSession(author) {
  if (!supabase) return null;
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session?.user) return sessionData.session.user;
  const { data, error } = await supabase.auth.signInAnonymously({ options: { data: { author } } });
  if (error) throw error;
  return data.user;
}

async function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function safeFilename(name = 'photo.jpg') {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'photo.jpg';
}

async function uploadCloudImages(files, userId, storyId) {
  const images = [];
  const imagePaths = [];
  for (const file of files) {
    const path = `${userId}/${storyId}/${crypto.randomUUID()}-${safeFilename(file.name)}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '31536000', upsert: false, contentType: file.type || 'image/jpeg'
    });
    if (error) throw error;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    images.push(data.publicUrl);
    imagePaths.push(path);
  }
  return { images, imagePaths };
}

function normalizeCloud(row) {
  return {
    id: row.id,
    tripId: row.trip_id,
    userId: row.user_id,
    author: row.author,
    title: row.title || '',
    body: row.body || '',
    dayKey: row.day_key || '',
    dayTitle: row.day_title || '',
    locationName: row.location_name || '',
    lat: row.lat,
    lng: row.lng,
    visitDate: row.visit_date,
    images: row.images || [],
    imagePaths: row.image_paths || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    mine: row.mine
  };
}

export async function getCurrentUserId(author = '') {
  if (!cloudConfigured) return 'local-user';
  const user = await ensureCloudSession(author);
  return user.id;
}

export async function loadStories(author = '') {
  if (!cloudConfigured) {
    const stories = await localGetAll();
    return stories.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
  }
  const user = await ensureCloudSession(author);
  const { data, error } = await supabase
    .from('trip_stories')
    .select('*')
    .eq('trip_id', TRIP_ID)
    .order('visit_date', { ascending: false });
  if (error) throw error;
  return (data || []).map(row => ({ ...normalizeCloud(row), mine: row.user_id === user.id }));
}

export async function createStory(input, imageFiles = []) {
  const storyId = crypto.randomUUID();
  const now = new Date().toISOString();
  if (!cloudConfigured) {
    const images = await Promise.all(imageFiles.map(blobToDataUrl));
    const story = {
      ...input,
      id: storyId,
      tripId: TRIP_ID,
      userId: 'local-user',
      images,
      imagePaths: [],
      createdAt: now,
      updatedAt: now,
      mine: true
    };
    await localPut(story);
    return story;
  }

  const user = await ensureCloudSession(input.author);
  const uploaded = await uploadCloudImages(imageFiles, user.id, storyId);
  const row = {
    id: storyId,
    trip_id: TRIP_ID,
    user_id: user.id,
    author: input.author,
    title: input.title,
    body: input.body,
    day_key: input.dayKey,
    day_title: input.dayTitle,
    location_name: input.locationName,
    lat: input.lat,
    lng: input.lng,
    visit_date: input.visitDate,
    images: uploaded.images,
    image_paths: uploaded.imagePaths
  };
  const { data, error } = await supabase.from('trip_stories').insert(row).select().single();
  if (error) {
    if (uploaded.imagePaths.length) await supabase.storage.from(BUCKET).remove(uploaded.imagePaths);
    throw error;
  }
  return { ...normalizeCloud(data), mine: true };
}

export async function updateStory(story, changes) {
  const updatedAt = new Date().toISOString();
  if (!cloudConfigured) {
    const next = { ...story, ...changes, updatedAt };
    await localPut(next);
    return next;
  }
  const payload = {
    author: changes.author,
    title: changes.title,
    body: changes.body,
    day_key: changes.dayKey,
    day_title: changes.dayTitle,
    location_name: changes.locationName,
    lat: changes.lat,
    lng: changes.lng,
    visit_date: changes.visitDate,
    updated_at: updatedAt
  };
  const { data, error } = await supabase.from('trip_stories').update(payload).eq('id', story.id).select().single();
  if (error) throw error;
  return { ...normalizeCloud(data), mine: true };
}

export async function deleteStory(story) {
  if (!cloudConfigured) return localDelete(story.id);
  if (story.imagePaths?.length) await supabase.storage.from(BUCKET).remove(story.imagePaths);
  const { error } = await supabase.from('trip_stories').delete().eq('id', story.id);
  if (error) throw error;
}

export function subscribeStories(onChange) {
  if (!cloudConfigured) return () => {};
  const channel = supabase
    .channel(`trip-stories-${TRIP_ID}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'trip_stories', filter: `trip_id=eq.${TRIP_ID}` }, onChange)
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export async function importLocalStories(stories) {
  if (cloudConfigured) throw new Error('ייבוא JSON זמין במצב המקומי בלבד.');
  for (const story of stories) await localPut({ ...story, id: story.id || crypto.randomUUID(), mine: true });
  return loadStories();
}

export function exportStories(stories) {
  const blob = new Blob([JSON.stringify({ version: 1, tripId: TRIP_ID, exportedAt: new Date().toISOString(), stories }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `italy-trip-storyline-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
