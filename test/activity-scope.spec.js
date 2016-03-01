describe("Test the ActivityScope singleton", function() {

    var SOME_TOTAL_RUBBISH = {
        some: 'totalRubbish'
    };

    beforeEach(function() {
    	CorrelatorJs.ActivityScope.current = null;
    });

    it('should provide a blank activity id', function() {
        expect(CorrelatorJs.ActivityScope.current).toBeFalsy();
    });

    it('should allow the creation of a scope', function() {

        CorrelatorJs.ActivityScope.create('TEST_SCOPE');

        expect(CorrelatorJs.ActivityScope.current).toBeTruthy();
        expect(CorrelatorJs.ActivityScope.current.id.toString()).toEqual(jasmine.any(String));
    });    

    it('should allow the creation of a scope from seed', function() {

        CorrelatorJs.ActivityScope.create('TEST_SCOPE', Uuid.EMPTY);

        expect(CorrelatorJs.ActivityScope.current).toBeTruthy();
        expect(CorrelatorJs.ActivityScope.current.id.toString()).toEqual(Uuid.EMPTY.toString());
    });    

    it('should allow you to set the current scope explicitly', function() {
        expect(CorrelatorJs.ActivityScope.current).toBeFalsy();

        CorrelatorJs.ActivityScope.current = new CorrelatorJs.ActivityScope('ROOT_SCOPE');

        expect(CorrelatorJs.ActivityScope.current).toBeTruthy();
        expect(CorrelatorJs.ActivityScope.current.id.toString()).toEqual(jasmine.any(String));
    }); 

    it('should not allow the creation of a scope from invalid uuid', function() {

        expect(function() {
            CorrelatorJs.ActivityScope.create('TEST_SCOPE', SOME_TOTAL_RUBBISH)
        }).toThrow();
    });  

    it('should not allow you to set the activity scope to anything but an activity scope', function() {
        expect(function() {
        	CorrelatorJs.ActivityScope.current = SOME_TOTAL_RUBBISH;
        }).toThrow();
    });

    it('should allow the creation of a sub activity scope with parent as current', function() {

        var parent = CorrelatorJs.ActivityScope.create('TEST_SCOPE_PARENT', Uuid.EMPTY);

        expect(CorrelatorJs.ActivityScope.child('TEST_SCOPE_CHILD', Uuid.EMPTY).parent).toBe(parent);
    });

    it('should allow the creation of a sub activity scope with parent as current parent', function() {

        var parent = CorrelatorJs.ActivityScope.create('TEST_SCOPE_PARENT', Uuid.EMPTY);

        var base = CorrelatorJs.ActivityScope.child('TEST_SCOPE_CHILD', Uuid.EMPTY);

        expect(CorrelatorJs.ActivityScope.new('TEST_SCOPE_SIBLING', Uuid.EMPTY).parent).toBe(parent);
    });

    it('should not allow the creation of a sub activity scope with invalid parent', function() {

        expect(function() {
            new ActivityScope(name, SOME_TOTAL_RUBBISH, new Uuid());
        }).toThrow();
    });
});