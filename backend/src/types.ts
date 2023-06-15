// Too lazy to figure out how to get builds to work these files are duplicates in FE and BE
export interface TAutocompleteEntry {
    image: string
    name: string
    id: string
  }
  
  export interface TArtist {
    name: string
    href: string
  }
  
  export interface TAlbum {
    name: string
    href: string
  }
  
  export interface TPlaylistEntry {
    id: string
    artists: TArtist[]
    name: string
    album: TAlbum
    uri: string
    href: string
    image: string
  }
  