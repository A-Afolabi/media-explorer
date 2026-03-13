function SearchResults({ results, onSelectTitle }) {
  if (results.length === 0) return null
  return (
    <>
      <h5 className='search-results-heading'>Showing {results.length} results</h5>
      <ul className='search-results-list'>
        {results.map(item => (
          <li
            key={item.id}
            className='search-result-item'
            onClick={() => onSelectTitle(item.id)}
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
  )
}

export default SearchResults