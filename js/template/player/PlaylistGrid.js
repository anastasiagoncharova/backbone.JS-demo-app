/**
 * Template of the playlist grid.
 *
 * @author DeadbraiN
 */
N13.define('App.template.player.PlaylistGrid', {
    statics: {
        data: '' +
            '<table class="playlist-grid">' +
                '<% var i, len, url, index; %>' +
                '<% for(i = 0, len = tracks.length; i < len; i++) { %>' +
                    '<% url   = tracks[i].url; %>' +
                    '<% index = url.lastIndexOf("/"); %>' +
                    '<tr row="<%= i %>"><td col="0"><%= index !== -1 && index !== url.length - 1 ? url.substr(url.lastIndexOf("/") + 1) : url %></td><td col="1" align="center">X</td></tr>' +
                '<% } %>' +
            '</table>'
    }
});