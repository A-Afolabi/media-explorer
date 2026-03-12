import { useState } from 'react'
import { getTitleDetails, searchTitles } from './api/watchmode'
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
      const resultsToEnrich = data.slice(0, 10)
      const remainingResults = data.slice(10)
      const enrichedResults = await Promise.all(
        resultsToEnrich.map(async (item) => {
          try {
            const details = await getTitleDetails(item.id)
            return {
              ...item,
              poster: details.poster || details.posterMedium || details.posterLarge || null
            }
          } catch (error) {
            return {
              ...item,
              poster: null
            }
          }
        })
      )
      const finalResults = [
        ...enrichedResults,
        ...remainingResults
      ]
      setResults(finalResults)
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
      <>
        {results.length > 0 && (
          <h5 className='search-results-heading'>Showing {results.length} results</h5>
        )}
        <ul className='search-results-list'>
          {results.map(item => (
            <li
              key={item.id}
              className='search-result-item'
              onClick={() => handleSelectTitle(item.id)}
            >
              {item.poster && (
                <img
                  src={item.poster}
                  alt={`${item.name} poster`}
                  className='search-result-poster'
                />
              )}
              <div className='search-result-text'>
                <strong>{item.name}</strong>
                {item.year ? ` (${item.year})` : ''}
                {item.type ? ` (${item.type})` : ''}
              </div>
            </li>
          ))}
        </ul>
      </>
      {selectedTitleId && (
        <TitleDetailsModal
          titleId={selectedTitleId}
          onClose={() => setSelectedTitleId(null)}
          onSelectTitle={handleSelectTitle}
        />
      )}
    </div>
  )
}

export default App
