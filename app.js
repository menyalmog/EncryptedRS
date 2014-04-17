(function() {
  var secretKey = 'Patience';
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

    remoteStorage.access.claim('encryptedrs', 'rw');
    remoteStorage.displayWidget();
    remoteStorage.encryptedrs.init();
    remoteStorage.encryptedrs.on('change', function(event) {
      // add
      if(event.newValue && (! event.oldValue)) {
        displaySecret(event.relativePath, event.newValue.name);
      }
      // remove
      else if((! event.newValue) && event.oldValue) {
        undisplaySecret(event.relativePath);
      }
    });

    remoteStorage.on('ready', function() {

      remoteStorage.on('disconnected', function() {
        emptySecrets();
      });

      ulElement.addEventListener('click', function(event) {
        if(event.target.tagName === 'SPAN') {
          removeSecret(unprefixId(event.target.parentNode.id));
        }
      });

      formElement.addEventListener('submit', function(event) {
        event.preventDefault();
        var trimmedText = inputElement.value.trim();
        if(trimmedText) {
          addSecret(trimmedText);
        }
        inputElement.value = '';
      });

    });
  }

  function addSecret(name) {
	name = sjcl.encrypt(secretKey, name, { 'mode': 'gcm' });
    remoteStorage.encryptedrs.addSecret(name);
  }

  function removeSecret(id) {
    remoteStorage.encryptedrs.removeSecret(id);
  }

  function displaySecrets(secrets) {
    for(var secretId in secrets) {
      displaySecret(secretId, secrets[secretId].name);
    }
  }

  function displaySecret(id, name) {
    var domID = prefixId(id);
    var liElement = document.getElementById(domID);
    if(! liElement) {
      liElement = document.createElement('li');
      liElement.id = domID;
      ulElement.appendChild(liElement);
    }
	name = sjcl.decrypt(secretKey, name);
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
