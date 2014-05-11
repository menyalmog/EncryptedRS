RemoteStorage.defineModule('encryptedrs', function(privateClient) {

  privateClient.declareType('secret', {
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      }
    },
    "required": ["name"]
  });

  return {
    exports: {

      init: function() {
        privateClient.cache('');
      },

      on: privateClient.on,

      addSecret: function(name) {
        var id = '' + Date.now();
        return privateClient.storeObject('secret', id, {
          name: name
        });
      },

      removeSecret: privateClient.remove.bind(privateClient),

      listSecrets: function() {
        return privateClient.getAll('', arguments[0]);
      }

    }
  };

});
