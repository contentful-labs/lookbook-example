export PATH := ./node_modules/.bin/:${PATH}

.PHONY: all
all: app styles

.PHONY: serve
serve:
	babel-node serve.js

.PHONY: app
app:
	browserify \
		--transform [ babelify --optional runtime ] \
		./app/index.js \
		--outfile application.js

.PHONY: styles
styles:
	stylus \
		--use nib \
		--include styles \
		< styles/index.styl \
		> styles.css

.PHONY: deploy
deploy:
	git checkout gh-pages
	git merge master
	make all
	git add --force styles.css application.js
	git commit --message 'build application'
	git push
	git checkout master
