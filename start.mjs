import stream from './stream.mjs'
import scan from './scan.mjs'
import render, { div, button } from './elements.mjs'

const createView = update => {
  const increase = amount => _ => update(amount)
  const view = model =>
    [
      div(`Counter: ${model}`),
      button({ onClick: increase(1) }, '+1'),
      button({ onClick: increase(-1) }, '-1')
    ]

  return view
}

const update = stream()
const view = createView(update)
const models = scan((model, value) => model + value, 0, update)

const element = document.getElementById('app')

models.map(model => {
  render(element, view(model))
})
