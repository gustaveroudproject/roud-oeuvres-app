# get the labels in an array so we can select
# returns: [ {"value": "Manuscript", "language": "en" }, {"value": "Manuscrit", "language": "fr" },
[ .list.children[].labels[] ]
# select only the french labels
| map(select(."language" == "fr"))
