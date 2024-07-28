import { MutableRefObject } from 'react'

import { Popup } from '@audius/harmony'

import styles from './ReactionPopupMenu.module.css'
import { reactionMap, ReactionType } from '.'

const reactionList = Object.entries(reactionMap)

type ReactionPopupMenuProps = {
  containerRef?: MutableRefObject<HTMLDivElement | null>
  anchorRef: MutableRefObject<HTMLElement | null>
  isVisible: boolean
  onSelected?: (reaction: ReactionType) => void
  onClose: () => void
  isAuthor?: boolean
}

export const ReactionPopupMenu = (props: ReactionPopupMenuProps) => {
  const { containerRef, anchorRef, isVisible, onSelected, onClose } = props
  return (
    <Popup
      containerRef={containerRef as MutableRefObject<HTMLDivElement>}
      anchorRef={anchorRef as MutableRefObject<HTMLElement>}
      isVisible={isVisible}
      onClose={onClose}
      className={styles.popup}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      css={{ overflow: 'hidden', borderRadius: 10, background: 'none' }}
    >
      <div className={styles.root}>
        {reactionList.map(([reactionType, Reaction]) => (
          <Reaction
            key={reactionType}
            onClick={() => {
              onSelected?.(reactionType as ReactionType)
            }}
            isResponsive
          />
        ))}
      </div>
    </Popup>
  )
}
