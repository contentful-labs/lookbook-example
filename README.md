Creating a Lookbook with Contenful
==================================

This is an example app that uses Contentful to display Lookbooks. It
uses the content model proposed in [this blog post][lookbook-post]

The application uses the [Contentful Javascript client][js-client] to
retrieve all data from the Contentful API and then renders it in the
browser.

You can see the app [hosted here][hosted-example]. It requires you to
setup your own space with lookbook content. You can then specify the
space id and the Preview API Key to see the lookbook.

I will try to provide content type data and example entries to help you
get started quickly.


Developing
----------

~~~
$ npm install
$ make serve
~~~

This will bring up a development server. The server automatically
recompiles the Stylus and JS files when refreshing a page.

To compile the JS and CSS files to use the app statically run `make
all`. This will create the `application.js` and `styles.css` files in
the directory which are referenced by the `index.html`. These are all
the files you need to use the app in a browser.

[hosted-example]: https://contentful-labs.github.io/lookbook-example/
[lookbook-post]: https://www.contentful.com/blog/2015/09/10/creating-a-digital-lookbook/
[js-client]: https://github.com/contentful/contentful.js

Creating a content model
----------------------

Create a new space, generate a new API key and follow the instructions in [Contentful space sync][installation-instructions] to copy the content types used in the example app to your space. 

[installation-instructions]: https://github.com/contentful-labs/contentful-space-syncs