import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import spotifyAPIClient from '../spotify'
import SpotifyClientPromise from '../spotify'
import { TAutocompleteEntry, TPlaylistEntry } from '../../../shared/types'

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

type CreateEnergizingPlaylistArgs = {
    artistId: string,
}


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

const autocomplete = {
    type: new GraphQLList(AutoCompleteType),
    description: 'Get a list of items searched for autocomplete',
    args: {
        types: { type: new GraphQLNonNull(SearchTypeEnum) },
        query: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (_: any, { query, types }: SearchArgs) => {
        const client = await SpotifyClientPromise
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
    const client = await SpotifyClientPromise
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



const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        ping,
        autocomplete,
        createEnergizingPlaylist
    }),
})

export default RootQueryType