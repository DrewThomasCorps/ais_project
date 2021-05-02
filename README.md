# AIS Project

## Team Members
- Drew Thomas
- Alan Bauer

## Set Up & Installation

## Documentation

This repository includes TypeDoc generated documentation for the traffic monitoring backend, REST layer, 
and Browser-displayed map. The repository also includes code level documentation for critical methods and components
for each of the previously mentioned layers.

The following documentation is best view in a web browser:
- `docs/client/index.html`
- `docs/server/index.html`

## Summary
This application follows the criteria for **Option C** outlined in the *project_tasks.html* document provided for the
project.

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
        curl --location --request DELETE 'http://localhost:3001/ais-messages?time=2020-11-18T02:33:00Z' \
        --header 'Content-Type: application/json' \
        --data-raw '{"Timestamp":"2020-11-18T00:00:00.000Z","Class":"Class A","MMSI":257385000,"MsgType":"position_report","Position":{"type":"Point","coordinates":[55.219403,13.127725]},"Status":"Under way using engine","RoT":25.7,"SoG":12.3,"CoG":96.5,"Heading":101
        }'
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

    ```

    - Response
    ```json

    ```

- Read permanent or transient vessel information matching the given MMSI, and 0 or more additional criteria: IMO, Name, CallSign
    - Curl Command
    ```bash
      curl --location --request GET 'http://localhost:3001/vessels?imo=1000033&name=Astralium&mmsi=234028000'
    ```

    - Response
    ```json
        [
            {
            "imo": 1000033,
            "id": "60799cb1a6a6ddd4f72b80ba",
            "flag": "United Kingdom",
            "name": "Astralium",
            "built": 1995,
            "length": 31,
            "breadth": 7,
            "tonnage": 178,
            "mmsi": 234028000,
            "vessel_type": "Yacht",
            "owner": null,
            "former_names": [
            "POWERFUL"
            ]
            }
        ]
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
