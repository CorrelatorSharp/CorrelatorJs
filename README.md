
[ ![CorrelatorJs](https://travis-ci.org/CorrelatorSharp/correlatorjs.svg "Travis Build") ](https://travis-ci.org/CorrelatorSharp/CorrelatorJs "CorrelatorJs")

# angular-correlator-sharp

A simple angular module providing support for the [correlator sharp package](https://github.com/CorrelatorSharp/CorrelatorSharp).


## Installation

Cureently the alpha is not published on NPM, will update when beta goes live on NPM.

`npm install angular-correlator-sharp --save`


## Usage

You can use the provided service to interact with the current scope and create new sub scopes.

```javascript

	angular
		.module('myApp', [ 'correlator-sharp' ])
		.controller('myController', ['$scope', 'csActivityScope', function ($scope, csActivityScope) {

            // The id of the 'myController_child' scope.
            $scope.stateChangeCorrelationId = csActivityScope.current.id.value;

            // Change the current scope.        
            csActivityScope.new('myController');

            // Nest a context as a child scope.
            csActivityScope.child('myController_child');

            // The id of the 'myController_child' scope.
            $scope.currentCorrelationId = csActivityScope.current.id.value;

            // The id of the 'myController' scope.
            $scope.parentCorrelationId = csActivityScope.current.parent.id.value;

            // Generate a new root scope
            csActivityScope.create('myApp');
		}]);

```


### Addins

This package currently come pre packaged with a number of extras, including ActivityScope initialisers for the standard `ngRoute` module and also the `ui.router` routing modules.

It also has a tracing logger for [Azure's Application Insights](https://azure.microsoft.com/en-gb/documentation/articles/app-insights-get-started/) tracing. 

As the package grows and new logging frameworks and front-end frameworks are added, these will be broken out into their own packages.


### Todo

1. Add support for other app frameworks
    - Ember
    - React
    - Backbone
    - etc.
2. Add support for other client side logging frameworks
    - log4js
    - etc
2. Either break up the project into multiple smaller pieces or improve the build pipeline for building out multiple configurations.
3. Nail down the scope for the activity in a consistant way
    - Any custom preference is currently supported of course.    
    - GET (form or page)?
    - UI state?
