import { NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get(
    'https://2124e8a9-da88-46d7-94fc-4310f61faab3.mock.pstmn.io/api/v1/mastery/customers?top=1&contactNumber=0903212403'
  )

  return new Response(
    JSON.stringify({ result: `You searched for: ${query}` }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
