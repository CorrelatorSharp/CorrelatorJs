/*

// Application Insights 

// To use the application insights logger service you will have to include the provided
// application insights code. This is available from your azure potal, there is an example below.

/**********************************************************************/
/*

(function (globals) {
    var appInsights=globals.appInsights||function(config){
        function r(config){t[config]=function(){var i=arguments;t.queue.push(function(){t[config].apply(t,i)})}}var t={config:config},u=document,e=globals,o="script",s=u.createElement(o),i,f;for(s.src=config.url||"//az416426.vo.msecnd.net/scripts/a/ai.0.js",u.getElementsByTagName(o)[0].parentNode.appendChild(s),t.cookie=u.cookie,t.queue=[],i=["Event","Exception","Metric","PageView","Trace"];i.length;)r("track"+i.pop());return r("setAuthenticatedUserContext"),r("clearAuthenticatedUserContext"),config.disableExceptionTracking||(i="onerror",r("_"+i),f=e[i],e[i]=function(config,r,u,e,o){var s=f&&f(config,r,u,e,o);return s!==!0&&t["_"+i](config,r,u,e,o),s}),t
    }({
        instrumentationKey:"00000000-0000-0000-0000-000000000000"
    });
    
    globals.appInsights=appInsights;
} (window))

*/

(function(ng, ai) {

    ng

        .module('correlator-sharp-ai', ['correlator-sharp'])

    .service('csApplicationInsights', [
        'csStatic',
        'csActivityScope',

        function(statics, activityScope) {

            /* Internal methods
            /**************************************************/

            function init() {
                let config = ai.config;

                config.enableDebug = true;
                config.verboseLogging = true;

                ai.config = config;
            }

            function getConfig() {
                return {
                    statics.CORRELATION_ID_HEADER: activityScope.current.id.value,
                    statics.CORRELATION_ID_STARTED_HEADER: activityScope.current.id.time,
                    statics.CORRELATION_ID_NAME_HEADER: activityScope.current.name,
                    statics.CORRELATION_ID_PARENT_HEADER: activityScope.current.parent ? activityScope.current.parent.id : null;
                }
            }

            function trackPageView(pageName, url, eventData) {

                ai.trackPageView(pageName, url, ng.extend(eventData, getConfig()));
            }

            function trackEvent(eventName, eventData) {

                ai.trackEvent(eventName, ng.extend(eventData, getConfig()));
            }

            /* Initialise the service
            /**************************************************/

            init();

            return {
                trackPageView: trackPageView,
                trackEvent: trackEvent
            }
        }
    ]);

})(angular, appInsights);