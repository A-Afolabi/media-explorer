import { useEffect, useState } from "react"
import { getTitleDetails } from '../api/watchmode'

function TitleDetailsModal({ titleId, onClose }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [similarTitles, setSimilarTitles] = useState([])

  useEffect(() => {
    if (!titleId) return

    let cancelled = false

    async function fetchDetails() {
      try {
        setLoading(true)
        setError(null)
        setDetails(null)
        setSimilarTitles([])

        const data = await getTitleDetails(titleId, ['similar_titles'])
        if (!cancelled) {
          setDetails(data)
          const similarIds = (data?.similar_titles ?? []).slice(0, 8)
          const similarDetails = await Promise.all(
            similarIds.map((id) => getTitleDetails(id))
          )
          if (!cancelled) {
            setSimilarTitles(similarDetails)
          }
        }
      } catch (err) {
        if (!cancelled) setError('Failed to load details')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDetails()

    return () => {
      cancelled = true
    }
  }, [titleId])

  useEffect(() => {
    // Allow Escape to close even while loading/error
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    // lock background scroll
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const posterSrc = details?.posterLarge || details?.posterMedium || details?.poster

  function formatRuntime(minutes) {
    if (!minutes) return null
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) return `${mins}m`
    return `${hours}hr ${mins}mins`
  }

  function formatReleaseDate(dateString) {
    if (!dateString) return null
    const date = new Date(dateString)

    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div
      className='modal-overlay'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-label='Title details'
    >
      <div className='modal-panel' onClick={(e) => e.stopPropagation()}>
        <button className='modal-close' onClick={onClose} aria-label='Close'>
          x
        </button>
        {loading && <p>Loading details...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && details && (
          <section className="title-details">
            {posterSrc && (
              <img
                className="title-details-poster"
                src={posterSrc}
                alt={`${details.title} poster`}
              />
            )}
            <div className='title-details-content'>
              <h2 className='title-details-title'>
                <strong>{details.title} {details.year && `(${details.year})`}</strong>
              </h2>
              <p className='title-details-meta'>
                {details.us_rating && `US Ratings: ${details.us_rating}`}
                {details.runtime_minutes ? (
                  <>
                    <span className='meta-separator'> · </span>
                    {formatRuntime(details.runtime_minutes)}
                  </>
                ) : null}
                {details.release_date ? (
                  <>
                    <span className='meta-separator'> · </span>
                    {formatReleaseDate(details.release_date)}
                  </>
                ) : null}
              </p>
              {details.genre_names?.length ? (
                <p className='title-details-genres'>
                  Genres: <strong>{details.genre_names.join(', ')}</strong>
                </p>
              ) : null}
              {details.plot_overview ? (
                <p className='title-details-overview'>{details.plot_overview}</p>
              ) : null}
              <h4 className='ratings-heading'>Ratings</h4>
              <div className='title-details-scores'>
                {typeof details.user_rating === 'number' && (
                  <span>⭐️ <strong>{details.user_rating}/10</strong></span>
                )}
                {typeof details.critic_score === 'number' && (
                  <span>🎬 <strong>{details.critic_score}%</strong></span>
                )}
              </div>
              {details.trailer ? (
                <p className='title-details-trailer'>
                  <a href={details.trailer} target='_blank' rel='noreferrer'>
                    Watch Trailer!
                  </a>
                </p>
              ) : null}
            </div>
          </section>
        )}
        {similarTitles.length > 0 && (
          <section className='similar-section'>
            <h3>Similar Titles</h3>
            <div className='similar-row'>
              {similarTitles.map((item) => {
                const poster =
                  item.poster || item.posterMedium || item.posterLarge
                return (
                  <div
                    key={item.id}
                    className='similar-card'
                    onClick={() => console.log('Clicked Similar:', item.id)}
                  >
                    {poster && (
                      <img
                        src={poster}
                        alt={item.title}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default TitleDetailsModal