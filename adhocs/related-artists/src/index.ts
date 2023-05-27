import getSpotifyClient from "./spotify"
import data from './data.json'
import { Array, Literal, Record, String, Dictionary } from "runtypes"
import fs from 'fs'
import path from 'path'

const Data = Dictionary(Array(String));

const previousGraph = Data.check(data)

const main = async (seedArtists: string[]) => {
    const newGraph = { ...previousGraph }
    const artistIDsToSearch = new Set(seedArtists)
    const artistIDsSearched = new Set()
    const client = await getSpotifyClient()

    Object.keys(previousGraph).forEach(artistId => artistIDsSearched.add(artistId))
    Object.values(previousGraph)
        .flat().forEach(artistId => !artistIDsSearched.has(artistId) && artistIDsToSearch.add(artistId))

    const iterable = artistIDsToSearch.values()

    try {
        while (artistIDsToSearch.size > 0) {
            console.log(`artistIDsToSearch: ${artistIDsToSearch.size}, artistIDsSearched: ${artistIDsSearched.size}`)

            const { value: artistId, done } = iterable.next()
            if (done) break

            artistIDsToSearch.delete(artistId)
            const results = await client.getArtistRelatedArtists(artistId)
            if (!results.body.artists) {
                console.log('Related artists did not exist', artistId)
                continue
            }
            newGraph[artistId] = results.body.artists.map(({ id }) => id)
            results.body.artists.forEach(({ id }) => !artistIDsSearched.has(id) && artistIDsToSearch.add(id))
            artistIDsSearched.add(artistId)
            // if (artistIDsSearched.size > 5) {
            //     break
            // }
        }
    } catch (error) {
        console.log('something went wrong...')
        console.log(error)
    }
    const outputFile = path.join(__dirname, './data.json')
    fs.writeFile(outputFile, JSON.stringify(newGraph), err => {
        if (err) {
            console.error(err);
        }
        console.log('saved to disk')
    });
}

export default main