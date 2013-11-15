/**
 * Common utilities class. Here we should store all common and globally used functions.
 *
 * @author DeadbraiN
 */
N13.define('App.util.Common', {
    /**
     * Standard left and right trimmer. It removes spaces and tabs from the beginning and from the end
     * @param {String} str String to trim
     * @returns {String} Trimmed string
     */
    trim: function (str) {
        return str.replace(/^\s+|\s+$/g, '');
    }
});