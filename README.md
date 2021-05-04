# AIS Project

## Team Members

- Drew Thomas
- Alan Bauer

## Set Up & Installation

### Required Dependencies

- [Yarn](https://classic.yarnpkg.com/en/docs/install/) is used for package management. It can be installed via npm
  with `npm install --global yarn`
- [Mongo and mongoimport](https://docs.mongodb.com/database-tools/installation/installation/)

### Set up process

Once yarn and mongo are installed the project can be set up.

1. Clone the repository. `git clone https://github.com/Adbauer89/ais_project.git`
2. Switch to the repositories `server` directory `cd ais_project/server`
3. Install the dependencies and set up the database with `yarn run setup`
4. Start the server, frontend, and ais_feed with `yarn run dev`
5. View the frontend in your web browser at `http://localhost:3000`

The ais feed will populate the database's ais_messages. The ais_messages will be empty until `yarn run dev` is ran.
The frontend will display the positions as they update every 5 seconds, it will start out with 0 vessels displayed until the ais_feed starts posting.

### Testing

Tests are located in `server/src/tests`. To run the tests, make sure you are in the `server` directory and run `yarn run test`.

Tests cover 100% of the code located in `server/src`

## Documentation

This repository includes TypeDoc generated documentation for the traffic monitoring backend, REST layer, and Browser-displayed map. The
repository also includes code level documentation for critical methods and components for each of the previously mentioned layers.

The following documentation is best view in a web browser:

- `docs/client/index.html`
- `docs/server/index.html`

## Summary

This application follows the criteria for **Option C** outlined in the *project_tasks.html* document provided for the project.

## Traffic Monitoring Backend

## Node.js REST layer for data operations

### Curl commands

- Insert a batch of AIS messages (Static Data and/or Position Reports)
    - Curl Command
    ```bash
    curl --location --request POST 'http://localhost:3001/ais-messages' \
    --header 'Content-Type: application/json' \
    --data-raw '[
      {"Timestamp":"2020-11-18T00:00:00.000Z","Class":"Class A","MMSI":304858000,"MsgType":"position_report","Position":{"type":"Point","coordinates":[55.218332,13.371672]},"Status":"Under way using engine","SoG":10.8,"CoG":94.3,"Heading":97},
      {"Timestamp":"2020-11-18T00:00:00.000Z","Class":"AtoN","MMSI":992111840,"MsgType":"static_data","IMO":"Unknown","Name":"WIND FARM BALTIC1NW","VesselType":"Undefined","Length":60,"Breadth":60,"A":30,"B":30,"C":30,"D":30}
    ]'
    ```

    - Response
    ```json
    {
        "insertedCount": 2
    }
    ```

- Insert an AIS message (Position Report)
    - Curl Command
    ```bash
        curl --location --request POST 'http://localhost:3001/ais-messages' \
        --header 'Content-Type: application/json' \
        --data-raw '{"Timestamp":"2020-11-18T00:00:00.000Z","Class":"Class A","MMSI":257385000,"MsgType":"position_report","Position":{"type":"Point","coordinates":[55.219403,13.127725]},"Status":"Under way using engine","RoT":25.7,"SoG":12.3,"CoG":96.5,"Heading":101
        }'
    ```

    - Response
    ```json
        {
        "insertedCount": 1
        }
    ```

- Insert an AIS message (Static Data)
    - Curl Command
    ```bash
        curl --location --request POST 'http://localhost:3001/ais-messages' \
        --header 'Content-Type: application/json' \
        --data-raw '{"Timestamp":"2020-11-18T00:00:00.000Z","Class":"Class A","MMSI":304858000,"MsgType":"position_report","Position":{"type":"Point","coordinates":[55.218332,13.371672]},"Status":"Under way using engine","SoG":10.8,"CoG":94.3,"Heading":97}'
    ```

    - Response
    ```json
      {
        "insertedCount": 1
      }
    ```

- Delete all AIS messages whose timestamp is more than 5 minutes older than current time
    - Curl Command
    ```bash
        curl --location --request DELETE 'http://localhost:3001/ais-messages?time=2020-11-18T02:33:00Z'        }'
    ```

    - Response
    ```json
        {
        "deletedMessages": 935333
        }
    ```

- Read all most recent ship positions
    - Curl Command
    ```bash
        curl --location --request GET "http://localhost:3001/recent-ship-positions"
    ```

    - Response
    ```json
        [
            {
            "Timestamp": "2020-11-18T02:38:20.000Z",
            "Position": {
            "type": "Point",
            "coordinates": [
            55.684615,
            12.605867
            ]
            },
            "MMSI": 5322
            },
            {
            "Timestamp": "2020-11-18T02:38:20.000Z",
            "Position": {
            "type": "Point",
            "coordinates": [
            55.4718,
            8.423338
            ]
            },
            "MMSI": 2190045
            }
        ]
    ```

- Gets most recent position for MMSI
    - Curl Command
    ```bash
      curl --location --request GET 'http://localhost:3001/recent-ship-positions?mmsi=219024175'
    ```

    - Response
    ```json
        {
        "MMSI": 219024175,
        "lat": 55.516188,
        "long": 10.569987,
        "IMO": null
        }
    ```

- Finds the most recent ship positions within a tile
    - Curl Command
    ```bash
      curl --location --request GET 'http://localhost:3001/recent-ship-positions?tile_id=54294'
    ```
  
    - Response (trimmed)
    ```json
      [
        {
        "Timestamp": "2020-11-18T02:38:15.000Z",
        "Position": {
        "type": "Point",
        "coordinates": [
        55.052153,
        11.988527
        ]
        },
        "MMSI": 2190051
        },
        {
        "Timestamp": "2020-11-18T02:36:57.000Z",
        "Position": {
        "type": "Point",
        "coordinates": [
        54.998457,
        11.88004
        ]
        },
        "MMSI": 209718000
        }
      ]
    ```
  

- Read permanent or transient vessel information matching the given MMSI, and 0 or more additional criteria: IMO, Name, CallSign
    - Curl Command
    ```bash
      curl --location --request GET 'http://localhost:3001/vessel-data?mmsi=265866000&imo=9217242&name=PETER%20PAN'
    ```

    - Response
    ```json
      {
      "_id": "6079924fbe22b8f9c1eea8cf",
      "Timestamp": "2020-11-18T02:33:14.000Z",
      "Class": "Class A",
      "MMSI": 265866000,
      "MsgType": "static_data",
      "IMO": 9217242,
      "CallSign": "SGUH",
      "Name": "PETER PAN",
      "VesselType": "Passenger",
      "CargoTye": "No additional information",
      "Length": 220,
      "Breadth": 30,
      "Draught": 6.1,
      "Destination": "TRAVEMUNDE",
      "ETA": "2020-11-18T06:00:00.000Z",
      "A": 21,
      "B": 199,
      "C": 15,
      "D": 15,
      "Vessel_Data": [
        {
        "_id": "60799cb6a6a6ddd4f72dd0df",
        "IMO": 9217242,
        "Flag": "Sweden",
        "Name": "Peter Pan",
        "Built": 2001,
        "Length": 219,
        "Breadth": 29,
        "Tonnage": 44245,
        "MMSI": 265866000,
        "VesselType": "Ro-Ro",
        "Owner": 10279,
        "FormerNames": [
        "PHT (2018, Sweden)",
        "PEPPADER (2013, Sweden)",
        "PB PANETEP (2013, Sweden)",
        "ETER PAN (2013, Sweden)",
        "HDER PAN (2013, Sweden)"
        ]
        }
      ],
      "PositionData": {
      "MMSI": 265866000,
      "lat": 54.3614,
      "long": 11.7873,
      "IMO": null
      }
      }
    ```

- Given a background map tile for zoom level 1 (2), find the 4 tiles of zoom level 2 (3) that are contained in it
    - Curl Command
    ```bash
        curl --location --request GET "http://localhost:3001/tile-data/5037"
    ```

    - Response
    ```json
    [
        {
        "id": 50371,
        "ICESName": "39F71",
        "west": 7,
        "south": 55.25,
        "east": 7.5,
        "north": 55.5,
        "scale": 3,
        "filename": "39F71.png",
        "image_width": 2000,
        "image_height": 2000,
        "image_west": 7,
        "image_east": 7.5,
        "image_north": 55.516993,
        "image_south": 55.232892,
        "contained_by": 5037,
        "image_file": null
        },
        {
        "id": 50372,
        "ICESName": "39F72",
        "west": 7.5,
        "south": 55.25,
        "east": 8,
        "north": 55.5,
        "scale": 3,
        "filename": "39F72.png",
        "image_width": 2000,
        "image_height": 2000,
        "image_west": 7.5,
        "image_east": 8,
        "image_north": 55.516993,
        "image_south": 55.232892,
        "contained_by": 5037,
        "image_file": null
        },
        {
        "id": 50373,
        "ICESName": "39F73",
        "west": 7,
        "south": 55,
        "east": 7.5,
        "north": 55.25,
        "scale": 3,
        "filename": "39F73.png",
        "image_width": 2000,
        "image_height": 2000,
        "image_west": 7,
        "image_east": 7.5,
        "image_north": 55.267886,
        "image_south": 54.981993,
        "contained_by": 5037,
        "image_file": null
        },
        {
        "id": 50374,
        "ICESName": "39F74",
        "west": 7.5,
        "south": 55,
        "east": 8,
        "north": 55.25,
        "scale": 3,
        "filename": "39F74.png",
        "image_width": 2000,
        "image_height": 2000,
        "image_west": 7.5,
        "image_east": 8,
        "image_north": 55.267886,
        "image_south": 54.981993,
        "contained_by": 5037,
        "image_file": null
        }
    ]
    ```

- Given a tile Id, get the actual tile (a PNG file)
    - Curl Command
    ```bash
        curl --location --request GET "http://localhost:3001/tile-image/1"
    ```

- Read all ports matching the given name and (optional) country
    - Curl Command
    ```bash
        curl --location --request GET 'http://localhost:3001/ports?name=Ebeltoft&country=Denmark'
    ```

    - Response
    ```json
      [
        {
            "id": 2968,
            "un_locode": "DKEBT",
            "port_location": "Ebeltoft",
            "country": "Denmark",
            "longitude": 10.670556,
            "latitude": 56.194444,
            "website": "\\N",
            "mapview_1": 1,
            "mapview_2": 5333,
            "mapview_3": 53334
        }
    ]
    ```

- Read all ship positions in the tile of scale 3 containing the given port. If multiple ports are found an array of ports is returned.
    - Curl Command
      ```bash
          curl --location --request GET 'http://localhost:3001/recent-ship-positions?port_name=Ebeltoft&country=Denmark'
      ```

    - Response
      ```json
        [
      {"Timestamp":"2020-11-18T02:38:17.000Z",
      "Position":{"type":"Point","coordinates":[56.053985,10.861367]},
      "MMSI":210008000},
      {"Timestamp":"2020-11-18T02:38:18.000Z",
      "Position":{"type":"Point","coordinates":[56.19394,10.668388]},
      "MMSI":219011321},
      {"Timestamp":"2020-11-18T02:38:13.000Z",
      "Position":{"type":"Point","coordinates":[56.193807,10.668115]},
      "MMSI":219020150},
      {"Timestamp":"2020-11-18T02:35:27.000Z",
      "Position":{"type":"Point","coordinates":[56.153913,10.66674]},
      "MMSI":219601000},
      {"Timestamp":"2020-11-18T02:38:21.000Z",
      "Position":{"type":"Point","coordinates":[56.071877,10.818295]},
      "MMSI":219997000},
      {"Timestamp":"2020-11-18T02:38:19.000Z",
      "Position":{"type":"Point","coordinates":[56.074927,10.556448]},
      "MMSI":305575000},
      {"Timestamp":"2020-11-18T02:38:19.000Z",
      "Position":{"type":"Point","coordinates":[56.012912,10.536257]},
      "MMSI":377085000
      }]
      ```

## Browser-displayed map

### Features

#### Display

- Regular interval queries for updating vessel positions
- Dynamic rendering of ports and port names based on background tile
- Dynamic rendering of most recent vessel location based on background tile
- Dynamic rendering of vessels based on search parameters
- Collapsible search menu
- Toggle buttons for zooming in/out and opening/closing search menu
- Animated vessel when target of a search

#### Zoom

- Zoom in/out views of map
- GUI for toggling zoom modes
- Three zoom levels
- Dynamic rendering of background tile based on mouse click positions while zooming
- Error protection from zooming to undefined tiles or tiles that have not been provided

#### Search

- Input fields for searching vessels by MMSI
