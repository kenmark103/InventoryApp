// router.ts
import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'
import { QueryClient } from '@tanstack/react-query'

// Create a QueryClient instance
export const queryClient = new QueryClient({
  // your query client options
})

// Create and export your router instance
export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})
