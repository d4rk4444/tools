import Web3 from 'web3';
import { abiToken, abiGalaxy } from './abi.js';
import { request, gql, GraphQLClient } from 'graphql-request';


//GALAXY
export const getClaimNFT = async(campaignID, address) => {
    const graphQLClient = new GraphQLClient('https://graphigo.prd.galaxy.eco/query');
    const query = gql`
        mutation claim {
            prepareParticipate(
                input: {signature: "", campaignID: "${campaignID}", address: "${address}"}
            ) {
                allow
                disallowReason
                signature
                spaceStation
                mintFuncInfo {
                    cap
                    powahs
                    verifyIDs
                    nftCoreAddress
                }
            }
        }
    `;
    const result = await graphQLClient.request(query);

    return result;
}

export const callClaimOAT = async(campaignID, address) => {
    const graphQLClient = new GraphQLClient('https://graphigo.prd.galaxy.eco/query');
    const query = gql`
        mutation claim {
            prepareParticipate(input: {
            signature:  ""
            campaignID: "${campaignID}"
            address:    "${address}"
            }) {
                allow              # Is allow user claim nft
                disallowReason     # Disallow reason
            }
        }
    `;
    const result = await graphQLClient.request(query);

    return result;
}

export const dataClaimNFT = async(rpc, powahs, verifyIDs, nftCoreAddress, signature, contractAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contract = new w3.eth.Contract(abiGalaxy, w3.utils.toChecksumAddress(contractAddress));

    const data = await contract.methods.claim(
        powahs,
        nftCoreAddress,
        verifyIDs,
        powahs,
        signature
    ).encodeABI();

    return data;
}

//OPTIMISM NFT
export const dataClaimFreeNFT = async(rpc, type) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contract = new w3.eth.Contract(abiGalaxy, w3.utils.toChecksumAddress(chainContract.Optimism.FreeNFTOpt));

    const data = await contract.methods.mintToken(
        type
    ).encodeABI();

    return data;
}