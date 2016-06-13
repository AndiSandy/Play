chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    switch (request.type) {
        case 'yund':
            var yund_option = _.cache('yund');
            sendResponse({yund_option:yund_option});
            break;
        default: break;
    }
});