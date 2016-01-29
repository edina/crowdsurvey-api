var uuid = require('node-uuid');
var Busboy = require('busboy');

module.exports = function(Asset) {
  var container = 'assets';

  Asset.disableRemoteMethod('create', true);
  Asset.disableRemoteMethod('upsert', true);
  Asset.disableRemoteMethod('deleteById', true);
  Asset.disableRemoteMethod('updateAll', true);
  Asset.disableRemoteMethod('updateAttributes', false);
  Asset.disableRemoteMethod('createChangeStream', true);
  Asset.disableRemoteMethod('findOne', true);
  Asset.disableRemoteMethod('deleteById', true);
  Asset.disableRemoteMethod('count', true);

  /*
   * Upload a single file and rename it to the filename provided by the user,
   * ignoring the filename provided in the multipart attachment
   */
  var uploadOneAs = function (container, filename, request, response, callback) {
    var fileStore = Asset.app.models.FileStore;
    var userFilename = filename;

    var busboy = new Busboy({
      headers: request.headers,
      limits: {
        files: 1
      }
    });

    busboy
      .on('file', function(fieldname, file, filename, encoding, mimetype) {
        var options;
        options = {
          filename: userFilename,
          metadata: {
            'mongo-storage': true,
            container: container,
            filename: userFilename,
            mimetype: mimetype
          }
        };
        fileStore.uploadFile(container, file, options, function(err, fileMetadata) {
          return callback(null, fileMetadata);
        });
      })
      return request.pipe(busboy);
  };


  Asset.upload = function(request, response, callback) {
    var internalId = uuid.v4();
    var filename = request.params.filename;

    uploadOneAs(container, internalId, request, response, function(err, fileInfo) {
      if (err) {
        callback(err);
      }
      else {
        Asset.create({
            filename: filename,
            mimetype: fileInfo.metadata.mimetype,
            length: fileInfo.length,
            container: container,
            internalId: internalId
        },
        function(err, asset) {
            if (err) {
              callback(err);
            }
            else {
              callback(null, asset);
            }
        });
      }
    });
  };

  Asset.download = function(request, response, callback) {
    var fileStore = Asset.app.models.FileStore;
    var fileId = request.params.assetId;
    var filter = {};
    var options = {};

    Asset.findById(fileId, filter, options, function(err, asset) {
      if (err) {
        callback(err);
      }
      else {
        if (asset === null) {
          response.type('application/json');
          response.status(404).send({error: 'File not found'});
        }
        else {
          fileStore.download(container, asset.internalId, response, function(err) {
            if (err) {
              callback(err);
            }
          });
        }
      }
    });
  };

  Asset.remoteMethod(
      'upload',
      {
        description: 'Uploads an asset',
        accepts: [
            { arg: 'req', type: 'object', http: { source: 'req' } },
            { arg: 'res', type: 'object', http: { source: 'res' } }
        ],
        returns: {
            arg: 'fileInfo', type: 'object', root: true
        },
        http: { verb: 'post', path: '/upload/:filename' }
      }
  );

  Asset.remoteMethod(
      'download',
      {
        description: 'Download an asset',
        accepts: [
          { arg: 'req', type: 'object', http: { source: 'req' } },
          { arg: 'res', type: 'object', http: { source: 'res' } }
        ],
        http: { verb: 'get', path: '/download/:assetId' }
      }
  );

};
