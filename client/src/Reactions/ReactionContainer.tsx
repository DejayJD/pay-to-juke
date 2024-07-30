import { Flex } from '@audius/harmony'
import { reactionMap, ReactionType } from '.'
import ReactDOM from 'react-dom'

import animationStyles from './ReactionAnimation.module.css'

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const spawnReaction = (type: ReactionType) => {
  const reactionOutlet = document.getElementById('reaction-outlet')
  if (!reactionOutlet) return

  const ReactionComponent = reactionMap[type]

  const newId = uuid()
  const newDiv = document.createElement('div')
  newDiv.setAttribute('id', newId)

  reactionOutlet.append(newDiv)
  ReactDOM.render(
    <div
      className={animationStyles.floatUp}
      style={{ marginLeft: Math.random() * 150 }}
    >
      <ReactionComponent />
    </div>,
    newDiv
  )
  newDiv.addEventListener('animationend', () => {
    newDiv.remove()
  })
}

export const ReactionContainer = () => {
  return (
    <Flex
      w='180px'
      h='280px'
      alignItems='flex-end'
      css={{
        position: 'absolute',
        left: '52%',
        top: '200px',
        transform: 'translateX(-50%)'
      }}
      id='reaction-outlet'
    />
  )
}
