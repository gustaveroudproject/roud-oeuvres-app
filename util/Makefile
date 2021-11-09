.PHONY: clean
clean: ## clean the list cache files
	rm -f cache/*

.PHONY: get_lists
get_lists: ## get lists, generate the cache file
	./getLists.sh

.PHONY: copy
copy: ## copy cache files to the app assets folder
	cp cache/* ../src/assets/cache/


.PHONY: help
help: ## this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

.DEFAULT_GOAL := help
