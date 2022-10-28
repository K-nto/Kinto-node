import cron from 'node-cron';
import axios, {AxiosResponse} from 'axios';
import {exit} from 'process';
import {Configuration} from './nodeConfiguration.interface';
import {IPFSNetworkConfiguration} from './IPFSConfig.interface';
import * as IPFS from 'ipfs';
import path from 'path';
import os from 'os';
import logger from 'node-color-log';
import fs from 'fs';

const configurationsJson = JSON.parse(
  JSON.stringify(fs.readFileSync('./node_configuration.json'))
);
if (!configurationsJson) {
  logger.error(' NO CONFIGURATION FILE');
  exit();
}

const configuration: Configuration = configurationsJson;

/**
 * @name registerNode
 * @description Sends request to register node into kinto node storage service.
 * @returns Registered Node Id
 */
const registerNode = async (): Promise<string> => {
  logger.info(' Registering node');
  try {
    const url =
      configuration.nodeServiceURL +
      '/users/' +
      configuration.wallet +
      '/nodes';

    const response: AxiosResponse = await axios.post(url, {
      storage: configuration.contributedSpace,
    });
    logger.log(
      '[INFO] Node registered successfuly, entity id: ',
      response.data.entityId,
      ' - node: ',
      response.data
    );

    return response.data.entityId;
  } catch (error: any) {
    logger.error('', error.message);
  }
  return '';
};

/**
 * @name sendStatus
 * @description  send status to kinto node storage service.
 * @param (kintoNodeID) node id
 */
const sendStatus = async (kintoNodeID: string): Promise<void> => {
  logger.info(' Sending update...');
  try {
    const url =
      configuration.nodeServiceURL +
      '/users/' +
      configuration.wallet +
      '/nodes/' +
      kintoNodeID;

    const response: AxiosResponse = await axios.patch(url);

    logger.debug('] Node updated successfuly:', response.data);
  } catch (error: any) {
    logger.error('', error);
  }
};

/**
 * @name getIpfsConfiguration
 * @description gets ipfs configuration from kinto node service.
 * @param
 * @returns Kinto ipfs network configs
 */
const getIpfsConfiguration = async (): Promise<IPFSNetworkConfiguration> => {
  logger.info('getting IPFS Configuration');
  try {
    const url =
      configuration.nodeServiceURL +
      '/users/' +
      configuration.wallet +
      '/nodes/ipfs';

    const response: AxiosResponse = await axios.get(url);
    logger.debug('Fetched configuration successfuly');

    return response.data;
  } catch (error: any) {
    logger.error(error.message);
  }
  return {
    Addresses: {
      Swarm: [],
      API: '',
      Gateway: '',
      RPC: '',
    },
  };
};

logger.log(
  '                                                                                \n                            /////                                               \n          /////     /////   /////                       ,//                     \n          /////    /////                              /////                     \n          /////   /////     /////   //// ////////   //////////    //////////    \n          ///////////       /////    //////  /////    /////     /////   /////   \n          /////  /////      /////    /////   /////    /////     ////*   *////.  \n          ////*.../////.    /////    /////   /////    /////     /////   *////   \n    ...,,,,,,,,,,,,,/////   /////.   /////   /////    /////,.,. ////// ,/////   \n .,.,,,,,,,,,,,,,,,,,(/////,,//////,,/////,,,/////,,,,,////////,,,/////////,,.  \n    .,,,,,,,,,,,,,,,,,,,,,                                                       \n      .,,,,,,,,,,,.                                                           \n                 \n'
);

let setup = true;
let nodeId = configuration.entityId;

let isNetworkConfigured = false;
let ipfsNetworkConfiguration: IPFSNetworkConfiguration;

const repoDir = path.join(os.tmpdir(), `repo-1`);

IPFS.create({
  repo: repoDir,
  config: {
    Addresses: {
      Swarm: [`/ip4/0.0.0.0/tcp/0`, `/ip4/127.0.0.1/tcp/0/ws`],
      API: `/ip4/127.0.0.1/tcp/0`,
      Gateway: `/ip4/127.0.0.1/tcp/0`,
      RPC: `/ip4/127.0.0.1/tcp/0`,
    },
    Bootstrap: [],
  },
}).then(() => {
  // Schedule tasks to be run on the server.
  cron.schedule('* * * * *', async () => {
    if (!isNetworkConfigured) {
      isNetworkConfigured = true;
      ipfsNetworkConfiguration = await getIpfsConfiguration();
    }

    if (setup) {
      setup = false;
      nodeId = configuration.entityId
        ? configuration.entityId
        : await registerNode();
      logger.debug('Wallet: ', configuration.wallet);
      logger.debug('Node Id: ', nodeId);

      logger.info('[START] Kinto node service running...');
    }
  });
});
