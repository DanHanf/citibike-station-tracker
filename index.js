var co = require('co')
  , request = require('co-request')
  , render = require('co-render')
  , forEach = require('co-foreach')
  , point = require('turf-point')
  , fc = require('turf-featurecollection');

exports.get = function *() {
  var stationsArr = yield getStations()
  this.state.stations = stationsArr
  this.body = yield render(__dirname+ '/index.jade', {title: 'CitiBike NYC Station Tracker', stations: stationsArr});
}

getStations = function *() {
  var stationFeedURL = 'https://www.citibikenyc.com/stations/json'
  var result = yield request(stationFeedURL)
  var body = yield JSON.parse(result.body)
  var result = yield eachStation(body)
  return result
}

eachStation = function *(body) {
  var stations = []
  forEach(body.stationBeanList, function *(beacon) {
    var station = point([beacon.longitude, beacon.latitude], {"id":beacon.id, "availableBikes":beacon.availableBikes})
    stations.push(station)
  })
  var featureColection = fc(stations)
  return featureColection
}