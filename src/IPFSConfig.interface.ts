export interface IPFSNetworkConfiguration {
  repo: string;
  config: {
    Addresses: {
      Swarm: string[];
      API: string;
      Gateway: string;
      RPC: string;
    };
    Bootstrap: any[]
  }
}
