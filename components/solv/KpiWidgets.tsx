'use client'
import { CHART_PALETTE } from '@/lib/solv/constants'
import { KpiDatum } from '@/lib/solv/types'

export function KpiMiniStat({ label, value, sub, isDark, color='#1e40af' }: { label: string; value: string|number; sub: string; isDark: boolean; color?: string }) {
  return (
    <div className={`rounded-xl border p-3 relative overflow-hidden ${isDark ? 'bg-[#23395f] border-slate-600/60' : 'bg-white border-blue-200'}`}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{background: color}}/>
      <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">{label}</div>
      <div className="text-xl font-black mt-1" style={{color: isDark ? '#e2e8f0' : color}}>{value}</div>
      <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>
    </div>
  )
}
export function KpiDonut({ data, total, isDark }: { data: KpiDatum[]; total: number; isDark: boolean }) {
  const safeTotal = Math.max(total, 1)
  const radius = 44
  const circ = 2 * Math.PI * radius
  let offset = 0
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 min-h-[190px]">
      <div className="relative w-44 h-44 shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke={isDark ? '#334155' : '#e0f2fe'} strokeWidth="16" />
          {data.map((item, i) => {
            const length = (item.value / safeTotal) * circ
            const el = <circle key={`${item.label}-${i}`} cx="60" cy="60" r={radius} fill="none" stroke={item.color || CHART_PALETTE[i % CHART_PALETTE.length]} strokeWidth="16" strokeDasharray={`${Math.max(length, item.value>0?0.5:0)} ${circ}`} strokeDashoffset={-offset} strokeLinecap="round" className="transition-all duration-500" />
            offset += length
            return el
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-black">{total}</div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Total</div>
        </div>
      </div>
      <div className="space-y-3 min-w-0 w-full sm:w-auto">
        {data.map((item,i) => {
          const pct = total ? Math.round((item.value/total)*100) : 0
          return (
            <div key={item.label} className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{background:item.color || CHART_PALETTE[i % CHART_PALETTE.length]}}/>
              <span className="text-xs font-bold truncate">{item.label}</span>
              <span className="text-xs font-black ml-auto">{item.value}</span>
              <span className="text-[10px] text-slate-400 w-8 text-right">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export function KpiBarChart({ data, isDark, horizontal=false }: { data: KpiDatum[]; isDark: boolean; horizontal?: boolean }) {
  const max = Math.max(1, ...data.map(x=>x.value))
  if(horizontal){
    return <div className="space-y-3 py-1">{data.map((item,i)=>(<div key={item.label} className="grid grid-cols-[minmax(80px,1fr)_minmax(90px,2fr)_34px] items-center gap-2"><div className="text-xs font-bold truncate">{item.label}</div><div className={`h-3 rounded-full overflow-hidden ${isDark?'bg-slate-700':'bg-blue-50'}`}><div className="h-full rounded-full shadow-sm" style={{width:`${(item.value/max)*100}%`, background:item.color||CHART_PALETTE[i % CHART_PALETTE.length]}}/></div><div className="text-xs font-black text-right">{item.value}</div></div>))}</div>
  }
  return <div className="h-52 flex items-end gap-2 sm:gap-3 pt-3">{data.map((item,i)=>{ const h=item.value?Math.max(6,Math.round((item.value/max)*100)):2; return (<div key={item.label} className="flex-1 min-w-0 h-full flex flex-col items-center justify-end gap-1.5"><div className="text-[10px] font-black px-1.5 py-0.5 rounded-full text-white" style={{background:item.color||CHART_PALETTE[i % CHART_PALETTE.length]}}>{item.value}</div><div className="w-full max-w-12 h-full flex items-end"><div className="w-full rounded-t-xl shadow-sm transition-all duration-500" style={{height:`${h}%`, background:item.color||CHART_PALETTE[i % CHART_PALETTE.length]}}/></div><div className="text-[10px] sm:text-xs font-bold text-slate-500 truncate max-w-full">{item.label}</div></div>)})}</div>
}
export function KpiLineChart({ data, data2, isDark }: { data: KpiDatum[]; data2?: KpiDatum[]; isDark: boolean }) {
  const width=700,height=230,pad={l:34,r:18,t:22,b:34},plotW=width-pad.l-pad.r,plotH=height-pad.t-pad.b
  const max=Math.max(1,...data.map(x=>x.value),...(data2||[]).map(x=>x.value))
  const pt=(v:number,i:number,len:number)=>({x:pad.l+(len<=1?plotW/2:(i/(len-1))*plotW), y:pad.t+plotH-(v/max)*plotH})
  const points=data.map((d,i)=>pt(d.value,i,data.length))
  const points2=data2?.map((d,i)=>pt(d.value,i,data2.length))||[]
  const poly=(pts:{x:number,y:number}[])=>pts.map(p=>`${p.x},${p.y}`).join(' ')
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[520px] h-56">
        {[0,0.25,0.5,0.75,1].map((r,i)=>{const y=pad.t+plotH-r*plotH; return <line key={i} x1={pad.l} x2={width-pad.r} y1={y} y2={y} stroke={isDark?'#334155':'#e0f2fe'} strokeWidth="1" strokeDasharray="4 4"/>})}
        <polyline fill="none" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={poly(points)}/>
        {data2 && <polyline fill="none" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={poly(points2)}/>}
        {points.map((p,i)=><circle key={`a-${i}`} cx={p.x} cy={p.y} r="6" fill="#0ea5e9" stroke={isDark?'#1e365a':'white'} strokeWidth="3"/>)}
        {points2.map((p,i)=><circle key={`b-${i}`} cx={p.x} cy={p.y} r="6" fill="#8b5cf6" stroke={isDark?'#1e365a':'white'} strokeWidth="3"/>)}
        {data.map((d,i)=>{const p=points[i]; return <text key={`t-${i}`} x={p.x} y={height-10} textAnchor="middle" className="fill-slate-500" fontSize="12" fontWeight="700">{d.label}</text>})}
      </svg>
    </div>
  )
}
export function KpiGauge({ value, label, isDark, color='#0ea5e9' }: { value: number; label: string; isDark: boolean; color?: string }) {
  const clamped=Math.max(0,Math.min(100,value)),radius=40,circ=Math.PI*radius,filled=(clamped/100)*circ
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <svg viewBox="0 0 120 70" className="w-32 h-20">
        <path d="M 10 60 A 40 40 0 0 1 110 60" fill="none" stroke={isDark?'#334155':'#e0f2fe'} strokeWidth="12" strokeLinecap="round"/>
        <path d="M 10 60 A 40 40 0 0 1 110 60" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${filled} ${circ}`} className="transition-all duration-700"/>
        <text x="60" y="52" textAnchor="middle" className={`font-black ${isDark?'fill-white':'fill-slate-900'}`} fontSize="18">{Math.round(clamped)}%</text>
      </svg>
      <div className="text-xs font-bold text-slate-500 text-center mt-1">{label}</div>
    </div>
  )
}
export function KpiHeatStrip({ data, isDark }: { data: { label: string; value: number }[]; isDark: boolean }) {
  const max=Math.max(1,...data.map(d=>d.value))
  return (
    <div>
      <div className="flex gap-1 items-end h-24">
        {data.map((d,i)=>{
          const intensity=d.value/max
          const h=Math.max(6,Math.round(intensity*80))
          const col = d.value===0 ? (isDark?'#334155':'#e0f2fe') : `hsl(${200 + intensity*80}, 90%, ${55 - intensity*10}%)`
          return <div key={i} className="flex-1 flex flex-col items-center gap-1 group" title={`${d.label}: ${d.value}`}><div className="w-full rounded-t-lg transition-all duration-500 shadow-sm" style={{height:`${h}px`, background: col}}/></div>
        })}
      </div>
      <div className="flex gap-1 mt-1.5">{data.map((d,i)=><div key={i} className="flex-1 text-[8px] text-center text-slate-400 font-bold truncate">{d.label}</div>)}</div>
    </div>
  )
}
export function KpiRankTable({ rows, isDark, valueLabel='count' }: { rows: { name: string; value: number; extra?: string; color?: string }[]; isDark: boolean; valueLabel?: string }) {
  const max=Math.max(1,...rows.map(r=>r.value))
  return (
    <div className="space-y-2">
      <div className={`grid grid-cols-[28px_1fr_60px] text-[10px] font-black uppercase tracking-widest text-slate-400 pb-1 border-b ${isDark?'border-slate-600':'border-blue-100'}`}><div>#</div><div>Name</div><div className="text-right">{valueLabel}</div></div>
      {rows.map((r,i)=>(<div key={`${r.name}-${i}`} className="grid grid-cols-[28px_1fr_60px] items-center gap-1 py-1.5"><div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm ${i===0?'bg-gradient-to-br from-amber-400 to-amber-600 text-white':i===1?'bg-gradient-to-br from-slate-400 to-slate-600 text-white':i===2?'bg-gradient-to-br from-orange-400 to-orange-600 text-white':isDark?'bg-slate-700 text-slate-300':'bg-blue-50 text-slate-500'}`}>{i+1}</div><div className="min-w-0"><div className="text-xs font-bold truncate">{r.name}</div>{r.extra&&<div className="text-[10px] text-slate-400 truncate">{r.extra}</div>}<div className={`h-1.5 rounded-full mt-1 overflow-hidden ${isDark?'bg-slate-700':'bg-blue-50'}`}><div className="h-full rounded-full shadow-sm" style={{width:`${(r.value/max)*100}%`, background:r.color||CHART_PALETTE[i % CHART_PALETTE.length]}}/></div></div><div className="text-xs font-black text-right px-2 py-1 rounded-full text-white text-[11px]" style={{background:r.color||CHART_PALETTE[i % CHART_PALETTE.length]}}>{r.value}</div></div>))}
    </div>
  )
}
