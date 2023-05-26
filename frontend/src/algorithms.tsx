import { FromArtistToArtist, ProgressivelyEnergetic } from './pages/algorithms'

interface TAlgorithm {
  title: string
  href: string
  description: string
  component: (title: string, description: string) => JSX.Element
}

export const ALGORITHM_ROUTES: TAlgorithm[] = [
  {
    title: 'Progressively Energetic',
    href: '/a/progressively_energetic',
    description: 'Pick an artist. Generate a playlist of songs related to that artist. The songs will start mellow and end with lots of energy.',
    component: (title, description) => <ProgressivelyEnergetic title={title} description={description} />
  },
  {
    title: 'From Artist to Arist',
    href: '/a/from_artist_to_artist',
    description: 'Pick two artists. Generate a playlist of songs that starts with one and ends with the other.',
    component: (title, description) => <FromArtistToArtist title={title} description={description} />

  }
]
