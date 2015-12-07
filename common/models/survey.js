module.exports = function(Survey) {
	Survey.observe('before save', function(ctx, next) {
		console.log('debug here');
	});
};
