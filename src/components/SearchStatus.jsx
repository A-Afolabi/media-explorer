function SearchStatus({ isLoading, error, hasSearched, resultsLength }) {
  if (isLoading) return <h4>Loading...</h4>
  if (error) return <h4>{error}</h4>
  if (hasSearched && resultsLength === 0) return <h4>No results found</h4>
  return null
}

export default SearchStatus