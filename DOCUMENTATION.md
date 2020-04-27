

# OeuvresRoudApp 

## Basic info

Web development for the project [Gustave Roud, *Œuvres complètes*](https://www.unil.ch/clsr/home/menuinst/projets-de-recherche/gustave-roud-oeuvres-completes.html) (SNSF Project [157970](http://p3.snf.ch/Project-157970)). The aim is to build a digital edition of Roud's complete works in an Angular web application. 

The back-end framework used is [Knora](knora.org/). Project specific ontologies and lists are available in a Platec (DaSCH@Unil) [repo](https://github.com/LaDHUL/oeuvres-roud).


## Prototype

During the first year of the project, in 2018, we created a [prototype](https://espadini.gitbook.io/roudwebappprototype) of the web application. This was presented to the publishing house that will produce the paper edition ([Zoé](http://www.editionszoe.ch/)) and used as a foundation for the web development.

## A work in progress

Issue [#12](https://github.com/gustaveroudproject/roud-oeuvres-app/issues/12) summarizes the tasks to be completed.


## How the app works

Most of these things will be obvious for those familiar with AngularJS, but serve as documentation for us and for those who are not.


#### The app

- `yalc` and `node_modules` contain all the libraries used in the project
- `src` is where most of the things happen
- `src/assets` contains localization data (multilingual) and static images (logos, etc.)
- `src/config` defines the *dev* and *prod* connection configurations
- `src/environments` defines if *dev* or *prod* should be used.
- ... to be completed

#### Templating

All pages have top-bar and footer. What's inside is defined by the router (`app-routing.module.ts`).

#### Localization

Translation is managed in `app.component.ts` and `assets`.

#### Requests to database

See `services/data-service` and `models` (OOP).

API requests to Knora are handled using the JavaScript library *knora-api-js-lib* ([npm](https://www.npmjs.com/package/@knora/api) | [doc](https://dasch-swiss.github.io/knora-api-js-lib/) | [github](https://github.com/dasch-swiss/knora-api-js-lib)).


#### Pipes

Names should be self explanatory, but comments are provided in each of the ts files. These are the pipes used in the code:

- *HTML sanitizer*;
- *encodeURIComponent*;
- *Knora dates formatting*.

#### Directives

See comments in the files for more info.

- *resource-link*: it applies to links inside a text, which are just IRI, to trigger the redirection to the right class of resources.
- *page-link*: used to sync facsimile pages to the pages in the texts.


#### Style and scripts

Style and scripts are defined in:

- in `src/styles.scss`
- in `angular.json`
- in each component `css` file
- [ng-bootstrap](https://ng-bootstrap.github.io/#/home) is used


#### Knora ui

*[Knora ui](https://dasch-swiss.github.io/knora-ui/)* provides out of the shelf front-end modules. It is a work in progress by the [DaSCH](dasch.swiss/) and it is not yet used in this project. The way the environments is set up in our app is compliant with *Knora ui* though, to make possible future integrations.
