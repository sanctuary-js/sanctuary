DOCTEST = node_modules/.bin/doctest --nodejs '--harmony' --module commonjs --prefix .
ESLINT = node_modules/.bin/eslint --config node_modules/sanctuary-style/eslint-es3.json --env es3
ISTANBUL = node_modules/.bin/istanbul
NPM = npm
TRANSCRIBE = node_modules/.bin/transcribe
XYZ = node_modules/.bin/xyz --repo git@github.com:sanctuary-js/sanctuary.git --script scripts/prepublish


.PHONY: all
all: LICENSE README.md

.PHONY: LICENSE
LICENSE:
	cp -- '$@' '$@.orig'
	sed 's/Copyright (c) .* Sanctuary/Copyright (c) $(shell git log --date=format:%Y --pretty=format:%ad | sort -r | head -n 1) Sanctuary/' '$@.orig' >'$@'
	rm -- '$@.orig'

README.md: index.js
	$(TRANSCRIBE) \
	  --heading-level 4 \
	  --url 'https://github.com/sanctuary-js/sanctuary/blob/v$(VERSION)/{filename}#L{line}' \
	  -- $^ \
	| LC_ALL=C sed 's/<h4 name="\(.*\)#\(.*\)">\(.*\)\1#\2/<h4 name="\1.prototype.\2">\3\1#\2/' >'$@'


.PHONY: lint
lint:
	$(ESLINT) \
	  --global define \
	  --global module \
	  --global require \
	  --global self \
	  -- index.js
	$(ESLINT) \
	  --env node \
	  --env mocha \
	  --rule 'dot-notation: [error, {allowKeywords: true}]' \
	  --rule 'max-len: [off]' \
	  -- test
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
	$(DOCTEST) -- index.js
endif
