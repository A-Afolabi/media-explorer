import { useState } from 'react'
import { searchTitles } from './api/watchmode'
import TitleDetailsModal from './components/TitleDetailsModal'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  // Store the selected title ID (not the whole details object)
  const [selectedTitleId, setSelectedTitleId] = useState(null)


  const handleSearch = async (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) {
      setError('Please enter a title')
      setHasSearched(false)
      return
    }
    setError('')
    setIsLoading(true)
    setHasSearched(true)

    try {
      const data = await searchTitles(q)
      setResults(data)
    } catch (err) {
      setError('Failed to load results')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  function handleSelectTitle(id) {
    setSelectedTitleId(id)
  }

  return (
    <div>
      <h1>Find It Stream It (Media Explorer app)</h1>
      <form onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search Movies or Shows'
        />
        <button type='submit' disabled={!query.trim() || isLoading}>Search</button>
      </form>

      {isLoading && <h4>Loading...</h4>}
      {error && <h4>{error}</h4>}

      {hasSearched && !isLoading && !error && results.length === 0 && (
        <h4>No results found</h4>
      )}
      <ul>
        {results.length > 0 &&
          <h5>Showing {results.length} results</h5>
        }
        {results.map(item => (
          <li
            key={item.id}
            style={{ cursor: 'pointer' }}
            onClick={() => handleSelectTitle(item.id)}
          >
            <strong>{item.name}</strong>
            {item.year ? ` (${item.year})` : ''}
            {item.type ? ` (${item.type})` : ''}
          </li>
        ))}
      </ul>
      {selectedTitleId && (
        <TitleDetailsModal
          titleId={selectedTitleId}
          onClose={() => setSelectedTitleId(null)}
        />
      )}
    </div>
  )
}

export default App
