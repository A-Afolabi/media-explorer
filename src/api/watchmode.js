import axios from 'axios'

const API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY

export const watchmode = axios.create({
  baseURL: 'https://api.watchmode.com/v1'
})

export async function searchTitles(query) {
  console.log('BASE:', watchmode.defaults.baseURL)
  const q = query.trim()
  if (!q) return []

  const res = await watchmode.get('/search', {
    params: {
      apiKey: API_KEY,
      search_field: 'name',
      search_value: q,
      // types: 'movie,tv_series'
    }
  })
  console.log('Search Data:', res.data)
  return res.data?.title_results ?? []
}