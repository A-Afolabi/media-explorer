import netflixLogo from '../assets/streaming/Netflix_Logo_0.svg'
import disneyLogo from '../assets/streaming/Disney +_Logo_0.svg'
import primeLogo from '../assets/streaming/amazon-prime-video-1.svg'
import appleLogo from '../assets/streaming/appletv.svg'

const platformLogos = {
  Netflix: netflixLogo,
  'Disney+': disneyLogo,
  'Amazon': primeLogo,
  'Prime Video': primeLogo,
  'AppleTV': appleLogo
}


function StreamingSources({ sources }) {
  if (!sources || sources.length === 0) {
    return <h4>Currently Not Streaming In The UK</h4>
  }

  const typeOrder = ['sub', 'free', 'buy', 'rent']

  const groupedSources = Object.values(
    sources.reduce((acc, source) => {
      if (!acc[source.name]) {
        acc[source.name] = {
          ...source,
          types: [source.type]
        }
      } else if (!acc[source.name].types.includes(source.type)) {
        acc[source.name].types.push(source.type)
      }
      return acc
    }, {})
  ).map(service => ({
    ...service,
    types: service.types.sort(
      (a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b)
    )
  }))

  return (
    <ul className='steaming-sources'>
      {groupedSources.map((source, index) => {
        // Using index too, due to issues with unique key
        const name = source.name.trim()
        const logo = platformLogos[name]
        return (
          <li key={`${source.source_id}-${source.type}-${source.region}-${index}`}>
            <a href={source.web_url} target='_blank' rel='noreferrer'>
              {logo ? (
                <img
                  src={logo}
                  alt={source.name}
                  className='streaming-logo'
                />
              ) : (
                source.name
              )}
              <div className='streaming-types'>
                {source.types.map(type => (
                  <span key={type}>{type.toUpperCase()}</span>
                ))}
              </div>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default StreamingSources