import { gql, useLazyQuery, useQuery } from "@apollo/client"
import { Container, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { Loading } from "sharedComponents"

const PING_QUERY = gql`
query Ping($ping: String!) {
    ping(ping: $ping)
  }
`


const Home = () => {
    const [loadGreeting, { loading, data }] = useLazyQuery(
        PING_QUERY,
        { variables: { ping: "english" } }
    );
    console.log(data)
    useEffect(() => {
        loadGreeting()
    }, [])

    if (loading) return <Loading />
    return <h1>Hello {JSON.stringify(data)}!</h1>;

    // const spotifyAPI = useCallback(async () => {
    //     // const response = await axios.get(`${__API__}/get_spotify_thing`)
    //     // setData(JSON.stringify(response.data))
    //     setIsLoading(false)
    // }, [])

    // useEffect(() => {
    //     spotifyAPI()
    //     ping()
    // })

    // if (isLoading) {
    //     return <Loading />
    // }

    // return (
    //     <Container>
    //         <Typography variant="h2" gutterBottom>
    //             Home
    //         </Typography>
    //         <Typography variant="body2" gutterBottom>
    //             {data}
    //         </Typography>
    //     </Container>
    // )
}

export default Home
