export interface IPFSNetworkConfiguration {
  Addresses: {
    Swarm: string[];
    API: string;
    Gateway: string;
    RPC: string;
  };
}
