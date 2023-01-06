// 'use strict';
// Object.defineProperty(exports, "__esModule", { value: true });

// var influxdb_client_1 = require("@influxdata/influxdb-client");
// const http = require("http");
// const argv = require('minimist')(process.argv.slice(2));

// const express = require('express')
// const app = express()
// const port = 8000

// const url="http://localhost:8086"
// const token="yzLZlg1DisHwsU0pFO96G-siBspo2rZUHFRDOMLPOvGUovx8WPclmIOsEOei_z8Q7f2SwJmZJKhYfJ4IgzPayg=="
// const org="TEST"
// const bucket="charo"

// var influxDB = new influxdb_client_1.InfluxDB({ url: url, token: token });

// var writeApi = influxDB.getWriteApi(org, bucket);

// // app.post('/api/humidity', (req, res) => {
// //     let data = "";
// //     req.on("data", (chunk) => {
// //       data += chunk;
// //     });
// //     req.on("end", () => {
// //         const frame = JSON.parse(data);
// //         if (frame.data.substring(0, 2) == "14") {
// //             const Pay = frame.data.substring(2);
// //             const HumInHexa = parseInt("0x" + Pay);
// //             const HumInDec = HumInHexa.toString(10) / 10;
// //      console.log('test humidité', HumInDec, "%"  );
// //         }
// //     }) 
// // })

// app.post("/api/temperature", (req, res) => {
//   let data = "";

//   req.on("data", (chunk) => {
//     data += chunk;
//   });

//   req.on("end", () => {
//     const frame = JSON.parse(data);
//     if (frame.data.substring(0, 2) == "28") {
//       const Pay = frame.data.substring(2);
//       const tempsInHexa = parseInt("0x" + Pay);
//       const tempsInDec = tempsInHexa.toString(10) / 10;

//       console.log("temperature: ", tempsInDec, "°C");    
//     }; 
//   })

//   const newPoint = new Point('temperature')
//     .tag('tp_iot_id', 'TLM01')
//     .floatField('temperature', value)
//     .intField('code', code)

//     writeApi.writePoint(newPoint)

//     writeApi.flush()
//       .then(function () {
//         console.log("WRITE FINISHED"); 
//       })
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// })

const express = require('express')
const app = express()
const port = 8000


'use strict'
/** @module write
 * Writes a data point to InfluxDB using the Javascript client library with Node.js.
**/

var influxdb_client_1 = require("@influxdata/influxdb-client");

/** Environment variables **/
const url = "http://localhost:8086"
const token = "l0aeRDMrnZOFK6WrJR_4mqPpaJWmD327puMQC_Cnj7tvHg6VEoh93Xoa0awOt0JihZMsSJhDGrHbb-LvmABUiw=="
const org = "TEST"
const bucket = "charo"

/**
 * Instantiate the InfluxDB client
 * with a configuration object.
 **/
const influxDB = new influxdb_client_1.InfluxDB({ url, token })

/**
 * Create a write client from the getWriteApi method.
 * Provide your `org` and `bucket`.
 **/
const writeApi = influxDB.getWriteApi(org, bucket)

/**
 * Apply default tags to all points.
 **/
app.post('/api/temperature', (req, res) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
        const frame = JSON.parse(data);
        const code = (parseInt("0x" + frame.data.substr(0,2)))/10;
        const value = (parseInt("0x0" + frame.data.substr(2, 4)))/10;
        let alert = "";
        if (frame.data.length > 6) {
            alert = (parseInt("0x" + frame.data.substr(6, 4)))/10
        };

        

        const newPoint = new influxdb_client_1.Point('temperature')
        .tag('tp_iot_id', 'TLM01')
        .floatField('temperature', value)
        .intField('code', code)
        writeApi.writePoint(newPoint)
        writeApi.flush().then(function () {
          console.log("WRITE FINISHED");
        });
        
    });
})

app.post('/api/humidity', (req, res) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      const frame = JSON.parse(data);
      const code = (parseInt("0x" + frame.data.substr(0,2)))/10;
      const value = (parseInt("0x0" + frame.data.substr(2, 4)))/10;
      let alert = "";
      if (frame.data.length > 6) {
       alert = (parseInt("0x" + frame.data.substr(6, 4)))/10
    };

    const newPoint = new influxdb_client_1.Point('humidity')
        .tag('tp_iot_id', 'TLM01')
        .floatField('humidity', value)
        .intField('code', code)
        writeApi.writePoint(newPoint)
        writeApi.flush().then(function () {
          console.log("WRITE FINISHED");
        });
        
    });

    
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})