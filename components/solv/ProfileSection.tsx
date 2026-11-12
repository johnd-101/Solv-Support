'use client'
export function ProfileSection({ isDark, currentUser, users, userProfile, profileForm, setProfileForm, avatarOptions, saveProfile, setShowProfile, kpiCard, cardCls, setConfirmDelete, deleteProfile, deleteProfileUser, logs, practices, appointments, setTab }: any){
  const stats = [
    { label: 'Logs Created', value: logs?.length || 0, icon: '📋', color: '#0ea5e9' },
    { label: 'Practices', value: practices?.length || 0, icon: '🏥', color: '#8b5cf6' },
    { label: 'Appointments', value: appointments?.length || 0, icon: '📅', color: '#10b981' },
  ]

  const displayUser = currentUser || userProfile

  if(!displayUser){
    return (
      <div className="space-y-4">
        <div className={`${kpiCard} text-center py-12`}>
          <div className="text-5xl mb-4">👤</div>
          <h3 className="font-black text-lg">No Profile Selected</h3>
          <p className="text-sm text-slate-500 mt-2">Please login with your user account</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className={kpiCard}>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-3xl shadow-lg">{displayUser.avatar || '👨‍💼'}</div>
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] ${isDark?'bg-[#23395f] border-[#1a2f4f]':'bg-white border-white'}`}>✓</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="font-black text-xl truncate">{displayUser.name}</h2>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${isDark?'bg-[#1a2f4f] text-blue-300':'bg-blue-50 text-blue-700'}`}>{displayUser.role}</span>
            </div>
            <div className="text-sm text-slate-500 mt-1">{displayUser.department} • {displayUser.email}</div>
            {displayUser.phone && <div className="text-sm text-slate-500">{displayUser.phone}</div>}
            {displayUser.bio && <div className={`mt-3 p-3 rounded-xl text-sm ${isDark?'bg-[#1a2f4f]':'bg-blue-50/50'}`}>{displayUser.bio}</div>}
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={()=>{ setProfileForm(displayUser); setShowProfile(true)}} className={`h-9 px-4 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${isDark?'bg-[#1a2f4f] border-slate-600 text-blue-300 hover:bg-[#23395f]':'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'}`}>✏️ Edit My Profile</button>
              <button onClick={()=>setConfirmDelete({type:'user', id:displayUser.id, name:displayUser.name})} className={`h-9 px-4 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${isDark?'bg-[#1a2f4f] border-red-900/40 text-red-400 hover:bg-red-950/30':'bg-white border-red-200 text-red-600 hover:bg-red-50'}`}>🗑️ Delete My Account</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((s:any)=>(
          <div key={s.label} className={`${kpiCard} flex items-center gap-3`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{background: `${s.color}20`, color: s.color}}>{s.icon}</div>
            <div><div className="text-[10px] uppercase font-bold text-slate-400">{s.label}</div><div className="font-black text-lg">{s.value}</div></div>
          </div>
        ))}
      </div>

      <div className={kpiCard}>
        <h3 className="font-bold text-sm mb-3">My Profile Details</h3>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-3 gap-3"><span className="text-slate-500 text-xs uppercase font-bold">Name</span><span className="col-span-2 font-bold">{displayUser.name}</span></div>
          <div className="grid grid-cols-3 gap-3"><span className="text-slate-500 text-xs uppercase font-bold">Email</span><span className="col-span-2">{displayUser.email}</span></div>
          <div className="grid grid-cols-3 gap-3"><span className="text-slate-500 text-xs uppercase font-bold">Phone</span><span className="col-span-2">{displayUser.phone || '—'}</span></div>
          <div className="grid grid-cols-3 gap-3"><span className="text-slate-500 text-xs uppercase font-bold">Role</span><span className="col-span-2">{displayUser.role}</span></div>
          <div className="grid grid-cols-3 gap-3"><span className="text-slate-500 text-xs uppercase font-bold">Department</span><span className="col-span-2">{displayUser.department}</span></div>
          <div className="grid grid-cols-3 gap-3"><span className="text-slate-500 text-xs uppercase font-bold">Member Since</span><span className="col-span-2 text-xs">{new Date(displayUser.createdAt).toLocaleDateString()}</span></div>
          <div className="grid grid-cols-3 gap-3"><span className="text-slate-500 text-xs uppercase font-bold">Last Login</span><span className="col-span-2 text-xs">{displayUser.lastLogin ? new Date(displayUser.lastLogin).toLocaleString() : '—'}</span></div>
        </div>
      </div>

      <div className={kpiCard}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm">All Users ({users.length}) - Each has own login</h3>
          <button onClick={()=>{ setProfileForm({ id: '', name: '', email: '', password: '', phone: '', role: 'Field Technician', department: 'Solv Optics', bio: '', avatar: '👨‍💼', createdAt: '', updatedAt: '' }); setShowProfile(true)}} className="h-8 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold">+ New User</button>
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {users.map((u:any)=>(
            <div key={u.id} className={`flex items-center gap-3 p-3 rounded-xl border ${u.id===currentUser?.id ? 'border-blue-600 bg-blue-50/50' : isDark?'border-slate-600/50':'border-blue-100'}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white">{u.avatar}</div>
              <div className="flex-1 min-w-0"><div className="font-bold text-sm truncate">{u.name} {u.id===currentUser?.id && <span className="text-blue-600 text-xs">(You)</span>}</div><div className="text-xs text-slate-500 truncate">{u.email} • {u.role} • {u.department}</div></div>
              <div className="flex gap-1">
                <button onClick={()=>{ setProfileForm(u); setShowProfile(true)}} className={`w-8 h-8 rounded-lg text-xs border flex items-center justify-center ${isDark?'bg-[#1a2f4f] border-slate-600 text-blue-300':'bg-white border-blue-200 text-blue-600'}`}>✏️</button>
                <button onClick={()=>setConfirmDelete({type:'user', id:u.id, name:u.name})} className={`w-8 h-8 rounded-lg text-xs border flex items-center justify-center ${isDark?'bg-[#1a2f4f] border-red-900/40 text-red-400':'bg-white border-red-200 text-red-600'}`}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProfileModal({ isDark, modalBg, inputCls, showProfile, setShowProfile, profileForm, setProfileForm, avatarOptions, saveProfile, currentUser }: any){
  if(!showProfile) return null
  const isEditingOwn = currentUser && profileForm.id === currentUser.id
  const isNew = !profileForm.id
  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-slate-900/20 backdrop-blur-sm p-0 sm:p-4">
      <div className={`w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${modalBg}`}>
        <div className="flex justify-between items-center"><h2 className="font-bold text-sm">{isNew ? 'Create New User' : `Edit ${isEditingOwn ? 'My Profile' : 'User'}`}</h2><button onClick={()=>setShowProfile(false)} className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark?'bg-[#1a2f4f]':'bg-blue-50'}`}>✕</button></div>
        
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500">Avatar</label>
            <div className="grid grid-cols-8 gap-2 mt-2">
              {avatarOptions.map((a:string)=>(
                <button key={a} onClick={()=>setProfileForm({...profileForm, avatar:a})} className={`w-10 h-10 rounded-xl text-lg border-2 transition-all ${profileForm.avatar===a ? 'border-blue-600 bg-blue-50 scale-110' : isDark?'border-slate-600 bg-[#1a2f4f]':'border-blue-100 bg-white'}`}>{a}</button>
              ))}
            </div>
          </div>

          <input value={profileForm.name} onChange={e=>setProfileForm({...profileForm, name:e.target.value})} placeholder="Full Name *" className={`h-11 w-full rounded-xl border px-4 text-sm ${inputCls}`} />
          <input value={profileForm.email} onChange={e=>setProfileForm({...profileForm, email:e.target.value})} placeholder="Email *" type="email" className={`h-11 w-full rounded-xl border px-4 text-sm ${inputCls}`} />
          <input value={profileForm.password} onChange={e=>setProfileForm({...profileForm, password:e.target.value})} placeholder={isNew ? "Password *" : "Password (leave blank to keep)"} type="password" className={`h-11 w-full rounded-xl border px-4 text-sm ${inputCls}`} />
          <input value={profileForm.phone} onChange={e=>setProfileForm({...profileForm, phone:e.target.value})} placeholder="Phone" className={`h-11 w-full rounded-xl border px-4 text-sm ${inputCls}`} />
          
          <div className="grid grid-cols-2 gap-3">
            <select value={profileForm.role} onChange={e=>setProfileForm({...profileForm, role:e.target.value})} className={`h-11 rounded-xl border px-4 text-sm ${inputCls}`}>
              <option>Field Technician</option><option>Senior Technician</option><option>Support Engineer</option><option>Sales Rep</option><option>Manager</option><option>Admin</option><option>Other</option>
            </select>
            <select value={profileForm.department} onChange={e=>setProfileForm({...profileForm, department:e.target.value})} className={`h-11 rounded-xl border px-4 text-sm ${inputCls}`}>
              <option>Solv Optics</option><option>Solv Physio</option><option>Solv Meds</option><option>Solv Dental</option><option>Operations</option><option>Support</option>
            </select>
          </div>

          <textarea value={profileForm.bio} onChange={e=>setProfileForm({...profileForm, bio:e.target.value})} placeholder="Bio / Notes" rows={3} className={`w-full rounded-xl border p-4 text-sm ${inputCls}`} />
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={()=>setShowProfile(false)} className={`flex-1 h-11 rounded-xl font-bold text-sm ${isDark?'bg-[#1a2f4f]':'bg-slate-100'}`}>Cancel</button>
          <button onClick={saveProfile} className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm">{isNew ? 'Create User' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  )
}
