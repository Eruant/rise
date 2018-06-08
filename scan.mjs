import stream from './stream.mjs'

const scan = (accumulator, initial, sourceStream) => {
  const newStream = stream(initial)
  let accumulated = initial

  sourceStream.map(value => {
    accumulated = accumulator(accumulated, value)
    newStream(accumulated)
  })

  return newStream
}

export default scan
