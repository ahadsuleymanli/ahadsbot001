var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    //track(null,req.body,new Date().getTime())
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text)
        {
            text = event.message.text
            if (text === 'Show Deals') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "Hımm, " + ' ' + event.sender.id +' '+ text.substring(0, 200))
            //sendToBotAnalytics(event.sender, "Hımm, " + ' ' + event.sender.id +' '+ text.substring(0, 200),false)
            //sendToBotAnalytics(event.sender,text,true)
            //sendToBotAnalytics2()
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            //sendToBotAnalytics(event.sender,text,true)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = "EAADJjeAm0WABAO1yggRLc8qiCZBFNVy96WqyYzxdyybk3cCBtBTA6YitZAMvPhXjboP0wUp5jZBNIKmGRZCDHh7aV55NImSSK9AocztRImhuGzLYqRBZClZB0UFSjpnRGn5oWmsr1cg4E3jFFD3lFNXRq3LSRzCudct4NX19hlzwZDZD"
 
/*
function track(recipient,message,timestamp){

  request({
url: 'http://botanalytics.co/api/v1/track', //URL to hit
body: JSON.stringify({message: message,
recipient: recipient,
token: "324d5564a67f15e56f8f6ef4cd3e9347",
timestamp:timestamp}), //Query string data
method: 'POST', //Specify the method
headers: { //We can define headers too
'Content-Type': 'application/json',
}
}, function(error, response, body){

if(error) {
console.log(error)
} else {
console.log(response.statusCode, body)
}
})
}*/


 

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
    //track(sender,messageData,new Date().getTime())
}

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                {
                    "title": "Model S",
                    "subtitle": "Performance and safety refined",
                    "image_url": "http://blog.caranddriver.com/wp-content/uploads/2016/04/2017-Tesla-Model-S-P90D-101-876x535.jpg",
                    "buttons":
                    [
	                    {
	                        "type": "web_url",
	                        "url": "https://www.teslamotors.com/models",
	                        "title": "Explore"
	                    },
	                    {
	                        "type": "postback",
	                        "title": "Buy Now!",
	                        "payload": "See, it's coming",
	                    }
	                ],
                },
                {
                    "title": "Model X",
                    "subtitle": "Meet Model X",
                    "image_url": "http://o.aolcdn.com/hss/storage/midas/f03635ab3daec6021760a187b6153b75/202724181/modelx.jpg",
                    "buttons":
                    [
	                    {
	                        "type": "web_url",
	                        "url": "https://www.teslamotors.com/modelx",
	                        "title": "Explore"
	                    },
	                    {
	                        "type": "postback",
	                        "title": "Buy Now!",
	                        "payload": "See, it's coming",
	                    }
                    ],
                }]
            }
        }
    }

    //sendToBotAnalytics(sender,messageData,false)
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
         if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
    //track(sender,messageData,new Date().getTime())
}
