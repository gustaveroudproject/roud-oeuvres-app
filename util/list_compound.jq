# goal: move from:
# {
#  "children": [],
#  "comments": [],
#  "hasRootNode": "http://rdfh.ch/lists/0112/roud-oeuvres-flatlist-hasDocumentType",
#  "id": "http://rdfh.ch/lists/0112/roud-oeuvres-flatlist-hasDocumentType-imprime",
#  "labels": [ { "value": "Imprimé", "language": "fr" }, { "value": "Print", "language": "en" } ],
#  "name": "imprime",
#  "position": 3
# }
#
# to:
# {
#     "id": "http://rdfh.ch/lists/0112/roud-oeuvres-flatlist-hasDocumentType-imprime",
#     "label" : "Imprimé"
# }
[ 
    .list.children[] | 
        { "id": .id, 
          "label":
            # keep "labels" in an arry to filter them (in following "map")   
            [ .labels[] ] | 
                # apply a select on each element of the array
                map(select(."language" == "fr")) |
                    # now grab the first (and only) label and get its value
                    .[0]."value"
        } 
]
