
[![Build Status](https://travis-ci.org/CorrelatorSharp/CorrelatorJs.svg?branch=master)](https://travis-ci.org/CorrelatorSharp/CorrelatorJs) [![npm version](https://badge.fury.io/js/correlatorjs.svg)](https://badge.fury.io/js/correlatorjs)

# CorrelatorJs

A simple javascript module to support the [correlator sharp package](https://github.com/CorrelatorSharp/CorrelatorSharp).


## Installation

Currently in beta, so beware.

`npm install correlatorjs --save`


## Usage

You can use the provided service to interact with the current scope and create new sub scopes.

```javascript

    // This is the easiest way to create a new scope
    var scope = new ActivityScope('name_of_scope', null, null);

    // Activity scope is really best used as a singleton though.
    // Change the current scope.        
    ActivityScope.new('myController');

    // Nest a context as a child scope.
    ActivityScope.child('myController_child');

    // The id of the 'myController_child' scope.
    var currentCorrelationId = ActivityScope.current.id.value;

    // The id of the 'myController' scope.
    var parentCorrelationId = ActivityScope.current.parent.id.value;

    // Generate a new root scope
    ActivityScope.create('myApp');

```


### Addins

This package currently come pre packaged with a number of extras, including ActivityScope initialisers for the standard `ngRoute` module and also the `ui.router` routing modules.

It also has a tracing logger for [Azure's Application Insights](https://azure.microsoft.com/en-gb/documentation/articles/app-insights-get-started/) tracing. 

As the package grows and new logging frameworks and front-end frameworks are added, these will be broken out into their own packages.


### Todo

1. Add support for other app frameworks
    - Ember - I literally have no idea about this framework.
    - React - Really should be a store in the flux ideal of single direction data flow.
    - Backbone - This has a sort of implementation in the angul;ar package.
    - etc.
2. Add support for other client side logging frameworks
    - log4js
    - logentries
    - splunk
    - etc
3. Nail down the scope for the activity in a consistant way
    - Any custom preference is currently supported of course.    
    - GET (form or page or ajax data)?
    - UI state?