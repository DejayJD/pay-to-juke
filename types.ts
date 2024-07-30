type User = any // no sdk types here lol

/**
 * Stuff the client can send to the server
 */
export enum ClientSocketMessage {
  queueAddRequest = 'queueAddRequest',
  syncRequest = 'syncRequest',
  reaction = 'reaction',
  chat = 'chat',
  disconnect = 'disconnect'
}

export type ClientQueueRequestEvent = {
  type: ClientSocketMessage.queueAddRequest
  hash: string
  trackId: string
  trackDurationS: number
  user: User
}

export type ClientSyncRequestEvent = {
  type: ClientSocketMessage.syncRequest
  user: User
}

export type ClientReactionEvent = {
  type: ClientSocketMessage.reaction
  reactionType: string
}

export type ClientChatEvent = {
  type: ClientSocketMessage.chat
  user: string
  msg: string
}

export type ClientDisconnectEvent = {
  type: ClientSocketMessage.disconnect
  user: User
}

export type ClientSocketEvent =
  | ClientQueueRequestEvent
  | ClientSyncRequestEvent
  | ClientReactionEvent
  | ClientChatEvent
  | ClientDisconnectEvent

/**
 * Stuff the server can send to the client
 */

export type QueuedTrackData = {
  hash: string
  trackId: string
  startTime: Date | null
  trackDurationS: number
  uuid: string
  requester: User
}

export enum ServerSocketMessage {
  queueChange = 'queueChange',
  songStart = 'songStart',
  endPlayback = 'endPlayback',
  sync = 'sync',
  reaction = 'reaction',
  chat = 'chat',
  listenerChange = 'listenerChange'
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

export type ServerChatEvent = {
  type: ServerSocketMessage.chat
  user: string
  msg: string
}

export type ServerListenerChangeEvent = {
  type: ServerSocketMessage.listenerChange
  listeners: User[]
}

export type ServerSocketEvent =
  | QueueChangeEvent
  | SongStartEvent
  | EndPlaybackEvent
  | ServerSyncEvent
  | ServerReactionEvent
  | ServerChatEvent
  | ServerListenerChangeEvent
