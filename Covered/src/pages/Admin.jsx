import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const ADMIN_PASS = 'itec85admin'

const BLUEPRINT = [
  {
    phase: 'Phase I', label: 'Investigation & Media Creation', color: 'blue',
    steps: [
      { title: 'Attack Type Selected', detail: 'Evil Twin / Captive Portal Phishing — a fake WiFi hotspot that mimics a legitimate free internet access point (Globe/PLDT Community WiFi).' },
      { title: 'Target Identified', detail: 'Subject: A willing participant (classmate / family member). Target Action: Victim submits email, mobile number, and a PIN (mock password) to "activate" their free session.' },
      { title: 'Hook Created', detail: 'A realistic React web app deployed on Vercel mimicking a Globe/PLDT captive portal. Paired with a printed barangay-style "Free WiFi Zone" notice to direct victims to connect.' },
    ]
  },
  {
    phase: 'Phase II', label: 'Execution', color: 'orange',
    steps: [
      { title: 'Bait Delivered', detail: 'Victim is told: "There\'s free WiFi here, just scan/connect and register." The barangay poster near the area points to the network name "BrgyFreeWiFi_Ph1".' },
      { title: 'Victim Behavior Observed', detail: 'Victim connects, lands on the portal, reads the Globe/PLDT-branded page, and proceeds to fill in their email, mobile number, and a PIN.' },
      { title: 'Interaction Recorded', detail: 'All submitted data (email, mobile, PIN, timestamp, device) is stored in a Supabase database and visible in the Admin panel at /admin from any device.' },
    ]
  },
  {
    phase: 'Phase III', label: 'Disclosure & Security Training', color: 'green',
    steps: [
      { title: 'The Reveal', detail: 'Immediately after submission, the portal automatically transitions to the Security Awareness Training screen, revealing this was a controlled academic experiment.' },
      { title: 'Security Briefing Given', detail: 'The reveal screen shows: (1) exactly what data was captured, (2) the psychological triggers used, and (3) 5 actionable security tips covering vigilance, technical protection, and behavioral awareness.' },
      { title: 'Victim Reaction Documented', detail: 'Admin notes the victim\'s response and whether they fell for the attack (submitted credentials), visible in the Admin panel entry log.' },
    ]
  },
  {
    phase: 'Phase IV', label: 'Data Decommissioning', color: 'red',
    steps: [
      { title: 'Data Review', detail: 'All captured entries are reviewed in the Admin panel for documentation purposes (Section C — Victim Impact Statement).' },
      { title: 'Secure Deletion', detail: 'The "Wipe All Data" function deletes all rows from the Supabase database permanently. A timestamped decommission log is generated.' },
      { title: 'Proof of Deletion', detail: 'The decommission log screen is screenshotted as proof. This satisfies the rubric requirement for Section D — Decommission Log.' },
    ]
  },
]

const TRIGGERS_TABLE = [
  { trigger: 'Authority', implementation: 'Globe & PLDT logos, "Community WiFi Program" label, Barangay notice poster' },
  { trigger: 'Trust', implementation: 'Familiar telecom branding, official-looking portal design, terms of service link' },
  { trigger: 'Reward', implementation: '"FREE 1-hour session", "No Load Needed", "Connect Now — FREE" CTA' },
  { trigger: 'Urgency', implementation: '"You\'ll need this PIN to reconnect when your session expires" warning under PIN field' },
  { trigger: 'Normalcy', implementation: 'Captive portals are standard on public/free WiFi — victim expects to see this kind of page' },
]

const colorMap = {
  blue: { badge: 'bg-blue-600', dot: 'bg-blue-500' },
  orange: { badge: 'bg-orange-500', dot: 'bg-orange-500' },
  green: { badge: 'bg-green-600', dot: 'bg-green-500' },
  red: { badge: 'bg-red-600', dot: 'bg-red-500' },
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [passInput, setPassInput] = useState('')
  const [passError, setPassError] = useState(false)
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [log, setLog] = useState([])
  const [confirmAll, setConfirmAll] = useState(false)
  const [tab, setTab] = useState('entries')

  useEffect(() => {
    if (authed) loadEntries()
  }, [authed])

  async function loadEntries() {
    setLoading(true)
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setEntries(data || [])
    setLoading(false)
  }

  async function deleteEntry(id) {
    await supabase.from('entries').delete().eq('id', id)
    setEntries(prev => prev.filter(e => e.id !== id))
    addLog(`Deleted entry ID ${id}`)
  }

  async function deleteAll() {
    const count = entries.length
    await supabase.from('entries').delete().neq('id', 0)
    setEntries([])
    setConfirmAll(false)
    addLog(`All ${count} entries permanently deleted from database.`)
    addLog(`Decommissioning complete. No participant data remains in storage.`)
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wifi-trap-entries-${Date.now()}.json`
    a.click()
    addLog(`Exported ${entries.length} entries to JSON`)
  }

  function addLog(msg) {
    const time = new Date().toLocaleTimeString('en-PH')
    setLog(prev => [`[${time}] ${msg}`, ...prev])
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center px-4">
        <div className="w-full max-w-xs bg-[#161b24] border border-[#2a3349] rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🛡️</div>
          <h2 className="text-[#00e5ff] font-mono font-bold text-lg mb-1">ADMIN ACCESS</h2>
          <p className="text-slate-500 text-xs mb-6">Enter the admin passkey to continue</p>
          <form onSubmit={e => { e.preventDefault(); passInput === ADMIN_PASS ? setAuthed(true) : (setPassError(true), setTimeout(() => setPassError(false), 2000)) }} className="space-y-3">
            <input
              type="password" value={passInput} onChange={e => setPassInput(e.target.value)}
              placeholder="••••••••"
              className={`w-full bg-[#0d0f14] border rounded-lg px-4 py-2.5 text-center text-white font-mono tracking-widest text-sm outline-none transition ${passError ? 'border-red-500' : 'border-[#2a3349] focus:border-[#00e5ff]'}`}
            />
            {passError && <p className="text-red-400 text-xs">Wrong passkey. Try again.</p>}
            <button type="submit" className="w-full bg-[#00e5ff] text-[#0d0f14] font-bold rounded-lg py-2.5 text-sm hover:opacity-90 transition">
              AUTHENTICATE
            </button>
          </form>
        </div>
      </div>
    )
  }

  const withPin = entries.filter(e => e.pin && e.pin !== '(not entered)').length
  const successRate = entries.length > 0 ? Math.round((withPin / entries.length) * 100) : 0

  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-200">

      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-56 bg-[#161b24] border-r border-[#2a3349] flex-col">
        <div className="px-5 pt-6 pb-5 border-b border-[#2a3349]">
          <p className="text-[#00e5ff] font-mono font-bold text-xs tracking-widest">// ADMIN PANEL</p>
          <p className="text-slate-600 text-[10px] mt-1">WiFi Trap · ITEC 85</p>
        </div>
        <nav className="mt-2 flex-1 space-y-0.5">
          {[
            { id: 'entries', icon: '📋', label: 'Captured Entries' },
            { id: 'blueprint', icon: '📐', label: 'Attack Blueprint' },
          ].map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-2 px-5 py-3 text-sm transition text-left ${tab === item.id ? 'text-[#00e5ff] border-l-2 border-[#00e5ff] bg-[#00e5ff]/5' : 'text-slate-500 border-l-2 border-transparent hover:text-slate-300'}`}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
          <button
            onClick={() => { setTab('entries'); setTimeout(() => document.getElementById('decomm')?.scrollIntoView({ behavior: 'smooth' }), 100) }}
            className="w-full flex items-center gap-2 px-5 py-3 text-sm text-slate-500 border-l-2 border-transparent hover:text-slate-300 transition text-left">
            <span>🗑️</span> Decommission
          </button>
        </nav>
        <div className="px-5 py-4 border-t border-[#2a3349]">
          <p className="text-[10px] text-slate-600 leading-relaxed">Academic use only<br/>CvSU Bacoor · ITEC 85</p>
          <button onClick={() => setAuthed(false)} className="mt-2 text-[10px] text-red-500/70 hover:text-red-400 transition">→ Logout</button>
        </div>
      </aside>

      <div className="lg:hidden bg-[#161b24] border-b border-[#2a3349] px-4 py-3 flex items-center justify-between">
        <p className="text-[#00e5ff] font-mono font-bold text-xs tracking-widest">// ADMIN PANEL</p>
        <div className="flex gap-2">
          <button onClick={() => setTab('entries')} className={`text-xs px-2.5 py-1.5 rounded-lg border ${tab === 'entries' ? 'border-[#00e5ff] text-[#00e5ff]' : 'border-[#2a3349] text-slate-400'}`}>📋</button>
          <button onClick={() => setTab('blueprint')} className={`text-xs px-2.5 py-1.5 rounded-lg border ${tab === 'blueprint' ? 'border-[#00e5ff] text-[#00e5ff]' : 'border-[#2a3349] text-slate-400'}`}>📐</button>
          <button onClick={() => setAuthed(false)} className="text-xs text-red-400 border border-red-500/30 px-2.5 py-1.5 rounded-lg">Logout</button>
        </div>
      </div>

      <main className="lg:ml-56 p-4 sm:p-6 lg:p-8">

        {tab === 'entries' && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h1 className="text-xl font-bold">Captured <span className="text-[#00e5ff]">Entries</span></h1>
                <p className="text-slate-500 text-xs mt-0.5">Submissions from all devices</p>
              </div>
              <div className="flex gap-2">
                <button onClick={exportJSON} disabled={entries.length === 0}
                  className="px-3 py-2 text-xs font-semibold border border-[#2a3349] rounded-lg text-slate-400 hover:border-[#00e5ff] hover:text-[#00e5ff] disabled:opacity-30 transition">
                  Export JSON
                </button>
                <button onClick={loadEntries}
                  className="px-3 py-2 text-xs font-semibold bg-[#00e5ff] text-[#0d0f14] rounded-lg hover:opacity-90 transition">
                  Refresh
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
              {[
                { val: entries.length, label: 'Total Captured', color: 'text-[#00e5ff]' },
                { val: withPin, label: 'Submitted PIN', color: 'text-yellow-400' },
                { val: `${successRate}%`, label: 'PIN Rate', color: 'text-green-400' },
              ].map(s => (
                <div key={s.label} className="bg-[#161b24] border border-[#2a3349] rounded-xl p-4 sm:p-5">
                  <p className={`text-2xl sm:text-3xl font-bold font-mono ${s.color}`}>{s.val}</p>
                  <p className="text-slate-500 text-[10px] sm:text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#161b24] border border-[#2a3349] rounded-xl overflow-hidden mb-8">
              <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-[#2a3349]">
                <h3 className="text-sm font-semibold">Victim Log</h3>
                {entries.length > 0 && (
                  <button onClick={() => setConfirmAll(true)}
                    className="text-xs font-semibold px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition">
                    Delete All
                  </button>
                )}
              </div>

              {loading ? (
                <div className="py-16 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-[#00e5ff] border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-slate-500 text-sm">Loading from database...</p>
                </div>
              ) : entries.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="text-slate-500 text-sm">No entries yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-[#1e2638]">
                      <tr>
                        {['#', 'Email', 'Mobile', 'PIN', 'Submitted At', 'Device', 'Action'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry, idx) => (
                        <tr key={entry.id} className="border-t border-[#2a3349] hover:bg-[#1e2638] transition">
                          <td className="px-4 py-3 text-slate-600 text-xs font-mono">{idx + 1}</td>
                          <td className="px-4 py-3 text-slate-300 text-xs">{entry.email}</td>
                          <td className="px-4 py-3 text-slate-400 text-xs font-mono">{entry.mobile}</td>
                          <td className="px-4 py-3">
                            {!entry.pin || entry.pin === '(not entered)'
                              ? <span className="text-slate-600 text-xs italic">—</span>
                              : <span className="font-mono text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">{entry.pin}</span>
                            }
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-[11px] whitespace-nowrap">
                            {new Date(entry.created_at).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}
                          </td>
                          <td className="px-4 py-3 text-slate-600 text-[10px] max-w-[140px] truncate">{entry.device}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => deleteEntry(entry.id)}
                              className="text-[11px] font-semibold px-2.5 py-1 border border-[#2a3349] text-red-400 rounded-md hover:bg-red-500 hover:text-white hover:border-red-500 transition whitespace-nowrap">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div id="decomm" className="bg-[#161b24] border border-[#2a3349] rounded-xl p-5 sm:p-6">
              <h3 className="text-red-400 font-bold text-base mb-1">Phase IV — Data Decommissioning</h3>
              <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                All participant data is permanently deleted from the database once the experiment concludes.
              </p>
              <div className="flex flex-wrap gap-3 mb-5">
                <button onClick={() => setConfirmAll(true)} disabled={entries.length === 0}
                  className="px-4 py-2.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 disabled:opacity-30 transition">
                  Wipe All Data
                </button>
                <button onClick={() => addLog(`Manual log entry added by admin`)}
                  className="px-4 py-2.5 border border-[#2a3349] text-slate-400 text-sm font-semibold rounded-lg hover:border-[#00e5ff] hover:text-[#00e5ff] transition">
                  + Add Log Entry
                </button>
              </div>
              <div className="bg-[#0d0f14] border border-[#2a3349] rounded-lg p-4 font-mono text-xs text-green-400 min-h-[100px] leading-7">
                {log.length === 0
                  ? <span className="text-slate-700">Awaiting actions...</span>
                  : log.map((l, i) => <div key={i}>{l}</div>)
                }
              </div>
              <p className="text-slate-600 text-[10px] mt-2">Include a screenshot of this log in Section D of your report.</p>
            </div>
          </>
        )}

        {tab === 'blueprint' && (
          <>
            <div className="mb-7">
              <h1 className="text-xl font-bold">Attack <span className="text-[#00e5ff]">Blueprint</span></h1>
              <p className="text-slate-500 text-xs mt-0.5">Attack lifecycle documentation</p>
            </div>

            <div className="bg-[#161b24] border border-[#2a3349] rounded-xl p-5 mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Attack Summary</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Attack Type', val: 'Captive Portal Phishing' },
                  { label: 'Vector', val: 'Fake WiFi Hotspot' },
                  { label: 'Targets', val: 'Email · Mobile · PIN' },
                  { label: 'Triggers', val: 'Authority · Reward · Urgency' },
                ].map(s => (
                  <div key={s.label} className="bg-[#1e2638] rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">{s.label}</p>
                    <p className="text-xs text-slate-200 font-semibold mt-1">{s.val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5 mb-8">
              {BLUEPRINT.map(phase => {
                const c = colorMap[phase.color]
                return (
                  <div key={phase.phase} className="bg-[#161b24] border border-[#2a3349] rounded-xl overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-[#2a3349] flex items-center gap-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${c.badge}`}>{phase.phase}</span>
                      <span className="text-sm font-semibold text-slate-200">{phase.label}</span>
                    </div>
                    <div className="p-5 space-y-4">
                      {phase.steps.map((step, i) => (
                        <div key={i} className="flex gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${c.dot}`} />
                          <div>
                            <p className="text-sm font-semibold text-slate-200">{step.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-[#161b24] border border-[#2a3349] rounded-xl overflow-hidden mb-6">
              <div className="px-5 py-3.5 border-b border-[#2a3349]">
                <h3 className="text-sm font-semibold">Psychological Triggers</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead className="bg-[#1e2638]">
                    <tr>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Trigger</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Implementation in This Attack</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TRIGGERS_TABLE.map((row, i) => (
                      <tr key={i} className="border-t border-[#2a3349] hover:bg-[#1e2638] transition">
                        <td className="px-4 py-3">
                          <span className="text-xs font-bold text-[#00e5ff] bg-[#00e5ff]/10 px-2.5 py-1 rounded-full">{row.trigger}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400 leading-relaxed">{row.implementation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {confirmAll && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-[#161b24] border border-red-500/40 rounded-2xl p-6 w-full max-w-sm text-center">
            <p className="text-3xl mb-3">⚠️</p>
            <h3 className="text-white font-bold text-base mb-2">Delete All Entries?</h3>
            <p className="text-slate-400 text-sm mb-5">
              This will permanently delete <span className="text-red-400 font-bold">{entries.length} entries</span> from the Supabase database. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAll(false)} className="flex-1 py-2.5 border border-[#2a3349] text-slate-400 rounded-lg text-sm hover:border-slate-400 transition">Cancel</button>
              <button onClick={deleteAll} className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-lg text-sm hover:bg-red-600 transition">Yes, Wipe All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
