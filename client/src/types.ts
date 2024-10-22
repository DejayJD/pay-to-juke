import { full as FullSdk } from '@audius/sdk'

export type TrackFull = FullSdk.TrackFull

export type PlayerTrackFull = TrackFull & {
  uid: string
}
