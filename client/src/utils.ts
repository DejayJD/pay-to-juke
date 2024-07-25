export const getHrsMinsSecsText = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0')

  if (hours) {
    return `${hours}:${minutes}:${secs}`
  } else {
    return `${minutes}:${secs}`
  }
}
