import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import getSpotifyClient from '../../spotify'
import { TAutocompleteEntry } from '../../types'
import { getSpotifyRedirectURI, refreshToken } from './auth'
import { savePlaylist } from './playlists'
import { autocomplete } from './autocomplete'
import { createProgressivelyEnergeticPlaylist } from './progressivelyEnergetic'

// They're f'ing case sensative -_-


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

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        ping,
        autocomplete,
        createProgressivelyEnergeticPlaylist,
        getSpotifyRedirectURI,
        refreshToken,
        savePlaylist
    }),
})

export default RootQueryType