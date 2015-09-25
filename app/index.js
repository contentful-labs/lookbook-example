import h from 'virtual-dom/h'
import create from 'virtual-dom/create-element'
import * as localStore from './local-store'
import renderLookbook from './lookbook'
import createClient from './data'
import {coroutine as co} from 'bluebird'




var boot = co(function *() {
  localStore.loadFromLocation()
  let spaceId = localStore.spaceId.get()
  let apiKey = localStore.apiKey.get()
  if (!apiKey || !spaceId) {
    return renderSetup()
  }

  if (window.location.search) {
    window.location.search = ''
  }

  let client = createClient(spaceId, apiKey)

  try {
    yield client.getSpace()
  } catch (e) {
    return renderSetup()
  }

  let lookbooks = yield client.getLookbooks()

  return h('.app', [
    renderLookbook(lookbooks[1])
  ])
})


boot()
.then((vnode) => {
  document.body.appendChild(create(vnode))
}).catch((e) => {
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
