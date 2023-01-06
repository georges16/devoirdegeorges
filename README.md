## Prerequisites

- Nodejs : https://nodejs.org/en 
- Grafana : https://grafana.com/grafana/download?platform=windows
- InfluxDB : https://dl.influxdata.com/influxdb/releases/influxdb2-2.5.1-windows-amd64.zip
- Middleware - API : choix du framework libre
- Capteurs – projet tp-iot : archive zip
- InfluxDB account and database set up
- express.js



# INFLUXBD

## Run influxDB

Navigate to where you downloaded indluxDB and execute the following command in a powershell or CMD
``` bash
influxd.exe
```
after that influxDB should be available on http://localhost:8086

Here influxDB greets you with the first configuration of a Organization and default bucket. Configurations made here are later neccessary for running the middleware application and connecting influxDB with grafana

furthermore we need to create a new API token. The token is also needed for grafana and the middleware application


## GET STARTED

. Visit http://localhost:8086 in a browser to log in and access the InfluxDB UI.

Navigate to Load Data > API Tokens using the left navigation bar.

Click + GENERATE API TOKEN and select All Access API Token.

Enter a description for the API token and click  SAVE.

. Visit http://localhost:8086 in a browser to log in and access the InfluxDB UI.

Navigate to Load Data > Buckets using the left navigation bar.

Click + CREATE BUCKET.

Provide a bucket name (get-started) and select NEVER to create a bucket with an infinite retention period.

Click CREATE.
Copy the generated token and store it for safe keeping
execute the middleware with the following command
``` bash
npm install


## Run sensors

This project is adapted to deal with sensor imput from the projet tp-iot. This project is provided by our professor and I have not found a github for it so I can't link it here :(

In order to start sensors, run the following commands :
``` bash
npm i
npm run sensors
```

## Run grafana

If not already installed, install grafana and verify that in services the grafana servive is running.
After that grafana should be available on http://localhost:3000

## configure grafana

We need to link the influxDB datasource in grafana. To do so we go to:
Data Sources -> Add data source -> select InfluxDB

There we specify the URL, token, Organization, default bucket and test the connection.


## Expected Results

Thanks to the middleware application data is now sent from the sensors to the influxDB. From here grafana can fetch information and display the result as following when configured corectly.
![Alt Text](https://github.com/georges16/devoirdegeorges/blob/main/Capture%20d'%C3%A9cran_20230106_153054.png)

### The flux query used to fetch the two diagrams are the following:
Temperature:

```
from(bucket: "charo")
  |> range(start: v.timeRangeStart, stop:v.timeRangeStop)
  |> filter(fn: (r) =>
    r._measurement == "humidity" and
    r._field == "humidity"
  )
```
Humidity:
```
from(bucket: "charo")
  |> range(start: v.timeRangeStart, stop:v.timeRangeStop)
  |> filter(fn: (r) =>
    r._measurement == "temperature" and
    r._field == "temperature"
  )
```

Thresholds can be added when editing the Dashboard view under the threshold tab. For teperature I chose 25° and for the humidity view I chose 80%. Those values are hardcoded. Since the sensors are sending thresholds as well it would be possible to dynamically determine the threshold via the values sent from the sensor. However I could not figure out how to make a flux query that could make a dynamic threshold based on the values sent from the sensor.
# Final Results 

## Run project

- npm run servers 
- node app.js

# LIEN UTILES
- https://docs.influxdata.com/influxdb/cloud/write-data/developer-tools/api/?t=Node.js
