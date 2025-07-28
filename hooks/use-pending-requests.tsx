"use client"

import { useState, useEffect } from "react"

export function usePendingRequestsCount() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await fetch('/api/sponsorship-requests')
        if (response.ok) {
          const data = await response.json()
          // Count pending requests that this user received (as athlete)
          const pendingCount = data.received_requests?.filter(
            (request: any) => request.status === 'PENDING'
          ).length || 0
          setCount(pendingCount)
        }
      } catch (error) {
        console.error('Error fetching pending requests count:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingCount()
  }, [])

  return { count, loading }
}
