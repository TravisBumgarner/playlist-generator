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

export enum SearchType {
    Album = 'Album',
    Artist = 'Artist',
    Playlist = 'Playlist',
    Track = 'Track',
}

export type TAutocomplete = {
    Request: {
        type: string,
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
    } & TSharedRequestParams,
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

export type TFilter = {
    value: EFilterOption
    start: EFilterValue
    end: EFilterValue
}
export type TSharedRequestParams = {
    trackCount: number;
    market: string;
}

export type TFullControl = {
    Request: {
        artistId: string;
        market: string;
        filters: string;
    } & TSharedRequestParams;
    Response: TPlaylistEntry[];
};

export type TGoodBeatsToGoodSleeps = {
    Request: {
        artistId: string;
        market: string;
    } & TSharedRequestParams;
    Response: TPlaylistEntry[];
};

export type TArtistMashup = {
    Request: {
        artistIds: string[];
        market: string;
    } & TSharedRequestParams;
    Response: TPlaylistEntry[];
};

export type TCreatePlaylist = {
    Request: {
        uris: string[],
        accessToken: string,
        playlistTitle: string
        playlistDescription: string
    },
}

export const stringifyFilters = (filters: TFilter[]): string => {
    return JSON.stringify(filters)
}

export const parseFilters = (filters: string): TFilter[] => {
    return JSON.parse(filters)
}