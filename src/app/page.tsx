import Link from 'next/link'

const PROVIDERS = [
  'Anthropic', 'OpenAI', 'Google Gemini', 'Minimax', 
  'Mistral', 'Groq', 'Together AI', 'Replicate'
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Know Your AI Costs
          <span className="text-emerald-400"> Before The Bill</span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          One dashboard for all your AI API spend <strong>plus</strong> subscriptions. 
          Track 8 providers + memberships like Anthropic Pro, OpenAI Plus, Cursor, and more.
        </p>
        
        <Link 
          href="/dashboard"
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
        >
          See My Costs Free →
        </Link>
        
        <p className="text-gray-400 mt-4 text-sm">
          No signup required. Keys stay in your browser. 
          <a href="https://github.com/alexcalderado/ai-cost-tracker" className="text-emerald-400 hover:underline ml-1">100% open source →</a>
        </p>
        
        {/* Provider logos */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {PROVIDERS.map((p) => (
            <span key={p} className="bg-gray-800 px-4 py-2 rounded-lg text-gray-300 text-sm">
              {p}
            </span>
          ))}
        </div>
      </div>
      
      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">60 Second Setup</h3>
            <p className="text-gray-400">Paste your API keys and instantly see your costs. No code changes, no SDK, no signup.</p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">8 Providers + Subscriptions</h3>
            <p className="text-gray-400">Anthropic, OpenAI, Gemini, Minimax, Mistral, Groq, Together, Replicate — plus your monthly memberships.</p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="text-3xl mb-4">💳</div>
            <h3 className="text-xl font-semibold text-white mb-2">Track Everything</h3>
            <p className="text-gray-400">API usage + Anthropic Pro + OpenAI Plus + Cursor Pro + GitHub Copilot = your real AI spend.</p>
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">1</div>
            <h3 className="text-lg font-semibold text-white mb-2">Paste Your Keys</h3>
            <p className="text-gray-400">Add API keys for any providers you use. Keys stay in your browser.</p>
          </div>
          
          <div>
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">2</div>
            <h3 className="text-lg font-semibold text-white mb-2">Check Your Subscriptions</h3>
            <p className="text-gray-400">Toggle on any monthly memberships you're paying for.</p>
          </div>
          
          <div>
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">3</div>
            <h3 className="text-lg font-semibold text-white mb-2">See Total Cost</h3>
            <p className="text-gray-400">Get your complete AI spend — API + subscriptions — in one number.</p>
          </div>
        </div>
      </div>
      
      {/* Pricing */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Simple Pricing</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
            <p className="text-4xl font-bold text-white mb-4">$0</p>
            <ul className="text-gray-300 space-y-2 mb-6">
              <li>✓ All 8 providers</li>
              <li>✓ Membership tracking</li>
              <li>✓ Current month data</li>
              <li>✓ No account needed</li>
            </ul>
            <Link href="/dashboard" className="block text-center bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors">
              Start Free
            </Link>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-8 border-2 border-emerald-500">
            <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
            <p className="text-4xl font-bold text-white mb-4">$9<span className="text-lg font-normal text-gray-400">/mo</span></p>
            <ul className="text-gray-300 space-y-2 mb-6">
              <li>✓ Everything in Free</li>
              <li>✓ Full history</li>
              <li>✓ Email/Telegram alerts</li>
              <li>✓ CSV export</li>
              <li>✓ Team dashboards</li>
            </ul>
            <Link href="/dashboard" className="block text-center bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg transition-colors">
              Coming Soon
            </Link>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Stop Getting Surprised By AI Bills</h2>
        <p className="text-gray-400 mb-8">Takes 60 seconds. Free forever for basic use.</p>
        <Link 
          href="/dashboard"
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
        >
          See My Costs →
        </Link>
      </div>
      
      {/* Trust Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">🔒 Built for Trust</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-emerald-400 font-semibold mb-1">Open Source</p>
              <p className="text-gray-400 text-sm">Every line of code is public. Verify what happens with your data.</p>
            </div>
            <div>
              <p className="text-emerald-400 font-semibold mb-1">No Backend</p>
              <p className="text-gray-400 text-sm">Keys stay in your browser. Manual entry works without any keys.</p>
            </div>
            <div>
              <p className="text-emerald-400 font-semibold mb-1">Self-Host Option</p>
              <p className="text-gray-400 text-sm">Clone the repo, deploy to your own Vercel. Full control.</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <a href="https://github.com/alexcalderado/ai-cost-tracker" className="text-emerald-400 hover:underline">View source on GitHub →</a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-400">
          <p>Built by <a href="https://x.com/AlexCalderAI" className="text-emerald-400 hover:underline">@AlexCalderAI</a> · <a href="https://github.com/alexcalderado/ai-cost-tracker" className="text-emerald-400 hover:underline">GitHub</a></p>
        </div>
      </footer>
    </main>
  )
}
