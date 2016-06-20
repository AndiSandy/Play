chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    switch (request.type) {
        case 'yund':
            var yund_option = _.cache('yund');
            sendResponse({yund_option:yund_option});
            break;
        case 'yund_config':
            var yund_config = _.cache('yund_config');
            sendResponse({yund_config:yund_config});
            break;    
        default: break;
    }
});