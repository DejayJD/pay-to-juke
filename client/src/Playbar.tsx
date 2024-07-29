import { Box, Flex, IconButton, IconMood, IconSearch } from '@audius/harmony'
import { Balance } from './Balance'
import { useContext, useRef, useState } from 'react'
import { AppContext } from './AppContext'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import styles from './Playbar.module.css'
import { TrackSearch } from './TrackSearch'
import { ReactionPopupMenu } from './Reactions/ReactionPopupMenu'
import { AudioPlayer } from './AudioPlayer'
import { ReactionType } from './Reactions'

import VolumeBar from './VolumeBar'

export const Playbar = () => {
  const { setVolume, sendReactionToServer } = useContext(AppContext)!
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isReactionPopupVisible, setIsReactionPopupVisible] = useState(false)
  const toggleSearchDrawer = () => setIsSearchOpen((val) => !val)
  const toggleReactionPopup = () => setIsReactionPopupVisible((val) => !val)
  const handleReactionSelected = (reactionType: ReactionType) => {
    sendReactionToServer(reactionType)
  }

  const reactionButtonRef = useRef<any>(null)

  return (
    <Flex
      w='100%'
      h='80px'
      justifyContent='space-between'
      backgroundColor='default'
      css={{
        position: 'fixed',
        bottom: 0,
        paddingLeft: '5%',
        paddingRight: '5%',
        zIndex: 100
      }}
      gap='l'
      alignItems='center'
    >
      <IconButton
        aria-label='search'
        icon={IconSearch}
        size='2xl'
        color='default'
        onClick={toggleSearchDrawer}
      />

      <Flex css={{ position: 'relative' }}>
        <Box
          css={{ position: 'absolute', top: -80, left: 30, background: 'blue' }}
          w='20'
          h='20'
          ref={reactionButtonRef}
        />
        <IconButton
          aria-label='toggle emote wheel'
          size='2xl'
          color='default'
          icon={IconMood}
          onClick={toggleReactionPopup}
        />
        <ReactionPopupMenu
          anchorRef={reactionButtonRef}
          isVisible={isReactionPopupVisible}
          onClose={() => {
            setIsReactionPopupVisible(false)
          }}
          onSelected={handleReactionSelected}
        />
      </Flex>
      <Flex flex='3'>
        <AudioPlayer />
      </Flex>
      <VolumeBar
        defaultValue={25}
        onChange={(vol) => {
          setVolume(vol * 0.5)
        }}
      />
      <Balance />

      <Drawer
        open={isSearchOpen}
        onClose={toggleSearchDrawer}
        direction='bottom'
        className={styles.searchDrawer}
        size='400px'
        style={{ background: '#242438' }}
      >
        <Flex
          w='100%'
          justifyContent='center'
          h='400px'
          css={{ overflow: 'auto' }}
        >
          <TrackSearch />
        </Flex>
      </Drawer>
    </Flex>
  )
}
