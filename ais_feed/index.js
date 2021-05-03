/***
 * AIS_TRANSMITTER: feeding AIS messages to a Web service.
 *
 * Revisions:
 *	1.0 	NPR	03/07/2020	Initial version.
 *	1.1 	NPR	03/15/2020	Use a single MongoDB client for all requests.
 *	1.2	NPR	03/16/2020	The POST request passes the timestamp as a parameter; documentation added.
 *	2.0	NPR	04/15/2021	Updated and adapted for CS418 project, with more realistic message structure.
 *
 * This utility replays a few hours worth of AIS data transmissions in the Danish seas
 * Starting on the 18th of September 2018 at 00:00 , it posts every second to your REST service 
 * all AIS messages found for that date and time, in a JSON array of the form:
 *
 *
 * ~~~~~~~~~~~~~~~{.json}
 * [{"Timestamp":"2020-11-18T00:00:00.000Z","Class":"Class A","MMSI":304858000,"MsgType":"position_report","Position":{
 *  "type":"Point","coordinates":[55.218332,13.371672]},"Status":"Under way using engine","SoG":10.8,"CoG":94.3,"Heading":97},
 *  {"Timestamp":"2020-11-18T00:00:00.000Z","Class":"AtoN","MMSI":992111840,"MsgType":"static_data","IMO":"Unknown","Name":
 *  "WIND FARM BALTIC1NW","VesselType":"Undefined","Length":60,"Breadth":60,"A":30,"B":30,"C":30,"D":30},
 *  {"Timestamp":"2020-11-18T00:00:00.000Z","Class":"Class A","MMSI":219005465,"MsgType":"position_report","Position":
 *  {"type":"Point","coordinates":[54.572602,11.929218]},"Status":"Under way using engine","RoT":0,"SoG":0,"CoG":298.7,"Heading":203},
 *  {"Timestamp":"2020-11-18T00:00:00.000Z","Class":"Class A","MMSI":257961000,"MsgType":"position_report","Position":
 *  {"type":"Point","coordinates":[55.00316,12.809015]},"Status":"Under way using engine","RoT":0,"SoG":0.2,"CoG":225.6,"Heading":240},
 *  {"Timestamp":"2020-11-18T00:00:00.000Z","Class":"AtoN","MMSI":992111923,"MsgType":"static_data","IMO":"Unknown","Name":
 *  "BALTIC2 WINDFARM SW","VesselType":"Undefined","Length":8,"Breadth":12,"A":4,"B":4,"C":4,"D":8},
 *  {"Timestamp":"2020-11-18T00:00:00.000Z","Class":"Class A","MMSI":257385000,"MsgType":"position_report","Position":
 *  {"type":"Point","coordinates":[55.219403,13.127725]},"Status":"Under way using engine","RoT":25.7,"SoG":12.3,"CoG":96.5,"Heading":101},
    ... ]
 * ~~~~~~~~~~~~~~~~~~~~~
 *
 *
 * The default URL for the target service is:
 * 
 *  http://localhost:3000/AISFeed/<timestamp>
 * 
 * where <timestamp> represents the date and time of the messages posted through the request (a string like this: "2018-09-11T10:39:06.000Z").
 *
 * You may configure the script parameters:
 *
 * + SERVICE_NAME: replace the default value ('AISFeed') with a name of your choice
 * + INTERVAL: modify this value (in milliseconds) to accelerate (ex. 500), or slow down (ex. 2000) the simulation
 * + START_DATETIME: modify to start the simulation later than 09/01/01-00:00:00.
 * 
 **/

const http = require("http");
const MongoClient = require('mongodb').MongoClient;

const dbName = 'AISFeed'; // do not modify
const url = 'mongodb://localhost:27017'; // do not modify
const dbCollection = 'aisdk_20201118'; // do not modify

// Modify to fit your service implementation
const SERVICE_NAME="ais-messages";

// Time interval between two POST requests (1000 ms for real-time, 
// faster (ex. 500 ms) to accelerate the simulation, or slower (ex. 2000s)...
var INTERVAL=4000;
// Drop the POST request if the server does not answer within this timeframe
var TIMEOUT=4;


START_DATETIME = new Date("2020-11-18T00:00:00Z");


// Testing access to the database
var cltPromise = MongoClient.connect( url + "/" + dbName , { useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 })
.then( clt => {
	console.log("Successful connection!");
	return clt;
})
.catch(err => {
	console.log("Could not connect! Verify the following:" +
	"\n\t - MongoDB is up and running;" +
	"\n\t - the " + dbName + " database has been uploaded." ); 
	process.exit(2);
})

var client_mode_notice = "**************************************************************\n" +
    "Started ais_feed client:\n" + 
	 " Implement the target service on" +
    `\thttp://localhost:3001/${SERVICE_NAME}\n` +
    `\tStarting date: ${START_DATETIME.toUTCString()}` + 
    "\n(change the START_DATETIME constant in index.js for an earlier or later date)\n" +
    "*****************************************************************\n" ;

var server_mode_notice = "**************************************************************\n" +
    "Started ais_feed server:\n" + 
	 " Retrieve messages from" + 
    `\taddress: http://localhost:3000/${SERVICE_NAME}/<timestamp>\n` +
    "\twhere <timestamp> is in milliseconds.\n" +
    "*****************************************************************\n" ;


// Main loop: depending on the CLI argument, the AIS either
// tries to post messages every second to the service under test,
// or wait for requests from the client under test (--server flag).
cltPromise.then( clt => {
		
	const collection = clt.db(dbName).collection(dbCollection);

	let mode_string = client_mode_notice;

	// server mode
	if (process.argv.length > 2 && process.argv[2]==='--server'){

		mode_string = server_mode_notice;
		on_call( collection );

	// server mode
	} else {	periodic_post( collection ); }

	return mode_string;

})
.then( ms => { console.log( ms ) })
.catch( err => { console.log(err)})
			

/**
 * Server mode: the AIS feed sends messages on request.
 */
function on_call( coll ){

	http.createServer ( async (req, res) => {
		let url = new URL(req.url, `http://${req.headers.host}`);
		
		try {
			if (url.pathname.startsWith(`/${SERVICE_NAME}`)){

				let date = parse_param( url.pathname )
				if (date != null){
					let docs = await coll.find({"Timestamp": date}).toArray()
					console.log(`Found ${docs.length} documents.`)
					
					res.writeHead( 200, {'Content-Type': 'application/json'});
					res.end(JSON.stringify( docs  ) + '\n' )
				}
				else {
					res.writeHead( 404, {'Content-Type': 'text/plain'});
					res.end("Missing parameter: timestamp\n");
				}
			}
			else {
				res.writeHead(404, {'Content-Type': 'text/plain'});
				res.end("Route not implemented.\n")
			}
		} catch(err){ console.log(err); } 
	}) .listen(3000) ;

}

/**
 * Client mode: the AIS feed posts messages to the client.
 *
 */
function periodic_post( coll ){

	let offset = 0;

	setInterval( async () => {
			
		let docs = [];
		let mseconds = START_DATETIME.getTime() + offset*1000;
		offset++;
		let timestamp = new Date();
		timestamp.setTime( mseconds );

		try {
		
			let docs = await coll.find({"Timestamp": { $eq: timestamp }}).project({_id:0}).toArray()
		
			console.log(`Found ${docs.length} docs.`);
			console.log(docs)
			let response = await make_post_request( JSON.stringify( docs ), timestamp);
			console.log("Placed POST request");
			console.log( response );
		}
		catch( err  ){
			console.log(err);
		}
	}, INTERVAL );

}


/**
 * Send the messages to the server: the target service is of the form:
 *
 *     http://localhost:3000/AISFeed/2020-11-18T00:12:06Z
 *
 * The client's behaviour is to place a request every second, even if
 * no message for that time: in this case, an empty JSON array gets
 * posted - passing the timestamp as a URL parameter allows for handling this
 * request for other purpose (deleting stale data, for example).
 */
function make_post_request( data, timestamp ){
	
   return new Promise ( (resolve, reject) => {
		let req = http.request({
		   hostname: 'localhost',
			port: 3001,
    	   path: `/${SERVICE_NAME}`,
		   method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': data.length
			}
		},
      (resp) => {
			resp.on('data', (d) => { resolve(d.toString()); });
      });
      req.on('error', (error) => { reject( error ); });

      req.write(data);
      req.end();
   });
}


/**
 * Parse a date parameter from the command line.
 *
 * Timestamp parameter can be parsed either from a Unix timestamp 
 * (in seconds, * not ms!) or an ISO string ("yyyy-mm-ddThh:mm:ssZ")
 *
 * @return {Date} - A Date object.
 */
function parse_param( pathname ){
	let extra = pathname.replace( `/${SERVICE_NAME}/`, '');
	
	// date param passed as a timestamp in seconds
	let param = /^\d+$/.exec( extra )
	if ((param != null) && (! isNaN(Number(param[0])))){
		// Unix timestamp (in ms)
		return new Date( Number(param) * 1000 )
	} 
	else {
		// ISO string
		let iso_date = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.exec( extra )
		if (iso_date != null){ return new Date( iso_date[0] ); }
	}
	return null;
}
