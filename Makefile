export PATH := ./node_modules/.bin/:${PATH}

.PHONY: all
all: app styles

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

