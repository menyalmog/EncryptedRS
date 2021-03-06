(function() {
  var inputElement;
  var formElement;
  var ulElement;
  var secretRowPrefix = 'secretrow-';

  function prefixId(id) {
    return secretRowPrefix + id;
  }

  function unprefixId(prefixedId) {
    return prefixedId.replace(secretRowPrefix, '');
  }

  function init() {
    formElement = document.getElementById('add-secret');
    inputElement = formElement.getElementsByTagName('input')[0];
    ulElement = document.getElementById('secret-list');

    remoteStorage.setApiKeys('googledrive', {
      client_id: '112380171307-be716p12intbm7afk4ucsltn8g043n52.apps.googleusercontent.com'
    });

    remoteStorage.setApiKeys('dropbox', {
      api_key: 'm35odvobcg9e8wc'
    });

    remoteStorage.access.claim('encryptedrs', 'rw');
    remoteStorage.displayWidget({'domID': 'remotestorage-connect', 'encryption': true});
    remoteStorage.encryptedrs.init();
    remoteStorage.encryptedrs.on('change', function(event) {
      if (!remoteStorage.widget.view.cipher || typeof remoteStorage.widget.view.userSecretKey !== 'undefined') {
        // add
        if(event.newValue && (! event.oldValue)) {
          displaySecret(event.relativePath, event.newValue.name);
        }
        // remove
        else if((! event.newValue) && event.oldValue) {
          undisplaySecret(event.relativePath);
        }
      }
    });

    // Trigger listSecrets cause change event might occur before the key is ready
    remoteStorage.widget.view.on('secret-entered', function() {
      if (remoteStorage.widget.view.userSecretKey) {
        remoteStorage.encryptedrs.listSecrets(1000000).then(function(secrets) {
          displaySecrets(secrets);
        });
      }
    });

    // Trigger listSecrets cause change event might occur before the key is ready - when unencrypted
    remoteStorage.widget.view.on('secret-cancelled', function() {
      remoteStorage.encryptedrs.listSecrets(1000000).then(function(secrets) {
        displaySecrets(secrets);
      });
    });

    remoteStorage.on('ready', function() {

      remoteStorage.on('disconnected', function() {
        emptySecrets();
      });

      ulElement.addEventListener('click', function(event) {
        if (event.target.tagName === 'SPAN') {
          var id = unprefixId(event.target.parentNode.id);

          removeSecret(id);
          undisplaySecret(id);
        }
      });

      formElement.addEventListener('submit', function(event) {
        event.preventDefault();
        var trimmedText = inputElement.value.trim();

        if (trimmedText) {
          addSecret(trimmedText);
        }
        inputElement.value = '';
      });

    });
  }

  function addSecret(name) {
    var id = '' + Date.now();

    if (remoteStorage.widget.view.cipher) {
      name = sjcl.encrypt(remoteStorage.widget.view.userSecretKey, name, { 'mode': 'gcm' });
    }
    remoteStorage.encryptedrs.addSecret(id, name);
    displaySecret(id, name);
  }

  function removeSecret(id) {
    remoteStorage.encryptedrs.removeSecret(id);
  }

  function displaySecrets(secrets) {
    for (var secretId in secrets) {
      if (secrets[secretId]) {
        displaySecret(secretId, secrets[secretId].name);
      }
    }
  }

  function displaySecret(id, name) {
    var domID = prefixId(id);
    var liElement = document.getElementById(domID);

    if (remoteStorage.widget.view.cipher && JSON.parse(name)) {
      try {
        name = sjcl.decrypt(remoteStorage.widget.view.userSecretKey, name);
      } catch (e) {
        remoteStorage.widget.view.userSecretKeyError = true;
        remoteStorage.widget.view.setState('connected');
        return;
      }
    }

    if(! liElement) {
      liElement = document.createElement('li');
      liElement.id = domID;
      ulElement.appendChild(liElement);
    }
    liElement.appendChild(document.createTextNode(name));//this will do some html escaping
    liElement.innerHTML += ' <span title="Delete">×</span>';
  }

  function undisplaySecret(id) {
    var elem = document.getElementById(prefixId(id));
    ulElement.removeChild(elem);
  }

  function emptySecrets() {
    ulElement.innerHTML = '';
    inputElement.value = '';
  }

  document.addEventListener('DOMContentLoaded', init);

})();
