import h from 'virtual-dom/h'
import marked from 'marked'
import virtualize from 'vdom-virtualize'
import {renderImage} from './elements'

export default function renderLookbook (lookbook) {
  return h('.lookbook', [
    h('.lookbook__menu', [
      h('a', {href: '#'}, ['back'])
    ]),
    h('header.lookbook__header', [
      h('h1.lookbook__title', lookbook.fields.title),
      h('.lookbook__deck', lookbook.fields.deck)
    ]),
    h('.lb-module-list', lookbook.fields.lookbookModules.map(renderModule))
  ])
}

function renderModule (module) {
  if (module.fields.layoutType) {
    return renderModuleLayout(module)
  }

  var ctName = getCTName(module)
  if (ctName === 'section-photo') {
    return renderPhotoSection(module)
  } else if (ctName === 'section-text') {
    return renderTextSection(module)
  }
}

function renderModuleLayout (module) {
  let slots = module.fields.contentSlots
  let bleed = module.fields.fullBleed
  switch (module.fields.layoutType) {
    case 'Text':
      return renderTextModule(slots)
    case '1up':
      return renderPhotoModule(slots, 1, bleed)
    case '2up':
      return renderPhotoModule(slots, 2, bleed)
    case '3up':
      return renderPhotoModule(slots, 3, bleed)
    case 'Quote':
      return renderQuoteModule(slots[0])
    case 'Credits':
      return renderCreditsModule(slots[0])
    default:
      return h('.lb-module.x--unknown', module.fields.layoutType)
  }
}

function renderTextModule (slots) {
  return h('.lb-module.x--text', slots.map(renderTextSlot))
}

function renderCreditsModule (slot) {
  return h('.lb-module.x--credits', [
    parseMarkdown(slot.fields.text)
  ])
}

function renderQuoteModule (slot) {
  return h('.lb-module.x--quote', [
    parseMarkdown(slot.fields.text)
  ])
}

function renderTextSlot (slot) {
  return h('.lb-slot.x--text', [
    h('h3', slot.fields.slotTitle),
    parseMarkdown(slot.fields.text)
  ])
}

function renderPhotoModule (slots, items, bleed) {
  let modifier = `.x--photo.x--${items}up`
  if (bleed) {
    modifier += '.x--bleed'
  }
  return h(`.lb-module${modifier}`, slots.map((slot) => {
    let photo = slot.fields.photos && slot.fields.photos[0]
    if (photo) {
      return h(`.lb-slot.x--photo`, [
        renderImage(photo)
      ])
    } else {
      return renderTextSlot(slot)
    }
  }))
}

// This is gonna be way easier once CF allows us to set the Content
// Type ID in the user interface
let contentTypes = {
  '6BkIYBtj44iOK62cC8IEkE': 'section-photo',
  '3JCsfadVjyK6AuEqsWS6ka': 'section-text',
}


function getCTName (entry) {
  if (entry.fields.layoutType) {
    return 'module'
  }
  let ctID = entry.sys.contentType.sys.id
  return contentTypes[ctID]
}


function renderTextSection (section) {
  return h('.lb-section.x--text', {
    style: {
      textAlign: getAlignment(section)
    }
  }, [
    parseMarkdown(section.fields.textParagraphQuote)
  ])
}


function renderPhotoSection (section) {
  let headline = section.fields.headline
  let caption = headline ?  h('.lb-photo-caption', section.fields.headline) : null
  return h('.lb-section.x--photo', [
    renderImage('.lb-section__photo', section.fields.photos[0]),
    caption,
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



function getAlignment (module) {
  let alignment = module.fields.textAlignment;
  if (alignment === 'Justified') {
    alignment = 'justify'
  }
  return (alignment || 'left').toLowerCase();
}



function parseMarkdown (md) {
  return virtualize.fromHTML(`<div class="md-content">${marked(md)}</div>`)
}
