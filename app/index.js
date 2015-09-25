import h from 'virtual-dom/h'
import create from 'virtual-dom/create-element'
import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import * as localStore from './local-store'
import renderLookbook from './lookbook'
import createClient from './data'
import {coroutine as co} from 'bluebird'
import createMainLoop from 'main-loop'


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

  return show(h('.app', [
    renderLookbook(lookbooks[1])
  ]))
})


boot()
.catch((e) => {
  console.error(e)
})


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
