import {
  Flex,
  IconButton,
  IconSearch,
  Text,
  TextInput,
  TextInputSize
} from '@audius/harmony'
import { useState } from 'react'
import { audiusSdk } from './audiusSdk'
import { TrackSearchTile } from './TrackSearchTile'
import { TrackFull } from './types'

export const TrackSearch = () => {
  const [searchText, setSearchText] = useState('RAC')
  const [tracklist, setTracklist] = useState<TrackFull[]>([])

  const searchTrack = async () => {
    const { data: tracks } = await audiusSdk.tracks.searchTracks({
      query: searchText
    })

    setTracklist(tracks ?? [])

    // const trackFavorites = (tracks ?? []).reduce<Record<string, boolean>>(
    //   (result, track) => ({
    //     ...result,
    //     [track.id]: track.hasCurrentUserSaved
    //   }),
    //   {}
    // )
  }

  return (
    <Flex direction='column' gap='s' mt='2xl'>
      <Text color='default'>Search for a track to play</Text>
      <Flex gap='m' w='500px'>
        <TextInput
          label='Get tracks for user handle:'
          size={TextInputSize.SMALL}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              searchTrack()
            }
          }}
          endIcon={IconSearch}
        />
      </Flex>
      <Flex direction='column' gap='l' mt='xl'>
        {tracklist.map((track) => (
          <TrackSearchTile track={track} key={track.id} />
        ))}
      </Flex>
    </Flex>
  )
}
