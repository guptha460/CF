
http  = require("http")
cfenv = require("cfenv")
cron = require("node-cron")
var twitlib= require('./twitlib');
function startTweets()
{
 twitlib.streamON();
if(twitlib.streamStatus===false)
{
console.log("stream started...");
twitlib.streamON();
}
}
startTweets();
appEnv   = cfenv.getAppEnv()
instance = appEnv.app.instance_index || 8084


server = http.createServer()


server.listen(appEnv.port, function() 
{

    // console.log("server starting on " + appEnv.url)
})

function onRequest(request, response) 
{
startTweets();
} 

 
cron.schedule('0 0 0 * * *', function(){
startTweets();

});