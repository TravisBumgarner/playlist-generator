import {
  Gradient,
  GoodBeatsToGoodSleeps,
  Mashup,
  FullControl
} from './pages/algorithms'

interface TAlgorithm {
  title: string
  href: string
  description: string
  component: (title: string, description: string) => JSX.Element
}

export const ALGORITHM_ROUTES: TAlgorithm[] = [
  {
    title: 'Full Control',
    href: '/a/full_control',
    description:
      'Pick an artist or track. Generate a playlist where you can tweak everything about the tracks of the playlist.',
    component: (title, description) => (
      <FullControl title={title} description={description} />
    )
  },
  {
    title: 'Good Beats to Good Sleeps',
    href: '/a/good_beats_to_good_sleeps',
    description:
      'Pick an artist. Generate a playlist that starts with tracks related to the artist and ends with enough white noise to last you through the night.',
    component: (title, description) => (
      <GoodBeatsToGoodSleeps title={title} description={description} />
    )
  },
  {
    title: 'Gradient',
    href: '/a/gradient',
    description:
      'Pick two artists or tracks. Generate a playlist of tracks that starts with one, moves through related music, and ends with the other.',
    component: (title, description) => (
      <Gradient title={title} description={description} />
    )
  },
  {
    title: 'Mashup',
    href: '/a/mashup',
    description:
      'Pick several artists and/or tracks. Generate a playlist that jumps between recommended tracks from each of them.',
    component: (title, description) => (
      <Mashup title={title} description={description} />
    )
  }
]
