# goal: move from:
# {
#     "lists": [
#         {
#             "id": "http://rdfh.ch/lists/0116/PHNT_BljS1mEMcEy3Qaw9w",
#             "labels": [
#                 {
#                     "value": "Type de technique de sculpture d'une statue",
#                     "language": "fr"
#                 }
#             ],
#             /.../
#         },
#         {
#             "id": "http://rdfh.ch/lists/0114/careerLeaving",
#             "labels": [
#                 {
#                     "value": "Reasons for departure",
#                     "language": "en"
#                 },
#                 {
#                     "value": "Raisons du départ",
#                     "language": "fr"
#                 }
#             ],
#             /.../
#         },
# }
#
# to a long object holding all the "id: label@fr":
# {
#      "http://rdfh.ch/lists/0116/PHNT_BljS1mEMcEy3Qaw9w": "Type de technique de sculpture d'une statue",
#      "http://rdfh.ch/lists/0114/careerLeaving": "Raisons du départ",
#      /.../
# }
#

# build an array only to rebuild it into an object later
[
  # for each element of "lists"
  .list.children[] |
    # build an object 
    {
      # the key is the value of "id"
      "\(.id)" :
      # the value is:
        # labels iterate over its elements with map
        # returns an array
        .labels  | 
        map(
          # select only the objects that have a property: 'language : "fr"'
          select(."language" == "fr")
        ) |
          # grab the first (and only) label and get its value
          .[0]."value"
        } 
]
  | add
