# Setup

1. `yarn` from root
2. Start up `yarn tunnel`
3. Copy forwarding URL for ngrok to `backend/.env`, don't forget `/spotify_redirect`
4. Copy same URL to Spotify https://developer.spotify.com/dashboard/726223a45ad04be18889eafe2825c57c/settings
5. `yarn start` from the root

# Yarn Link

- In `utilities/` can run `yarn link` and it'll make a link to the package's name, `playlist-generator-utilities`. 
- In `frontend/` and `backend/` run `yarn link playlist-generaetor-utilities` which seems to override the package from npmjs.com.
- Now, any local dev stuff will take priority over what's in the package that's been installed.
- Will at some point probably want a script to automate repetative steps.