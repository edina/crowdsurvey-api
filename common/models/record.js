module.exports = function(Record) {
    Record.disableRemoteMethod('findOne', true);
    Record.disableRemoteMethod('createChangeStream', true);
    Record.disableRemoteMethod('exists', true);
};
