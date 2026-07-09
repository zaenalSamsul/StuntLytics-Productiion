import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const API_BASE = process.env.STUNTLYTICS_DS_API_URL ?? 'http://127.0.0.1:8000'

type RouteContext = {
  params: Promise<{ path: string[] }>
}

async function proxy(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  const upstream = new URL(`${API_BASE.replace(/\/$/, '')}/${path.join('/')}`)
  upstream.search = request.nextUrl.search

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 45_000)

  try {
    const body = request.method === 'GET' || request.method === 'HEAD'
      ? undefined
      : await request.text()

    const response = await fetch(upstream, {
      method: request.method,
      headers: {
        'content-type': request.headers.get('content-type') ?? 'application/json',
        accept: request.headers.get('accept') ?? 'application/json',
      },
      body,
      cache: 'no-store',
      signal: controller.signal,
    })

    const responseBody = await response.arrayBuffer()
    return new NextResponse(responseBody, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') ?? 'application/json',
        'x-stuntlytics-upstream': 'data-science-api',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown proxy error'
    return NextResponse.json(
      {
        detail: 'The StuntLytics data-science service is unavailable.',
        error: message,
        upstream: API_BASE,
        hint: 'Run `npm run dev:full` or start `python -m uvicorn ds_api.main:app --port 8000`.',
      },
      { status: 503 },
    )
  } finally {
    clearTimeout(timeout)
  }
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const PATCH = proxy
export const DELETE = proxy
