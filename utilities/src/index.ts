export interface TAutocompleteEntry {
    image: string
    name: string
    id: string
    type: SearchType
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
    Response: TAutocompleteEntry[]
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

export type TAlgorithmGradient = {
    Request: {
        startWithId: string;
        startWithType: SearchType;
        endWithId: string;
        endWithType: SearchType;
    } & TSharedAlgorithmRequestParams,
    Response: TPlaylistEntry[]
}

export type TSharedAlgorithmRequestParams = {
    trackCount: number;
    market: string;
}

export type TAlgorithmFullControl = {
    Request: {
        selectedId: string;
        selectedType: SearchType;
        filters: string;
    } & TSharedAlgorithmRequestParams;
    Response: TPlaylistEntry[];
};

export type TAlgorithmGoodBeatsToGoodSleeps = {
    Request: {
        selectedId: string;
        selectedType: SearchType;
    } & TSharedAlgorithmRequestParams;
    Response: TPlaylistEntry[];
};

export type TAlgorithmMashup = {
    Request: {
        artistIds: string[];
        trackIds: string[]
    } & TSharedAlgorithmRequestParams;
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