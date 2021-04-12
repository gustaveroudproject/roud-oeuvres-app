ACCOUNT=platec
CONTAINER=roud
VERSION=v0.0.0

.PHONY: build
build: ## build the web-app container image
	docker build -t ${ACCOUNT}/${CONTAINER}:${VERSION} .

.PHONY: run
run: ## run a container instance with the freshly built image
	docker run -p 80:80 --name roud ${ACCOUNT}/${CONTAINER}:${VERSION}

.PHONY: start
start: ## re-start an existing container instance (form a previous `run`)
	docker start roud

.PHONY: stop
stop: ## stop the docker container instance
	docker stop roud

.PHONY: rm
rm: ## remove the docker container instance
	docker rm roud

.PHONY: rmi
rmi: ## remove the built container image
	docker rmi ${ACCOUNT}/${CONTAINER}:${VERSION}

.PHONY: login
login: ## docker hub login
	docker login -u ${ACCOUNT}

.PHONY: push
push: ## push the image to docker hub
	docker push ${ACCOUNT}/${CONTAINER}:${VERSION}

.PHONY: help
help: ## this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

.DEFAULT_GOAL := help