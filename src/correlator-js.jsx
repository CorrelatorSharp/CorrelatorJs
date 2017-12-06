(function(globals) {

    let uuid = globals.UuidCrypto.Uuid;
    let CorrelatorJs = CorrelatorJs || {};


    /* Static module memebers.
    /*********************************************************/

    let statics = {
        CORRELATION_ID_HEADER: 'X-Correlation-Id',
        CORRELATION_ID_STARTED_HEADER: 'X-Correlation-Started',
        CORRELATION_ID_NAME_HEADER: 'X-Correlation-Name',
        CORRELATION_ID_PARENT_HEADER: 'X-Correlation-Parent'
    };

    CorrelatorJs.Statics = statics;


    /* ActivityScope - Core of the library.
    /*********************************************************/

    // let activityScopeSingleton = null;

    function peek (stack) {
        if (stack.length < 1) {
            return null;
        }

        return stack[stack.length-1];
    }

    class ActivityTracker {

        constructor () {
            this.activityStack = [];
        }

        get current() {
            return peek(this.activityStack);
        }

        start (newActivityScope) {
            if (newActivityScope === null) {
                return;
            }
            this.activityStack.push(newActivityScope);
        }

        end (oldActivityScope) {
            while (this.activityStack.pop() != oldActivityScope) { }
        }

        find (id) {
            return this.activityStack.filter(function (e) {
                return e.id === id;
            }).pop();
        }

        clear () {
            this.activityStack = [];
        }
    }

    let activityTracker = new ActivityTracker();
    
    function activityScopeFactory(name, seed) {
        return new ActivityScope(name, activityTracker.current, new uuid(seed));
    }
   
    class ActivityScope {

        /* Instance class memebers.
        /*********************************************************/

        constructor(name, parent, seed) {
            if (parent && !(parent instanceof ActivityScope)) {
                throw new Error('parent must be an activity scope.');
            }

            if (seed && !(seed instanceof uuid)) {
                throw new Error('seed must be a valid UUID.');
            }

            this.innerid = seed || new uuid();
            this.innername = name;
            this.innerparent = parent || null;
            
            activityTracker.start(this);
        }

        get id() {
            return this.innerid;
        }

        get parent() {
            return this.innerparent;
        }

        get name() {
            return this.innername;
        }


        /* Static class memebers.
        /*********************************************************/

        // Access memebers

        static get current() {
            return activityTracker.current;
        }

        static set current(value) {
            if (value && !(value instanceof ActivityScope))
                throw new Error("Can't set value of activity scope to be anything but activity scope type.")

            activityTracker.start(value);
        }

        // Creation members.

        static create(name, seed) {
            activityTracker.clear();
            return activityScopeFactory(name, seed);
        }

        static child(name, seed) {
            return activityScopeFactory(name, seed);
        }

        static new(name, seed) {
            activityTracker.end(this.current);
            return activityScopeFactory(name, seed);
        }

        static clear() {
            activityTracker.clear();
        }
    }

    CorrelatorJs.ActivityScope = ActivityScope;


    /* Global module.
    /*********************************************************/

    globals.CorrelatorJs = (globals.module || {}).exports = CorrelatorJs;

}(window || global))
var window, global;