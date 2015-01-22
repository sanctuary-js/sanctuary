ISTANBUL = node_modules/.bin/istanbul
JSCS = node_modules/.bin/jscs
JSHINT = node_modules/.bin/jshint
NPM = npm
XYZ = node_modules/.bin/xyz --repo git@github.com:plaid/sanctuary.git

SRC = $(shell find . -name '*.js' -not -path './coverage/*' -not -path './node_modules/*')


.PHONY: lint
lint:
	$(JSHINT) -- $(SRC)
	$(JSCS) -- $(SRC)


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
