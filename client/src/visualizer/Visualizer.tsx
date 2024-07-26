import { useContext, useEffect, useState } from 'react'

import Visualizer1 from './utils/visualizer-1.js'
import cn from 'classnames'

import styles from './Visualizer.module.css'
import { AppContext } from '../AppContext.js'

type VisualizerProps = {
  // TODO
  dominantColors?: any
}

export const Visualizer = ({ dominantColors }: VisualizerProps) => {
  const theme = 'dark'
  const { audioPlayer, currentTrack } = useContext(AppContext)!
  const isPlaying = !!currentTrack
  // Used to fadeIn/Out the visualizer (opacity 0 -> 1) through a css class
  const [fadeVisualizer, setFadeVisualizer] = useState<boolean | null>(null)
  // Used to show/hide the visualizer (display: block/none) through a css class
  const [showVisualizer, setShowVisualizer] = useState(true)

  // if (!webGLExists) {
  //   return null
  // }

  // Update Colors
  useEffect(() => {
    if (dominantColors !== null) {
      Visualizer1?.setDominantColors(dominantColors)
    }
  }, [dominantColors, isPlaying, currentTrack])

  // TODO:
  // Rebind audio
  useEffect(() => {
    if (!audioPlayer) {
      return
    }
    if (isPlaying) {
      audioPlayer.addEventListener('canplay', () => {
        console.log('audio player is binding')
        Visualizer1?.bind(audioPlayer)
      })
    }
  }, [isPlaying, currentTrack, audioPlayer])

  useEffect(() => {
    const darkMode = true
    Visualizer1?.show(darkMode)
    setShowVisualizer(true)
    // Fade in after a 50ms delay because setting showVisualizer() and fadeVisualizer() at the
    // same time leads to a race condition resulting in the animation not fading in sometimes
    setTimeout(() => {
      setFadeVisualizer(true)
    }, 50)
  }, [theme])

  // On Closing of visualizer -> fadeOut
  // Wait some time before removing the wrapper DOM element to allow time for fading out animation.
  useEffect(() => {
    if (fadeVisualizer === false) {
      setTimeout(() => {
        setShowVisualizer(false)
        Visualizer1?.hide()
      }, 400)
    }
  }, [fadeVisualizer])

  return (
    <div
      className={cn(styles.visualizer, {
        [styles.fade]: fadeVisualizer,
        [styles.show]: showVisualizer
      })}
      id='#visualizer-container'
    >
      <div className='visualizer' />
      {/* <div className={styles.infoOverlayTileShadow} /> */}
    </div>
  )
}
