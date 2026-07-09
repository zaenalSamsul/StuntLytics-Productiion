'use client'

import { FormEvent, ReactNode, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Lightbulb, Search, Send, ShieldCheck, Sparkles } from 'lucide-react'
import { DataSourceBadge } from '@/components/DataSourceBadge'
import { PageHeader } from '@/components/PageHeader'
import { dashboardApi, DataSourceInfo } from '@/lib/api'

const suggestedQuestions = [
  'Which districts currently show the highest stunting signal?',
  'What do the strongest numeric associations suggest I should verify next?',
  'How do immunisation and safe-water coverage look in this workspace?',
  'Give me a cautious evidence summary for a program review meeting.',
]

type Message = { role: 'user' | 'assistant'; content: string; source?: DataSourceInfo; mode?: string }

function inlineBold(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) => part.startsWith('**') && part.endsWith('**') ? <strong key={index} className="font-extrabold text-foreground">{part.slice(2, -2)}</strong> : <span key={index}>{part}</span>)
}

function EvidenceAnswer({ content }: { content: string }) {
  const lines = content.split('\n')
  return <div className="space-y-2">{lines.map((line, index) => {
    const trimmed = line.trim()
    if (!trimmed) return <div key={index} className="h-1" />
    if (trimmed.startsWith('### ')) return <h3 key={index} className="pt-1 text-xs font-extrabold uppercase tracking-[.08em] text-primary">{trimmed.slice(4)}</h3>
    if (trimmed.startsWith('- ')) return <div key={index} className="flex gap-2 text-[12px] leading-5 text-text-secondary"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-secondary"/><span>{inlineBold(trimmed.slice(2))}</span></div>
    return <p key={index} className="text-[12px] leading-6 text-text-secondary">{inlineBold(trimmed.replace(/^_|_$/g, ''))}</p>
  })}</div>
}

export default function InsightsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Ask about regional priority signals, monthly trends, service coverage, or the strongest numeric associations. Answers are grounded in the active StuntLytics analytics source.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState<DataSourceInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  const send = async (question: string) => {
    const clean = question.trim()
    if (!clean || loading) return
    setMessages((current) => [...current, { role: 'user', content: clean }])
    setInput('')
    setLoading(true)
    setError(null)
    try {
      const response = await dashboardApi.getAIInsights(clean, {})
      setSource(response.source)
      setMessages((current) => [...current, { role: 'assistant', content: response.answer, source: response.source, mode: response.mode }])
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Evidence assistant unavailable'
      setError(message)
      setMessages((current) => [...current, { role: 'assistant', content: 'The data-science service could not answer this question. Start the integrated service with `npm run dev:full` and try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const submit = (event: FormEvent) => { event.preventDefault(); void send(input) }

  return (
    <div className="space-y-6">
      <PageHeader icon={<Lightbulb className="size-5" />} eyebrow="Grounded decision support" title="Health Insights" description="Ask questions against dashboard aggregation, district risk signals, and numeric correlation outputs. Gemini 2.5 Flash-Lite is optional; deterministic evidence remains available without an API key.">
        <Link href="/data-science" className="btn-secondary"><ShieldCheck className="size-4" /> Review engine</Link>
      </PageHeader>

      {error && <div className="rounded-2xl border border-warning/20 bg-warning/5 p-4 text-xs leading-5 text-text-secondary">{error}</div>}

      <section className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <article className="clinical-card p-5"><span className="flex size-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><Sparkles className="size-5"/></span><h2 className="mt-4 text-sm font-extrabold text-foreground">Suggested evidence questions</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Start from common monitoring and program-review needs.</p><div className="mt-4 space-y-2">{suggestedQuestions.map((question)=><button key={question} type="button" onClick={()=>void send(question)} className="flex w-full items-start gap-2 rounded-xl border border-border bg-white p-3 text-left text-[11px] font-semibold leading-5 text-text-secondary transition hover:border-primary/25 hover:bg-surface-blue hover:text-foreground dark:bg-card"><Search className="mt-0.5 size-3.5 shrink-0 text-primary"/>{question}</button>)}</div></article>
          <article className="rounded-2xl border border-warning/20 bg-warning/5 p-5"><div className="flex items-center gap-2 text-xs font-extrabold text-foreground"><ShieldCheck className="size-4 text-warning"/> Decision-support boundary</div><p className="mt-2 text-[11px] leading-5 text-text-secondary">Outputs summarize available evidence. They do not replace clinical assessment, field validation, data-quality review, or accountable program decisions.</p></article>
        </aside>

        <section className="clinical-card flex min-h-[650px] flex-col overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-border-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="section-title">Evidence conversation</h2><p className="section-description">Metrics and factor context are computed before the answer is generated.</p></div><DataSourceBadge source={source} /></div>
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/55 p-5 dark:bg-background/25 sm:p-6">
            {messages.map((message,index)=><div key={index} className={`flex ${message.role==='user'?'justify-end':'justify-start'}`}><div className={`max-w-[88%] rounded-2xl px-4 py-3 ${message.role==='user'?'rounded-br-md bg-primary text-white shadow-sm':'rounded-bl-md border border-slate-200 bg-white dark:border-border dark:bg-card'}`}>{message.role === 'assistant' ? <EvidenceAnswer content={message.content} /> : <p className="text-[13px] leading-6">{message.content}</p>}{message.mode && <div className="mt-3 border-t border-border-soft pt-2 text-[9px] font-extrabold uppercase tracking-[.1em] text-muted-foreground">Response mode · {message.mode.replaceAll('_', ' ')}</div>}</div></div>)}
            {loading && <div className="flex justify-start"><div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-4"><span className="size-2 animate-pulse rounded-full bg-primary"/><span className="size-2 animate-pulse rounded-full bg-primary [animation-delay:120ms]"/><span className="size-2 animate-pulse rounded-full bg-primary [animation-delay:240ms]"/></div></div>}
          </div>
          <form onSubmit={submit} className="border-t border-border-soft bg-card p-4 sm:p-5"><div className="flex gap-2"><input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask about a region, trend, factor, or coverage signal…" disabled={loading} className="premium-input min-w-0 flex-1"/><button type="submit" disabled={loading||!input.trim()} className="btn-primary size-10 shrink-0 px-0" aria-label="Send question"><Send className="size-4"/></button></div><div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-muted-foreground"><span>Aggregated evidence only · no raw health records sent to the LLM</span><Link href="/activity" className="inline-flex items-center gap-1 font-bold text-primary">Review audit trail <ArrowUpRight className="size-3"/></Link></div></form>
        </section>
      </section>
    </div>
  )
}
