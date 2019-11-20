# BITSWALL

## Deployment

- Get CI token `firebase login:ci`

### Hosting

- firebase deploy --only hosting --token $CI_TOKEN

### Function

- firebase deploy --only functions --token $CI_TOKEN