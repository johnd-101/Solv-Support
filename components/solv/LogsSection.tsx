'use client'
import { statusStyle, getProductShort } from '@/lib/solv/utils'
import { PRODUCT_COLORS, EMPTY_LOG } from '@/lib/solv/constants'
export function LogsSection({ cardCls, cardBg, isDark, filteredLogs, statusFilter, setStatusFilter, setLForm, setEditingLog, setShowLog, setShowDetailLog, UNIFIED_CARD, setConfirmDelete }: any){
  return (
    <div className={`rounded-2xl border shadow overflow-hidden ${cardCls}`}>
      <div className={`p-4 border-b flex justify-between items-center ${isDark?'border-slate-600/50':'border-blue-50'}`}><h3 className="font-bold text-sm">Logs • {statusFilter} • {filteredLogs.length}</h3><button onClick={()=>{ setLForm(EMPTY_LOG); setEditingLog(null); setShowLog(true) }} className="h-10 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold">+ New Log</button></div>
      <div className={`flex gap-2 p-3 border-b overflow-x-auto ${isDark?'border-slate-600/50':'border-blue-50'}`}>{(['All','Open','In Progress','Closed'] as const).map(s=><button key={s} onClick={()=>setStatusFilter(s)} className={`h-8 px-4 rounded-full text-xs font-bold border ${statusFilter===s?'bg-blue-600 text-white border-blue-600': isDark?'bg-[#1a2f4f] border-slate-600 text-slate-300':'bg-white border-blue-200 text-slate-500'}`}>{s}</button>)}</div>
      <div className={`p-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 ${cardBg}`}>
        {filteredLogs.map((l:any)=>{const st=statusStyle(l.status); return <div key={l.id} className={`p-3 rounded-xl border flex flex-col ${UNIFIED_CARD}`}><div onClick={()=>setShowDetailLog(l)} className="cursor-pointer flex-1"><div className="flex items-start justify-between gap-2"><div className="font-bold truncate pr-2">{l.practice_name}</div><span style={{background:st.bg,color:st.color,borderColor:st.border}} className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase">{l.status}</span></div><div className={`text-xs line-clamp-2 mt-1 ${isDark?'text-slate-300':'text-slate-500'}`}>{l.issue}</div><div className="flex items-center gap-1.5 mt-2"><span className="w-2 h-2 rounded-full" style={{background: (PRODUCT_COLORS as any)[l.product] || '#0ea5e9'}}></span><span className="text-[10px] font-bold uppercase" style={{color:(PRODUCT_COLORS as any)[l.product] || '#0ea5e9'}}>{getProductShort(l.product)}</span></div></div>
          <div className="flex gap-1.5 mt-3 pt-2 border-t border-blue-50/50">
            <button onClick={()=>setShowDetailLog(l)} className={`flex-1 h-8 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${isDark?'bg-[#1a2f4f] border-slate-600 text-blue-300 hover:bg-[#23395f] hover:text-blue-200':'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'}`}>
              <span>✏️</span> Edit
            </button>
            <button onClick={()=>setConfirmDelete({type:'log', id:l.id, name:l.practice_name})} className={`flex-1 h-8 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${isDark?'bg-[#1a2f4f] border-red-900/40 text-red-400 hover:bg-red-950/30 hover:border-red-800/50':'bg-white border-red-200 text-red-600 hover:bg-red-50'}`}>
              <span>🗑️</span> Delete
            </button>
          </div>
        </div>})}
        {filteredLogs.length===0&&<div className="col-span-full p-10 text-center text-sm text-slate-400">No logs found</div>}
      </div>
    </div>
  )
}
