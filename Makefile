ISTANBUL = node_modules/.bin/istanbul
JSCS = node_modules/.bin/jscs
JSHINT = node_modules/.bin/jshint
NPM = npm
TRANSCRIBE = node_modules/.bin/transcribe
XYZ = node_modules/.bin/xyz --repo git@github.com:plaid/sanctuary.git --script scripts/prepublish


.PHONY: all
all: README.md

README.md: index.js
	$(TRANSCRIBE) \
	  --heading-level 4 \
	  --url 'https://github.com/plaid/sanctuary/blob/v$(VERSION)/{filename}#L{line}' \
	  -- $^ \
	| sed 's/<h4 name="\(.*\)#\(.*\)">\(.*\)\1#\2/<h4 name="\1.prototype.\2">\3\1#\2/' >'$@'


.PHONY: lint
lint:
	$(JSHINT) -- index.js test/index.js
	$(JSCS) -- index.js test/index.js
	@echo 'Checking for missing link definitions...'
	grep -o '\[[^]]*\]\[[^]]*\]' index.js \
	| sort -u \
	| sed -e 's:\[\(.*\)\]\[\]:\1:' \
	      -e 's:\[.*\]\[\(.*\)\]:\1:' \
	      -e '/0-9/d' \
	| xargs -I '{}' sh -c "grep '^//[.] \[{}\]: ' index.js"


.PHONY: release-major release-minor release-patch
release-major release-minor release-patch:
	@$(XYZ) --increment $(@:release-%=%)


.PHONY: setup
setup:
	$(NPM) install


.PHONY: test
test:
	$(ISTANBUL) cover node_modules/.bin/_mocha -- --recursive
	$(ISTANBUL) check-coverage --branches 100
ifneq ($(shell node --version | sed 's/[.][^.]*$$//'),v0.10)
	@<index.js \
	    sed -n "/^[ ]*\/\/\. >/{N;p;}" \
	  | sed -e "s:^[ ]*\/\/\. ::" \
	        -e "s:^\([^>].*\):   '\1');:" \
	        -e "s:^> \(.*\):eq(R.toString(\1),:" \
	  | sed "1 s:^:var eq = require('assert').strictEqual, R = require('ramda'), S = require('./');:" \
	  | node --harmony
endif
