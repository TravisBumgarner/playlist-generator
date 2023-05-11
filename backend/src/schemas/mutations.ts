import { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql'
import SpotifyClientPromise from '../spotify'

type SavePlaylistArgs = {
    uris: string[]
}

const savePlaylist = {
    type: new GraphQLList(GraphQLString),
    description: 'Save a playlsit to Travis\'s Spotify',
    args: {
        uris: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    },
    resolve: async (_: any, { uris }: SavePlaylistArgs) => {
        const client = await SpotifyClientPromise
        const playlist = await client.createPlaylist(Math.random().toString(), {
            public: false,
            description: "Made by a robot."
        })
        console.log(playlist)

        client.addTracksToPlaylist(playlist.body.id, uris)
    }
}

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        savePlaylist
    })
})

export default RootMutationType