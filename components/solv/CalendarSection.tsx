'use client'
import { EMPTY_APPT } from '@/lib/solv/constants'
import { apptTypeStyle } from '@/lib/solv/utils'
export function CalendarSection({ calendarDate, setCalendarDate, calendarGrid, getApptsForDate, toLocalDateStr, isDark, selectedCalDate, setSelectedCalDate, setAForm, setEditingAppt, setShowAppt, setShowDetailAppt, upcomingAppts, cardCls, setConfirmDelete }: any){
  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border shadow overflow-hidden ${cardCls}`}>
        <div className={`p-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between border-b ${isDark?'border-slate-600/50':'border-blue-50'}`}>
          <div className="flex items-center gap-2">
            <button onClick={()=>setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth()-1,1))} className={`w-10 h-10 rounded-xl border font-bold ${isDark?'bg-[#1a2f4f] border-slate-600':'bg-white border-blue-200'}`}>‹</button>
            <div className="font-bold text-sm">{calendarDate.toLocaleString('default',{month:'long', year:'numeric'})}</div>
            <button onClick={()=>setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth()+1,1))} className={`w-10 h-10 rounded-xl border font-bold ${isDark?'bg-[#1a2f4f] border-slate-600':'bg-white border-blue-200'}`}>›</button>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>setCalendarDate(new Date())} className={`h-10 px-4 rounded-xl text-sm font-bold border ${isDark?'bg-[#1a2f4f] border-slate-600':'bg-white border-blue-200'}`}>Today</button>
            <button onClick={()=>{ setAForm({...EMPTY_APPT, date: new Date().toISOString().split('T')[0]}); setEditingAppt(null); setShowAppt(true) }} className="h-10 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold">+ Appointment</button>
          </div>
        </div>
        <div className={`grid grid-cols-7 border-b text-xs font-bold ${isDark?'border-slate-600/50 bg-[#1a2f4f]/60':'border-blue-50 bg-blue-50/60'}`}>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=><div key={d} className="p-2.5 text-center">{d}</div>)}</div>
        <div className="grid grid-cols-7">
          {calendarGrid.map((cell:any,i:number)=>{
            const isToday=cell.dateStr===toLocalDateStr(new Date())
            const isSelected = cell.dateStr === selectedCalDate
            const appts=cell.dateStr?getApptsForDate(cell.dateStr):[]
            return (
              <div 
                key={i} 
                onClick={()=> {
                  if(!cell.dateStr) return
                  setSelectedCalDate(cell.dateStr)
                  setAForm({...EMPTY_APPT, date: cell.dateStr})
                  setEditingAppt(null)
                  setShowAppt(true)
                }} 
                className={`border-b border-r p-1.5 min-h-[96px] group transition-colors hover:bg-blue-50/80 ${isDark?'border-slate-600/30 hover:bg-[#1a2f4f]':'border-blue-50'} ${!cell.isCurrentMonth? isDark?'bg-[#1a2f4f]/60 text-slate-500':'bg-slate-50/60 text-slate-300' : isDark?'bg-[#23395f]':'bg-white'} cursor-pointer ${isSelected ? 'ring-2 ring-inset ring-blue-500' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isToday? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow' : 'group-hover:bg-blue-100'}`}>{cell.date?.getDate()}</div>
                <div className="mt-1.5 space-y-1 hidden sm:block">
                  {appts.slice(0,2).map((a:any)=>{ const ts=apptTypeStyle(a.type); return <div key={a.id} onClick={(e)=>{ e.stopPropagation(); setShowDetailAppt(a) }} className="truncate text-[10px] font-bold px-2 py-1 rounded-full shadow-sm cursor-pointer" style={{background:ts.bg, color:ts.color}}>{a.start_time} {a.title}</div>})}
                  {appts.length>2&&<div className="text-[10px] text-slate-500">+{appts.length-2}</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className={`rounded-2xl border p-5 shadow ${cardCls}`}><h3 className="font-bold text-sm mb-4">Upcoming • {upcomingAppts.length}</h3><div className="space-y-2">{upcomingAppts.map((a:any)=>{ const st=apptTypeStyle(a.type); return <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl border ${isDark?'border-slate-600/50':'border-blue-50'}`}><div onClick={()=>setShowDetailAppt(a)} className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"><div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold" style={{background:st.bg, color:st.color}}>{new Date(a.date).getDate()}</div><div className="flex-1 min-w-0"><div className="font-bold text-sm truncate">{a.title}</div><div className="text-xs text-slate-500 truncate">{a.date} • {a.start_time}-{a.end_time}</div></div></div>
      <div className="flex gap-1">
        <button onClick={()=>setShowDetailAppt(a)} className={`h-8 w-8 rounded-lg text-xs font-bold flex items-center justify-center border transition-colors ${isDark?'bg-[#1a2f4f] border-slate-600 text-blue-300 hover:bg-[#23395f]':'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'}`}>✏️</button>
        <button onClick={()=>setConfirmDelete({type:'appt', id:a.id, name:a.title})} className={`h-8 w-8 rounded-lg text-xs font-bold flex items-center justify-center border transition-colors ${isDark?'bg-[#1a2f4f] border-red-900/40 text-red-400 hover:bg-red-950/30':'bg-white border-red-200 text-red-600 hover:bg-red-50'}`}>🗑️</button>
      </div>
      </div>})}{upcomingAppts.length===0 && <div className="text-xs text-slate-400">No upcoming appointments</div>}</div></div>
    </div>
  )
}
