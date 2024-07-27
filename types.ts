/**
 * Stuff the client can send to the server
 */
export enum ClientSocketMessage {
  queueAddRequest = 'queueAddRequest',
  syncRequest = 'syncRequest',
  reaction = 'reaction'
}

export type ClientQueueRequestEvent = {
  type: ClientSocketMessage.queueAddRequest
  hash: string
  trackId: string
  trackDurationS: number
}

export type ClientSyncRequestEvent = { type: ClientSocketMessage.syncRequest }

export type ClientReactionEvent = {
  type: ClientSocketMessage.reaction
  reactionType: string
}

export type ClientSocketEvent =
  | ClientQueueRequestEvent
  | ClientSyncRequestEvent
  | ClientReactionEvent

/**
 * Stuff the server can send to the client
 */

export type QueuedTrackData = {
  hash: string
  trackId: string
  startTime: Date | null
  trackDurationS: number
  uuid: string
}

export enum ServerSocketMessage {
  queueChange = 'queueChange',
  songStart = 'songStart',
  endPlayback = 'endPlayback',
  sync = 'sync',
  reaction = 'reaction'
}

export type QueueChangeEvent = {
  type: ServerSocketMessage.queueChange
  queue: QueuedTrackData[]
  history: QueuedTrackData[]
}

export type EndPlaybackEvent = {
  type: ServerSocketMessage.endPlayback
}

export type SongStartEvent = {
  type: ServerSocketMessage.songStart
  currentTrack: QueuedTrackData
}

export type ServerSyncEvent = {
  type: ServerSocketMessage.sync
  queue: QueuedTrackData[]
  history: QueuedTrackData[]
  currentTrack: QueuedTrackData | null
}

export type ServerReactionEvent = {
  type: ServerSocketMessage.reaction
  reactionType: string
}

export type ServerSocketEvent =
  | QueueChangeEvent
  | SongStartEvent
  | EndPlaybackEvent
  | ServerSyncEvent
  | ServerReactionEvent
