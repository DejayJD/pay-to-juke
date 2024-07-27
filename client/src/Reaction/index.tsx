import { ComponentType } from 'react'

export type ReactionType = 'heart' | 'fire' | 'party' | 'explode'

import { ReactionProps as BaseReactionProps } from './Reaction'
import {
  ExplodeReaction,
  FireReaction,
  HeartReaction,
  PartyReaction
} from './Reactions'

export type ReactionProps = Omit<BaseReactionProps, 'animationData'>

export const reactionMap: {
  [k in ReactionType]: ComponentType<ReactionProps>
} = {
  heart: HeartReaction,
  fire: FireReaction,
  party: PartyReaction,
  explode: ExplodeReaction
}
