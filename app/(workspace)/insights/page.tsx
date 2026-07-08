'use client'

import { FormEvent, useMemo, useState } from 'react'
import { ArrowUpRight, BookOpenCheck, Search, Send, ShieldCheck, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { useToast } from '@/components/ToastProvider'

interface Message { role: 'user' | 'assistant'; content: string }

const suggestedQuestions = [
  'Which regions need priority review?',
  'How is service coverage changing?',
  'What factors should be explored further?',
  'Which interventions are behind schedule?',
]

export default function InsightsPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'I can help summarize the current demo workspace, compare regional patterns, and point you toward records that deserve human review. I do not provide clinical diagnoses.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { notify } = useToast()

  const knowledge = useMemo(() => ({
    priority: 'The current demo workspace places Indramayu Cluster (34.8%) and Garut Selatan (31.2%) at the top of the review queue. These are program-level signals, not individual diagnoses. Open Regional Risk Map to inspect spatial context before escalation.',
    coverage: 'Service coverage rises from 68% in January to 78.5% in June in the current monitoring series. The strongest operational question is whether follow-up continuity keeps pace in high-risk clusters.',
    factor: 'Factor Analysis suggests sanitation access, immunization continuity, nutrition follow-up, and workforce availability deserve deeper exploration. Correlation alone does not establish causality, so field validation remains necessary.',
    intervention: 'The current action board shows sanitation referral at 61% completion and one critical case still in triage. Open Action Center to review ownership, due dates, progress, and verification evidence.',
  }), [])

  const send = (question?: string) => {
    const text = (question ?? input).trim()
    if (!text || loading) return
    setMessages((current) => [...current, { role: 'user', content: text }])
    setInput('')
    setLoading(true)
    window.setTimeout(() => {
      const lower = text.toLowerCase()
      const response = lower.includes('priority') || lower.includes('region') ? knowledge.priority : lower.includes('coverage') ? knowledge.coverage : lower.includes('factor') || lower.includes('why') ? knowledge.factor : lower.includes('intervention') || lower.includes('schedule') ? knowledge.intervention : 'I can help with regional priority, service coverage, contributing factors, or intervention progress. Try asking a more specific operational question so the answer can stay traceable to the current demo workspace.'
      setMessages((current) => [...current, { role: 'assistant', content: response }])
      setLoading(false)
    }, 450)
  }

  const submit = (event: FormEvent) => { event.preventDefault(); send() }

  return <div className="space-y-6">
    <PageHeader icon={<BookOpenCheck className="size-5"/>} eyebrow="Evidence support" title="Health Insights" description="Ask operational questions about regional signals, service coverage, contributing factors, and intervention follow-up.">
      <button type="button" onClick={()=>notify({tone:'info',title:'Evidence policy',message:'Responses in this demo are grounded to the visible workspace examples and still require expert review.'})} className="btn-secondary"><ShieldCheck className="size-4"/> Review guardrails</button>
    </PageHeader>

    <section className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <article className="clinical-card p-5"><span className="flex size-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><Sparkles className="size-5"/></span><h2 className="mt-4 text-sm font-extrabold text-foreground">Suggested questions</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Start from common program-review needs.</p><div className="mt-4 space-y-2">{suggestedQuestions.map((question)=><button key={question} type="button" onClick={()=>send(question)} className="flex w-full items-start gap-2 rounded-xl border border-border bg-white p-3 text-left text-[11px] font-semibold leading-5 text-text-secondary transition hover:border-primary/25 hover:bg-surface-blue hover:text-foreground dark:bg-card"><Search className="mt-0.5 size-3.5 shrink-0 text-primary"/>{question}</button>)}</div></article>
        <article className="rounded-2xl border border-warning/20 bg-warning/5 p-5"><div className="flex items-center gap-2 text-xs font-extrabold text-foreground"><ShieldCheck className="size-4 text-warning"/> Decision-support boundary</div><p className="mt-2 text-[11px] leading-5 text-text-secondary">Use outputs to guide review and exploration, not to replace clinical assessment, field validation, or accountable program decisions.</p></article>
      </aside>

      <section className="clinical-card flex min-h-[620px] flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-soft px-5 py-4"><div><h2 className="section-title">Evidence conversation</h2><p className="section-description">Current demo workspace context</p></div><span className="inline-flex items-center gap-1.5 rounded-lg bg-success/8 px-2.5 py-1 text-[10px] font-extrabold text-success"><span className="size-1.5 rounded-full bg-success"/> Ready</span></div>
        <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/55 p-5 dark:bg-background/25 sm:p-6">
          {messages.map((message,index)=><div key={index} className={`flex ${message.role==='user'?'justify-end':'justify-start'}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 text-[13px] leading-6 ${message.role==='user'?'rounded-br-md bg-primary text-white shadow-sm':'rounded-bl-md border border-slate-200 bg-white text-text-secondary dark:border-border dark:bg-card'}`}>{message.content}</div></div>)}
          {loading && <div className="flex justify-start"><div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-4"><span className="size-2 animate-pulse rounded-full bg-primary"/><span className="size-2 animate-pulse rounded-full bg-primary [animation-delay:120ms]"/><span className="size-2 animate-pulse rounded-full bg-primary [animation-delay:240ms]"/></div></div>}
        </div>
        <form onSubmit={submit} className="border-t border-border-soft bg-card p-4 sm:p-5"><div className="flex gap-2"><input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask about a region, trend, factor, or follow-up…" disabled={loading} className="premium-input min-w-0 flex-1"/><button type="submit" disabled={loading||!input.trim()} className="btn-primary size-10 shrink-0 px-0" aria-label="Send question"><Send className="size-4"/></button></div><div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-muted-foreground"><span>Grounded to visible demo context</span><a href="/activity" className="inline-flex items-center gap-1 font-bold text-primary">Review audit trail <ArrowUpRight className="size-3"/></a></div></form>
      </section>
    </section>
  </div>
}
