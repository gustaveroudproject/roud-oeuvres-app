TEST_LIST="https://knora.unil.ch/admin/lists/http%3A%2F%2Frdfh.ch%2Flists%2F0112%2Froud-oeuvres-flatlist-hasDocumentType"


.PHONY: test_start
test_start: ## test_get a list, starting point
	curl $(TEST_LIST) | jq -f list_start.jq

.PHONY: test_filter_list
test_filter_list: ## test_filter_list
	curl $(TEST_LIST) | jq -f list_filter_test.jq

.PHONY: test_compound
test_compound: ## test_compound list elements
	curl $(TEST_LIST) | jq -f list_compound.jq

.PHONY: help
help: ## this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

.DEFAULT_GOAL := help
