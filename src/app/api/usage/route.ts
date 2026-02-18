import { NextResponse } from 'next/server'

// Model pricing (per 1K tokens)
const PRICING: Record<string, Record<string, { input: number; output: number }>> = {
  anthropic: {
    'claude-3-opus': { input: 0.015, output: 0.075 },
    'claude-3-sonnet': { input: 0.003, output: 0.015 },
    'claude-3-haiku': { input: 0.00025, output: 0.00125 },
    'claude-3-5-sonnet': { input: 0.003, output: 0.015 },
    'claude-sonnet-4-5': { input: 0.003, output: 0.015 },
    'claude-opus-4-5': { input: 0.015, output: 0.075 },
    'claude-haiku-4-5': { input: 0.0008, output: 0.004 },
  },
  openai: {
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'gpt-4o': { input: 0.0025, output: 0.01 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
    'o1': { input: 0.015, output: 0.06 },
    'o1-mini': { input: 0.003, output: 0.012 },
  },
  google: {
    'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
    'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
    'gemini-2.0-flash': { input: 0.0001, output: 0.0004 },
  },
  mistral: {
    'mistral-large': { input: 0.002, output: 0.006 },
    'mistral-small': { input: 0.0002, output: 0.0006 },
    'codestral': { input: 0.0003, output: 0.0009 },
  },
  groq: {
    'llama-3.1-70b': { input: 0.00059, output: 0.00079 },
    'llama-3.1-8b': { input: 0.00005, output: 0.00008 },
    'mixtral-8x7b': { input: 0.00024, output: 0.00024 },
  },
}

interface UsageResult {
  provider: string
  totalCost: number
  byModel: { model: string; cost: number; tokens: number }[]
  byDay: { date: string; cost: number }[]
  error?: string
}

async function fetchAnthropicUsage(apiKey: string): Promise<UsageResult> {
  try {
    const endDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    // Try admin usage endpoint first
    const res = await fetch(
      `https://api.anthropic.com/v1/admin/usage?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
      }
    )
    
    if (!res.ok) {
      const text = await res.text()
      console.log('Anthropic API response:', res.status, text)
      return {
        provider: 'anthropic',
        totalCost: 0,
        byModel: [],
        byDay: [],
        error: 'API key needs admin permissions. Check console.anthropic.com → Settings → API Keys.',
      }
    }
    
    const data = await res.json()
    const byModel: { model: string; cost: number; tokens: number }[] = []
    const byDay: { date: string; cost: number }[] = []
    let totalCost = 0
    
    if (data.data) {
      for (const item of data.data) {
        const model = item.model || 'unknown'
        const inputTokens = item.input_tokens || 0
        const outputTokens = item.output_tokens || 0
        
        const pricing = PRICING.anthropic[model] || { input: 0.003, output: 0.015 }
        const cost = (inputTokens / 1000 * pricing.input) + (outputTokens / 1000 * pricing.output)
        
        const existing = byModel.find(m => m.model === model)
        if (existing) {
          existing.cost += cost
          existing.tokens += inputTokens + outputTokens
        } else {
          byModel.push({ model, cost, tokens: inputTokens + outputTokens })
        }
        totalCost += cost
        
        if (item.date) {
          const dayExisting = byDay.find(d => d.date === item.date)
          if (dayExisting) {
            dayExisting.cost += cost
          } else {
            byDay.push({ date: item.date, cost })
          }
        }
      }
    }
    
    return { provider: 'anthropic', totalCost, byModel, byDay }
  } catch (e) {
    console.error('Anthropic fetch error:', e)
    return {
      provider: 'anthropic',
      totalCost: 0,
      byModel: [],
      byDay: [],
      error: 'Network error fetching Anthropic usage.',
    }
  }
}

async function fetchOpenAIUsage(apiKey: string): Promise<UsageResult> {
  try {
    const endDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    // Try the organization usage endpoint
    const res = await fetch(
      `https://api.openai.com/v1/organization/usage/completions?start_time=${Math.floor(Date.now()/1000) - 30*24*60*60}&bucket_width=1d`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    )
    
    if (!res.ok) {
      // Try legacy dashboard endpoint
      const dashRes = await fetch(
        `https://api.openai.com/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      )
      
      if (!dashRes.ok) {
        return {
          provider: 'openai',
          totalCost: 0,
          byModel: [],
          byDay: [],
          error: 'API key needs org admin permissions. Check platform.openai.com → Settings → API Keys.',
        }
      }
      
      const dashData = await dashRes.json()
      return {
        provider: 'openai',
        totalCost: (dashData.total_usage || 0) / 100,
        byModel: [],
        byDay: [],
      }
    }
    
    const data = await res.json()
    const byModel: { model: string; cost: number; tokens: number }[] = []
    const byDay: { date: string; cost: number }[] = []
    let totalCost = 0
    
    if (data.data) {
      for (const bucket of data.data) {
        const date = new Date(bucket.start_time * 1000).toISOString().split('T')[0]
        let dayCost = 0
        
        for (const result of bucket.results || []) {
          const model = result.model_id || 'unknown'
          const inputTokens = result.input_tokens || 0
          const outputTokens = result.output_tokens || 0
          
          const pricing = PRICING.openai[model] || { input: 0.01, output: 0.03 }
          const cost = (inputTokens / 1000 * pricing.input) + (outputTokens / 1000 * pricing.output)
          
          const existing = byModel.find(m => m.model === model)
          if (existing) {
            existing.cost += cost
            existing.tokens += inputTokens + outputTokens
          } else {
            byModel.push({ model, cost, tokens: inputTokens + outputTokens })
          }
          
          dayCost += cost
          totalCost += cost
        }
        
        if (dayCost > 0) {
          byDay.push({ date, cost: dayCost })
        }
      }
    }
    
    return { provider: 'openai', totalCost, byModel, byDay }
  } catch (e) {
    console.error('OpenAI fetch error:', e)
    return {
      provider: 'openai',
      totalCost: 0,
      byModel: [],
      byDay: [],
      error: 'Network error fetching OpenAI usage.',
    }
  }
}

async function fetchGoogleUsage(apiKey: string): Promise<UsageResult> {
  // Google doesn't have a public usage API - return placeholder
  return {
    provider: 'google',
    totalCost: 0,
    byModel: [],
    byDay: [],
    error: 'Google Vertex AI usage requires Cloud Console access. Coming soon.',
  }
}

async function fetchMinimaxUsage(apiKey: string): Promise<UsageResult> {
  // Minimax API - check if they have usage endpoint
  return {
    provider: 'minimax',
    totalCost: 0,
    byModel: [],
    byDay: [],
    error: 'Minimax usage API integration coming soon.',
  }
}

async function fetchMistralUsage(apiKey: string): Promise<UsageResult> {
  try {
    // Mistral has a usage endpoint
    const res = await fetch('https://api.mistral.ai/v1/usage', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })
    
    if (!res.ok) {
      return {
        provider: 'mistral',
        totalCost: 0,
        byModel: [],
        byDay: [],
        error: 'Could not fetch Mistral usage. Check your API key.',
      }
    }
    
    const data = await res.json()
    // Parse Mistral response format
    return {
      provider: 'mistral',
      totalCost: data.total_cost || 0,
      byModel: [],
      byDay: [],
    }
  } catch (e) {
    return {
      provider: 'mistral',
      totalCost: 0,
      byModel: [],
      byDay: [],
      error: 'Network error fetching Mistral usage.',
    }
  }
}

async function fetchGroqUsage(apiKey: string): Promise<UsageResult> {
  // Groq doesn't have a public usage API yet
  return {
    provider: 'groq',
    totalCost: 0,
    byModel: [],
    byDay: [],
    error: 'Groq usage API not available. Track manually via console.groq.com.',
  }
}

async function fetchTogetherUsage(apiKey: string): Promise<UsageResult> {
  try {
    const res = await fetch('https://api.together.xyz/v1/usage', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })
    
    if (!res.ok) {
      return {
        provider: 'together',
        totalCost: 0,
        byModel: [],
        byDay: [],
        error: 'Could not fetch Together AI usage. Check your API key.',
      }
    }
    
    const data = await res.json()
    return {
      provider: 'together',
      totalCost: data.total_cost || 0,
      byModel: [],
      byDay: [],
    }
  } catch (e) {
    return {
      provider: 'together',
      totalCost: 0,
      byModel: [],
      byDay: [],
      error: 'Network error fetching Together AI usage.',
    }
  }
}

async function fetchReplicateUsage(apiKey: string): Promise<UsageResult> {
  try {
    // Replicate has a billing endpoint
    const res = await fetch('https://api.replicate.com/v1/account/billing', {
      headers: {
        'Authorization': `Token ${apiKey}`,
      },
    })
    
    if (!res.ok) {
      return {
        provider: 'replicate',
        totalCost: 0,
        byModel: [],
        byDay: [],
        error: 'Could not fetch Replicate usage. Check your API token.',
      }
    }
    
    const data = await res.json()
    return {
      provider: 'replicate',
      totalCost: data.spend || data.total || 0,
      byModel: [],
      byDay: [],
    }
  } catch (e) {
    return {
      provider: 'replicate',
      totalCost: 0,
      byModel: [],
      byDay: [],
      error: 'Network error fetching Replicate usage.',
    }
  }
}

export async function POST(request: Request) {
  try {
    const { keys } = await request.json()
    
    const usage: UsageResult[] = []
    
    // Fetch from each provider that has a key
    const fetchers: [string, string, (key: string) => Promise<UsageResult>][] = [
      ['anthropic', keys.anthropic, fetchAnthropicUsage],
      ['openai', keys.openai, fetchOpenAIUsage],
      ['google', keys.google, fetchGoogleUsage],
      ['minimax', keys.minimax, fetchMinimaxUsage],
      ['mistral', keys.mistral, fetchMistralUsage],
      ['groq', keys.groq, fetchGroqUsage],
      ['together', keys.together, fetchTogetherUsage],
      ['replicate', keys.replicate, fetchReplicateUsage],
    ]
    
    // Run all fetchers in parallel
    const results = await Promise.all(
      fetchers
        .filter(([_, key]) => key && key.length > 0)
        .map(([_, key, fetcher]) => fetcher(key))
    )
    
    usage.push(...results)
    
    return NextResponse.json({ usage })
  } catch (e) {
    console.error('Usage API error:', e)
    return NextResponse.json({ error: 'Failed to fetch usage data' }, { status: 500 })
  }
}
