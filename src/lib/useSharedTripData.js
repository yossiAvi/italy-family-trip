import { useEffect, useRef, useState } from 'react';
import { loadSharedValue, saveSharedValue, sharedCloudConfigured, subscribeSharedValue } from './sharedStore.js';

export default function useSharedTripData(key, initialValue, legacyLoader=null) {
  const cacheKey=`tripSharedCache:${key}`;
  const [value,setValue]=useState(()=>{
    try{const cached=localStorage.getItem(cacheKey);if(cached!==null)return JSON.parse(cached);}
    catch{}
    try{const legacy=legacyLoader?.();if(legacy!==undefined&&legacy!==null)return legacy;}catch{}
    return typeof initialValue==='function'?initialValue():initialValue;
  });
  const [syncState,setSyncState]=useState(sharedCloudConfigured?'loading':'local');
  const loaded=useRef(false), timer=useRef(null), valueRef=useRef(value);
  useEffect(()=>{valueRef.current=value},[value]);

  useEffect(()=>{
    let active=true;
    let unsub=()=>{};
    const init=async()=>{
      if(!sharedCloudConfigured){loaded.current=true;return;}
      try{
        const row=await loadSharedValue(key);
        if(!active)return;
        if(row){setValue(row.value);localStorage.setItem(cacheKey,JSON.stringify(row.value));}
        else await saveSharedValue(key,valueRef.current);
        loaded.current=true;setSyncState('synced');
        unsub=subscribeSharedValue(key,next=>{if(!active)return;setValue(next);localStorage.setItem(cacheKey,JSON.stringify(next));setSyncState('synced')});
      }catch(e){console.warn('Shared data load failed',key,e);loaded.current=true;setSyncState('error');}
    };
    init();
    return()=>{active=false;unsub();clearTimeout(timer.current)};
  },[key,cacheKey]);

  const update=next=>setValue(old=>{
    const resolved=typeof next==='function'?next(old):next;
    localStorage.setItem(cacheKey,JSON.stringify(resolved));
    if(sharedCloudConfigured&&loaded.current){
      setSyncState('saving');clearTimeout(timer.current);
      timer.current=setTimeout(()=>saveSharedValue(key,resolved).then(()=>setSyncState('synced')).catch(()=>setSyncState('error')),350);
    }
    return resolved;
  });
  return [value,update,syncState];
}
