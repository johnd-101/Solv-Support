'use client'
import { LOGO_PATH } from '@/lib/solv/constants'
export function AuthView({ isDark, setTheme, pass, setPass, showPass, setShowPass, isLocked, countdown, showErrorPopup, setShowErrorPopup, errorMsg, shake, logoError, setLogoError, handleLogin, modalBg, users, selectedLoginUser, setSelectedLoginUser, authMode, setAuthMode, profileForm, setProfileForm, avatarOptions, handleCreateUser }: any){
  const isCreateMode = authMode==='create' || authMode==='createFirst'
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 ${isDark ? 'bg-[#1a2f4f]' : 'bg-gradient-to-br from-[#dbeafe] via-[#bfdbfe] to-[#1e40af]'}`}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}`}</style>
      <div className={`relative w-full max-w-md rounded-3xl p-[1.5px] ${shake? 'animate-[shake_0.4s_ease]' : ''}`}>
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-700 opacity-90" />
        <div className={`relative w-full rounded-3xl p-7 sm:p-8 ${isDark ? 'bg-[#223a5f]' : 'bg-white'}`}>
          <div className="text-center">
            {!logoError? <img src={LOGO_PATH} alt="Logo" onError={()=>setLogoError(true)} className="h-11 mx-auto mb-3 object-contain" /> : <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white mx-auto mb-3">👁</div>}
            <div className="font-black tracking-[0.18em] text-blue-800 text-sm">SOLV • SECURE</div>
            <div className={`text-xs mt-1 ${isDark?'text-slate-400':'text-slate-500'}`}>{isCreateMode ? (authMode==='createFirst' ? 'Create your first user account' : 'Create new user') : `${users.length} user${users.length!==1?'s':''} registered`}</div>
          </div>

          {isCreateMode ? (
            <div className="mt-6 space-y-3">
              <div className="text-left">
                <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark?'text-slate-300':'text-slate-500'}`}>Avatar</label>
                <div className="grid grid-cols-8 gap-1.5 mt-2">
                  {avatarOptions.map((a:string)=><button key={a} onClick={()=>setProfileForm({...profileForm, avatar:a})} className={`w-8 h-8 rounded-lg text-sm border-2 ${profileForm.avatar===a?'border-blue-600 bg-blue-50 scale-110': isDark?'border-slate-600 bg-[#1a2f4f]':'border-blue-100 bg-white'}`}>{a}</button>)}
                </div>
              </div>
              <input value={profileForm.name} onChange={e=>setProfileForm({...profileForm, name:e.target.value})} placeholder="Full Name *" className={`w-full h-11 rounded-xl border px-4 text-sm ${isDark ? 'bg-[#1a2f4f] border-slate-600 text-white' : 'border-blue-200 bg-blue-50/50'}`} />
              <input value={profileForm.email} onChange={e=>setProfileForm({...profileForm, email:e.target.value})} placeholder="Email *" type="email" className={`w-full h-11 rounded-xl border px-4 text-sm ${isDark ? 'bg-[#1a2f4f] border-slate-600 text-white' : 'border-blue-200 bg-blue-50/50'}`} />
              <div className="relative">
                <input type={showPass?'text':'password'} value={profileForm.password} onChange={e=>setProfileForm({...profileForm, password:e.target.value})} placeholder="Password *" className={`w-full h-11 rounded-xl border px-4 pr-12 text-sm ${isDark ? 'bg-[#1a2f4f] border-slate-600 text-white' : 'border-blue-200 bg-blue-50/50'}`} />
                <button onClick={()=>setShowPass(!showPass)} className="absolute right-1 top-1 w-9 h-9 rounded-lg border text-sm flex items-center justify-center">{showPass?'🙈':'👁'}</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select value={profileForm.role} onChange={e=>setProfileForm({...profileForm, role:e.target.value})} className={`h-11 rounded-xl border px-3 text-xs ${isDark ? 'bg-[#1a2f4f] border-slate-600 text-white' : 'border-blue-200'}`}><option>Field Technician</option><option>Senior Technician</option><option>Support Engineer</option><option>Sales Rep</option><option>Manager</option><option>Admin</option></select>
                <select value={profileForm.department} onChange={e=>setProfileForm({...profileForm, department:e.target.value})} className={`h-11 rounded-xl border px-3 text-xs ${isDark ? 'bg-[#1a2f4f] border-slate-600 text-white' : 'border-blue-200'}`}><option>Solv Optics</option><option>Solv Physio</option><option>Solv Meds</option><option>Solv Dental</option><option>Operations</option><option>Support</option></select>
              </div>
              <button onClick={handleLogin} className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold shadow">{authMode==='createFirst' ? 'Create First User →' : 'Create User →'}</button>
              {authMode!=='createFirst' && <button onClick={()=>{ setAuthMode('login'); setProfileForm({ id: '', name: '', email: '', password: '', phone: '', role: 'Field Technician', department: 'Solv Optics', bio: '', avatar: '👨‍💼', createdAt: '', updatedAt: '' }) }} className={`w-full h-10 rounded-xl text-xs font-bold ${isDark?'bg-[#1a2f4f] text-slate-300 border border-slate-600':'bg-slate-100 text-slate-600'}`}>← Back to Login</button>}
            </div>
          ) : (
            <div className="mt-6">
              {users.length===0 ? (
                <div className="text-center py-6">
                  <div className="text-3xl">👤</div>
                  <div className="text-sm text-slate-500 mt-2">No users yet</div>
                  <button onClick={()=>setAuthMode('createFirst')} className="mt-4 h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold">Create First User</button>
                </div>
              ) : (
                <>
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark?'text-slate-300':'text-slate-500'}`}>Select User to Login</label>
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1">
                    {users.map((u:any)=>(
                      <button key={u.id} onClick={()=>setSelectedLoginUser(u)} className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${selectedLoginUser?.id===u.id ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : isDark?'bg-[#1a2f4f] border-slate-600 hover:border-slate-500':'bg-white border-blue-100 hover:border-blue-200'}`}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-lg">{u.avatar}</div>
                        <div className="flex-1 min-w-0"><div className={`font-bold text-sm truncate ${isDark?'text-white':''}`}>{u.name}</div><div className="text-xs text-slate-500 truncate">{u.email} • {u.role}</div></div>
                        {selectedLoginUser?.id===u.id && <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">✓</div>}
                      </button>
                    ))}
                  </div>

                  {selectedLoginUser && (
                    <div className="mt-4 text-left">
                      <label className={`font-bold uppercase tracking-widest text-[10px] ${isDark?'text-slate-300':'text-slate-500'}`}>Password for {selectedLoginUser.name}</label>
                      <div className="relative mt-2">
                        <input type={showPass?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} placeholder="••••••••" disabled={isLocked} className={`w-full h-11 rounded-xl border pl-4 pr-12 text-sm ${isDark ? 'bg-[#1a2f4f] border-slate-600 text-white' : 'border-blue-200 bg-blue-50/50'}`} />
                        <button onClick={()=>setShowPass(!showPass)} className="absolute right-1 top-1 w-9 h-9 rounded-lg border text-sm flex items-center justify-center">{showPass?'🙈':'👁'}</button>
                      </div>
                    </div>
                  )}

                  <button onClick={handleLogin} disabled={isLocked || !selectedLoginUser} className="w-full h-11 mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold disabled:opacity-50"> {isLocked?`Locked ${countdown}s`:'Login →'} </button>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button onClick={()=>{ setAuthMode('create'); setProfileForm({ id: '', name: '', email: '', password: '', phone: '', role: 'Field Technician', department: 'Solv Optics', bio: '', avatar: '👨‍💼', createdAt: '', updatedAt: '' }) }} className={`h-10 rounded-xl text-xs font-bold border ${isDark?'bg-[#1a2f4f] text-slate-300 border-slate-600':'bg-white border-blue-200 text-blue-700'}`}>+ New User</button>
                    <button onClick={()=>setTheme(isDark?'light':'dark')} className={`h-10 rounded-xl text-xs font-bold border ${isDark?'bg-[#1a2f4f] text-slate-300 border-slate-600':'bg-slate-100 text-slate-600 border-slate-200'}`}>{isDark?'☀ Light':'🌙 Dark'}</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {showErrorPopup && <div className="fixed inset-0 z-[999] bg-slate-900/10 backdrop-blur-sm flex items-center justify-center p-4"><div className={`${modalBg} rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl border`}><div className="text-3xl">🚫</div><h3 className="font-extrabold text-sm mt-3">{errorMsg || 'Incorrect Password'}</h3><div className="text-xs text-slate-500 mt-1">{errorMsg?.includes('Email') ? 'Try another email' : 'Please try again'}</div><button onClick={()=>setShowErrorPopup(false)} className="w-full h-11 mt-5 rounded-xl bg-slate-900 text-white text-sm font-bold">Try Again</button></div></div>}
    </div>
  )
}
