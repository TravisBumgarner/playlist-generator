import {
  FromArtistToArtist,
  ProgressivelyEnergetic,
  GoodBeatsToGoodSleeps,
} from './pages/algorithms'

interface TAlgorithm {
  title: string
  href: string
  description: string
  component: (title: string, description: string) => JSX.Element
}

export const ALGORITHM_ROUTES: TAlgorithm[] = [
  {
    title: 'From Artist to Artist',
    href: '/a/from_artist_to_artist',
    description:
      'Pick two artists. Generate a playlist of songs that starts with one and ends with the other.',
    component: (title, description) => (
      <FromArtistToArtist title={title} description={description} />
    ),
  },
  {
    title: 'Good Beats to Good Sleeps',
    href: '/a/good_beats_to_good_sleeps',
    description:
      'Pick an arist. Generate a playlist of songs that starts with the selected artist and ends with enough white noise to last you through the night.',
    component: (title, description) => (
      <GoodBeatsToGoodSleeps title={title} description={description} />
    ),
  },
  {
    title: 'Progressively Energetic',
    href: '/a/progressively_energetic',
    description:
      'Pick an artist. Generate a playlist of songs related to that artist. The songs will start mellow and end with lots of energy.',
    component: (title, description) => (
      <ProgressivelyEnergetic title={title} description={description} />
    ),
  },
]
