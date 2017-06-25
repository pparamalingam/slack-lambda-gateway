var AWS = require('aws-sdk');
var slack = require('slack');
exports.handler = function(event, context, callback) {

  if (event.hasOwnProperty('challenge')){
    callback(null, event['challenge'])
    return 0;
  }


  var lexruntime = new AWS.LexRuntime({apiVersion: '2016-11-28'});

  var params = {
    botAlias: 'Beta', /* required */
    botName: 'amznshopbot', /* required */
    contentType: 'text/plain; charset=utf-8', /* required */
    inputStream: event["event"]["text"], /* required */
    userId: '10', /* required */
    accept: 'text/plain; charset=utf-8'
  };

  lexruntime.postContent(params, function(err, data) {
    if (err){
      console.log(err, err.stack);
      return 1;
    }
    else{
      if (data["dialogState"] == "Fulfilled"){
        slack.chat.postMessage({token:process.env['SLACK_TOKEN'], channel:event["event"]["channel"] , text: data["message"], unfurl_links: true, parse:"full"}, (err, data) => { 
          if (err){
            console.log(err, err.stack);
            return 1;
          }
          else{
            console.log(data["message"]);
            return 0;
          }        
        });        
      }
      console.log(data);
      return 0;
    }
  });
};