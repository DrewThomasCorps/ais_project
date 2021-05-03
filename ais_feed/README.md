

## 1. THE AIS FEEDER

This utility replays a few hours worth of AIS data transmissions in the Danish seas.

There are 2 possible ways to use the tool:

Client mode
:	Starting on the 18th of September 2018 at 00:00, it posts every second to your REST service 
 	all AIS messages found for that date and time, in a JSON array of the form:

	~~~~~~~~~~~~~~~{.json}
	 [{"Timestamp":"2020-11-18T00:00:00.000Z","Class":"Class A","MMSI":304858000,"MsgType":"position_report","Position":{
	  "type":"Point","coordinates":[55.218332,13.371672]},"Status":"Under way using engine","SoG":10.8,"CoG":94.3,"Heading":97},
	  {"Timestamp":"2020-11-18T00:00:00.000Z","Class":"AtoN","MMSI":992111840,"MsgType":"static_data","IMO":"Unknown","Name":
	  "WIND FARM BALTIC1NW","VesselType":"Undefined","Length":60,"Breadth":60,"A":30,"B":30,"C":30,"D":30},
	  {"Timestamp":"2020-11-18T00:00:00.000Z","Class":"Class A","MMSI":219005465,"MsgType":"position_report","Position":
	  {"type":"Point","coordinates":[54.572602,11.929218]},"Status":"Under way using engine","RoT":0,"SoG":0,"CoG":298.7,"Heading":203},
	  {"Timestamp":"2020-11-18T00:00:00.000Z","Class":"Class A","MMSI":257961000,"MsgType":"position_report","Position":
	  {"type":"Point","coordinates":[55.00316,12.809015]},"Status":"Under way using engine","RoT":0,"SoG":0.2,"CoG":225.6,"Heading":240},
	  {"Timestamp":"2020-11-18T00:00:00.000Z","Class":"AtoN","MMSI":992111923,"MsgType":"static_data","IMO":"Unknown","Name":
	  "BALTIC2 WINDFARM SW","VesselType":"Undefined","Length":8,"Breadth":12,"A":4,"B":4,"C":4,"D":8},
	  {"Timestamp":"2020-11-18T00:00:00.000Z","Class":"Class A","MMSI":257385000,"MsgType":"position_report","Position":
	  {"type":"Point","coordinates":[55.219403,13.127725]},"Status":"Under way using engine","RoT":25.7,"SoG":12.3,"CoG":96.5,"Heading":101},
	    ... ]
	~~~~~~~~~~~~~~~~~~~~~

	In this mode, it is assumed that the Web interface under test is a service, that allows for storing messages.  The default URL for the target service is:
	 
	  `http://localhost:3000/AISFeed/<timestamp>`

 	where `<timestamp>` represents the date and time of the messages posted in the request's body. It is an 
	 ISO string of the form: "2020-11-18T01:12:06Z".


	~~~~~~~~~~~
	
	  |          | POST [ { mesg }, ... ]     |                                    |
	  | AIS Feed |--------------------------->| (your) REST service under test     |-------> TMB module
	  |          | (every second)             | at http://localhost:3000/AISFeed   |

	~~~~~~~~~~~~~~~~


Server mode
:	The feed simply waits for GET requests on URL `http://localhost:3000/AISFeed/<timestamp>`
 	where `<timestamp>` represents the date and time of the messages requested by the client under test.


	~~~~~~~~~~~~~~~~
	                                          GET ./AISFeed/<timestamp>  
	                 |                     |------------------------------>|                                   
	 TMB module <----| (your) REST client  |                               |  AIS Feed REST service at        |
	                 |   under test        |<------------------------------| at http://localhost:3000/AISFeed |
	                                           [ { message }, ... ]
	~~~~~~~~~~~~~~~~~~~


	The server accepts two forms for the timestamp parameter:

	+ a human-readable, ISO string, such as "2020-11-18T01:12:06Z"
	+ a Unix-style timestamp, in _seconds_ since 1970: 1605657602

	Examples:

	+ get all messages for 020-11-18T00:00:02.000Z, with Unix-style timestamp parameter (in seconds):

	~~~~~~~~~
	curl http://localhost:3000/AISFeed/1605657602
	~~~~~~~~~~~~~

	+ same, with human-readable timestamp string

	~~~~~~~~~~
	curl http://localhost:3000/AISFeed/2020-11-18T00:00:02.000Z
	~~~~~~~~~~~~~~



## 2. INSTALLATION AND SETUP

Prerequisite: MongoDB and tools (mongorestore) are installed.


1. Unzip the provided archive 
2. Launch the Powershell and `cd` into the  `ais_feed` subfolder
3. In the _system shell_ (CMD.exe or Powershell on Windows, Bash on Mac/Linux), run
   
   ~~~~~~{.bash}
   > mongorestore --drop --gzip --archive=AISFeed.bson.gz
   ~~~~~~~~~~~~~

You may configure the script parameters by modifying the following constants in the file `index.js`:

 + `SERVICE_NAME`: replace the default value (`'AISFeed'`) with a name of your choice
 + `INTERVAL` (client-mode): modify this value (in milliseconds) to accelerate (ex. 500), or slow down (ex. 2000) the simulation
 + `START_DATETIME` (client-mode): modify to start the simulation later than 2020-11-18-00:00:00.
 

## 3. RUNNING THE TRANSMITTER

The client-mode is the default:

~~~~~~~{.bash}
> node index.js
~~~~~~~~~~~~~

To run in server mode:


~~~~~~~{.bash}
> node index.js --server
~~~~~~~~~~~~~


