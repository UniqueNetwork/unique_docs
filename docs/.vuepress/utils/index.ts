export const copyToBuffer = (data: string) => {
  if (data) {
    navigator.clipboard.writeText(data)
    console.log('data copied!', data)
  } else {
    console.log('data was not copied', data)
  }
}
