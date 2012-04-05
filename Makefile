all: phonograph.min.js

phonograph.min.js:
	uglifyjs -nc -o $@ phonograph.js

