const authEndpoint = 'https://accounts.spotify.com/authorize'
//const redirectUrl = 'http://localhost:8000'
const redirectUrl = 'http://localhost:3000/'
const clientId = '6f000ef1367546db96a0db63603e13ca'

const scopes = [
    'user-read-email',
    'user-read-private',
    'user-library-read',
    'user-follow-read',
    'playlist-read-private',
    'playlist-read-collaborative'
]

export const loginUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}&scope=${scopes.join(
    "%20"
  )}`;