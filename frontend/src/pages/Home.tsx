import { Container, Typography } from "@mui/material"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { Loading } from "sharedComponents"



const Home = () => {
    const [data, setData] = useState<any>()
    const [isLoading, setIsLoading] = useState(true)

    const spotifyAPI = useCallback(async () => {
        const response = await axios.get(`${__API__}/get_spotify_thing`)
        setData(JSON.stringify(response.data))
        setIsLoading(false)
    }, [])

    useEffect(() => {
        spotifyAPI()
    })

    if (isLoading) {
        return <Loading />
    }

    return (
        <Container>
            <Typography variant="h2" gutterBottom>
                Home
            </Typography>
            <Typography variant="body2" gutterBottom>
                {data}
            </Typography>
        </Container>
    )
}

export default Home
