import cron from 'node-cron';
import axios, {AxiosResponse} from 'axios';

import {exit} from 'process';
import {Configuration} from './nodeConfiguration.interface';
import fs from 'fs';

const nodeConfiguration: Configuration = JSON.parse(
  fs.readFileSync('./node_configuration.json', 'utf8')
);

if (!nodeConfiguration) {
  console.log('[ERROR] NO CONFIGURATION FILE');
  exit();
}

const BASE_URL = 'http://144.22.182.162:3001'; 
const registerNode = async (): Promise<string> => {
  console.log('[INFO] Registering node');
  try {
    const url = BASE_URL + '/users/' + nodeConfiguration.wallet + '/nodes';

    const response: AxiosResponse = await axios.post(url, {
      storage: nodeConfiguration.storageSize,
    });
    console.log(
      '[INFO] Node registered successfuly, entity id: ',
      response.data.entityId,
      ' - node: ',
      response.data
    );

    return response.data.entityId;
  } catch (error: any) {
    console.log('[ERROR]', error.message);
  }
  return '';
};

const sendStatus = async (kintoNodeID: string): Promise<void> => {
  console.log('[INFO] Sending update...');
  try {
    const url =
      BASE_URL + '/users/' + nodeConfiguration.wallet + '/nodes/' + kintoNodeID;

    const response: AxiosResponse = await axios.patch(url);

    console.log('[DEBUG] Node updated successfuly:', response.data);
  } catch (error: any) {
    console.log('[ERROR]', error);
  }
};

console.log(
  '                                                                                \n                            /////                                               \n          /////     /////   /////                       ,//                     \n          /////    /////                              /////                     \n          /////   /////     /////   //// ////////   //////////    //////////    \n          ///////////       /////    //////  /////    /////     /////   /////   \n          /////  /////      /////    /////   /////    /////     ////*   *////.  \n          ////*.../////.    /////    /////   /////    /////     /////   *////   \n    ...,,,,,,,,,,,,,/////   /////.   /////   /////    /////,.,. ////// ,/////   \n .,.,,,,,,,,,,,,,,,,,(/////,,//////,,/////,,,/////,,,,,////////,,,/////////,,.  \n    .,,,,,,,,,,,,,,,,,,,,,                                                       \n      .,,,,,,,,,,,.                                                           \n                 \n'
);

let setup = true;
let nodeId = nodeConfiguration.entityId;

// Schedule tasks to be run on the server.
cron.schedule('* * * * *', async () => {
  if (setup) {
    setup = false;
    nodeId = nodeConfiguration.entityId
      ? nodeConfiguration.entityId
      : await registerNode();
    console.log('[SETUP] Wallet: ', nodeConfiguration.wallet);
    console.log('[SETUP] Node Id: ', nodeId);

    console.log('[START] Kinto node service running...');
  }

  sendStatus(nodeId);
});
