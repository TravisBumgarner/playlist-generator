import getSpotifyClient from "./spotify"
import { Array, String, Dictionary } from "runtypes"
import fs from 'fs'
import path from 'path'

const Data = Dictionary(Array(String));

const main = async (seedArtists: string[]) => {
    const artistIDsToSearch = new Set(seedArtists)
    const artistIDsSearched = new Set()

    const outputDir = path.join(__dirname, 'output')
    const jsonOutputDir = fs.readdirSync(outputDir).filter(file => path.extname(file) === '.json');
    jsonOutputDir.forEach(file => {
        const fileData = fs.readFileSync(path.join(outputDir, file));
        const json = JSON.parse(fileData.toString());
        const previousGraph = Data.check(json)
        Object.keys(previousGraph).forEach(artistId => artistIDsSearched.add(artistId))
        Object.values(previousGraph)
            .flat().forEach(artistId => !artistIDsSearched.has(artistId) && artistIDsToSearch.add(artistId))
    });

    let newGraph: Record<string, string[]> = {}
    const client = await getSpotifyClient()
    const iterable = artistIDsToSearch.values()

    try {
        while (artistIDsToSearch.size > 0) {
            const { value: artistId, done } = iterable.next()
            if (done) break

            artistIDsToSearch.delete(artistId)
            const results = await client.getArtistRelatedArtists(artistId)
            if (!results.body.artists) {
                continue
            }
            newGraph[artistId] = results.body.artists.map(({ id }) => id)
            results.body.artists.forEach(({ id }) => !artistIDsSearched.has(id) && artistIDsToSearch.add(id))
            artistIDsSearched.add(artistId)

            if (artistIDsSearched.size % 5000 === 0) {
                const outputFile = path.join(__dirname, `output/data_${artistIDsSearched.size}.json`)
                fs.writeFileSync(outputFile, JSON.stringify(newGraph))
                console.log('saved to disk')
                newGraph = {}
            }
        }
    } catch (error) {
        console.log('something went wrong...')
        console.log(error)
    }

    const outputFile = path.join(__dirname, `output/data_${artistIDsSearched.size}.json`)
    fs.writeFileSync(outputFile, JSON.stringify(newGraph))
    console.log('saved to disk')
}

export default main