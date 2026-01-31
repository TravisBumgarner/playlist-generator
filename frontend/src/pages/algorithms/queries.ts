import { gql } from '@apollo/client'

const Playlist = gql`
  fragment playlist on PlaylistResult {
    name
    id
    album {
      href
      name
    }
    artists {
      href
      name
    }
    uri
    image
    href
  }
`

// playlistFromArtistToArtist,
// playlistFullControl,
// playlistGoodBeatsToGoodSleeps,
// playlistMashup

export const FULL_CONTROL = gql`
  ${Playlist}

  query playlistFullControl(
    $selectedId: String!
    $selectedType: String!
    $filters: String!
    $market: String!
    $trackCount: Int!
  ) {
    playlistFullControl(
      selectedId: $selectedId,
      selectedType: $selectedType,
      filters: $filters
      market: $market
      trackCount: $trackCount
    ) {
      ...playlist
    }
  }
`

export const GRADIENT = gql`
  ${Playlist}

  query playlistGradient(
    $startWithId: String!,
    $endWithId: String!,
    $startWithType: String!,
    $endWithType: String!,   
    $market: String!,
    $trackCount: Int!
  ) {
    playlistGradient(
      startWithId: $startWithId,
      endWithId: $endWithId,
      startWithType: $startWithType,
      endWithType: $endWithType,
      market: $market,
      trackCount: $trackCount
    ) {
      ...playlist
    }
  }
`

export const MASHUP = gql`
  ${Playlist}

  query playlistMashup(
    $artistIds: [String]!,
    $trackIds: [String]!,
    $market: String!,
    $trackCount: Int!
  ) {
    playlistMashup(
      artistIds: $artistIds,
      trackIds: $trackIds,
      market: $market,
      trackCount: $trackCount
    ) {
      ...playlist
    }
  }
`

export const GOOD_BEATS_TO_GOOD_SLEEPS = gql`
  ${Playlist}

  query playlistGoodBeatsToGoodSleeps(
    $selectedId: String!
    $selectedType: String!
    $market: String!,
    $trackCount: Int!
  ) {
    playlistGoodBeatsToGoodSleeps(
      market: $market,
      selectedId: $selectedId,
      selectedType: $selectedType,
      trackCount: $trackCount
    ) {
      ...playlist
    }
  }
`
