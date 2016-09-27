var s4a = s4a || {};

/**
 * s4a.js modeul
 * @type type
 */
s4a.whiteboard = (function() {
    var module = {};

    var _socketServerUrl = null;

    var _webSocket = null;

    function onMessageDefault(event) {
        console.log('Message: ' + event.data);
    }

    function onOpenDefault(event) {
        console.log('Connection established');
    }

    function onErrorDefault(event) {
        console.log(event.data);
    }

    module.setSocketServerUrl = function(url) {
        _socketServerUrl = url;
    };

    /**
     * Broadcast a message to the server
     * 
     * @param {type} message
     * @returns {Boolean}
     */
    module.send = function(message) {
        if (_webSocket === null) {
            return false;
        } else {
            _webSocket.send(message);
            return false;
        }
    };

    module.applyPatchString = function(baseObject, patchString) {
        var patch = JSON.parse(patchString);
        jsonpatch.apply(baseObject, patch);
    };

    module.synchronize = function(originalObject, alteredObject) {
        var diff = jsonpatch.compare(originalObject, alteredObject);
        jsonpatch.apply(originalObject, diff);
    };

    /**
     * Initialize a web socket connection to the configured server
     * 
     * @param {function} onMessage - A function that receives a web socket event as parameter - called when a message is received
     * @param {function} onOpen - A function that receives a web socket event as parameter - called when the connection is opened
     * @param {type} onError - A function that receives a web socket event as paramtere - called in the event of errors
     */
    module.init = function(onMessage, onOpen, onError) {

        if (_socketServerUrl === null) {
            console.log('No socket server URL configured');
            return;
        }

        if (onOpen === undefined || onOpen === null) {
            onOpen = onOpenDefault;
        }

        if (onMessage === undefined || onMessage === null) {
            onMessage = onMessageDefault;
        }

        if (onError === undefined || onMessage === null) {
            onError = onErrorDefault;
        }

        _webSocket =
            new WebSocket('ws://' + _socketServerUrl);

        _webSocket.onerror = function(event) {
            onError(event);
        };

        _webSocket.onopen = function(event) {
            onOpen(event);
        };

        _webSocket.onmessage = function(event) {
            onMessage(event);
        };

    };

    return module;

})();