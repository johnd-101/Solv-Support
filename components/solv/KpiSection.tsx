'use client'
import { KpiMiniStat, KpiDonut, KpiBarChart, KpiLineChart, KpiGauge, KpiHeatStrip, KpiRankTable } from './KpiWidgets'
import { PRODUCT_COLORS } from '@/lib/solv/constants'

export function KpiSection({ kpiView, setKpiView, isDark, kpi, kpiCard, practices, logs, appointments }: any){
  const tabs = [
    {k:'overview', l:'Overview'},
    {k:'trends', l:'Trends'},
    {k:'products', l:'Products'},
    {k:'practices', l:'Practices'},
    {k:'performance', l:'Performance'},
    {k:'time', l:'Time'},
    {k:'workload', l:'Workload'}
  ]

  return (
    <div className="space-y-4">
      <div className={`flex gap-1.5 p-1 rounded-full w-full overflow-x-auto border shadow-sm ${isDark?'bg-[#23395f] border-slate-600/50':'bg-white border-blue-200'}`}>
        {tabs.map(v=>{
          const active=kpiView===v.k
          return <button key={v.k} onClick={()=>setKpiView(v.k)} className={`h-8 px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all ${active?'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow':isDark?'text-slate-300 hover:bg-[#1a2f4f]':'text-slate-500 hover:bg-blue-50'}`}>{v.l}</button>
        })}
      </div>

      {/* KPI STATS - Always visible */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiMiniStat label="Practices" value={practices?.length || 0} sub={`${kpi.practicesByProduct.length} product groups`} isDark={isDark} color="#0ea5e9" />
        <KpiMiniStat label="Total Logs" value={kpi.totalLogs} sub={`${kpi.open} open • ${kpi.closed} closed`} isDark={isDark} color="#8b5cf6" />
        <KpiMiniStat label="Resolution Rate" value={`${kpi.resolutionRate}%`} sub={`${kpi.closed} of ${kpi.totalLogs} closed`} isDark={isDark} color="#10b981" />
        <KpiMiniStat label="Avg / Practice" value={kpi.avgLogsPerPractice} sub={`${kpi.apptThisMonth} appts this month`} isDark={isDark} color="#f59e0b" />
      </div>

      {kpiView === 'overview' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Logs by Product</h3><KpiDonut data={kpi.byProductDonut} total={kpi.totalLogs} isDark={isDark} /></div>
            <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Top Practices by Logs</h3><KpiBarChart data={kpi.byPracticeTopChart} isDark={isDark} /></div>
          </div>
          <div className={kpiCard}><h3 className="font-bold text-sm mb-3">6-Month Trend: Logs vs Appointments</h3><KpiLineChart data={kpi.logsByMonth.map((m:any)=>({label:m.label, value:m.count}))} data2={kpi.apptsByMonth.map((m:any)=>({label:m.label, value:m.count}))} isDark={isDark} /></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiMiniStat label="Open" value={kpi.open} sub={`${kpi.openRate}% of total`} isDark={isDark} color="#3b82f6" />
            <KpiMiniStat label="In Progress" value={kpi.prog} sub={`${kpi.inProgressRate}%`} isDark={isDark} color="#f59e0b" />
            <KpiMiniStat label="Closed" value={kpi.closed} sub={`${kpi.resolutionRate}%`} isDark={isDark} color="#10b981" />
            <KpiMiniStat label="Avg Appts/Month" value={kpi.avgApptsPerMonth} sub="workload" isDark={isDark} color="#8b5cf6" />
          </div>
        </>
      )}

      {kpiView === 'trends' && (
        <>
          <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Last 14 Days - Logs Created</h3><KpiHeatStrip data={kpi.last14} isDark={isDark} /><div className="mt-3"><KpiBarChart data={kpi.last14} isDark={isDark} /></div></div>
          <div className={kpiCard}><h3 className="font-bold text-sm mb-3">6-Month Trend</h3><KpiLineChart data={kpi.logsByMonth.map((m:any)=>({label:m.label, value:m.count}))} data2={kpi.apptsByMonth.map((m:any)=>({label:m.label, value:m.count}))} isDark={isDark} /><div className="flex gap-3 mt-3 text-xs"><span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#0ea5e9]"></span>Logs</span><span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#8b5cf6]"></span>Appointments</span></div></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Logs per Month</h3><KpiBarChart data={kpi.logsByMonth.map((m:any)=>({label:m.label, value:m.count, color:'#0ea5e9'}))} isDark={isDark} /></div>
            <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Appointments per Month</h3><KpiBarChart data={kpi.apptsByMonth.map((m:any)=>({label:m.label, value:m.count, color:'#8b5cf6'}))} isDark={isDark} /></div>
          </div>
        </>
      )}

      {kpiView === 'products' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kpi.productDeepDive.map((p:any)=>(
              <div key={p.product} className={kpiCard}>
                <div className="flex items-center gap-2 mb-3"><span className="w-3 h-3 rounded-full" style={{background:p.color}}></span><h3 className="font-bold text-sm">{p.product}</h3></div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${isDark?'bg-[#1a2f4f]':'bg-blue-50'}`}><div className="text-[10px] uppercase font-bold text-slate-400">Total Logs</div><div className="font-black text-lg">{p.totalLogs}</div></div>
                  <div className={`p-2 rounded-lg ${isDark?'bg-[#1a2f4f]':'bg-blue-50'}`}><div className="text-[10px] uppercase font-bold text-slate-400">Practices</div><div className="font-black text-lg">{p.practices}</div></div>
                </div>
                <div className="flex gap-2 mb-2"><span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-bold">{p.open} Open</span><span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">{p.inProgress} Progress</span><span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-bold">{p.closed} Closed</span></div>
                <div className="mt-3"><div className="text-xs flex justify-between"><span>Resolution</span><span className="font-bold">{p.resolution}%</span></div><div className={`h-2 rounded-full mt-1 ${isDark?'bg-slate-700':'bg-slate-100'}`}><div className="h-full rounded-full" style={{width:`${p.resolution}%`, background:p.color}}></div></div></div>
                <div className="text-[11px] text-slate-400 mt-2">{p.logsPerPractice} logs per practice avg</div>
              </div>
            ))}
          </div>
          <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Product Distribution</h3><div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><KpiDonut data={kpi.byProductDonut} total={kpi.totalLogs} isDark={isDark} /><div><h4 className="font-bold text-xs mb-2">Practices by Product</h4><KpiBarChart data={kpi.practicesByProduct.map((x:any)=>({label:x.product.replace('Solv ',''), value:x.count, color: PRODUCT_COLORS[x.product]}))} isDark={isDark} horizontal /></div></div></div>
          <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Status Matrix by Product</h3><div className="space-y-3">{kpi.productStatusMatrix.map((row:any)=>(<div key={row.product} className="flex items-center gap-3"><div className="w-24 text-xs font-bold truncate">{row.product.replace('Solv ','')}</div><div className="flex-1 flex gap-1"><div className="h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold" style={{width:`${row.open? Math.max(10,(row.open/(row.open+row.inProgress+row.closed||1))*100):0}%`}}>{row.open>0?row.open:''}</div><div className="h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold" style={{width:`${row.inProgress? Math.max(10,(row.inProgress/(row.open+row.inProgress+row.closed||1))*100):0}%`}}>{row.inProgress>0?row.inProgress:''}</div><div className="h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold" style={{width:`${row.closed? Math.max(10,(row.closed/(row.open+row.inProgress+row.closed||1))*100):0}%`}}>{row.closed>0?row.closed:''}</div></div></div>))}</div></div>
        </>
      )}

      {kpiView === 'practices' && (
        <>
          <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Top 5 Practices - Most Logs</h3><KpiRankTable rows={kpi.byPracticeTop.map((p:any)=>({name:p.name, value:p.count}))} isDark={isDark} valueLabel="logs" /></div>
          <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Practice Health - Open Issues</h3><div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">{kpi.practiceHealth.slice(0,20).map((p:any,i:number)=>(<div key={p.name+i} className={`flex items-center gap-3 p-2 rounded-xl border ${isDark?'border-slate-600/50':'border-blue-100'}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white ${p.health==='good'?'bg-green-500':p.health==='watch'?'bg-amber-500':'bg-red-500'}`}>{p.open}</div><div className="flex-1 min-w-0"><div className="font-bold text-xs truncate">{p.name} <span className="text-slate-400 font-normal">{p.number?`#${p.number}`:''}</span></div><div className="text-[11px] text-slate-400 truncate">{p.product.replace('Solv ','')} • {p.contact||'No contact'} • {p.totalLogs} total logs</div></div><div className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.health==='good'?'bg-green-50 text-green-700':p.health==='watch'?'bg-amber-50 text-amber-700':'bg-red-50 text-red-700'}`}>{p.health}</div></div>))}</div></div>
        </>
      )}

      {kpiView === 'performance' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className={kpiCard}><KpiGauge value={kpi.resolutionRate} label="Resolution Rate" isDark={isDark} color="#10b981" /></div>
            <div className={kpiCard}><KpiGauge value={kpi.openRate} label="Open Rate" isDark={isDark} color="#3b82f6" /></div>
            <div className={kpiCard}><KpiGauge value={kpi.inProgressRate} label="In Progress" isDark={isDark} color="#f59e0b" /></div>
            <div className={kpiCard}><div className="text-center py-4"><div className="text-3xl font-black">{kpi.totalLogs}</div><div className="text-xs text-slate-400 mt-1">Total Logs</div><div className="text-xs mt-3">{kpi.closed} closed / {kpi.open} open</div></div></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Product Performance - Resolution</h3><div className="space-y-3">{kpi.productDeepDive.map((p:any)=>(<div key={p.product} className="space-y-1"><div className="flex justify-between text-xs"><span className="font-bold">{p.product.replace('Solv ','')}</span><span>{p.resolution}% • {p.closed}/{p.totalLogs}</span></div><div className={`h-2 rounded-full ${isDark?'bg-slate-700':'bg-slate-100'}`}><div className="h-full rounded-full transition-all" style={{width:`${p.resolution}%`, background:p.color}}></div></div></div>))}</div></div>
            <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Overall Status</h3><KpiDonut data={[{label:'Open', value:kpi.open, color:'#3b82f6'},{label:'In Progress', value:kpi.prog, color:'#f59e0b'},{label:'Closed', value:kpi.closed, color:'#10b981'}]} total={kpi.totalLogs} isDark={isDark} /></div>
          </div>
        </>
      )}

      {kpiView === 'time' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Logs by Day of Week</h3><KpiBarChart data={kpi.logsByDayMonFirst} isDark={isDark} /></div>
            <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Logs by Hour Bucket</h3><KpiBarChart data={kpi.hourBuckets} isDark={isDark} /></div>
          </div>
          <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Last 14 Days Activity</h3><KpiHeatStrip data={kpi.last14} isDark={isDark} /><div className="mt-4"><KpiBarChart data={kpi.last14} isDark={isDark} /></div></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Monthly Logs</h3><KpiLineChart data={kpi.logsByMonth.map((m:any)=>({label:m.label, value:m.count}))} isDark={isDark} /></div>
            <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Monthly Appointments</h3><KpiLineChart data={kpi.apptsByMonth.map((m:any)=>({label:m.label, value:m.count}))} isDark={isDark} /></div>
          </div>
        </>
      )}

      {kpiView === 'workload' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiMiniStat label="Open Issues" value={kpi.open} sub="needs attention" isDark={isDark} color="#ef4444" />
            <KpiMiniStat label="In Progress" value={kpi.prog} sub="being worked" isDark={isDark} color="#f59e0b" />
            <KpiMiniStat label="This Month Appts" value={kpi.apptThisMonth} sub="appointments" isDark={isDark} color="#8b5cf6" />
            <KpiMiniStat label="Avg Logs/Practice" value={kpi.avgLogsPerPractice} sub="workload per client" isDark={isDark} color="#0ea5e9" />
          </div>
          <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Appointment Types</h3><KpiBarChart data={kpi.byType.map((x:any)=>({label:x.type, value:x.count}))} isDark={isDark} /></div>
          <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Product Workload Matrix</h3><div className="space-y-2">{kpi.productStatusMatrix.map((row:any)=>(<div key={row.product} className={`flex items-center gap-2 p-2 rounded-lg ${isDark?'bg-[#1a2f4f]':'bg-blue-50/50'}`}><div className="w-3 h-3 rounded-full" style={{background:row.color}}></div><div className="w-20 text-xs font-bold truncate">{row.product.replace('Solv ','')}</div><div className="flex-1 grid grid-cols-3 gap-2 text-xs"><div>Open: <b>{row.open}</b></div><div>Progress: <b>{row.inProgress}</b></div><div>Closed: <b>{row.closed}</b></div></div></div>))}</div></div>
          <div className={kpiCard}><h3 className="font-bold text-sm mb-3">Practice Health - Attention Needed</h3><KpiRankTable rows={kpi.practiceHealth.filter((p:any)=>p.open>0).slice(0,10).map((p:any)=>({name:p.name, value:p.open, extra:`${p.totalLogs} total • ${p.product.replace('Solv ','')}`, color:p.health==='attention'?'#ef4444':p.health==='watch'?'#f59e0b':'#10b981'}))} isDark={isDark} valueLabel="open" /></div>
        </>
      )}
    </div>
  )
}
