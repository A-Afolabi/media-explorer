function SearchForm({ query, setQuery, onSearch, isLoading }) {
  return (
    <form onSubmit={onSearch}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search Movies or Shows'
      />
      <button type='submit' disabled={!query.trim() || isLoading}>
        Search
      </button>
    </form>
  )
}

export default SearchForm