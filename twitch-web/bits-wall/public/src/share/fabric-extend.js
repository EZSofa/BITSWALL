// reference: https://stackoverflow.com/questions/11272772/fabric-js-how-to-save-canvas-on-server-with-custom-attributes

fabric.BitWallsImage = fabric.util.createClass(fabric.Image, {
    type: 'named-image',
    initialize: function (element, options) {
        this.callSuper('initialize', element, options);
        this.set('active', options.active);
        this.set('price', options.price || 0);
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            'active': this.active,
            'price': this.price
        });
    }
})

fabric.BitWallsImage.fromObject = function (object, callback) {
    fabric.util.loadImage(object.src, function (img) {
        callback && callback(new fabric.NamedImage(img, object));
    });
};

fabric.BitWallsImage.async = true;