import { GraphQLBoolean, GraphQLEnumType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { v4 as uuidv4 } from 'uuid'

import getSpotifyClient, { getSpotifyUserTokenWithRefresh } from '../spotify'
import { TAutocompleteEntry } from '../types'
import config from '../config'


// They're f'ing case sensative -_-
enum Markets {
    US = "US"
}

const ping = {
    type: GraphQLString,
    description: 'Health Check',
    args: {
        ping: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (_: any, args: { ping: string }) => {
        return `pong, ${ping}`
    },
}

const SearchTypeEnum = new GraphQLEnumType({
    name: 'SearchTypeEnum',
    values: {
        artist: { value: 'artist' },
    }
})

enum ESearchTypeEnum {
    artist = 'artist'
}

type SearchArgs = {
    types: ESearchTypeEnum,
    query: string
}

type RefreshTokenArgs = {
    refreshToken: string
}


type CreateEnergizingPlaylistArgs = {
    artistId: string,
}

const TokenType = new GraphQLObjectType({
    name: 'Token',
    description: 'This represents a spotify Token',
    fields: () => ({
        refreshToken: { type: GraphQLString },
        expiresIn: { type: new GraphQLNonNull(GraphQLInt) },
        accessToken: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

const AutoCompleteType = new GraphQLObjectType({
    name: 'AutocompleteResult',
    description: 'This represents an autocomplete entry',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

const PlaylistType = new GraphQLObjectType({
    name: 'PlaylistResult',
    description: 'This represents a playlist entry',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        artists: { type: new GraphQLNonNull(GraphQLString) },
        album: { type: new GraphQLNonNull(GraphQLString) },
        uri: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

const getSpotifyRedirectURI = {
    type: GraphQLString,
    description: 'Initiate Login Process',
    args: {
    },
    resolve: async () => {
        const state = uuidv4();
        const scope = 'user-read-private user-read-email playlist-modify-public';

        const queryString = new URLSearchParams({
            response_type: 'code',
            client_id: config.spotify.clientId,
            scope: scope,
            redirect_uri: config.spotify.redirectURI,
            state: state
        })

        const redirectUrl = 'https://accounts.spotify.com/authorize?' + queryString.toString()
        return redirectUrl
    }
}

const refreshToken = {
    type: new GraphQLNonNull(TokenType),
    description: 'Initiate Token Refresh Process',
    args: {
        refreshToken: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (_: any, { refreshToken }: RefreshTokenArgs) => {
        return await getSpotifyUserTokenWithRefresh(refreshToken)
    }
}


const autocomplete = {
    type: new GraphQLList(AutoCompleteType),
    description: 'Get a list of items searched for autocomplete',
    args: {
        types: { type: new GraphQLNonNull(SearchTypeEnum) },
        query: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (_: any, { query, types }: SearchArgs) => {
        const client = await getSpotifyClient()
        console.log('autocomplete', client.getAccessToken())

        const spotifyResults = await client.search(query, [types], { market: Markets.US, offset: 0, limit: 10 })
        const autocompleteResults = spotifyResults?.body?.artists?.items.map(({ id, images, name }) => {
            return {
                id,
                name,
                image: images.length > 0 ? images[0].url : ''
            }
        }) ?? []

        return autocompleteResults as TAutocompleteEntry[]
    }
}

type GetRecommendationsOptions = {
    seed_artists: string[] | string
    market: string,
    limit: number,
    min_energy: number,
    max_energy: number
}

const getRecommendations = async (options: GetRecommendationsOptions) => {
    const client = await getSpotifyClient()
    console.log('getrecs', client.getAccessToken())
    try {
        const results = await client.getRecommendations(options)
        return results.body?.tracks?.map(({ id, name, artists, album, uri }) => {
            return {
                id,
                artists: artists.map(artist => artist.name).join(', '),
                album: album.name,
                name,
                uri
            }
        })
    } catch (error: any) {
        console.log(error)
        console.log(error.name)
        console.log(error.message)
        return []
    }
}

const createEnergizingPlaylist = {
    type: new GraphQLList(PlaylistType),
    description: 'Start with an artist, and create a playlist of increasingly energetic songs',
    args: {
        artistId: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_: any, { artistId }: CreateEnergizingPlaylistArgs) => {
        const promises = await Promise.all([0.25, 0.5, 0.75].map(async (minEnergy) => {
            const options = { seed_artists: artistId, market: Markets.US, limit: 5, min_energy: 0, max_energy: 1 }
            return getRecommendations(options)
        }))
        return promises.flat()
    }
}

type CreatePlaylistArgs = {
    uris: string[],
    accessToken: string,
    playlistTitle: string
}

const savePlaylist = {
    type: GraphQLString,
    description: 'Save a collection of tracks to spotify',
    args: {
        playlistTitle: { type: new GraphQLNonNull(GraphQLString) },
        accessToken: { type: new GraphQLNonNull(GraphQLString) },
        uris: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    },
    resolve: async (_: any, { uris, accessToken, playlistTitle }: CreatePlaylistArgs) => {
        try {
            const client = await getSpotifyClient()
            client.setAccessToken(accessToken)
            console.log(playlistTitle)
            const playlist = await client.createPlaylist(playlistTitle)
            console.log(playlist)
            await client.addTracksToPlaylist(playlist.body.id, uris)
            return playlist.body.uri
        } catch (error: any) {
            console.log(error)
            console.log(error.name)
            console.log(error.message)
            return null
        }
    }
}

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        ping,
        autocomplete,
        createEnergizingPlaylist,
        getSpotifyRedirectURI,
        refreshToken,
        savePlaylist
    }),
})

export default RootQueryType