import { useEffect } from "react"

export default function TitleDetailsModal({ title, onClose }) {
  useEffect(() => {
    if (!title) return

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
  }, [title, onClose])

  if (!title) return null

  const posterSrc = title.posterLarge || title.posterMedium || title.poster

  return (
    <div
      className='modal-overlay'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-label={`${title.title} details`}
    >
      <div className='modal-panel' onClick={(e) => e.stopPropagation()}>
        <button className='modal-close' onClick={onClose} aria-label='Close'>
          x
        </button>

        <section className="title-details">
          {posterSrc && (
            <img
              className="title-details-poster"
              src={posterSrc}
              alt={`${title.title} poster`}
            />
          )}
          <div className='title-details-content'>
            <h2 className='title-details-title'>
              {title.title} {title.year && `(${title.year})`}
            </h2>
            <p className='title-details-meta'>
              {title.us_rating && `US Ratings: ${title.us_rating}`}
              <strong> - </strong>
              {title.runtime_minutes && `Running time: ${title.runtime_minutes} mins`}
              <strong> - </strong>
              {title.release_date}
            </p>
            {title.genre_names?.length ? (
              <p className='title-details-genres'>
                Genres:{' '}
                <strong>{title.genre_names.join(', ')}</strong>
              </p>
            ) : null}
            {title.plot_overview ? (
              <p className='title-details-overview'>{title.plot_overview}</p>
            ) : null}
            <div className='title-details-scores'>
              {typeof title.user_rating === 'number' && (
                <span>User: <strong>{title.user_rating}/10</strong> </span>
              )}
              {typeof title.critic_score === 'number' && (
                <span>Critic: <strong>{title.critic_score}%</strong></span>
              )}
            </div>
            {title.trailer ? (
              <p className='title-details-trailer'>
                <a href={title.trailer} target='_blank' rel='noreferrer'>
                  Watch Trailer!
                </a>
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}