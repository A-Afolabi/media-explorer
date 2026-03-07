import axios from 'axios'

const API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY

export const watchmode = axios.create({
  baseURL: 'https://api.watchmode.com/v1'
})

export async function searchTitles(query) {
  const q = query.trim()
  if (!q) return []

  const res = await watchmode.get('/search', {
    params: {
      apiKey: API_KEY,
      search_field: 'name',
      search_value: q,
    }
  })
  return res.data?.title_results ?? []
}

export async function getTitleDetails(titleId, append = []) {
  const res = await watchmode.get(`/title/${titleId}/details/`, {
    params: {
      apiKey: API_KEY,
      ...(append.length ? { append_to_response: append.join(',') } : {})
    }
  })
  return res.data
}

export async function getSources(titleId) {
  const res = await watchmode.get(`/title/${titleId}/sources/`, {
    params: {
      apiKey: API_KEY
    }
  })
  return res.data.filter(source => source.region === 'GB')
}