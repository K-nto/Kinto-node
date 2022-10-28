<div align="center">

  <img src="resources/Kintoisologo.png" alt="logo" width="200" height="auto" />
  <h1>Kinto Peer Node</h1>
  
  <h5>
    UADE Informatics Engineering thesis project - 2022   
  </h5>

  <p>
    Kinto peer agent for providing resources to the network. 
  </p>
   
<h4>
    <a href="https://github.com/K-nto/Kinto-node/">Documentation</a>
  <span> · </span>
    <a href="https://github.com/K-nto/Kinto-node/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/K-nto/Kinto-node/issues/">Request Feature</a>
  </h4>
</div>

<br />

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  - [Tech Stack](#space_invader-tech-stack)
  - [Features](#dart-features)
- [Getting Started](#toolbox-getting-started)
  - [Prerequisites](#bangbang-prerequisites)
  - [Installation](#gear-installation)
  - [Run Locally](#running-run-locally)
  - [Deployment](#triangular_flag_on_post-deployment)
- [Usage](#eyes-usage)
- [License](#warning-license)
- [Contact](#handshake-contact)
- [Acknowledgements](#gem-acknowledgements)

## :star2: About the Project

This agent is connected to Kinto IPFS network on behalf of a wallet owner and provides resources while providing a Proof of Activity to the Kinto Nodes Service.

### :space_invader: Tech Stack

  <ul>
    <li><a href="https://www.docker.com/">Docker</a></li>
    <li><a href="https://www.hyperledger.org/use/fabric">Hyperledger fabric</a></li>
    <li><a href="https://nodejs.org/">Node</a></li>
    <li><a href="https://redis.io/">Redis</a></li>
    <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
  </ul>

### :dart: Features

- Connects and supports Kinto network
  - Storage: IPFS
  - Blockchain: Hyperlerdger
- Proof of activty

## :toolbox: Setup

### :bangbang: Prerequisites

This project uses node and npm as package manager, make sure it is installed.

```bash
 node -v
 npm -v
```

## :eyes: Usage

Clone the project

```bash
  git clone https://github.com/K-nto/Kinto-node.git
```

Go to the project directory

```bash
  cd Kinto-node
```

Install dependencies

```bash
  npm install
```

Add the `node_configuration.json` file to `Kinto-node` folder , example of configuration file:

- wallet: Identity on behalf to connect.
- Alias: Name of such instance.
- contributedSpace: GB of memory destinated to IPFS network.

```json
{
  "entityId": "01GFC2E2BN91DS8CSKQKSFPWFT",
  "wallet": "asd123",
  "alias": "FE 1",
  "createdDate": "2022-10-14T20:19:40.533Z",
  "contributedSpace": 100
}
```

Start the agent.

```bash
  npm run start
```

## :warning: License

Distributed under the no License. See LICENSE.txt for more information.

<!-- Contact -->

## :handshake: Contact

Federico Javier Parodi - Fedejp - [Linkedin](https://www.linkedin.com/in/fedejp) - [Github](https://github.com/Fedejp)

Carlos Santiago Yanzon - Bizk - [Linkedin](https://www.linkedin.com/in/carlos-santiago-yanzon/) - [Github](https://github.com/bizk)

Project Link: [https://github.com/K-nto](https://github.com/K-nto)

## :gem: Acknowledgements

We thank and aknowledge the authors of these resources for their work.

- [Awesome README](https://github.com/matiassingers/awesome-readme)
- [Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md#travel--places)
- [Readme Template](https://github.com/othneildrew/Best-README-Template)
