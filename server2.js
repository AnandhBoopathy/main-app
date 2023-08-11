const ping = require('ping');

const hosts = ['192.168.201.10', 'google.com', 'www.134rfg.com'];

async function example() {
  for (const host of hosts) {
    const response = await ping.promise.probe(host);
    console.log(response.alive);
  }
}
async function example2() {
  let promises = [];
  for (const host of hosts) {
    promises.push(await ping.promise.probe(host)
    //   window.axios.post(`/my-url`, {
    //   myVar: 'myValue'})
    .then(response => {
      // do something with response
      console.log(response.alive);
    })
    )
    // const response = await ping.promise.probe(host);
    // console.log(response.alive);
  }
  Promise.all(promises).then(() => console.log('all done'));
}

example2();

/// Other codes//

// var ping = require('ping');

// var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];
// hosts.forEach(function(host){
//     ping.sys.probe(host, function(isAlive){
//         var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
//         console.log(msg);
//     });
// });