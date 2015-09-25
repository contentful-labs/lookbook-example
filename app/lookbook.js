import h from 'virtual-dom/h'
import marked from 'marked'
import virtualize from 'vdom-virtualize'
import {renderImage} from './elements'

export default function renderLookbook (lookbook) {
  return h('div.lookbook', [
    h('header.lookbook__header', [
      h('h1.lookbook__title', lookbook.fields.title),
      h('.lookbook__deck', lookbook.fields.deck)
    ]),
    h('.lb-module-list', lookbook.fields.lookbookModules.map(renderLBModule))
  ])
}

function renderLBModule (module) {
  var ctName = getCTName(module)
  if (ctName === 'section-photo') {
    return renderPhotoSection(module)
  } else if (ctName === 'section-text') {
    return renderTextSection(module)
  }
}


// This is gonna be way easier once CF allows us to set the Content
// Type ID in the user interface
let contentTypes = {
  '6BkIYBtj44iOK62cC8IEkE': 'section-photo',
  '3JCsfadVjyK6AuEqsWS6ka': 'section-text',
}


function getCTName (entry) {
  let ctID = entry.sys.contentType.sys.id
  return contentTypes[ctID]
}


function renderPhotoSection (section) {
  return h('.lb-module.x--photo', [
    renderImage('.lb-section-photo', section.fields.photos[0]),
    h('.lb-photo-products',
      section.fields.associatedProducts.map(renderProduct)
    )
  ])
}


function renderProduct (product) {
  let brand = product.fields.brand

  return h('.lb-photo-products__item', [
    h('.lb-photo-products__brand', brand.fields.name),
    h('.lb-photo-products__name', product.fields.name)
  ])
}


function renderTextSection (section) {
  return h('.lb-module.x--text', {
    style: {
      textAlign: getAlignment(section)
    }
  }, [
    parseMarkdown(section.fields.textParagraphQuote)
  ])
}


function getAlignment (module) {
  let alignment = module.fields.textAlignment;
  if (alignment === 'Justified') {
    alignment = 'justify'
  }
  return (alignment || 'left').toLowerCase();
}



function parseMarkdown (md) {
  return virtualize.fromHTML(marked(md))
}
