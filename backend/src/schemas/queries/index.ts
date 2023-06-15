import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import { getSpotifyRedirectURI, refreshToken } from './auth'
import { savePlaylist } from './playlists'
import { autocomplete } from './autocomplete'
import { createProgressivelyEnergeticPlaylist } from './progressivelyEnergetic'
import { createFromArtistToArtistPlaylist } from './fromArtistToArtist'
import { createGoodBeatsToGoodSleepsPlaylist } from './goodBeatsToGoodSleeps'
import { createArtistMashupPlaylist } from './artistMashup'
import { createFullControlPlaylist } from './fullControl'

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
        savePlaylist,
        createFromArtistToArtistPlaylist, 
        createGoodBeatsToGoodSleepsPlaylist,
        createArtistMashupPlaylist,
        createFullControlPlaylist
    }),
})

export default RootQueryType