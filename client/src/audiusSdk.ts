import { sdk } from '@audius/sdk'

export const audiusSdk = sdk({
  appName: 'Audius SDK React Example'
  // apiKey: "Your API Key goes here",
  // apiSecret: "Your API Secret goes here",
  // NOTE: In a real app, you should never expose your apiSecret to the client.
  // Instead, store the apiSecret on your server and make requests using @audius/sdk server side
})
