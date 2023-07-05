import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import { getSpotifyRedirectURI, refreshToken } from './auth'
import { savePlaylist } from './playlists'
import { autocomplete } from './autocomplete'
import playlistGradient from './playlistGradient'
import playlistGoodBeatsToGoodSleeps from './playlistGoodBeatsToGoodSleeps'
import playlistMashup from './playlistMashup'
import playlistFullControl from './playlistFullControl'

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
        getSpotifyRedirectURI,
        refreshToken,
        savePlaylist,
        playlistGradient,
        playlistFullControl,
        playlistGoodBeatsToGoodSleeps,
        playlistMashup
    }),
})

export default RootQueryType