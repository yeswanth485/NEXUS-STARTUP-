import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const PROTECTED = ['/dashboard', '/chat', '/onboarding']
  const isProtected = PROTECTED.some(p => req.nextUrl.pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => req.cookies.get(name)?.value, set: () => {}, remove: () => {} } }
  )
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.redirect(new URL('/?auth=signin', req.url))
  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*', '/chat/:path*', '/onboarding/:path*'] }
