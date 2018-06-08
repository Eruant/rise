const stream = (initial = null) => {
  const mapFns = []

  const createdStream = value => {
    for (const fn in mapFns) {
      mapFns[fn](value)
    }
  }

  createdStream.map = mapFn => {
    const newStream = stream(
      initial === null
        ? null
        : mapFn(initial)
    )

    mapFns.push(value => {
      newStream(mapFn(value))
    })

    return newStream
  }

  return createdStream
}

export default stream
