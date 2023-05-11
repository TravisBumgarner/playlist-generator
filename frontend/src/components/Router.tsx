import { useContext } from 'react'
import { Routes, Route } from 'react-router'

import { context } from 'context'
import { Home, Error } from '../pages'
import { ElevatedArtist } from '../pages/algorithms'

const Router = () => {
    const { state } = useContext(context)

    if (state.hasErrored) {
        return <Error />
    }

    return (
        <Routes>
            <Route path="/error" element={<Error />} />
            <Route path="/" element={<Home />} />
            <Route path="/a/elevated_artist" element={<ElevatedArtist />} />
        </Routes>
    )
}

export default Router