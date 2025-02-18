import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

import cn from 'classnames'
import Lottie, { LottieProps } from 'react-lottie'

import styles from './Reaction.module.css'

export type ReactionProps = {
  className?: string
  animationData: Promise<LottieProps['options']['animationData']>
  isActive?: boolean
  isResponsive?: boolean
  onClick?: MouseEventHandler
  width?: number
  height?: number
  title?: string
  disableClickAnimation?: boolean
}

export const Reaction = (props: ReactionProps) => {
  const {
    className,
    animationData,
    isActive,
    isResponsive,
    onClick,
    width = 48,
    height = 48,
    title,
    disableClickAnimation = false
  } = props
  const [isInteracting, setInteracting] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [animation, setAnimation] =
    useState<LottieProps['options']['animationData']>()

  useEffect(() => {
    const loadAnimation = async () => {
      const { default: animation } = await animationData
      setAnimation(animation)
    }
    loadAnimation()
  }, [animationData])

  const lottieOptions = useMemo<LottieProps['options']>(
    () => ({
      autoplay: true,
      loop: true,
      animationData: animation
    }),
    [animation]
  )

  const handleMouseEnter = useCallback(() => {
    setInteracting(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setInteracting(false)
  }, [])

  useEffect(() => {
    if (isClicked) {
      const timeout = setTimeout(() => {
        setIsClicked(false)
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [isClicked])

  return (
    <div
      className={cn(styles.root, className, {
        [styles.active]: isActive === true,
        [styles.inactive]: isActive === false,
        [styles.responsive]: isResponsive,
        [styles.clicked]: !disableClickAnimation && isClicked
      })}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Lottie
        title={title}
        height={width}
        width={height}
        options={lottieOptions}
        isStopped={isActive === false && !isInteracting}
        isClickToPauseDisabled
      />
    </div>
  )
}
