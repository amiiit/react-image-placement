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

export function convertToRelativeCrop (jqueryImageDescription, dimensions) {
    const {
        y: top,
        x: left,
        scale,
        h: cropHeight,
        w: cropWidth
        } = jqueryImageDescription;

    const fixedScale = scale.toFixed(2);

    const parsedEditData = {
        top: Math.floor(top / fixedScale),
        left: Math.floor(left / fixedScale),
        cropHeight: Math.floor(cropHeight / fixedScale),
        cropWidth: Math.floor(cropWidth / fixedScale),
        scale: fixedScale
    };

    parsedEditData.cropHeight = Math.min(parsedEditData.cropHeight, dimensions.height);
    parsedEditData.cropWidth = Math.min(parsedEditData.cropWidth, dimensions.width);
    parsedEditData.left = Math.min(parsedEditData.left, dimensions.width - parsedEditData.cropWidth);
    parsedEditData.top = Math.min(parsedEditData.top, dimensions.height - parsedEditData.cropHeight);
    return parsedEditData;
}

export function convertFromRelativeCrop (placement, dimensions) {

    let result;
    const {cropHeight, cropWidth, left, top, scale} = placement;

    if (!isNaN(cropHeight + cropWidth + left + top + scale)) {
        result = {
            h: cropHeight * scale,
            w: cropWidth * scale,
            x: left * scale,
            y: top * scale,
            scale
        };
    } else {
        result = {
            h: dimensions.height,
            w: dimensions.width
        };
    }

    return result;
}