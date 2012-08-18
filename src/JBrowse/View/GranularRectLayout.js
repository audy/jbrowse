define(
    ['dojo/_base/declare'],
    function( declare ) {
return declare( null,
{
    constructor: function( args ) {
        this.pitchX = args.pitchX || 10;
        this.pitchY = args.pitchY || 10;
        this.bitmap = [];
        this.rectangles = {};
        this.maxTop = 0;
        this.pTotalHeight = 0; // total height, in units of bitmap squares (px/pitchY)
        this.vertPadding = 2; // pixels
    },

    /**
     * @returns {Number} top position for the rect
     */
    addRect: function(id, left, right, height) {
        // assumptions:
        //  - most of the rectangles being laid out will be
        //    nearly the same size
        if( this.rectangles[id] )
            return this.rectangles[id].top * this.pitchY;

        var pLeft  = Math.floor( left / this.pitchX );
        var pRight = Math.floor( right / this.pitchX );
        var pHeight = Math.ceil( (height+this.vertPadding) / this.pitchY );

        var midX = Math.floor((pLeft+pRight)/2);
        var rectangle = { id: id, l: pLeft, r: pRight, mX: midX, h: pHeight };
        for( var top=0; top <= this.pTotalHeight; top++ ){
            if(! this._collides(rectangle,top) )
                break;
        }
        rectangle.top = top;

        this._addRectToBitmap( rectangle );
        this.rectangles[id] = rectangle;
        //delete rectangle.mX; // don't need to store the midpoint

        this.pTotalHeight = Math.max( this.pTotalHeight||0, top+pHeight );

        return top * this.pitchY;
    },

    _collides: function( rect, top ) {
        var bitmap = this.bitmap;
        //var mY = top + rect.h/2; // Y midpoint: ( top+height  + top ) / 2

        // test the left first, then right, then middle
        var mRow = bitmap[top];
        if( mRow && ( mRow[rect.l] || mRow[rect.r] || mRow[rect.mX]) )
            return true;

        // finally, test exhaustively
        var maxY = top+rect.h;
        for( var y = top; y < maxY; y++ ) {
            var row = bitmap[y];
            if( row )
                for( var x = rect.l; x <= rect.r; x++ )
                    if( row[x] )
                        return true;
        }

        return false;
    },

    /**
     * make a subarray if it does not exist
     * @private
     */
    _autovivify: function( array, subscript ) {
        return array[subscript] ||
            (function() { var a = []; array[subscript] = a; return a; })();
    },

    _addRectToBitmap: function( rect ) {
        var bitmap = this.bitmap;
        var av = this._autovivify;
        // finally, test exhaustively
        var yEnd = rect.top+rect.h;
        for( var y = rect.top; y < yEnd; y++ ) {
            var row = av(bitmap,y);
            for( var x = rect.l; x <= rect.r; x++ )
                row[x]=true;
            }
    },

    /**
     *  Given a basepair range, deletes all data dealing with the features
     */
    discardRange: function( left, right ) {
    },

    hasSeen: function( id ) {
        return !! this.rectangles[id];
    },

    cleanup: function() {
    },

    getTotalHeight: function() {
        return this.pTotalHeight * this.pitchY;
    }
}
);
});