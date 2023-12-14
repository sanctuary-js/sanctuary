define CONFIG
repo-owner = sanctuary-js
repo-name = sanctuary
contributing-file = .github/CONTRIBUTING.md
source-files = src/**/*.js
readme-source-files = $(shell ORS=' ' awk -F "'" 'substr($$2, 1, 2) == "./" { print substr($$2, 3) }' index.js)
endef

export CONFIG

.config: index.js Makefile
	cat <<<"$$CONFIG" >'$@'
