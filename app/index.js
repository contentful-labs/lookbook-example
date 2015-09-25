import h from 'virtual-dom/h'
import create from 'virtual-dom/create-element'
import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import hasher from 'hasher'
import * as localStore from './local-store'
import renderLookbook from './lookbook'
import createClient from './data'
import {coroutine as co} from 'bluebird'
import createMainLoop from 'main-loop'
import {renderImage} from './elements'



var boot = co(function *() {
  let show = createLoop();

  localStore.loadFromLocation()
  let spaceId = localStore.spaceId.get()
  let apiKey = localStore.apiKey.get()
  if (!apiKey || !spaceId) {
    return show(renderSetup())
  }

  if (window.location.search) {
    window.location.search = ''
  }

  let client = createClient(spaceId, apiKey)

  try {
    yield client.getSpace()
  } catch (e) {
    return show(renderSetup())
  }


  let lookbooks = yield client.getLookbooks()

  startRouting((path) => {
    let lb = lookbooks.find((lb) => {
      return lb.fields.slug === path
    })

    if (lb) {
      return renderLookbook(lb)
    } else {
      return renderLookbookIndex(lookbooks)
    }
  })


  function startRouting (route) {
    hasher.prependHash = ''
    hasher.init()
    hasher.initialized.add(dispatch)
    hasher.changed.add(dispatch)

    function dispatch (path) {
      document.body.scrollTop = 0
      show(h('.app', route(path)))
    }
  }
})


boot()
.catch((e) => {
  console.error(e)
})


function createLoop () {
  let loop = createMainLoop(
    h('div'),
    (node) => node,
    { create, diff, patch }
  )

  document.body.appendChild(loop.target)

  return function update (node) {
    loop.update(node)
  }
}


function renderLookbookIndex (lookbooks) {
  return h('.lb-index', lookbooks.map((lookbook) => {
    let href = `#${lookbook.fields.slug}`
    return h('a.lb-index__item', {href}, [
      renderImage(lookbook.fields.coverImage),
      h('.lb-index__caption', [
        h('h1.lb-index__title', [lookbook.fields.title]),
        h('.lb-index__subtitle', [lookbook.fields.deck])
      ])
    ])
  }))
}


function renderSetup () {
  return h('form.app-setup', [
    h('.app-setup__space-field', [
      h('label', ['Space ID']),
      h('input', {name: 'spaceId'}),
    ]),
    h('.app-setup__api-key-field', [
      h('label', ['API Key']),
      h('input', {name: 'apiKey'}),
    ]),
    h('button', {type: 'submit'}, ['Save'])
  ])
}
