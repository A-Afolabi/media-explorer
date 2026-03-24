function SearchForm({ query, setQuery, onSearch, isLoading }) {
  return (
    <form className='search-form' onSubmit={onSearch}>
      <input
        className='search-input'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search Movies or Shows'
      />
      <button
        className='search-button'
        type='submit'
        disabled={!query.trim() || isLoading}
      >
        Search
      </button>
    </form>
  )
}

export default SearchForm