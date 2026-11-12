'use client'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Practice, LogRow, Appointment } from '@/lib/solv/types'
import { PRODUCT_OPTIONS, PRODUCT_COLORS, CHART_PALETTE, EMPTY_PRACTICE, EMPTY_LOG, EMPTY_APPT } from '@/lib/solv/constants'
import { normalizeProduct, getProductShort, toLocalDateStr, normalizeDateStr } from '@/lib/solv/utils'

export type UserProfile = {
  id: string
  name: string
  email: string
  password: string
  phone: string
  role: string
  department: string
  bio: string
  avatar: string
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export function useSolvData(){
  const [theme, setTheme] = useState<'light'|'dark'>('light')
  const isDark = theme === 'dark'
  const [users, setUsers] = useState<UserProfile[]>([])
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const isLoggedIn = !!currentUser
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [shake, setShake] = useState(false)
  const [practices, setPractices] = useState<Practice[]>([])
  const [logs, setLogs] = useState<LogRow[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [tab, setTab] = useState<'logs' | 'practices' | 'calendar' | 'kpi' | 'profile'>('logs')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'In Progress' | 'Closed'>('All')
  const [showPractice, setShowPractice] = useState(false)
  const [editingPractice, setEditingPractice] = useState<Practice | null>(null)
  const [pForm, setPForm] = useState<any>(EMPTY_PRACTICE)
  const [showLog, setShowLog] = useState(false)
  const [editingLog, setEditingLog] = useState<LogRow | null>(null)
  const [lForm, setLForm] = useState<any>(EMPTY_LOG)
  const [showDetailLog, setShowDetailLog] = useState<LogRow | null>(null)
  const [showDetailPractice, setShowDetailPractice] = useState<Practice | null>(null)
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [selectedCalDate, setSelectedCalDate] = useState<string | null>(null)
  const [showAppt, setShowAppt] = useState(false)
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null)
  const [aForm, setAForm] = useState<any>(EMPTY_APPT)
  const [showDetailAppt, setShowDetailAppt] = useState<Appointment | null>(null)
  const [toast, setToast] = useState('')
  const [logoError, setLogoError] = useState(false)
  const [kpiView, setKpiView] = useState<'overview'|'trends'|'products'|'practices'|'performance'|'time'|'workload'>('overview')
  const [confirmDelete, setConfirmDelete] = useState<{type:'practice'|'log'|'appt'|'profile'|'user', id:string, name:string} | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ id: '', name: '', email: '', password: '', phone: '', role: 'Field Technician', department: 'Solv Optics', bio: '', avatar: '👨‍💼', createdAt: '', updatedAt: '' })
  const [selectedLoginUser, setSelectedLoginUser] = useState<UserProfile | null>(null)
  const [authMode, setAuthMode] = useState<'login'|'create'|'createFirst'>('login')
  const avatarOptions = ['👨‍💼','👩‍💼','👨‍🔧','👩‍🔧','👨‍⚕️','👩‍⚕️','🧑‍💻','👨‍💼','🦸','🦹','👑','🎯','💼','🔧','⚡','🌟']

  useEffect(() => {
    const saved = localStorage.getItem('solv-theme') as 'light'|'dark'|null
    if (saved) setTheme(saved)
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark')
    
    // Load users
    const savedUsers = localStorage.getItem('solv-users')
    if(savedUsers){
      try{
        const u = JSON.parse(savedUsers)
        setUsers(u)
        if(u.length===0) setAuthMode('createFirst')
      } catch{ setAuthMode('createFirst') }
    } else {
      setAuthMode('createFirst')
    }

    // Load current user
    const savedCurrent = localStorage.getItem('solv-current-user')
    if(savedCurrent){
      try{
        const cu = JSON.parse(savedCurrent)
        setCurrentUser(cu)
        setUserProfile(cu)
        setProfileForm(cu)
      } catch{}
    }

    fetchAll()
  }, [])

  useEffect(() => { localStorage.setItem('solv-theme', theme) }, [theme])
  useEffect(() => { if (!isLocked) return; const t = setInterval(() => setCountdown(c => { if (c<=1){ setIsLocked(false); setFailedAttempts(0); return 0 } return c-1 }), 1000); return () => clearInterval(t) }, [isLocked])
  useEffect(() => { if(toast){ const t=setTimeout(()=>setToast(''),3000); return()=>clearTimeout(t) } }, [toast])

  function saveUsersToStorage(newUsers: UserProfile[]){
    localStorage.setItem('solv-users', JSON.stringify(newUsers))
    setUsers(newUsers)
  }

  function handleCreateUser(){
    if(!profileForm.name || !profileForm.email || !profileForm.password){
      setErrorMsg('Name, Email & Password required')
      setShowErrorPopup(true)
      return
    }
    if(users.find(u=>u.email.toLowerCase()===profileForm.email.toLowerCase())){
      setErrorMsg('Email already exists')
      setShowErrorPopup(true)
      return
    }
    const newUser: UserProfile = {
      id: Date.now().toString(),
      name: profileForm.name,
      email: profileForm.email,
      password: profileForm.password,
      phone: profileForm.phone || '',
      role: profileForm.role || 'Field Technician',
      department: profileForm.department || 'Solv Optics',
      bio: profileForm.bio || '',
      avatar: profileForm.avatar || '👨‍💼',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
    const newUsers = [...users, newUser]
    saveUsersToStorage(newUsers)
    localStorage.setItem('solv-current-user', JSON.stringify(newUser))
    setCurrentUser(newUser)
    setUserProfile(newUser)
    setProfileForm({ id: '', name: '', email: '', password: '', phone: '', role: 'Field Technician', department: 'Solv Optics', bio: '', avatar: '👨‍💼', createdAt: '', updatedAt: '' })
    setPass('')
    setAuthMode('login')
    setSelectedLoginUser(null)
    setToast(`✓ Welcome ${newUser.name}! Profile created`)
  }

  function handleLogin(){
    if (isLocked) return
    if(authMode==='create' || authMode==='createFirst'){
      handleCreateUser()
      return
    }

    // Login with selected user
    if(!selectedLoginUser){
      setErrorMsg('Please select a user')
      setShowErrorPopup(true)
      setShake(true); setTimeout(()=>setShake(false),400)
      return
    }

    if(pass === selectedLoginUser.password){
      const updatedUser = { ...selectedLoginUser, lastLogin: new Date().toISOString() }
      const newUsers = users.map(u=>u.id===selectedLoginUser.id ? updatedUser : u)
      saveUsersToStorage(newUsers)
      localStorage.setItem('solv-current-user', JSON.stringify(updatedUser))
      setCurrentUser(updatedUser)
      setUserProfile(updatedUser)
      setProfileForm(updatedUser)
      setFailedAttempts(0)
      setPass('')
      setToast(`✓ Welcome back ${updatedUser.name}`)
    } else {
      const n=failedAttempts+1
      setFailedAttempts(n)
      setShake(true)
      setErrorMsg('Incorrect password')
      setShowErrorPopup(true)
      setTimeout(()=>setShake(false),400)
      setPass('')
      if(n>=3){ setIsLocked(true); setCountdown(30) }
    }
  }

  function handleLogout(){
    localStorage.removeItem('solv-current-user')
    setCurrentUser(null)
    setUserProfile(null)
    setSelectedLoginUser(null)
    setPass('')
    setTab('logs')
    setToast('Logged out')
  }

  function switchUser(){
    handleLogout()
  }

  async function fetchAll(){
    setLoading(true); setFetchError('')
    try { const pRes = await supabase.from('practices').select('*').order('created_at',{ascending:false}); if(!(pRes as any).error) setPractices((pRes as any).data || []) } catch(e:any){ setFetchError('Cannot connect to Supabase') }
    try { const lRes = await supabase.from('logs').select('*').order('created_at',{ascending:false}); if(!(lRes as any).error) setLogs((lRes as any).data || []) } catch{}
    try { const aRes = await supabase.from('appointments').select('*').order('date',{ascending:true}); if(!(aRes as any).error) setAppointments((aRes as any).data || []) } catch{}
    setLoading(false)
  }

  const filteredLogs = useMemo(()=>{ let f=logs; if (statusFilter!=='All') f=f.filter(l=>l.status===statusFilter); if (search) f=f.filter(l=>(l.practice_name+l.issue+l.solution).toLowerCase().includes(search.toLowerCase())); return f }, [logs, search, statusFilter])
  const filteredPractices = useMemo(()=> practices.filter(p=>(p.practice_name+(p.prac_number||'')+p.contact_person+p.phone+p.email).toLowerCase().includes(search.toLowerCase())), [practices, search])
  const calendarGrid = useMemo(() => { const y=calendarDate.getFullYear(),m=calendarDate.getMonth(); const first=new Date(y,m,1); const startDay=(first.getDay()+6)%7; const daysInMonth=new Date(y,m+1,0).getDate(); const cells:{date:Date|null,dateStr:string|null,isCurrentMonth:boolean}[]=[]; for(let i=0;i<startDay;i++) cells.push({date:null,dateStr:null,isCurrentMonth:false}); for(let d=1;d<=daysInMonth;d++){const dt=new Date(y,m,d); cells.push({date:dt,dateStr:toLocalDateStr(dt),isCurrentMonth:true})} while(cells.length%7!==0) cells.push({date:null,dateStr:null,isCurrentMonth:false}); return cells }, [calendarDate])
  const getApptsForDate = (dateStr: string) => appointments.filter(a => normalizeDateStr(a.date) === dateStr).sort((a,b) => a.start_time.localeCompare(b.start_time))
  const upcomingAppts = useMemo(() => { const todayStr=toLocalDateStr(new Date()); return [...appointments].filter(a=>normalizeDateStr(a.date)>=todayStr).sort((a,b)=>(normalizeDateStr(a.date)+a.start_time).localeCompare(normalizeDateStr(b.date)+b.start_time)).slice(0,8) }, [appointments])

  async function savePractice(){ if(!pForm.practice_name){setToast('Practice Name required');return} try{ const cleaned={...pForm, product:normalizeProduct(pForm.product)}; if(editingPractice){ const {error,data}=await supabase.from('practices').update(cleaned).eq('id',editingPractice.id).select().single(); if(error) throw error; setPractices(practices.map(x=>x.id===editingPractice.id?data as any:x)) } else { const {error,data}=await supabase.from('practices').insert(cleaned).select().single(); if(error) throw error; setPractices([data as any,...practices]) } setShowPractice(false); setShowDetailPractice(null); setToast('Practice saved') } catch(e:any){ setToast(e.message||'Failed') } }
  async function saveLog(){ if(!lForm.practice_name||!lForm.issue){setToast('Practice + Issue required');return} try{ const cleaned={...lForm, product:normalizeProduct(lForm.product)}; if(editingLog){ const {error,data}=await supabase.from('logs').update(cleaned).eq('id',editingLog.id).select().single(); if(error) throw error; setLogs(logs.map(x=>x.id===editingLog.id?data as any:x)) } else { const {error,data}=await supabase.from('logs').insert(cleaned).select().single(); if(error) throw error; setLogs([data as any,...logs]) } setShowLog(false); setShowDetailLog(null); setToast('Log saved') } catch(e:any){ setToast(e.message||'Failed') } }
  async function saveAppt(){ if(!aForm.title||!aForm.date){setToast('Title + Date required');return} try{ if(editingAppt){ const {error,data}=await supabase.from('appointments').update(aForm).eq('id',editingAppt.id).select().single(); if(error) throw error; setAppointments(appointments.map(x=>x.id===editingAppt.id?data as any:x)) } else { const {error,data}=await supabase.from('appointments').insert(aForm).select().single(); if(error) throw error; setAppointments([...appointments,data as any]) } setShowAppt(false); setShowDetailAppt(null); setToast('Appointment saved') } catch(e:any){ setToast(e.message||'Failed') } }

  async function deletePractice(practice: Practice | {id:string, practice_name:string}){
    const id = (practice as any).id
    const name = (practice as any).practice_name || 'Practice'
    try{
      setToast('Deleting practice...')
      setPractices(prev => prev.filter(x=>x.id!==id))
      setShowDetailPractice(null)
      setConfirmDelete(null)
      const {error} = await supabase.from('practices').delete().eq('id', id)
      if(error) throw error
      setToast(`✓ Deleted ${name}`)
    } catch(e:any){
      setToast(e.message||'Failed - check RLS')
      fetchAll()
    }
  }
  async function deleteLog(log: LogRow | {id:string, practice_name:string}){
    const id = (log as any).id
    const name = (log as any).practice_name || 'Log'
    try{
      setToast('Deleting log...')
      setLogs(prev => prev.filter(x=>x.id!==id))
      setShowDetailLog(null)
      setConfirmDelete(null)
      const {error} = await supabase.from('logs').delete().eq('id', id)
      if(error) throw error
      setToast(`✓ Deleted ${name}`)
    } catch(e:any){
      setToast(e.message||'Failed to delete log')
      fetchAll()
    }
  }
  async function deleteAppt(appt: Appointment | {id:string, title:string}){
    const id = (appt as any).id
    const name = (appt as any).title || 'Appointment'
    try{
      setToast('Deleting appointment...')
      setAppointments(prev => prev.filter(x=>x.id!==id))
      setShowDetailAppt(null)
      setConfirmDelete(null)
      const {error} = await supabase.from('appointments').delete().eq('id', id)
      if(error) throw error
      setToast(`✓ Deleted ${name}`)
    } catch(e:any){
      setToast(e.message||'Failed to delete appointment')
      fetchAll()
    }
  }

  function saveProfile(){
    if(!profileForm.name || !profileForm.email){ setToast('Name + Email required'); return }
    const isEditingOwn = currentUser && profileForm.id === currentUser.id
    const updatedUser: UserProfile = {
      id: profileForm.id || currentUser?.id || Date.now().toString(),
      name: profileForm.name,
      email: profileForm.email,
      password: profileForm.password || currentUser?.password || '',
      phone: profileForm.phone || '',
      role: profileForm.role || 'Field Technician',
      department: profileForm.department || 'Solv Optics',
      bio: profileForm.bio || '',
      avatar: profileForm.avatar || '👨‍💼',
      createdAt: profileForm.createdAt || currentUser?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: currentUser?.lastLogin
    }
    if(!updatedUser.password){
      setToast('Password required')
      return
    }
    const newUsers = users.map(u=>u.id===updatedUser.id ? updatedUser : u)
    // If editing different user (admin)
    const finalUsers = users.find(u=>u.id===updatedUser.id) ? newUsers : [...users, updatedUser]
    saveUsersToStorage(finalUsers)
    if(isEditingOwn || !profileForm.id){
      localStorage.setItem('solv-current-user', JSON.stringify(updatedUser))
      setCurrentUser(updatedUser)
      setUserProfile(updatedUser)
    }
    setShowProfile(false)
    setToast(`✓ Profile updated - ${updatedUser.name}`)
  }

  function deleteProfileUser(userId: string){
    const newUsers = users.filter(u=>u.id!==userId)
    saveUsersToStorage(newUsers)
    if(currentUser?.id===userId){
      handleLogout()
    }
    setConfirmDelete(null)
    setToast('User deleted')
  }

  function deleteProfile(){
    if(currentUser) deleteProfileUser(currentUser.id)
  }

  const kpi = useMemo(()=>{
    const open = logs.filter(l=>l.status==='Open').length
    const prog = logs.filter(l=>l.status==='In Progress').length
    const closed = logs.filter(l=>l.status==='Closed').length
    const totalLogs = logs.length
    const apptThisMonth = appointments.filter(a=>{ const d=new Date(a.date); return d.getMonth()===new Date().getMonth() && d.getFullYear()===new Date().getFullYear() }).length
    const months: {key:string,label:string}[]=[]
    for(let i=5;i>=0;i--){ const d=new Date(); d.setMonth(d.getMonth()-i); const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; const label=d.toLocaleString('default',{month:'short'}); months.push({key,label}) }
    const logsByMonth = months.map(m=>({ ...m, count: logs.filter(l=>(l.created_at||'').slice(0,7)===m.key).length }))
    const apptsByMonth = months.map(m=>({ ...m, count: appointments.filter(a=>a.date.slice(0,7)===m.key).length }))
    const byProductMap: Record<string,number>={}; PRODUCT_OPTIONS.forEach(o=>byProductMap[o]=0); logs.forEach(l=>{ const k=normalizeProduct(l.product); byProductMap[k]=(byProductMap[k]||0)+1 })
    const byProduct = Object.entries(byProductMap).map(([product,count])=>({ product, count })).filter(x=>x.count>0)
    const byProductDonut = byProduct.map(p=>({ label: getProductShort(p.product), value: p.count, color: PRODUCT_COLORS[p.product] }))
    const practicesByProductMap: Record<string,number>={}; PRODUCT_OPTIONS.forEach(o=>practicesByProductMap[o]=0); practices.forEach(p=>{ const k=normalizeProduct(p.product); practicesByProductMap[k]=(practicesByProductMap[k]||0)+1 })
    const practicesByProduct = Object.entries(practicesByProductMap).map(([product,count])=>({ product, count })).filter(x=>x.count>0)
    const byPracticeMap: Record<string,number>={}; logs.forEach(l=>{ const k=l.practice_name||'Unknown'; byPracticeMap[k]=(byPracticeMap[k]||0)+1 })
    const byPracticeTop = Object.entries(byPracticeMap).map(([name,count])=>({ name, count })).sort((a,b)=>b.count-a.count).slice(0,8)
    const byPracticeTopChart = byPracticeTop.map((p,i)=>({ label: p.name.slice(0,12), value: p.count, color: CHART_PALETTE[i % CHART_PALETTE.length] }))
    const productDeepDive = PRODUCT_OPTIONS.map(prod=>{
      const prodLogs=logs.filter(l=>normalizeProduct(l.product)===prod)
      const prodPractices=practices.filter(p=>normalizeProduct(p.product)===prod)
      const prodOpen=prodLogs.filter(l=>l.status==='Open').length
      const prodClosed=prodLogs.filter(l=>l.status==='Closed').length
      const prodProg=prodLogs.filter(l=>l.status==='In Progress').length
      const resolution=prodLogs.length?Math.round((prodClosed/prodLogs.length)*100):0
      return { product:prod, color:PRODUCT_COLORS[prod]||'#0ea5e9', totalLogs:prodLogs.length, open:prodOpen, inProgress:prodProg, closed:prodClosed, practices:prodPractices.length, resolution, logsPerPractice:prodPractices.length?(prodLogs.length/prodPractices.length).toFixed(1):'0' }
    })
    const practiceHealth = practices.map(p=>{
      const pLogs=logs.filter(l=>l.practice_id===p.id || l.practice_name===p.practice_name)
      const pOpen=pLogs.filter(l=>l.status==='Open').length
      const pProg=pLogs.filter(l=>l.status==='In Progress').length
      return { name:p.practice_name, number:p.prac_number||'', product:normalizeProduct(p.product), contact:p.contact_person||'', totalLogs:pLogs.length, open:pOpen, inProgress:pProg, health:(pOpen===0?'good':pOpen<=2?'watch':'attention') as any }
    }).sort((a,b)=>b.open-a.open || b.totalLogs-a.totalLogs)
    const resolutionRate = totalLogs?Math.round((closed/totalLogs)*100):0
    const openRate = totalLogs?Math.round((open/totalLogs)*100):0
    const inProgressRate = totalLogs?Math.round((prog/totalLogs)*100):0
    const avgLogsPerPractice = practices.length?(totalLogs/practices.length).toFixed(1):'0'
    const avgApptsPerMonth = apptsByMonth.length?(apptsByMonth.reduce((s,m)=>s+m.count,0)/apptsByMonth.length).toFixed(1):'0'
    const dayNames=['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    const logsByDayArr = dayNames.map(day=>({day,count:0} as any))
    logs.forEach(l=>{ if(!l.created_at) return; const d=new Date(l.created_at); if(isNaN(d.getTime())) return; logsByDayArr[d.getDay()].count++ })
    const logsByDayMonFirst = [...logsByDayArr.slice(1), logsByDayArr[0]].map((d:any)=>({ label:d.day, value:d.count, color: CHART_PALETTE[d.day==='Sat'||d.day==='Sun'?3:0] }))
    const hourBuckets = Array.from({length:8},(_,i)=>({ label:`${i*3}:00`, value:0, color: CHART_PALETTE[i % CHART_PALETTE.length] }))
    logs.forEach(l=>{ if(!l.created_at) return; const d=new Date(l.created_at); if(isNaN(d.getTime())) return; const b=Math.min(7,Math.floor(d.getHours()/3)); hourBuckets[b].value++ })
    const last14 = Array.from({length:14},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(13-i)); const dateStr=d.toISOString().slice(0,10); const count=logs.filter(l=>(l.created_at||'').slice(0,10)===dateStr).length; return { label:d.toLocaleDateString('en-ZA',{day:'2-digit'}), value:count } })
    const productStatusMatrix = PRODUCT_OPTIONS.map(prod=>{ const prodLogs=logs.filter(l=>normalizeProduct(l.product)===prod); return { product:prod, open:prodLogs.filter(l=>l.status==='Open').length, inProgress:prodLogs.filter(l=>l.status==='In Progress').length, closed:prodLogs.filter(l=>l.status==='Closed').length, color: PRODUCT_COLORS[prod] } })
    const byType = (['Meeting','Call','Visit','Personal','Other'] as const).map(t=>({ type:t, count:appointments.filter(a=>a.type===t).length }))
    return { open, prog, closed, totalLogs, apptThisMonth, byProduct, byProductDonut, practicesByProduct, byPracticeTop, byPracticeTopChart, logsByMonth, apptsByMonth, productDeepDive, practiceHealth, resolutionRate, openRate, inProgressRate, avgLogsPerPractice, avgApptsPerMonth, logsByDayMonFirst, hourBuckets, last14, productStatusMatrix, byType }
  }, [logs, appointments, practices])

  const bgMain = isDark ? 'bg-[#1a2f4f]' : 'bg-[#eff6ff]'
  const textMain = isDark ? 'text-slate-100' : 'text-slate-900'
  const headerCls = isDark ? 'bg-[#1e365a]/90 border-slate-600/50' : 'bg-white/80 border-blue-200'
  const cardCls = isDark ? 'bg-[#23395f] border-slate-600/50' : 'bg-white border-blue-200'
  const cardBg = isDark ? 'bg-[#1c2f52]' : 'bg-[#eff6ff]'
  const inputCls = isDark ? 'bg-[#243a5f] border-slate-500/50 text-white placeholder:text-slate-400' : 'bg-white border-blue-200 text-slate-900 placeholder:text-slate-400'
  const modalBg = isDark ? 'bg-[#223a5f]' : 'bg-white'
  const UNIFIED_CARD = isDark ? 'bg-[#23395f] border border-slate-600/50 hover:border-blue-400/50' : 'bg-white border border-blue-200 hover:border-blue-300'
  const kpiCard = `rounded-2xl border p-5 shadow-sm ${cardCls}`

  return {
    theme, setTheme, isDark, isLoggedIn, currentUser, users, selectedLoginUser, setSelectedLoginUser, authMode, setAuthMode,
    pass, setPass, showPass, setShowPass, failedAttempts, isLocked, countdown, showErrorPopup, setShowErrorPopup, errorMsg, setErrorMsg, shake,
    practices, logs, appointments, loading, fetchError, tab, setTab, search, setSearch, statusFilter, setStatusFilter,
    showPractice, setShowPractice, editingPractice, setEditingPractice, pForm, setPForm, showLog, setShowLog, editingLog, setEditingLog, lForm, setLForm,
    showDetailLog, setShowDetailLog, showDetailPractice, setShowDetailPractice, calendarDate, setCalendarDate, selectedCalDate, setSelectedCalDate,
    showAppt, setShowAppt, editingAppt, setEditingAppt, aForm, setAForm, showDetailAppt, setShowDetailAppt, toast, setToast, logoError, setLogoError, kpiView, setKpiView,
    fetchAll, handleLogin, handleLogout, switchUser, handleCreateUser, filteredLogs, filteredPractices, calendarGrid, getApptsForDate, upcomingAppts, savePractice, deletePractice, deleteLog, deleteAppt, saveLog, saveAppt,
    kpi, bgMain, textMain, headerCls, cardCls, cardBg, inputCls, modalBg, UNIFIED_CARD, kpiCard, toLocalDateStr, normalizeDateStr,
    confirmDelete, setConfirmDelete, userProfile, setUserProfile, showProfile, setShowProfile, profileForm, setProfileForm, avatarOptions, saveProfile, deleteProfile, deleteProfileUser
  }
}
