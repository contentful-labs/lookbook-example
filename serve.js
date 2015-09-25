import express from 'express'
import browserify from 'browserify-middleware'
import babelify from 'babelify'
import stylus from 'stylus'
import fs from 'fs'
import nib from 'nib'
import B from 'bluebird'

let readFile = B.promisify(fs.readFile)

express()
.use('/application.js', browserify('./app/index.js', {
  transform: babelify.configure({optional: ['runtime']})
}))
.get('/styles.css', function (req, res) {
  readFile('./styles/index.styl', 'utf-8')
  .then((content) => {
    return B.fromNode((cb)=> {
      stylus(content)
      .use(nib())
      .set({filename: './styles/index.styl'})
      .render(cb)
    })
  })
  .then((css) => {
    res
    .type('text/css')
    .send(css)
    .end()
  })
  .catch((err) => {
    console.log(err)
    res.sendStatus(500)
  })
})
.use(express.static('.'))
.listen(3000, function () {
  console.log('listening to localhost:3000')
})
