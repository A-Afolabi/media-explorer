import { useState } from 'react'
import { getTitleDetails, searchTitles } from './api/watchmode'
import TitleDetailsModal from './components/TitleDetailsModal/TitleDetailsModal'
import SearchResults from './components/SearchResults'
import SearchForm from './components/SearchForm'
import SearchStatus from './components/SearchStatus'
import './App.css'

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
      <div className='homepage'>
        <h1>Find It. Stream It.</h1>
        <p className='homepage-tagline'>
          Search movies and TV shows to find where they're streaming.
        </p>
        <div className='homepage-search'>
          <SearchForm
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>
      </div>
      <SearchStatus
        isLoading={isLoading}
        error={error}
        hasSearched={hasSearched}
        resultsLength={results.length}
      />
      <SearchResults
        results={results}
        onSelectTitle={handleSelectTitle}
      />
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