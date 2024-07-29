import { createRef, Component } from 'react'

import {
  IconVolumeLevel0 as IconVolume0,
  IconVolumeLevel1 as IconVolume1,
  IconVolumeLevel2 as IconVolume2,
  IconVolumeLevel3 as IconVolume3,
  setupHotkeys,
  ModifierKeys
} from '@audius/harmony'

import styles from './VolumeBar.module.css'
import { Slider } from './slider/Slider'

const getVolumeIcon = (volumeLevel: number) => {
  if (volumeLevel === 0) return IconVolume0
  if (volumeLevel <= 33) return IconVolume1
  if (volumeLevel <= 66) return IconVolume2
  return IconVolume3
}

const getSavedVolume = (defaultVolume: number) => {
  if (typeof window === 'undefined') return defaultVolume
  const localStorageVolume = window.localStorage.getItem('volume')
  if (localStorageVolume === null) {
    window.localStorage.setItem('volume', `${defaultVolume}`)
    return defaultVolume
  } else {
    return parseFloat(localStorageVolume)
  }
}

class VolumeBar extends Component<{
  defaultValue: number
  onChange: (newVolume: number) => void
  granularity?: number
}> {
  state = {
    volumeLevel: getSavedVolume(this.props.defaultValue)
  }

  volumeBarRef = createRef<HTMLDivElement>()

  componentDidMount() {
    const volumeUp = () => {
      this.volumeChange(Math.min(this.state.volumeLevel + 10, 100))
    }
    const volumeDown = () => {
      this.volumeChange(Math.max(this.state.volumeLevel - 10, 0))
    }
    setupHotkeys({
      38 /* up */: { cb: volumeUp, or: [ModifierKeys.CTRL, ModifierKeys.CMD] },
      40 /* down */: {
        cb: volumeDown,
        or: [ModifierKeys.CTRL, ModifierKeys.CMD]
      }
    })
    // Ensure rounded edges at the default volume (100%).
    this.volumeChange(this.state.volumeLevel)
  }

  /**
   * @param {number} value volume number to set, 0 to 100
   * @param {boolean} persist whether or not toe persist the change to local storage
   */
  volumeChange = (value: number, persist = true) => {
    if (value === this.state.volumeLevel) return
    // Round the volume bar tracker's right edge when it reaches 100%
    if (persist) {
      window.localStorage.setItem('volume', `${value}`)
    }
    this.setState({ volumeLevel: value })
    this.props.onChange?.(value)
  }

  mute = () => {
    this.volumeChange(0, false)
  }

  unmute = () => {
    const unmuteVolume = getSavedVolume(this.props.defaultValue)
    this.volumeChange(Math.max(unmuteVolume, 0.5))
  }

  onClick = () => {
    this.state.volumeLevel > 0 ? this.mute() : this.unmute()
  }

  render() {
    const { volumeLevel } = this.state
    const { granularity, defaultValue } = this.props

    const VolumeIcon = getVolumeIcon(volumeLevel)

    return (
      <div className={styles.volumeBarWrapper}>
        <VolumeIcon onClick={this.onClick} className={styles.volumeIcon} />
        <div ref={this.volumeBarRef} className={styles.volumeBar}>
          <Slider
            defaultValue={defaultValue}
            value={this.state.volumeLevel}
            max={granularity || 1}
            showHandle={false}
            onChange={this.volumeChange}
          />
        </div>
      </div>
    )
  }
}

export default VolumeBar
