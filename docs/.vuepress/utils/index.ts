export const copyToBuffer = (data: string | number) => {
  if (data) {
    navigator.clipboard.writeText(typeof data === "number" ? String(data) : data)
    console.log('data copied!', data)
  } else {
    console.log('data was not copied', data)
  }
}
