import {
  Flex,
  IconButton,
  IconMood,
  IconSearch,
  IconVolumeLevel0,
  IconVolumeLevel3
} from '@audius/harmony'
import { Scrubber } from './Scrubber'
import { Balance } from './Balance'
import { useContext, useRef, useState } from 'react'
import { AppContext } from './AppContext'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import styles from './Playbar.module.css'
import { TrackSearch } from './TrackSearch'
import { ReactionPopupMenu } from './Reaction/ReactionPopupMenu'

export const Playbar = () => {
  const { isMuted, setIsMuted } = useContext(AppContext)!
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isReactionPopupVisible, setIsReactionPopupVisible] = useState(false)
  const toggleSearchDrawer = () => setIsSearchOpen((val) => !val)
  const toggleReactionPopup = () => setIsReactionPopupVisible((val) => !val)
  const handleReactionSelected = (reaction: string) => {
    console.log('chose reaction', reaction)
  }
  const reactionButtonRef = useRef<HTMLButtonElement>(null)

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
      <ReactionPopupMenu
        anchorRef={reactionButtonRef}
        isVisible={isReactionPopupVisible}
        onClose={() => {
          toggleReactionPopup()
        }}
        onSelected={handleReactionSelected}
      />
      <IconButton
        aria-label='toggle emote wheel'
        size='2xl'
        color='default'
        icon={IconMood}
        onClick={toggleReactionPopup}
        ref={reactionButtonRef}
      />
      <Flex flex='3'>
        <Scrubber />
      </Flex>
      <IconButton
        aria-label='mute'
        icon={isMuted ? IconVolumeLevel0 : IconVolumeLevel3}
        size='2xl'
        color='default'
        onClick={() => {
          setIsMuted((val) => !val)
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
