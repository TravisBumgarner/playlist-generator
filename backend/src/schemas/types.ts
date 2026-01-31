import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

const PlaylistArtistType = new GraphQLObjectType({
  name: 'PlaylistArtistResult',
  description: 'This represents a playlist artist entry',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    href: { type: new GraphQLNonNull(GraphQLString) },
  }),
})

const PlaylistAlbumType = new GraphQLObjectType({
  name: 'PlaylistAlbumResult',
  description: 'This represents a playlist album entry',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    href: { type: new GraphQLNonNull(GraphQLString) },
  }),
})

export const PlaylistType = new GraphQLObjectType({
  name: 'PlaylistResult',
  description: 'This represents a playlist entry',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    artists: { type: new GraphQLNonNull(new GraphQLList(PlaylistArtistType)) },
    image: { type: new GraphQLNonNull(GraphQLString) },
    album: { type: new GraphQLNonNull(PlaylistAlbumType) },
    uri: { type: new GraphQLNonNull(GraphQLString) },
    href: { type: new GraphQLNonNull(GraphQLString) },
  }),
})
