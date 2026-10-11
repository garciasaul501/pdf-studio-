import { createFileRoute } from '@tanstack/react-router'

import { clearSession } from '#/lib/session'

export const Route = createFileRoute('/api/oauth/signout')({
  server: {
    handlers: {
      GET: async () => {
        clearSession()
        return new Response(null, { status: 302, headers: { Location: '/' } })
      },
    },
  },
})
