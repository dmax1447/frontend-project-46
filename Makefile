install: install-deps
	npx simple-git-hooks

run:
	bin/gendiff.js ./__fixtures__/file1.json ./__fixtures__/file2.json

install-deps:
	npm ci

test:
	npm test

test-coverage:
	npm test:coverage

lint:
	npx eslint .
