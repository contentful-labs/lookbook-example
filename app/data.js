import * as cf from 'contentful'

const lookbookCT = '3CWLC87PEkIcOOukWseUIC'

export default function createClient (spaceId, accessToken) {
  let client = cf.createClient({
    space: spaceId,
    accessToken: accessToken,
    host: 'preview.contentful.com'
  })

  return {
    getLookbooks () {
      return client.entries({
        content_type: lookbookCT,
        include: 3
      })
    },

    getSpace () {
      return client.space()
    }
  }
}
