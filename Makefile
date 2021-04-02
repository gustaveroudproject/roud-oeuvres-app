ACCOUNT=roud
CONTAINER=roud
VERSION=v0.0.0

.PHONY: build
build: ## builds the web-app container
	docker build -t ${ACCOUNT}/${CONTAINER}:${VERSION} .

.PHONY: run
run: ## run the freshly built container
	docker run -p 8080:80 --name roud ${ACCOUNT}/${CONTAINER}:${VERSION}

.PHONY: stop
stop: ## stop the docker instance
	docker stop roud

.PHONY: rm
rm: ## remove the container
	docker rm roud

.PHONY: rmi
rmi: ## remove the build image
	docker rmi ${ACCOUNT}/${CONTAINER}:${VERSION}

.PHONY: help
help: ## this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

.DEFAULT_GOAL := help