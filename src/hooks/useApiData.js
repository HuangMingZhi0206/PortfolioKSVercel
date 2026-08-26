import { useState, useEffect } from 'react'
import { API_URL } from '../config/api'

/**
 * Fetches JSON from the portfolio API.
 * Keeps `fallback` when the request fails or returns an empty list,
 * so sections always have something sensible to render.
 */
export function useApiData(path, fallback = null) {
  const [data, setData] = useState(fallback)

  useEffect(() => {
    let cancelled = false

    fetch(`${API_URL}${path}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`${res.status} ${res.statusText}`))))
      .then((json) => {
        const isEmpty = json == null || (Array.isArray(json) && json.length === 0)
        if (!cancelled && !isEmpty) setData(json)
      })
      .catch((err) => console.error(`Failed to fetch ${path}:`, err))

    return () => {
      cancelled = true
    }
  }, [path])

  return data
}
