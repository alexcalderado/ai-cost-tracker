'use client'

import { useState } from 'react'
import Link from 'next/link'

interface UsageData {
  provider: string
  totalCost: number
  byModel: { model: string; cost: number; tokens: number }[]
  byDay: { date: string; cost: number }[]
  error?: string
}

interface Membership {
  name: string
  cost: number
  enabled: boolean
}

const DEFAULT_MEMBERSHIPS: Membership[] = [
  { name: 'Anthropic Max', cost: 100, enabled: false },
  { name: 'Anthropic Pro', cost: 20, enabled: false },
  { name: 'OpenAI Pro', cost: 200, enabled: false },
  { name: 'OpenAI Plus', cost: 20, enabled: false },
  { name: 'Claude Pro (via Claude.ai)', cost: 20, enabled: false },
  { name: 'Cursor Pro', cost: 20, enabled: false },
  { name: 'GitHub Copilot', cost: 10, enabled: false },
]

export default function Dashboard() {
  // API Keys
  const [keys, setKeys] = useState({
    anthropic: '',
    openai: '',
    google: '',
    minimax: '',
    mistral: '',
    groq: '',
    together: '',
    replicate: '',
  })
  
  const [loading, setLoading] = useState(false)
  const [usage, setUsage] = useState<UsageData[]>([])
  const [error, setError] = useState('')
  
  // Memberships
  const [memberships, setMemberships] = useState<Membership[]>(DEFAULT_MEMBERSHIPS)
  const [customMembership, setCustomMembership] = useState({ name: '', cost: '' })
  
  // Manual API spend (for when APIs don't work)
  const [manualSpend, setManualSpend] = useState<Record<string, string>>({
    anthropic: '',
    openai: '',
    google: '',
    other: '',
  })

  const updateKey = (provider: string, value: string) => {
    setKeys(prev => ({ ...prev, [provider]: value }))
  }

  const toggleMembership = (index: number) => {
    setMemberships(prev => prev.map((m, i) => 
      i === index ? { ...m, enabled: !m.enabled } : m
    ))
  }

  const addCustomMembership = () => {
    if (customMembership.name && customMembership.cost) {
      setMemberships(prev => [...prev, {
        name: customMembership.name,
        cost: parseFloat(customMembership.cost),
        enabled: true,
      }])
      setCustomMembership({ name: '', cost: '' })
    }
  }

  const fetchUsage = async () => {
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Failed to fetch usage')
        return
      }
      
      setUsage(data.usage)
    } catch (e) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const hasAnyKey = Object.values(keys).some(k => k.length > 0)
  const apiCostFromFetch = usage.reduce((sum, u) => sum + u.totalCost, 0)
  const manualApiCost = Object.values(manualSpend).reduce((sum, v) => sum + (parseFloat(v) || 0), 0)
  const apiCost = apiCostFromFetch + manualApiCost
  const membershipCost = memberships.filter(m => m.enabled).reduce((sum, m) => sum + m.cost, 0)
  const totalCost = apiCost + membershipCost

  const providers = [
    { id: 'anthropic', name: 'Anthropic', placeholder: 'sk-ant-...' },
    { id: 'openai', name: 'OpenAI', placeholder: 'sk-...' },
    { id: 'google', name: 'Google (Gemini)', placeholder: 'AIza...' },
    { id: 'minimax', name: 'Minimax', placeholder: 'eyJ...' },
    { id: 'mistral', name: 'Mistral', placeholder: '...' },
    { id: 'groq', name: 'Groq', placeholder: 'gsk_...' },
    { id: 'together', name: 'Together AI', placeholder: '...' },
    { id: 'replicate', name: 'Replicate', placeholder: 'r8_...' },
  ]

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700 py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-white">
            Token Cost Guard
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Total Cost Card - Always Visible */}
        <div className="bg-gradient-to-r from-emerald-900/50 to-gray-800 rounded-xl p-6 mb-8 border border-emerald-500/30">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total AI Spend (This Month)</h3>
          <p className="text-5xl font-bold text-white">${totalCost.toFixed(2)}</p>
          <div className="flex gap-6 mt-2 text-sm">
            <span className="text-gray-400">API Usage: <span className="text-emerald-400">${apiCost.toFixed(2)}</span></span>
            <span className="text-gray-400">Memberships: <span className="text-emerald-400">${membershipCost.toFixed(2)}/mo</span></span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* API Keys Form */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">🔑 API Keys</h2>
            <p className="text-gray-400 text-sm mb-4">Enter your API keys to fetch usage. Keys are only used for this request — we don't store them.</p>
            
            <div className="space-y-3">
              {providers.map((p) => (
                <div key={p.id}>
                  <label className="block text-gray-400 text-xs mb-1">{p.name}</label>
                  <input
                    type="password"
                    value={keys[p.id as keyof typeof keys]}
                    onChange={(e) => updateKey(p.id, e.target.value)}
                    placeholder={p.placeholder}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              ))}
            </div>
            
            <button
              onClick={fetchUsage}
              disabled={loading || !hasAnyKey}
              className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              {loading ? 'Fetching...' : 'Fetch API Usage'}
            </button>
            
            {error && (
              <p className="text-red-400 mt-2 text-sm">{error}</p>
            )}
          </div>

          {/* Manual API Spend */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">📝 API Spend (Manual)</h2>
            <p className="text-gray-400 text-sm mb-4">Enter your API costs from provider dashboards. Most usage APIs require admin keys.</p>
            
            <div className="space-y-3">
              {[
                { id: 'anthropic', name: 'Anthropic API' },
                { id: 'openai', name: 'OpenAI API' },
                { id: 'google', name: 'Google/Other' },
              ].map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <label className="text-gray-300 text-sm w-28">{p.name}</label>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={manualSpend[p.id as keyof typeof manualSpend]}
                      onChange={(e) => setManualSpend(prev => ({ ...prev, [p.id]: e.target.value }))}
                      placeholder="0.00"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-7 pr-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-gray-500 text-xs mt-3">
              Find your spend: <a href="https://console.anthropic.com/settings/billing" target="_blank" className="text-emerald-400 hover:underline">Anthropic</a> · <a href="https://platform.openai.com/usage" target="_blank" className="text-emerald-400 hover:underline">OpenAI</a>
            </p>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Membership Fees */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">💳 Monthly Memberships</h2>
            <p className="text-gray-400 text-sm mb-4">Check any subscriptions you're paying for.</p>
            
            <div className="space-y-2">
              {memberships.map((m, i) => (
                <label key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={m.enabled}
                      onChange={() => toggleMembership(i)}
                      className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-white">{m.name}</span>
                  </div>
                  <span className="text-emerald-400 font-medium">${m.cost}/mo</span>
                </label>
              ))}
            </div>
            
            {/* Add Custom */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Add custom subscription:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customMembership.name}
                  onChange={(e) => setCustomMembership(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Name"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="number"
                  value={customMembership.cost}
                  onChange={(e) => setCustomMembership(prev => ({ ...prev, cost: e.target.value }))}
                  placeholder="$/mo"
                  className="w-24 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={addCustomMembership}
                  disabled={!customMembership.name || !customMembership.cost}
                  className="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-3 py-2 rounded-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Results */}
        {usage.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">📊 API Usage Breakdown</h2>
            
            {/* By Provider */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {usage.map((u) => (
                <div key={u.provider} className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 capitalize">{u.provider}</h3>
                  {u.error ? (
                    <p className="text-yellow-400 text-sm">{u.error}</p>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-emerald-400 mb-4">${u.totalCost.toFixed(2)}</p>
                      
                      {u.byModel.length > 0 && (
                        <>
                          <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-2">By Model</h4>
                          <div className="space-y-1">
                            {u.byModel.slice(0, 5).map((m) => (
                              <div key={m.model} className="flex justify-between text-sm text-gray-300">
                                <span className="truncate mr-2">{m.model}</span>
                                <span className="text-white">${m.cost.toFixed(2)}</span>
                              </div>
                            ))}
                            {u.byModel.length > 5 && (
                              <p className="text-gray-500 text-xs">+{u.byModel.length - 5} more</p>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Daily Table */}
            {usage.some(u => u.byDay.length > 0) && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Daily Spend</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 text-left">
                        <th className="pb-2">Date</th>
                        {usage.filter(u => u.byDay.length > 0).map((u) => (
                          <th key={u.provider} className="pb-2 capitalize">{u.provider}</th>
                        ))}
                        <th className="pb-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(new Set(usage.flatMap(u => u.byDay.map(d => d.date))))
                        .sort()
                        .reverse()
                        .slice(0, 14)
                        .map((date) => {
                          const dayCosts = usage.filter(u => u.byDay.length > 0).map(u => {
                            const day = u.byDay.find(d => d.date === date)
                            return day?.cost || 0
                          })
                          const dayTotal = dayCosts.reduce((a, b) => a + b, 0)
                          
                          return (
                            <tr key={date} className="border-t border-gray-700">
                              <td className="py-2 text-gray-300">{date}</td>
                              {dayCosts.map((cost, i) => (
                                <td key={i} className="py-2 text-white">${cost.toFixed(2)}</td>
                              ))}
                              <td className="py-2 text-emerald-400 font-medium">${dayTotal.toFixed(2)}</td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {usage.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            <p>Enter API keys and click "Fetch API Usage" to see your costs</p>
          </div>
        )}
      </div>
    </main>
  )
}
