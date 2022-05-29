import { AUTH_CLIENT_ID, AUTH_CALLBACK_URL, AUTH_CLIENT_SECRET } from "."

const Auth0Config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: 'http://localhost:8080',
    clientID: AUTH_CLIENT_ID,
    issuerBaseURL: 'https://dev-hny8cmer.us.auth0.com',
    secret: AUTH_CLIENT_SECRET
}

export default Auth0Config