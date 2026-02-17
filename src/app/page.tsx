import Link from 'next/link'

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
          One dashboard for all your AI API spend. Connect Anthropic, OpenAI, and more. 
          See exactly what you're spending in 60 seconds.
        </p>
        
        <Link 
          href="/dashboard"
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
        >
          Get Started Free →
        </Link>
        
        <p className="text-gray-400 mt-4 text-sm">No credit card required</p>
      </div>
      
      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">60 Second Setup</h3>
            <p className="text-gray-400">Paste your API keys and instantly see your costs. No code changes needed.</p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">Unified Dashboard</h3>
            <p className="text-gray-400">All your AI providers in one view. Anthropic, OpenAI, and more coming soon.</p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="text-3xl mb-4">🚨</div>
            <h3 className="text-xl font-semibold text-white mb-2">Budget Alerts</h3>
            <p className="text-gray-400">Get notified before you blow your budget. Daily and weekly summaries.</p>
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
              <li>✓ 1 provider</li>
              <li>✓ 7-day history</li>
              <li>✓ Basic dashboard</li>
            </ul>
            <Link href="/dashboard" className="block text-center bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors">
              Start Free
            </Link>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-8 border-2 border-emerald-500">
            <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
            <p className="text-4xl font-bold text-white mb-4">$9<span className="text-lg font-normal text-gray-400">/mo</span></p>
            <ul className="text-gray-300 space-y-2 mb-6">
              <li>✓ Unlimited providers</li>
              <li>✓ Full history</li>
              <li>✓ Email alerts</li>
              <li>✓ CSV export</li>
              <li>✓ Team support</li>
            </ul>
            <Link href="/dashboard" className="block text-center bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg transition-colors">
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-700 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-400">
          <p>Built by <a href="https://x.com/AlexCalderAI" className="text-emerald-400 hover:underline">@AlexCalderAI</a></p>
        </div>
      </footer>
    </main>
  )
}
