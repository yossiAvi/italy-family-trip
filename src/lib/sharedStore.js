import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const TRIP_ID = import.meta.env.VITE_TRIP_ID || 'italy-family-trip-2026';
const SHARED_BUCKET = import.meta.env.VITE_SHARED_BUCKET || 'trip-shared-files';

export const sharedCloudConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const client = sharedCloudConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
}) : null;

async function ensureSession() {
  if (!client) return null;
  const { data } = await client.auth.getSession();
  if (data.session?.user) return data.session.user;
  const result = await client.auth.signInAnonymously();
  if (result.error) throw result.error;
  return result.data.user;
}

export async function loadSharedValue(key) {
  if (!client) return null;
  await ensureSession();
  const { data, error } = await client.from('trip_shared_data').select('value,updated_at').eq('trip_id', TRIP_ID).eq('data_key', key).maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function saveSharedValue(key, value) {
  if (!client) return;
  const user = await ensureSession();
  const { error } = await client.from('trip_shared_data').upsert({
    trip_id: TRIP_ID,
    data_key: key,
    value,
    updated_by: user.id,
    updated_at: new Date().toISOString()
  }, { onConflict: 'trip_id,data_key' });
  if (error) throw error;
}

export function subscribeSharedValue(key, onChange) {
  if (!client) return () => {};
  const channel = client.channel(`shared-${TRIP_ID}-${key}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'trip_shared_data', filter: `trip_id=eq.${TRIP_ID}` }, payload => {
      if (payload.new?.data_key === key) onChange(payload.new.value);
    }).subscribe();
  return () => client.removeChannel(channel);
}

export async function uploadSharedImage(file, folder='general') {
  if (!client || !file) return null;
  const user = await ensureSession();
  const ext=(file.name?.split('.').pop()||'jpg').replace(/[^a-z0-9]/gi,'').toLowerCase();
  const path=`${TRIP_ID}/${folder}/${user.id}-${crypto.randomUUID()}.${ext}`;
  const { error }=await client.storage.from(SHARED_BUCKET).upload(path,file,{cacheControl:'31536000',upsert:false,contentType:file.type||'image/jpeg'});
  if(error) throw error;
  return client.storage.from(SHARED_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function exportAllSharedData() {
  if (!client) return null;
  await ensureSession();
  const { data,error }=await client.from('trip_shared_data').select('data_key,value,updated_at').eq('trip_id',TRIP_ID).order('data_key');
  if(error)throw error;
  return {version:2,tripId:TRIP_ID,exportedAt:new Date().toISOString(),shared:Object.fromEntries((data||[]).map(row=>[row.data_key,row.value]))};
}

export async function importAllSharedData(shared={}) {
  if (!client) return;
  const user=await ensureSession();
  const rows=Object.entries(shared).map(([data_key,value])=>({trip_id:TRIP_ID,data_key,value,updated_by:user.id,updated_at:new Date().toISOString()}));
  if(!rows.length)return;
  const {error}=await client.from('trip_shared_data').upsert(rows,{onConflict:'trip_id,data_key'});
  if(error)throw error;
}

export async function listLiveLocations() {
  if (!client) return [];
  await ensureSession();
  const { data, error } = await client.from('family_live_locations')
    .select('*').eq('trip_id', TRIP_ID).order('member_name');
  if (error) throw error;
  return data || [];
}

export async function upsertLiveLocation(location) {
  if (!client) return;
  const user = await ensureSession();
  const { error } = await client.from('family_live_locations').upsert({
    trip_id: TRIP_ID,
    member_id: location.memberId,
    member_name: location.memberName,
    avatar: location.avatar || '📍',
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: location.accuracy || null,
    sharing: true,
    updated_by: user.id,
    updated_at: new Date().toISOString()
  }, { onConflict: 'trip_id,member_id' });
  if (error) throw error;
}

export async function stopLiveLocation(memberId, remove=false) {
  if (!client) return;
  await ensureSession();
  const query = client.from('family_live_locations');
  const result = remove
    ? await query.delete().eq('trip_id', TRIP_ID).eq('member_id', memberId)
    : await query.update({ sharing:false, updated_at:new Date().toISOString() }).eq('trip_id',TRIP_ID).eq('member_id',memberId);
  if (result.error) throw result.error;
}

export function subscribeLiveLocations(onChange) {
  if (!client) return () => {};
  const channel = client.channel(`live-locations-${TRIP_ID}`)
    .on('postgres_changes', { event:'*', schema:'public', table:'family_live_locations', filter:`trip_id=eq.${TRIP_ID}` }, () => onChange())
    .subscribe();
  return () => client.removeChannel(channel);
}
