TEST_LIST="https://knora.unil.ch/admin/lists/http%3A%2F%2Frdfh.ch%2Flists%2F0112%2Froud-oeuvres-flatlist-hasDocumentType"
LIST_SupportType="https://knora.unil.ch/admin/lists/http%3A%2F%2Frdfh.ch%2Flists%2F0112%2Froud-oeuvres-flatlist-hasSupportType"


.PHONY: test_start
test_start: ## test_get a list, starting point
	curl $(TEST_LIST) | jq -f list_start.jq

.PHONY: test_filter_list
test_filter_list: ## test_filter_list
	curl $(TEST_LIST) | jq -f list_filter_test.jq

.PHONY: test_compound
test_compound: ## test_compound list elements
	curl $(TEST_LIST) | jq -f list_compound.jq

.PHONY: support_type.json
support_type.json: ## build cache for list "supportType"
	curl $(LIST_SupportType) | jq -f list_compound.jq > cache_list/support_type.json

.PHONY: copy
copy: ## copy cache files to the app assets folder
	cp cache_list/* ../src/assets/cache_lists/

.PHONY: clean
clean: ## clean the list cache files
	rm cache_list/*

.PHONY: help
help: ## this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

.DEFAULT_GOAL := help
