'use strict';

/* eslint-disable no-console */

require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const WebSocket = require('ws');

function deserialize(value) {
  if (typeof value === 'object' && value !== null) {
    switch (value['@t']) {
      case '[[undefined]]':
        return undefined;
      case 'Function': {
        const f = function renameMe() {};
        Object.defineProperty(f, 'name', {
          value: value.data.name,
        });
        return f;
      }
      case 'BigInt':
        return BigInt(value.data.value);
      default:
        break;
    }
    if (Array.isArray(value)) {
      return value.map(deserialize);
    }
    return Object.fromEntries(Object.entries(value)
      .map(([k, v]) => {
        if (typeof k === 'string' && k.startsWith('#') && k.endsWith('@t')) {
          k = k.slice(1);
        }
        return [k, deserialize(v)];
      }));
  }
  return value;
}

const dep = process.env.DEPLOYMENTS;
let _dep = [dep];
if(dep.includes('|')) _dep = new Array().concat(dep.split('|'));
_dep.forEach(function(deployment_id) {
    fetch(`https://pylon.bot/api/deployments/${deployment_id}`, {
    method: 'POST',
    headers: {
        'Authorization': process.env.API_TOKEN,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        script: {
        contents: fs.readFileSync('./dist/bundle.ts', 'utf8'),
        project: {
            files: [{ path: '/main.ts', content: '' }],
        },
        },
    }),
    }).then(r => r.json())
    .then((obj) => {
        //console.log(obj);
        if(typeof(obj['msg']) === 'string') {
            console.error(obj.msg);
            return;
        } else {
            console.log(`Published to ${obj.guild.name} (${obj.guild.id}) successfully (Revision ${obj.revision})! `);
            //workbenchWs(obj.workbench_url);
        }
    })
    /*
    .then(({ workbench_url: workbenchEndpoint }) => {
        console.log('Published!');
        workbenchWs(workbenchEndpoint);
    })*/
    .catch(e => {
        console.log('API KEY IS ' + process.env.API_TOKEN);
        console.error(e);
        process.exit(1);
    });
});