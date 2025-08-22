import { createTRPCReact } from '@trpc/react-query'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

// Type-only import to avoid bundling backend code
type AppRouter = any // Will be properly typed when backend is available

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser should use relative url
    return ''
  }
  
  // Development
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:3001'
  }
  
  // Production - use environment variable or default
  return import.meta.env.VITE_API_BASE_URL || 'https://api.communityconsciousness.com'
}

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      headers() {
        const token = localStorage.getItem('auth_token')
        return token ? { authorization: `Bearer ${token}` } : {}
      }
    })
  ]
})