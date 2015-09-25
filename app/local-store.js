export var spaceId = createStore('cf.spaceId');
export var apiKey = createStore('cf.apiKey');

export function loadFromLocation () {
  let q = {}
  window.location.search
  .substr(1)
  .split('&')
  .map((pair) => pair.split('='))
  .forEach(([key, val]) => {
    q[key] = val
  })

  if (q.spaceId) {
    spaceId.set(q.spaceId)
  }
  if (q.apiKey) {
    apiKey.set(q.apiKey)
  }
}

function createStore (key) {
  return {
    get () {
      return window.localStorage.getItem(key)
    },

    set (value) {
      window.localStorage.setItem(key, value)
    }
  }
}
