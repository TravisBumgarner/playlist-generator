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

export const CREATE_FULL_CONTROL_PLAYLIST = gql`
  ${Playlist}

  query createFullControlPlaylist(
    $artistId: String!
    $filters: String!
    $market: String!
    $trackCount: Int!
  ) {
    createFullControlPlaylist(
      artistId: $artistId
      filters: $filters
      market: $market
      trackCount: $trackCount
    ) {
      ...playlist
    }
  }
`

export const CREATE_FROM_ARTIST_TO_ARTIST_PLAYLIST = gql`
    ${Playlist}

query createFromArtistToArtistPlaylist(
  $artistIdStart: String!,
  $artistIdEnd: String!,
  $market: String!,
  $trackCount: Int!
  ) {
  createFromArtistToArtistPlaylist(
    artistIdStart: $artistIdStart,
    artistIdEnd: $artistIdEnd,
    market: $market,
    trackCount: $trackCount) {
    ...playlist
    }
  }
`

export const CREATE_ARTIST_MASHUP_PLAYLIST = gql`
    ${Playlist}

query createArtistMashupPlaylist(
  $artistIds: [String]!,
  $market: String!,
  $trackCount: Int!
) {
  createArtistMashupPlaylist(
    artistIds: $artistIds,
    market: $market,
    trackCount: $trackCount
  ) {
    ...playlist
    }
  }
`

export const CREATE_GOOD_BEATS_TO_GOOD_SLEEPS_QUERY = gql`
    ${Playlist}


query createGoodBeatsToGoodSleepsPlaylist(
    $artistId: String!,
    $market: String!,
    $trackCount: Int!
  ) {
  createGoodBeatsToGoodSleepsPlaylist(
    market: $market,
    artistId: $artistId,
    trackCount: $trackCount
  ) {
    ...playlist
    }
  }
`
