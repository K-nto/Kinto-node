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

const nodeConfiguration: Configuration = JSON.parse(
  fs.readFileSync('./node_configuration.json', 'utf8')
);
if (!nodeConfiguration) {
  logger.error(' NO CONFIGURATION FILE');
  exit();
}

/**
 * @name registerNode
 * @description Sends request to register node into kinto node storage service.
 * @returns Registered Node Id
 */
const registerNode = async (): Promise<string> => {
  logger.info(' Registering node');
  try {
    const url =
      nodeConfiguration.nodeServiceURL +
      '/users/' +
      nodeConfiguration.wallet +
      '/nodes';

    const response: AxiosResponse = await axios.post(url, {
      storage: nodeConfiguration.contributedSpace,
    });
    logger.info(
      'Node registered successfuly, entity id: ',
      response.data.entityId,
      ' - node: ',
      response.data
    );

    return response.data.entityId;
  } catch (error: any) {
    logger.error('Register Node - ', error.message);
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
      nodeConfiguration.nodeServiceURL +
      '/users/' +
      nodeConfiguration.wallet +
      '/nodes/' +
      kintoNodeID;

    const response: AxiosResponse = await axios.patch(url);

    logger.debug('] Node updated successfuly:', response.data);
  } catch (error: any) {
    logger.warn('Send status failed -', error);
  }
};

/**
 * @name getIpfsConfiguration
 * @description gets ipfs configuration from kinto node service.
 * @param
 * @returns Kinto ipfs network configs
 */
const getIpfsConfiguration = async (): Promise<IPFSNetworkConfiguration> => {
  logger.info('getting IPFS Configuration...');
  try {
    const url =
      nodeConfiguration.nodeServiceURL +
      '/users/' +
      nodeConfiguration.wallet +
      '/nodes/ipfs';

    const response: AxiosResponse = await axios.get(url);
    logger.debug('Fetched configuration successfuly');

    return response.data;
  } catch (error: any) {
    logger.warn('get ipfs configuration - ', error.message);
  }
  logger.debug('Using default ipfs network configuration');
  return {
    Addresses: {
      Swarm: [`/ip4/0.0.0.0/tcp/0`, `/ip4/127.0.0.1/tcp/0/ws`],
      API: `/ip4/127.0.0.1/tcp/0`,
      Gateway: `/ip4/127.0.0.1/tcp/0`,
      RPC: `/ip4/127.0.0.1/tcp/0`,
    },
  };
};

logger.log(
  '                                                                                \n                            /////                                               \n          /////     /////   /////                       ,//                     \n          /////    /////                              /////                     \n          /////   /////     /////   //// ////////   //////////    //////////    \n          ///////////       /////    //////  /////    /////     /////   /////   \n          /////  /////      /////    /////   /////    /////     ////*   *////.  \n          ////*.../////.    /////    /////   /////    /////     /////   *////   \n    ...,,,,,,,,,,,,,/////   /////.   /////   /////    /////,.,. ////// ,/////   \n .,.,,,,,,,,,,,,,,,,,(/////,,//////,,/////,,,/////,,,,,////////,,,/////////,,.  \n    .,,,,,,,,,,,,,,,,,,,,,                                                       \n      .,,,,,,,,,,,.                                                           \n                 \n'
);

let nodeId = nodeConfiguration.entityId;
const repoDir = path.join(os.tmpdir(), `repo-1`);

getIpfsConfiguration()
  .then(
    async ipfsNetworkConfiguration =>
      await IPFS.create({
        repo: repoDir,
        config: {
          Addresses: ipfsNetworkConfiguration.Addresses,
          Bootstrap: [],
        },
      })
  )
  .then(async () => {
    logger.info('Setting up node...');
    nodeId = nodeConfiguration.entityId ?? (await registerNode());
    logger.debug('Wallet: ', nodeConfiguration.wallet);
    logger.debug('Node: ', nodeId, ' - ', nodeConfiguration.alias);

    logger.info('[START] Kinto node service running...');
    // Schedule tasks to be run on the server.
    cron.schedule('* * * * *', async () => await sendStatus(nodeId));
  });
