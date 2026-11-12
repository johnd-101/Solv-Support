'use client'
import { LOGO_PATH } from '@/lib/solv/constants'
export function HeaderBar({ isDark, setTheme, setIsLoggedIn, practices, logs, appointments, loading, search, setSearch, fetchError, fetchAll, headerCls, inputCls, logoError, setLogoError, userProfile, currentUser, setShowProfile, setTab, handleLogout, switchUser }: any){
  return (
    <header className={`sticky top-0 z-10 backdrop-blur-xl border-b ${headerCls}`}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 h-14 flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          {!logoError? <div className="p-[1.5px] rounded-full bg-gradient-to-br from-blue-600 to-violet-600"><img src={LOGO_PATH} alt="Logo" onError={()=>setLogoError(true)} className="h-8 w-8 rounded-full bg-white p-1 object-contain" /></div> : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white">👁</div>}
          <div className="font-black text-sm bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">SOLV</div>
          <div className={`hidden lg:flex ml-2 text-xs font-bold px-3 py-1 rounded-full border ${isDark?'bg-[#1a2f4f] border-slate-600 text-slate-300':'bg-blue-50 border-blue-200 text-blue-800'}`}>{loading?'Loading…':`${practices.length} • ${logs.length} • ${appointments.length}`}</div>
          {currentUser && <div className={`hidden sm:flex ml-2 text-xs font-bold px-3 py-1 rounded-full border items-center gap-1.5 ${isDark?'bg-[#1a2f4f] border-slate-600 text-slate-300':'bg-white border-blue-200 text-blue-800'}`}><span>{currentUser.avatar}</span>{currentUser.name}</div>}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={()=>{ setTab('profile'); }} className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg ${isDark?'bg-[#23395f] border-slate-600':'bg-white border-blue-200'}`} title={currentUser?.name || 'Profile'}>{currentUser?.avatar || '👤'}</button>
          <button onClick={()=>setTheme(isDark?'light':'dark')} className={`w-10 h-10 rounded-xl border flex items-center justify-center ${isDark?'bg-[#23395f] border-slate-600 text-yellow-400':'bg-white border-blue-200'}`}>{isDark ? '☀' : '🌙'}</button>
          <button onClick={handleLogout} className={`w-10 h-10 rounded-xl border flex items-center justify-center ${isDark?'bg-[#23395f] border-slate-600':'bg-white border-blue-200'}`} title="Logout / Switch User">↪</button>
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-3 pt-1">
        <div className="relative"><span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600 text-sm">⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search practices, logs, appointments..." className={`w-full h-11 rounded-xl pl-10 pr-4 text-sm border ${inputCls}`} /></div>
        {fetchError && <div className="mt-2 text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex justify-between items-center">{fetchError} <button onClick={fetchAll} className="ml-3 px-3 py-1 rounded-full bg-blue-700 text-white">Retry</button></div>}
      </div>
    </header>
  )
}
