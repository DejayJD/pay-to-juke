import { useEffect, useRef, useState } from 'react'
import { audiusSdk } from './audiusSdk'
import { Flex, Hint, IconInfo, Text } from '@audius/harmony'

// /**
//  * Favorite or unfavorite a track. This requires a user to be authenticated and granted
//  * write permissions to the app
//  */
// const favoriteTrack =
//   (trackId: string, favorite = true): MouseEventHandler<HTMLButtonElement> =>
//   async (e) => {
//     e.stopPropagation()
//     if (user) {
//       setFavorites((prev) => ({ ...prev, [trackId]: favorite }))
//       try {
//         await audiusSdk.tracks[
//           favorite ? 'favoriteTrack' : 'unfavoriteTrack'
//         ]({ userId: user.userId, trackId })
//       } catch (e) {
//         console.error('Failed to favorite track', e)
//         setFavorites((prev) => ({ ...prev, [trackId]: !favorite }))
//       }
//     } else {
//       alert('Please log in with Audius to perform write operations')
//     }
//   }

type User = { userId: string; handle: string }

// probably wont need this
export const AudiusSignIn = () => {
  const loginWithAudiusButtonRef = useRef<HTMLDivElement>(null)

  const [user, setUser] = useState<User | null>(null)
  /**
   * Init @audius/sdk oauth
   */
  useEffect(() => {
    audiusSdk.oauth?.init({
      successCallback: (user: User) => setUser(user),
      errorCallback: (error: string) => console.log('Got error', error)
    })

    if (loginWithAudiusButtonRef.current) {
      audiusSdk.oauth?.renderButton({
        element: loginWithAudiusButtonRef.current,
        scope: 'write'
      })
    }
  }, [])

  return !user ? (
    <Hint
      icon={() => <IconInfo size='l' color='default' />}
      m='m'
      css={{ maxWidth: 400 }}
    >
      <Flex gap='m' direction='column'>
        <Text>
          To perform writes with @audius/sdk please authorize this app to
          perform writes on your behalf
        </Text>
        <div ref={loginWithAudiusButtonRef} />
      </Flex>
    </Hint>
  ) : null
}
