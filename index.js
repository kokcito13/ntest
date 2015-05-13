var app = require('express')();
var httpAll = require('http');
var https = require('https');
var http = httpAll.Server(app);
var io = require('socket.io')(http);
var request = require('request');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
        io.emit('chat message', "Start checking: "+ msg);

  });
    socket.on('check vk', function(msg){
        var uri = helpers.replaceShareUrl(msg, 'vk');
        request(uri, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var VK = {
                    Share: {
                        count: function(value, count) {
                            io.emit('chat message', "VK shared is: "+count);
                            console.log(value, count);
                        }
                    }
                };
                eval(body);
            }
        })
    });
    socket.on('check fb', function(msg){
        var uri = helpers.replaceShareUrl(msg, 'fb');
        request(uri, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var obj = JSON.parse(body);
                io.emit('chat message', "FB shared is: "+obj[0].share_count);
            }
        })
    });
    socket.on('check od', function(msg){
        var uri = helpers.replaceShareUrl(msg, 'od');
        request(uri, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var ODKL = {
                    updateCountOC: function (i, c, n, m) {
                        io.emit('chat message', "OD shared is: "+c);
                    }
                };
                eval(body);
            }
        })
    });
    socket.on('check tw', function(msg){
        var uri = helpers.replaceShareUrl(msg, 'tw');
        request(uri, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var obj = JSON.parse(body);
                io.emit('chat message', "TW shared is: "+obj.count);
            }
        })
    });
});

var CONSTANTS = {
    LINKS: {
        OD:'http://www.odnoklassniki.ru/dk?st.cmd=extOneClickLike&uid=odklocs0&ref=%URL1%',
        VK: "https://vk.com/share.php?act=count&index=1&url=%URL1%",
        FB: "https://api.facebook.com/method/links.getStats?urls=%URL1%&format=json",
        TW: "http://urls.api.twitter.com/1/urls/count.json?url=%URL1%"
    }
}

var helpers = {
    replaceShareUrl: function(uri, soc) {
        var returnUrl = uri;
        switch (soc) {
            case 'vk':
                returnUrl = CONSTANTS.LINKS.VK.replace(/%URL1%/g, uri);
                break;
            case 'fb':
                returnUrl = CONSTANTS.LINKS.FB.replace(/%URL1%/g, uri);
                break;
            case 'od':
                returnUrl = CONSTANTS.LINKS.OD.replace(/%URL1%/g, uri);
                break;
            case 'tw':
                returnUrl = CONSTANTS.LINKS.TW.replace(/%URL1%/g, uri);
                break;
        }


        return returnUrl;
    }
};

http.listen(3000, function(){
  console.log('listening on *:3000');
});
