RemoteStorage.defineModule('encryptedrs', function(privateClient) {

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
        return privateClient.getAll('', arguments);
      }

    }
  };

});
