(function (globals) {

    let crypto = globals.crypto || globals.msCrypto;

    /* Regex for checking is string is UUID or empty GUID
    /*****************************************************/

    let UUID_REGEX = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89aAbB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}|[0]{8}-[0]{4}-[0]{4}-[0]{4}-[0]{12}/;

    globals.isUuid = function isUuid(suspectString) {
        return suspectString.match(UUID_REGEX);
    }

    /* Generate a new uuid string using browser crypto or time.
    /*****************************************************/

    function rngCrypto() {
        return crypto.getRandomValues(new Uint32Array(1))[0];
    }

    function rngTime(i) {
        return Math.random() * 0x100000000 >>> ((i || new Date().getTicks() & 0x03) << 3) & 0xff;
    }

    let rng = crypto && crypto.getRandomValues && Uint8Array ? rngCrypto : rngTime;

    globals.randomNumberGenerator = rng;

    function randomNumberGeneratorInRange(min, max) {
        // should be number between 0 and 4,294,967,295...
        var number = rng();

        // make a percentage.
        var asPercent = ((100 / 0xFFFFFFFF) * number) / 100;

        // redistribute the number across the new boundry
        return Math.floor(asPercent * (max - min + 1)) + min;
    }
    
    globals.randomNumberGeneratorInRange = randomNumberGeneratorInRange;

    function randomNumberGeneratorInSequence(last, minJump, maxJump) {
        return randomNumberGeneratorInRange(last + minJump, last + maxJump);
    }
    
    globals.randomNumberGeneratorInSequence = randomNumberGeneratorInSequence;

    /* Uuid object wrapper for validation and 'security'.
    /*****************************************************/

    function generateNewId() {
        let i = 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = rng(i++) % 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }    

    class Uuid {

        static get EMPTY() {
            return new Uuid('00000000-0000-0000-0000-000000000000');
        }

        constructor(seed) {
            if (seed && !isUuid(seed.toString())) {
                throw new Error('seed value for uuid must be valid uuid.');
            }

            this.innervalue = (seed || generateNewId()).toString();
            this.innertime = new Date();
        }

        get value() {
            return this.innervalue;
        }

        get time() {
            return this.innertime;
        }

        toString() {
            return this.value;
        }
    }

    globals.Uuid = Uuid;

    globals.UuidCrypto = (globals.module || {}).exports = { Uuid: Uuid, randomNumberGenerator: rng, isUuid: isUuid };

}(window || global))
var window, global;