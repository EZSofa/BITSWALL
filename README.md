# BITSWALL

## Emulator development

### Run emulator

 - `npm run dev`

### Check Database

Browse data with REST api.
Need to add query params ns = [databaseName]

 - On browser `http://localhost:9000/.json?ns=bitswall-8478f`

----

## Deployment

- Get CI token `firebase login:ci`

### Hosting

- firebase deploy --only hosting --token $CI_TOKEN

### Function

- firebase deploy --only functions --token $CI_TOKEN