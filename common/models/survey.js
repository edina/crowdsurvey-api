module.exports = function(Survey) {
    Survey.disableRemoteMethod('findOne', true);
    Survey.disableRemoteMethod('createChangeStream', true);
    Survey.disableRemoteMethod('exists', true);
};
