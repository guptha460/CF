
var Twitter = require('twitter');
var o = require('odata');



var client = new Twitter({
  consumer_key: 'aCyJ7cEB7ZPYE6BbpNiGno4bl',
  consumer_secret: 'PMKC9FEYSbjX2WwFhk3mz3yAbc1hqWVm60X4TlgUhpXnDcL0Jt',
  access_token_key: '633642645-n8yguLeug7FepGTWtsIbbpGgwSD4rCYiEIRyUDdI',
  access_token_secret: 'ebnIVXQGPdurQfnDei6wFNHVYGQssmgccVb8voLGr8k44'
});


var stream = client.stream('statuses/filter', {track: 'SAP'});
var streamStatus=null;
var lastSync='';

exports.streamON=function streamON()
{
	console.log("inside on function");
stream.on('data', function(data) 
{

	console.log("inside stream");
	//console.log(data);
	streamStatus=true;
	lastSync=new Date().getTime();
	var oHandler = o('https://xs01a2a87b01e.hana.ondemand.com/BIDEV/DEMO_14285/data.xsodata/Tweets');
	var oHandlerUS = o('https://xs01df3504f5a.us2.hana.ondemand.com/BIDEV/DEMO_14285/data.xsodata/Tweets');
	
	var myDate = new Date(Date.parse(data.created_at.replace(/( +)/, 'UTC$1')));
	var createdAt = myDate.getFullYear() + '-' + eval(myDate.getMonth()+1) + '-' + myDate.getDate() + ' ' + myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds();
        var created_date = new Date(data.created_at).getTime(); 
        var created_ms = "/Date(" + created_date + ")/";
	var replyUser = '';
					if (data.in_reply_to_screen_name !== null) {
						replyUser = data.in_reply_to_screen_name
					}
					var retweetedUser = '';
					if (typeof data.retweeted_status !== 'undefined') {
						retweetedUser = data.retweeted_status.user.screen_name;
					}
					var lat = null;
					var lon = null;
					if (data.geo !== null) {
						lat = data.geo.coordinates[0];
						lon = data.geo.coordinates[1];
					}
                    
                                                      var obj= {
	                                                       "T_ID":  data.id_str,
	                                                        "CREATED": created_ms,
                                                                "TEXTD": data.text,
                                                                "LANG": data.lang,
                                                                "USERT": data.user.screen_name,
                                                                "REPLYUSER": replyUser,
                                                                "RETWEETEDUSER":retweetedUser
                                                                 };
//console.log(oj);
oHandler.post(obj).save(function(data) {console.log(data)});
oHandlerUS.post(obj).save(function(data) {console.log(data)});
});




 stream.on('error', function (err) {
        if (err.message == 'Status Code: 420') 
        {
        	console.log(err.message);
           stream.destroy();
           streamStatus=false;
              }
  });
}



exports.streamDestroy=function streamDestroy()
{
	stream.destroy();
	streamStatus=false;
}

