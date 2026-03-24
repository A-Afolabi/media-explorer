import netflixLogo from '../../assets/streaming/Netflix_Logo_0.svg'
import disneyLogo from '../../assets/streaming/Disney +_Logo_0.svg'
import primeLogo from '../../assets/streaming/amazon-prime-video-1.svg'
import appleLogo from '../../assets/streaming/appletv.svg'
import youtubeLogo from '../../assets/streaming/YouTube_Logo_0.svg'
import rakutenLogo from '../../assets/streaming/Rakuten_idZrx4UxGb_0.svg'
import nowTVLogo from '../../assets/streaming/NOW_ideybGV1zR_1.svg'
import iPlayerLogo from '../../assets/streaming/BBC_iPlayer_2021_(symbol).svg.png'
import skyStoreLogo from '../../assets/streaming/Sky_Store_logo_2020.webp'
import skyGoLogo from '../../assets/streaming/SkyGoLogo.png'
import chiliLogo from '../../assets/streaming/Chilli_Streaming_Logo.png'
import ITVX_Logo from '../../assets/streaming/idZ-0UZC7Q_1773365584309.svg'
import all4Logo from '../../assets/streaming/id9I1ieBvO_1773365823842.svg'
import UKTV_Logo from '../../assets/streaming/UKTV-Logo.jpeg'
import my5Logo from '../../assets/streaming/My5Logo.jpeg'
import paramountLogo from '../../assets/streaming/Paramount+.svg'
import discoveryLogo from '../../assets/streaming/Discovery_Plus_logo.svg.png'
import britBoxLogo from '../../assets/streaming/Britbox.svg'
import mubiLogo from '../../assets/streaming/mubi.svg'
import plutoLogo from '../../assets/streaming/PlutoLogo.svg'

const platformAliases = {
  Amazon: 'Prime Video', 'Amazon Prime Video': 'Prime Video', 'Prime Video': 'Prime Video', 'Amazon Freevee': 'Prime Video'
}

const platformLogos = {
  Netflix: netflixLogo,
  'Disney+': disneyLogo,
  'Prime Video': primeLogo,
  'AppleTV': appleLogo,
  'Apple TV': appleLogo,
  YouTube: youtubeLogo,
  'Rakuten TV': rakutenLogo,
  'NOW TV': nowTVLogo,
  'BBC iPlayer': iPlayerLogo,
  'Sky Store': skyStoreLogo,
  'Sky Go': skyGoLogo,
  'Chili': chiliLogo,
  'Now TV': nowTVLogo,
  'ITV Player': ITVX_Logo,
  'All 4': all4Logo,
  'UKTV Play': UKTV_Logo,
  'My5': my5Logo,
  'Paramount Plus': paramountLogo,
  'Discovery+': discoveryLogo,
  'BritBox': britBoxLogo,
  'MUBI': mubiLogo,
  'Pluto TV': plutoLogo
}

function StreamingSources({ sources }) {
  if (!sources || sources.length === 0) {
    return <h4>Currently Not Streaming In The UK</h4>
  }

  const uniqueSources = Object.values(
    sources.reduce((acc, source) => {
      const normalisedName = platformAliases[source.name] || source.name
      if (!acc[normalisedName]) {
        acc[normalisedName] = {
          ...source,
          name: normalisedName
        }
      }
      return acc
    }, {})
  )

  return (
    <ul className='streaming-sources'>
      {uniqueSources.map((source, index) => {
        // Using index too, due to issues with unique key
        const name = source.name.trim()
        const logo = platformLogos[name]
        return (
          <li key={`${source.name}-${index}`}>
            <a href={source.web_url} target='_blank' rel='noreferrer'>
              {logo ? (
                <img
                  src={logo}
                  alt={source.name}
                  className='streaming-logo'
                />
              ) : (
                <span className='streaming-fallback'>{source.name}</span>
              )}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default StreamingSources