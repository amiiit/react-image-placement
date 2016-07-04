let previouslyLoadedImageFiles = new Map();

export function loadImageFromUrl (url) {
    return new Promise(function (resolve, reject) {

        if (previouslyLoadedImageFiles.get(url)) {
            resolve(previouslyLoadedImageFiles.get(url));
        }

        var image = new Image();

        image.onload = function () {
            previouslyLoadedImageFiles.set(url, image);
            resolve(image);
        };

        image.onerror = function () {
            reject({
                errorType: 'IMG_LOAD_ERROR',
                err: new Error('Could not load image at ' + url)
            });
        };

        image.src = url;
    });
}

export function loadImageDomNodeFromFile (fileObject) {
    return loadImageFromString(
        URL.createObjectURL(fileObject)
    );
}