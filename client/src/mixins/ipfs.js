import IPFS from "ipfs-http-client";

// https://github.com/ipfs/js-ipfs-http-client#in-a-web-browser

// const ipfs_node = "https://ipfs.infura.io"
// const ipfs_node = "https://api.ipfs.temporal.cloud";

const ipfs_node = 'http://localhost:5001';

export const ipfs = new IPFS(ipfs_node);

export const ipfs_view = 'http://localhost:1111/ipfs/'; // 'https://ipfs.io/ipfs/',
