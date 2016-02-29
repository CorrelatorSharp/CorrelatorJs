describe('The activity scope', function () {
	
	var globals = window || global;

	var cs_as = new CorrelatorJs.ActivityScope('TEST_01', null, null);

	it('should create a valid scope', function () {
		expect(globals.isUuid(cs_as.id.value)).toBeTruthy();
	});
});