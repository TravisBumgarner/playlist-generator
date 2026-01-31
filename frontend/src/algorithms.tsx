import type { JSX } from 'react'

import {
  ContrastPairs,
  DiscoveryDial,
  FocusMode,
  FullControl,
  GenreDrift,
  GoodBeatsToGoodSleeps,
  Gradient,
  Mashup,
  MoodSwing,
  PartyCurve,
  RandomWalk,
  TempoLock,
  TimeMachine,
  WorkoutArc,
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
    component: (title, description) => <FullControl title={title} description={description} />,
  },
  {
    title: 'Good Beats to Good Sleeps',
    href: '/a/good_beats_to_good_sleeps',
    description:
      'Pick an artist. Generate a playlist that starts with tracks related to the artist and ends with enough white noise to last you through the night.',
    component: (title, description) => <GoodBeatsToGoodSleeps title={title} description={description} />,
  },
  {
    title: 'Gradient',
    href: '/a/gradient',
    description:
      'Pick two artists or tracks. Generate a playlist of tracks that starts with one, moves through related music, and ends with the other.',
    component: (title, description) => <Gradient title={title} description={description} />,
  },
  {
    title: 'Mashup',
    href: '/a/mashup',
    description:
      'Pick several artists and/or tracks. Generate a playlist that jumps between recommended tracks from each of them.',
    component: (title, description) => <Mashup title={title} description={description} />,
  },
  {
    title: 'Time Machine',
    href: '/a/time_machine',
    description:
      'Pick an artist or track and an era. Generate a playlist with tempo and danceability tuned to that decade.',
    component: (title, description) => <TimeMachine title={title} description={description} />,
  },
  {
    title: 'Mood Swing',
    href: '/a/mood_swing',
    description: 'Pick an artist or track. Generate a playlist that alternates between high and low valence tracks.',
    component: (title, description) => <MoodSwing title={title} description={description} />,
  },
  {
    title: 'Workout Arc',
    href: '/a/workout_arc',
    description: 'Pick an artist or track. Generate a playlist with warm-up, main set, and cool-down energy phases.',
    component: (title, description) => <WorkoutArc title={title} description={description} />,
  },
  {
    title: 'Discovery Dial',
    href: '/a/discovery_dial',
    description:
      'Pick an artist or track and set your adventurousness. Higher values surface less popular, more obscure tracks.',
    component: (title, description) => <DiscoveryDial title={title} description={description} />,
  },
  {
    title: 'Tempo Lock',
    href: '/a/tempo_lock',
    description:
      'Pick an artist or track and a target BPM. Generate a playlist where every track is within 5 BPM of your target.',
    component: (title, description) => <TempoLock title={title} description={description} />,
  },
  {
    title: 'Genre Drift',
    href: '/a/genre_drift',
    description:
      'Pick two artists or tracks. Generate a playlist that gradually drifts from one genre to another through intermediate artists.',
    component: (title, description) => <GenreDrift title={title} description={description} />,
  },
  {
    title: 'Party Curve',
    href: '/a/party_curve',
    description:
      'Pick an artist or track. Generate a playlist that follows a bell curve of energy and danceability — building up, peaking, then winding down.',
    component: (title, description) => <PartyCurve title={title} description={description} />,
  },
  {
    title: 'Contrast Pairs',
    href: '/a/contrast_pairs',
    description:
      'Pick two artists or tracks. Generate a playlist that interleaves recommendations from each, creating an A/B contrast.',
    component: (title, description) => <ContrastPairs title={title} description={description} />,
  },
  {
    title: 'Focus Mode',
    href: '/a/focus_mode',
    description:
      'Pick an artist or track. Generate a playlist of low energy, high acousticness tracks perfect for concentration.',
    component: (title, description) => <FocusMode title={title} description={description} />,
  },
  {
    title: 'Random Walk',
    href: '/a/random_walk',
    description:
      'Pick an artist or track. Generate a playlist by chaining single recommendations — each track seeds the next.',
    component: (title, description) => <RandomWalk title={title} description={description} />,
  },
]
