import { useContext, useEffect, useRef } from 'react'
import { audiusSdk } from './audiusSdk'
import { User } from '@audius/sdk'
import { AppContext } from './AppContext'
import { Button, IconVolumeLevel3 } from '@audius/harmony'

type AuthLoginProps = {
  onLogin: (user: User) => void
}

export const AuthLogin = ({ onLogin }: AuthLoginProps) => {
  const { setUser } = useContext(AppContext)!
  const loginWithAudiusButtonRef = useRef<HTMLDivElement>(null)
  const localstorageUser = JSON.parse(
    localStorage.getItem('audiusUser')
  ) as User
  /**
   * Init @audius/sdk oauth
   */
  useEffect(() => {
    audiusSdk.oauth?.init({
      successCallback: (user: User) => {
        localStorage.setItem('audiusUser', JSON.stringify(user))
        onLogin(user)
        setUser(user)
      },
      errorCallback: (error: string) => console.log('Got error', error)
    })

    if (loginWithAudiusButtonRef.current) {
      audiusSdk.oauth?.renderButton({
        element: loginWithAudiusButtonRef.current,
        scope: 'write'
      })
    }
  }, [onLogin, setUser])
  return localstorageUser || true ? (
    <Button
      onClick={() => {
        setUser(localstorageUser)
        onLogin(localstorageUser)
      }}
      iconRight={IconVolumeLevel3}
    >
      Start Listening
    </Button>
  ) : (
    <div ref={loginWithAudiusButtonRef} />
  )
}
