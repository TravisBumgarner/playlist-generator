// Too lazy to figure out how to get builds to work these files are duplicates in FE and BE
export type TAutocompleteEntry = {
    image: string,
    name: string,
    id: string
}

export type TPlaylistEntry = {
    id: string,
    artists: string,
    name: string,
    album: string
    uri: string
    image: string
}