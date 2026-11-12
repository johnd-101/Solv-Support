'use client'
import { PRODUCT_COLORS, EMPTY_PRACTICE } from '@/lib/solv/constants'
import { getProductShort, normalizeProduct } from '@/lib/solv/utils'
export function PracticesSection({ cardCls, cardBg, isDark, filteredPractices, practices, setPForm, setEditingPractice, setShowPractice, setShowDetailPractice, UNIFIED_CARD, setConfirmDelete }: any){
  return (
    <div className={`rounded-2xl border shadow overflow-hidden ${cardCls}`}>
      <div className={`p-4 border-b flex justify-between items-center ${isDark?'border-slate-600/50':'border-blue-50'}`}><h3 className="font-bold text-sm">Practices • {practices.length}</h3><button onClick={()=>{ setPForm(EMPTY_PRACTICE); setEditingPractice(null); setShowPractice(true) }} className="h-10 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold">+ New Practice</button></div>
      <div className={`p-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 ${cardBg}`}>{filteredPractices.map((p:any)=>(<div key={p.id} className={`p-3 rounded-xl border flex flex-col ${UNIFIED_CARD}`}><div onClick={()=>setShowDetailPractice(p)} className="cursor-pointer flex-1"><div className="flex justify-between gap-2"><span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-black text-white" style={{background:PRODUCT_COLORS[normalizeProduct(p.product)]}}>#{p.prac_number||'NO #'}</span><span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{background:PRODUCT_COLORS[normalizeProduct(p.product)]}}>{getProductShort(p.product)}</span></div><div className="font-bold truncate mt-2">{p.practice_name}</div><div className={`text-xs truncate mt-1 ${isDark?'text-slate-300':'text-slate-500'}`}>{p.contact_person||'No contact'} • {p.phone||p.mobile||'No phone'}</div></div>
      <div className="flex gap-1.5 mt-3 pt-2 border-t border-blue-50/50">
        <button onClick={()=>setShowDetailPractice(p)} className={`flex-1 h-8 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${isDark?'bg-[#1a2f4f] border-slate-600 text-blue-300 hover:bg-[#23395f] hover:text-blue-200':'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'}`}>
          <span>✏️</span> Edit
        </button>
        <button onClick={()=>setConfirmDelete({type:'practice', id:p.id, name:p.practice_name})} className={`flex-1 h-8 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${isDark?'bg-[#1a2f4f] border-red-900/40 text-red-400 hover:bg-red-950/30 hover:border-red-800/50':'bg-white border-red-200 text-red-600 hover:bg-red-50'}`}>
          <span>🗑️</span> Delete
        </button>
      </div>
      </div>))}{filteredPractices.length===0&&<div className="col-span-full p-10 text-center text-sm text-slate-400">No practices</div>}</div>
    </div>
  )
}
