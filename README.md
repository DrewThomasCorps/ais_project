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

- Read all most recent ship positions
```bash
curl --location --request GET 'http://localhost:3001/recent-ship-positions'
```

- Given a background map tile for zoom level 1 (2), find the 4 tiles of zoom level 2 (3) that are contained in it
```bash
curl --location --request GET "http://localhost:3001/tile-data/-1"
```

- Given a tile Id, get the actual tile (a PNG file)
```bash
curl --location --request GET "http://localhost:3001/tile-image/1"
```

- Read all ports matching the given name and (optional) country
```bash
curl --location --request GET 'http://localhost:3001/ports?name=Ebeltoft&country=Denmark'
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
- Input fields for searching for vessels by destination port
