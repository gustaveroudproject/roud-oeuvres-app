#! /usr/bin/env bash

###############################################################################

#
# get Lists in french
#
# - send request to the dsp-api to get list items
# - process them into a dictionnary where keys are IRIs and values are french labels 
#

###############################################################################

# sanity checks
# exit when a command fails, use "cmd || true" to allow "cmd" to fail
# comment this out is you need to know that it failed
set -o errexit
# don't allow undeclared variables
set -o nounset
# exit on pipe failure (cmd1 | cmd2 : exits if cmd2 fails)
set -o pipefail
# comment xtrace when not in debug
set -o xtrace


###############################################################################

project_iri="http://rdfh.ch/projects/QNSP2JJRTEyh6A0ZtpRdPQ"
lists_endpoint="https://knora.unil.ch/admin/lists"

# request the list of lists
project_encoded_iri=`wwwenc ${project_iri}`
list_iris=`curl ${lists_endpoint}\?projectIri=${project_encoded_iri} | jq ' .lists[].id '`

# seed the collector file with an empty object to merge it with the succesive results
echo "{}" > cache/lists_fr.json

# we have the list of lists, for each one
# get its nodes' IRI and request the content
for list_iri in ${list_iris}; do
    # copy over an eventual merged results to the collector file 
    test -f cache/joined.json && mv cache/joined.json cache/lists_fr.json
    # encode the list iri
    list_encoded_iri=`wwwenc ${list_iri//\"/}`
    # query the knora endpoint ot get the nodes of the list,
    # use jq to extract the french labels
    curl ${lists_endpoint}/${list_encoded_iri} | jq -f lists_compound.jq > cache/lists_fr_parsed.json
    # merge with the collector file
    jq -s '.[0] * .[1]' cache/lists_fr.json cache/lists_fr_parsed.json > cache/joined.json
done

# clean up
test -f cache/joined.json && mv cache/joined.json cache/lists_fr.json
test -f cache/lists_fr_parsed.json && rm cache/lists_fr_parsed.json 
