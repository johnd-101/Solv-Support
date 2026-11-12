'use client'
import { useSolvData } from '@/hooks/useSolvData'
import { AuthView } from '@/components/solv/AuthView'
import { HeaderBar } from '@/components/solv/HeaderBar'
import { LogsSection } from '@/components/solv/LogsSection'
import { PracticesSection } from '@/components/solv/PracticesSection'
import { CalendarSection } from '@/components/solv/CalendarSection'
import { KpiSection } from '@/components/solv/KpiSection'
import { AllModals } from '@/components/solv/Modals'
import { ProfileSection, ProfileModal } from '@/components/solv/ProfileSection'

export default function Page(){
  const data = useSolvData()
  if(!data.isLoggedIn) return <AuthView {...data} />
  
  return (
    <div className={`min-h-screen pb-28 sm:pb-10 ${data.bgMain} ${data.textMain}`}>
      <HeaderBar {...data} />
      <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
        <div className={`flex gap-1.5 mb-5 p-1 rounded-full w-full sm:w-fit overflow-x-auto border shadow-sm ${data.isDark?'bg-[#23395f] border-slate-600/50':'bg-white border-blue-200'}`}>
          {[{k:'logs',l:'Logs',i:'📋'},{k:'practices',l:'Practices',i:'🏥'},{k:'calendar',l:'Calendar',i:'📅'},{k:'kpi',l:'KPI',i:'📊'},{k:'profile',l:'Profile',i:'👤'}].map(t=>{
            const active=data.tab===t.k
            return <button key={t.k} onClick={()=>data.setTab(t.k as any)} className={`h-9 px-4 rounded-full text-sm font-bold whitespace-nowrap flex items-center gap-1.5 active:scale-95 ${active? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow' : data.isDark?'text-slate-300 hover:bg-[#1a2f4f]':'text-slate-500 hover:bg-blue-50'}`}>{t.i} {t.l}</button>
          })}
        </div>
        {data.tab==='logs' && <LogsSection {...data} />}
        {data.tab==='practices' && <PracticesSection {...data} />}
        {data.tab==='calendar' && <CalendarSection {...data} />}
        {data.tab==='kpi' && <KpiSection {...data} />}
        {data.tab==='profile' && <ProfileSection {...data} />}
      </main>
      <nav className={`fixed bottom-0 inset-x-0 z-20 sm:hidden border-t backdrop-blur-xl pb-[env(safe-area-inset-bottom)] ${data.isDark?'bg-[#1e365a]/95 border-slate-600/50':'bg-white/90 border-blue-200'}`}>
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {[{k:'logs',l:'Logs',i:'📋'},{k:'practices',l:'Practices',i:'🏥'},{k:'calendar',l:'Calendar',i:'📅'},{k:'kpi',l:'KPI',i:'📊'},{k:'profile',l:'Profile',i:'👤'}].map(t=>(
            <button key={t.k} onClick={()=>data.setTab(t.k as any)} className={`flex flex-col items-center justify-center h-14 rounded-xl text-[10px] font-bold gap-0.5 ${data.tab===t.k?'bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow':data.isDark?'text-slate-400':'text-slate-500'}`}>
              <span className="text-base leading-none">{t.i}</span>{t.l}
            </button>
          ))}
        </div>
      </nav>
      <AllModals {...data} />
      <ProfileModal {...data} />
      {data.toast && <div onClick={()=>data.setToast('')} className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-bold shadow z-[200]">{data.toast}</div>}
    </div>
  )
}
