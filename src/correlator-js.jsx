(function(globals) {

    let uuid = globals.UuidCrypto.Uuid;
    let CorrelatorJs = CorrelatorJs;


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

    let activityScope = null;

    function activityScopeFactory(name, parent, seed) {
        return activityScope = new ActivityScope(name, parent, new uuid(seed));
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
            return activityScope;
        }

        static set current(value) {
            if (value && !(value instanceof ActivityScope))
                throw new Error("Can't set value of activity scope to be anything but activity scope type.")

            activityScope = value;
        }

        // Creation members.

        static create(name, seed) {
            return activityScopeFactory(name, null, seed);
        }

        static child(name, seed) {
            return activityScopeFactory(name, activityScope, seed);
        }

        static new(name, seed) {
            return activityScopeFactory(name, activityScope.parent, seed);
        }
    }

    CorrelatorJs.ActivityScope = ActivityScope;


    /* Global module.
    /*********************************************************/

    globals.CorrelatorJs = (globals.module || {}).exports = CorrelatorJs;

}(window || global))
var window, global;