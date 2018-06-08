const makeChild = props => {
  switch (true) {
    case typeof props === 'string':
      {
        const el = document.createTextNode(props)
        return el
      }
    case Array.isArray(props):
      return props.map(makeChild)
    case props instanceof window.HTMLElement:
      return props
  }

  return null
}

const element = type => (props, ...children) => {
  const el = document.createElement(type)
  let defaultProps = {}

  if (typeof props === 'string' || props instanceof window.HTMLElement) {
    Object.assign(defaultProps, {
      children: [props].concat(children)
    })
  } else {
    Object.assign(defaultProps, props, { children })
  }

  const childElements = makeChild(defaultProps.children)

  if (Array.isArray(childElements)) {
    childElements.forEach(childElement => {
      el.appendChild(childElement)
    })
  } else {
    el.appendChild(childElements)
  }

  delete defaultProps.children

  if (defaultProps.hasOwnProperty('onClick')) {
    el.addEventListener('click', defaultProps.onClick)
  }

  return el
}

export const div = element('div')
export const button = element('button')

const render = (rootEl, ...children) => {
  while (rootEl.lastChild) {
    rootEl.removeChild(rootEl.lastChild)
  }

  children.forEach(child => {
    if (Array.isArray(child)) {
      child.forEach(grandChild => rootEl.appendChild(grandChild))
    } else {
      rootEl.appendChild(child)
    }
  })
}

export default render
