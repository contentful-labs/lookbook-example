import h from 'virtual-dom/h'

export function renderImage (klass, asset) {
  if (typeof klass !== 'string') {
    asset = klass;
  }
  return h(`img${klass}`, {
    src: asset.fields.file.url,
    alt: asset.fields.title
  })
}
