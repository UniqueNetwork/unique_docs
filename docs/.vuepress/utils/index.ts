export const copyToBuffer = async (data: string | number) => {
  try {
    await navigator.clipboard.writeText(typeof data === "number" ? String(data) : data)
    console.log('data copied!', data)
  } catch(e) {
    console.error(e)
    console.log('data was not copied', data)
  }
}
