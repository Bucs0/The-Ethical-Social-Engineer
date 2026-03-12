import { useState } from 'react'
import { supabase } from '../lib/supabase'

const SECURITY_TIPS = [
  { icon: '🔍', title: 'Verify Before You Connect', desc: 'Always confirm WiFi networks with the establishment or barangay hall before entering credentials.' },
  { icon: '🔒', title: 'Enable Multi-Factor Authentication', desc: 'Use MFA on all accounts so that even if credentials are captured, attackers cannot log in.' },
  { icon: '⚠️', title: 'Be Skeptical of "Free" Offers', desc: 'Captive portals that ask for passwords or PINs are a red flag — legitimate free WiFi never needs your account password.' },
  { icon: '🛡️', title: 'Keep Antivirus Updated', desc: 'Updated security software can detect and block phishing pages and suspicious network activity.' },
  { icon: '📵', title: 'Ignore Urgent or Threatening Messages', desc: 'Social engineers create urgency to bypass your critical thinking. Pause and verify before acting.' },
]

const TRIGGERS = [
  { label: 'Authority', color: 'bg-blue-100 text-blue-700', desc: 'Globe/PLDT + Barangay branding implies official government/ISP backing' },
  { label: 'Trust', color: 'bg-green-100 text-green-700', desc: 'Familiar telecom logos and "Community WiFi Program" language build credibility' },
  { label: 'Reward', color: 'bg-yellow-100 text-yellow-700', desc: '"FREE 1-hour session" incentivizes immediate action without questioning' },
  { label: 'Urgency', color: 'bg-orange-100 text-orange-700', desc: '"Session expires in 60 minutes. Save this PIN — you will be locked out without it." creates time pressure' },
  { label: 'Normalcy', color: 'bg-purple-100 text-purple-700', desc: 'Captive portals are normal on public WiFi, lowering the victim\'s guard' },
]

export default function Portal() {
  const [form, setForm] = useState({ email: '', mobile: '', pin: '' })
  const [status, setStatus] = useState('idle')
  const [showTriggers, setShowTriggers] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')

    await supabase.from('entries').insert({
      email: form.email,
      mobile: form.mobile,
      pin: form.pin || '(not entered)',
      device: navigator.userAgent.substring(0, 150),
    })

    setTimeout(() => setStatus('success'), 1600)
    setTimeout(() => setStatus('revealed'), 4500)
  }

  if (status === 'revealed') {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col">
        <div className="bg-amber-500 px-5 py-4 text-center shadow-md">
          <p className="text-white font-black text-lg tracking-wide">SECURITY AWARENESS TRAINING</p>
          <p className="text-amber-100 text-xs mt-0.5">ITEC 85 — Ethical Social Engineering Simulation</p>
        </div>
        <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">

          <div className="bg-white border-2 border-amber-400 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl flex-shrink-0">🎭</div>
              <div>
                <h1 className="text-red-600 font-extrabold text-xl leading-tight">You Were Socially Engineered!</h1>
                <p className="text-gray-500 text-xs mt-0.5">This was a controlled academic simulation</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 space-y-1.5 leading-relaxed">
              <p>This was NOT a real WiFi portal. "BrgyFreeWiFi_Ph1" was a simulated phishing hotspot created for ITEC 85 Activity 2.</p>
              <p>No real data was collected beyond this experiment. All entries will be deleted after decommissioning.</p>
              <p>No information was transmitted to any unauthorized third party.</p>
              <p>This activity complies with RA 10175 — Cybercrime Prevention Act of 2012.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
            <h2 className="font-bold text-gray-800 text-sm mb-3">What You Submitted</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                <span className="text-gray-500">Email</span>
                <span className="font-mono font-semibold text-gray-800">{form.email}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                <span className="text-gray-500">Mobile</span>
                <span className="font-mono font-semibold text-gray-800">{form.mobile}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">PIN</span>
                <span className={`font-mono font-semibold ${form.pin ? 'text-red-600' : 'text-gray-400 italic'}`}>
                  {form.pin ? form.pin : 'not entered'}
                </span>
              </div>
            </div>
            {form.pin && (
              <p className="mt-3 text-xs text-red-500 bg-red-50 rounded-lg p-2.5">
                You entered a PIN — in a real attack, this could be your account password or OTP, now in the attacker's hands.
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
            <button
              onClick={() => setShowTriggers(prev => !prev)}
              className="w-full flex items-center justify-between text-sm font-bold text-gray-800"
            >
              <span>Psychological Triggers Used in This Attack</span>
              <span className="text-gray-400">{showTriggers ? 'Hide' : 'Show'}</span>
            </button>
            {showTriggers && (
              <div className="mt-4 space-y-3">
                {TRIGGERS.map(t => (
                  <div key={t.label} className="flex items-start gap-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${t.color}`}>{t.label}</span>
                    <p className="text-xs text-gray-600 leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
            <h2 className="font-bold text-gray-800 text-sm mb-4">How to Protect Yourself</h2>
            <div className="space-y-4">
              {SECURITY_TIPS.map(tip => (
                <div key={tip.title} className="flex gap-3">
                  <span className="text-xl flex-shrink-0">{tip.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{tip.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700 leading-relaxed">
            <p className="font-bold mb-1">Legal and Ethical Compliance</p>
            <p>This activity complies with the Cybercrime Prevention Act of 2012 (RA 10175). The participant agreed to take part, no real credentials were collected, and all data will be securely decommissioned. Conducted strictly for academic purposes at CvSU Bacoor — ITEC 85.</p>
          </div>

          <button
            onClick={() => { setStatus('idle'); setForm({ email: '', mobile: '', pin: '' }); setShowTriggers(false) }}
            className="w-full mt-6 bg-[#003087] text-white font-bold rounded-xl py-3 text-sm hover:bg-[#002470] transition"
          >
            Run Simulation Again
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#eef2f7] flex flex-col">
      <header className="bg-gradient-to-r from-[#003087] via-[#0057b8] to-[#00a651] px-5 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-1.5">
          <span className="text-white font-black text-xl tracking-tight">Globe</span>
          <span className="text-white/60 font-light text-xl">•</span>
          <span className="text-white font-black text-xl tracking-tight">PLDT</span>
          <span className="text-white/80 font-light text-lg ml-1.5">WiFi</span>
        </div>
        <div className="text-right">
          <span className="text-[#00e676] font-black text-sm tracking-widest">FREE</span>
          <p className="text-white/60 text-[10px] leading-none mt-0.5 hidden sm:block">Community Hotspot Network</p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg shadow-blue-900/10 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-[#003087] via-[#0057b8] to-[#00a651]" />
          <div className="px-6 sm:px-10 py-8">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
                  <path d="M4 16 C10 9, 30 9, 36 16" stroke="#0057b8" strokeWidth="3" strokeLinecap="round" fill="none"/>
                  <path d="M9 21 C13 16.5, 27 16.5, 31 21" stroke="#0057b8" strokeWidth="3" strokeLinecap="round" fill="none"/>
                  <path d="M14 26 C16.5 23.5, 23.5 23.5, 26 26" stroke="#0057b8" strokeWidth="3" strokeLinecap="round" fill="none"/>
                  <circle cx="20" cy="31" r="2.5" fill="#00a651"/>
                </svg>
              </div>
            </div>
            <h1 className="text-center text-[#003087] font-extrabold text-2xl sm:text-3xl mb-1">Connect to Free WiFi</h1>
            <p className="text-center text-gray-500 text-sm mb-7">
              Network: <span className="text-[#0057b8] font-semibold">BrgyFreeWiFi_Ph1</span>
            </p>
            <hr className="border-gray-100 mb-6" />
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="yourname@email.com" required autoComplete="off"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 outline-none focus:border-[#0057b8] focus:bg-white transition placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                <input
                  type="tel" name="mobile" value={form.mobile} onChange={handleChange}
                  placeholder="09XXXXXXXXX" required autoComplete="off" maxLength={11}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 outline-none focus:border-[#0057b8] focus:bg-white transition placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Create Access PIN</label>
                <input
                  type="password" name="pin" value={form.pin} onChange={handleChange}
                  placeholder="Enter a 4–6 digit PIN" autoComplete="off" maxLength={6} inputMode="numeric"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 outline-none focus:border-[#0057b8] focus:bg-white transition placeholder-gray-400"
                />
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Session expires in 60 minutes. Save this PIN — you will be locked out without it.
                </p>
              </div>
              <button
                type="submit" disabled={status !== 'idle'}
                className="w-full bg-[#003087] hover:bg-[#002470] text-white font-bold rounded-xl py-3.5 text-base tracking-wide transition active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
              >
                {status === 'loading' && (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                )}
                {status === 'idle' && 'Connect to Internet'}
                {status === 'loading' && 'Connecting...'}
                {status === 'success' && 'Connected!'}
              </button>
            </form>
            <p className="text-center text-[11px] text-gray-400 mt-4 leading-relaxed px-2">
              By connecting, you agree to the <span className="text-[#0057b8]">Terms of Use</span> and{' '}
              <span className="text-[#0057b8]">Privacy Policy</span>.
              Your information is used solely for network access verification.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-5 text-center text-xs text-gray-400 px-4">
        Powered by <span className="text-[#003087] font-semibold">Globe Telecom</span> and <span className="text-[#00a651] font-semibold">PLDT</span> Community WiFi Program
      </footer>

      {status === 'success' && (
        <div className="fixed inset-0 bg-[#001a5e]/90 z-50 flex flex-col items-center justify-center text-center px-8">
          <div className="w-20 h-20 rounded-full bg-[#00a651] flex items-center justify-center mb-5 animate-bounce shadow-lg">
            <svg viewBox="0 0 44 44" fill="none" className="w-10 h-10">
              <path d="M10 22l9 9 15-16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-white text-2xl font-extrabold">You are Connected!</h2>
          <p className="text-white/70 text-sm mt-2 leading-relaxed">
            Welcome to BrgyFreeWiFi_Ph1<br/>Your 1-hour free session is now active.
          </p>
          <div className="w-56 h-1.5 bg-white/20 rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-[#00e676] rounded-full" style={{ width: '100%', transition: 'width 3.5s ease' }}/>
          </div>
          <p className="text-white/40 text-xs mt-3">Loading security awareness training...</p>
        </div>
      )}
    </div>
  )
}
