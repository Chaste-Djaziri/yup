import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  const referer = req.headers.get('referer') || ''

  const blockedDomains = [
    'searchregister.net',
    'searchregister.info',
    'searchregistry.org',
    'domainbly.com',
    'droa.com',
    'domainrenewalonline.com',
    'domainnameoutlet.com'
  ]

  if (blockedDomains.some(domain => referer.includes(domain))) {
    return new Response(JSON.stringify({ error: 'Referrer blocked.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const submissionData = await req.json()

  const { data, error } = await supabase
    .from('contact_submissions')
    .insert(submissionData)

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 })
  }

  return new Response(JSON.stringify({ data }), { status: 200 })
})
