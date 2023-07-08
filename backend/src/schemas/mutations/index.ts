import { GraphQLObjectType } from 'graphql'

import savePlaylist from './savePlaylist'

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        savePlaylist
    })
})

export default RootMutationType