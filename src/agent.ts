import cron from 'node-cron';
import axios, {AxiosResponse} from 'axios';
import configurationsJson from '../node_configuration.json';
import {exit} from 'process';
import {Configuration} from './nodeConfiguration.interface';

require('dotenv').config();

if (!configurationsJson) {
  console.log('[ERROR] NO CONFIGURATION FILE');
  exit();
}

const BASE_URL = 'http://144.22.182.162:3001';

const configuration: Configuration =
  configurationsJson as unknown as Configuration;

const registerNode = async (): Promise<string> => {
  console.log('[INFO] Registering node');
  try {
    const url = BASE_URL + '/users/' + configuration.wallet + '/nodes';

    const response: AxiosResponse = await axios.post(url, {
      storage: configuration.storageSize,
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
      BASE_URL + '/users/' + configuration.wallet + '/nodes/' + kintoNodeID;

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
let nodeId = configuration.entityId;

// Schedule tasks to be run on the server.
cron.schedule('* * * * *', async () => {
  if (setup) {
    setup = false;
    nodeId = configuration.entityId
      ? configuration.entityId
      : await registerNode();
    console.log('[SETUP] Wallet: ', configuration.wallet);
    console.log('[SETUP] Node Id: ', nodeId);

    console.log('[START] Kinto node service running...');
  }

  sendStatus(nodeId);
});
