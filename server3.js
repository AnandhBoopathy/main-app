const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ping = require('ping');

const jsonConfigFile = './db.json';
const app = express();
const PORT = process.env.port || 3003; // Port for the Node server

 var corsOptions = { // Cross Orign options
     origin: 'http://localhost:3000',         //  FrontEnd url
     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
 }
let websites = [];

app.use(cors(corsOptions));

app.use(express.json());

app.get('/', (req,res) =>  {
    res.send('Running Proxy Server!...');
});

app.get('/status/:url', async (req, res) => {
    const { url } = req.params;
    try {
      const response = await axios.get(url);
      res.json({ status: response.status });
    } catch (error) {
      console.error(error);
      res.json({ status: error.response ? error.response.status : 'offline' });
    }
  });
  
  app.get('/healthcheck/', async (req, res) => {
      let promises = [];
      let output = [];
      await readCheckList();
      let getStatus = async (webSite) => {
          let site = { ...webSite };
          let count = []
          for (j = 0; j<site.apps.length; j++){
              
                promises.push(await ping.promise.probe(site.apps[j].app)
                .then(response => {
                  site.apps[j].status = response.alive === true ? 'UP' : 'DOWN'; // response.status;
                  response.status === true ? count.push('UP') : count.push('DOWN');
                  
              })
                )
          }
          if(count.includes('DOWN')){
              site.App_Status = 'Amber'
          }else{
              site.App_Status = 'Green'
          }
          count = []
          // try {
          //     const response = await axios.get(site.url);
          //     site.status = response.status === 200 ? 'UP' : 'DOWN'; // response.status;
          // } catch (error) {
          //     console.error(error);
          //     site.status = error.response ? error.response.status : 'DOWN';
          // }
          output.push(site);
      };
  
      let process = async () => {
          await asyncForEach(websites.recipes, getStatus);
          res.json(output);
      }  
      process();
  });
  // done below
  async function readCheckList() {
      const fs = require('fs');
      fs.readFile(jsonConfigFile, 'utf8', (err, data) => {
          if (err) {
              console.error('Error reading config file:', err);
              return;
          }
          try {
              websites = JSON.parse(data);
          } catch (err) {
              console.log('Error parsing configFile:', err);
          }
      });
  }
  //Done Above
  //below need to modify
  async function asyncForEach(array, callback) {
      for (let i = 0; i < array.length; i++) {
          await callback(array[i], i, array);
      }
  }
  //above need to modify
  // No chnages needed it seems
  app.listen(PORT, async () => {
      await readCheckList();
      console.log(`Proxy server is running on http://localhost:${PORT}`);
  });
  