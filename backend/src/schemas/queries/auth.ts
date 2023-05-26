import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { v4 as uuidv4 } from 'uuid'

import { getSpotifyUserTokenWithRefresh } from '../../spotify'
import config from '../../config'

type RefreshTokenArgs = {
  refreshToken: string
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

export const getSpotifyRedirectURI = {
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

export const refreshToken = {
  type: new GraphQLNonNull(TokenType),
  description: 'Initiate Token Refresh Process',
  args: {
    refreshToken: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (_: any, { refreshToken }: RefreshTokenArgs) => {
    return await getSpotifyUserTokenWithRefresh(refreshToken)
  }
}