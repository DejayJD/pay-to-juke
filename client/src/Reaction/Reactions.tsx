import { ReactionProps } from '.'
import { Reaction } from './Reaction'

export const HeartReaction = (props: ReactionProps) => (
  <Reaction
    {...props}
    animationData={import('./smiling_face_with_heart_eyes.json')}
  />
)
export const FireReaction = (props: ReactionProps) => (
  <Reaction {...props} animationData={import('./fire.json')} />
)
export const PartyReaction = (props: ReactionProps) => (
  <Reaction {...props} animationData={import('./partying_face.json')} />
)
export const ExplodeReaction = (props: ReactionProps) => (
  <Reaction {...props} animationData={import('./exploding_head.json')} />
)
