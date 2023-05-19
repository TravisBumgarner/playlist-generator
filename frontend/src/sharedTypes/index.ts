// Too lazy to figure out how to get builds to work these files are duplicates in FE and BE
export interface TAutocompleteEntry {
  image: string
  name: string
  id: string
}

export interface TPlaylistEntry {
  id: string
  artists: string
  name: string
  album: string
  uri: string
  image: string
}
