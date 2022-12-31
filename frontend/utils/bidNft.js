import { Contract } from "ethers";
import { smartcontractaddress, smartcontractaddressABI } from "../constants";

export const bidNft = async ( amount, signer ) => {
  try {
    const timeLessNftContract = new Contract(
      smartcontractaddress,
      smartcontractaddressABI,
      signer
    );
 
    const tx = 
    await timeLessNftContract.bidNft( 
        {
      value: amount,
        }
    );
    await tx.wait();

  } catch (err) {
    console.error(err);
  }
};

export const withdrawBid = async (signer) => {
  try {
    const timeLessNftContract = new Contract(
      smartcontractaddress,
      smartcontractaddressABI,
      signer
    );

    const tx = 
    await timeLessNftContract.withdrawBid();

    await tx.wait();

  } catch (err) {
    console.error(err);
  }
};


export const mint = async (signer) => {
  try {
    const timeLessNftContract = new Contract(
      smartcontractaddress,
      smartcontractaddressABI,
      signer
    );

    const tx = await timeLessNftContract.mintToHighestBidder();

    await tx.wait();

  } catch (err) {
    console.error(err);
  }
};