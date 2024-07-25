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
import { TrackListTile } from './TrackListTile'
import { TrackFull } from './types'

export const TrackSearch = () => {
  const [searchText, setSearchText] = useState('RAC')
  const [tracklist, setTracklist] = useState<TrackFull[]>([])

  const searchTrack = async () => {
    const { data: tracks } = await audiusSdk.tracks.searchTracks({
      query: searchText
    })

    console.log({ tracks })
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
      <Text>Enter a user handle to fetch their tracks:</Text>
      <Flex gap='m'>
        <TextInput
          label='Get tracks for user handle:'
          size={TextInputSize.SMALL}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <IconButton
          size='s'
          icon={IconSearch}
          aria-label='search'
          onClick={searchTrack}
          color='accent'
        />
      </Flex>
      <Flex direction='column' gap='l' mt='xl'>
        {tracklist.map((track) => (
          <TrackListTile track={track} key={track.id} />
        ))}
      </Flex>
    </Flex>
  )
}
