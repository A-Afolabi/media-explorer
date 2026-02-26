import { useEffect, useState } from 'react'
import { searchTitles } from './api/watchmode'
import { getTitleDetails } from './api/watchmode'

import TitleDetailsModal from './components/TitleDetailsModal'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const [selectedTitle, setSelectedTitle] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState(null)

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

  async function handleSelectTitle(id) {
    try {
      setLoadingDetails(true)
      setDetailsError(null)

      const details = await getTitleDetails(id)
      console.log('DETAILS:', details)
      setSelectedTitle(details)
    } catch (err) {
      console.error(err)
      setDetailsError('Could not load title details')
    } finally {
      setLoadingDetails(false)
    }
  }

  return (
    <>
      <div>
        <h1>
          Find It Stream It (Media Explorer app)
        </h1>
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
        <div>
          <ul>
            {results.length === 0 ? '' :
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
          {loadingDetails && <h5>Loading details...</h5>}
          {detailsError && <h5>{detailsError}</h5>}

          <TitleDetailsModal
            title={selectedTitle}
            onClose={() => setSelectedTitle(null)}
          />
        </div>
      </div>
    </>
  )
}

export default App
