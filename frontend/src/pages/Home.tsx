import { gql, useLazyQuery } from "@apollo/client"
import { Box, Button, Container, List, ListItemButton, Typography } from "@mui/material"
import { useCallback, useContext, useState, useMemo } from "react"
import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { context } from "context"
import { Link } from "react-router-dom";

const Algorithms = () => {
    return (
        <List>
            <ListItem disablePadding>
                <Link to="/a/elevated_artist">Elevated Artist</Link>
            </ListItem>
        </List>
    )
}

const Home = () => {
    const { state } = useContext(context)

    return (
        <Container>
            <Typography variant="h2" gutterBottom>Welcome!</Typography>
            {!(state.user) && <Typography variant="h3">Please login.</Typography>}

            {(state.user) && <Algorithms />}
        </Container>
    )
}

export default Home
