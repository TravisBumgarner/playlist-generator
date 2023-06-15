export type Foo = {
    bar: string;
}

export const foo = 5
export default 5

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

enum ESearchTypeEnum {
    artist = 'artist'
}

export type TAutocomplete = {
    Request: {
        types: ESearchTypeEnum,
        query: string,
        market: string
    }
    Response: {
        id: string,
        name: string,
        image: string
    }[]
}


export type TFromArtistToArtist = {
    Request: {
        artistIdStart: string,
        artistIdEnd: string,
        market: string
    },
    Response: TPlaylistEntry[]
}

export enum EFilterOption {
    Danceability = 'danceability',
    Energy = 'energy',
    Popularity = 'popularity',
    Tempo = 'tempo',
    Valence = 'valence'
}

export enum EFilterValue {
    ExtraLow = "ExtraLow",
    Low = "Low",
    Medium = "Medium",
    High = "High",
    ExtraHigh = "ExtraHigh",
}

type TFilter = {
    value: EFilterOption
    start: EFilterValue
    end: EFilterValue
}

export type TFullControl = {
    Request: {
        artistId: string,
        market: string,
        [EFilterOption.Danceability]?: EFilterOption
        [EFilterOption.Energy]?: EFilterOption
        [EFilterOption.Popularity]?: EFilterOption
        [EFilterOption.Tempo]?: EFilterOption
        [EFilterOption.Valence]?: EFilterOption
    },
    Response: TPlaylistEntry[]
}


export type TGoodBeatsToGoodSleeps = {
    Request: {
        artistId: string,
        market: string
    },
    Response: TPlaylistEntry[]
}

export type TArtistMashup = {
    Request: {
        artistIds: string[],
        market: string
    },
    Response: TPlaylistEntry[]
}

export type TProgressivelyEnergetic = {
    Request: {
        artistId: string,
        market: string
    },
    Response: TPlaylistEntry[]
}

export type TCreatePlaylist = {
    Request: {
        uris: string[],
        accessToken: string,
        playlistTitle: string
    },
}