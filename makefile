
all:
	make dist/js/camel.js
	make dist/js/camel.min.js

dist/js/camel.js: src/copyright.js src/namespace-beginning.js src/camel-request-base.js src/camel-mime.js src/camel-request.js src/camel-request-reference.js src/camel-bound-request.js src/camel.js src/namespace-end.js
	cat src/copyright.js src/namespace-beginning.js src/camel-request-base.js src/camel-mime.js src/camel-request.js src/camel-request-reference.js src/camel-bound-request.js src/camel.js src/namespace-end.js > dist/js/camel.js

dist/js/camel.min.js: dist/js/camel.js
	npx google-closure-compiler --compilation_level=ADVANCED --js=dist/js/camel.js --js_output_file=dist/js/camel.min.js
