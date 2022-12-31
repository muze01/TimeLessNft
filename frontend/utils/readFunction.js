import { smartcontractaddress, smartcontractaddressABI } from "../constants";
import { Contract } from "ethers";

export const getCurrentWeek = async ( provider ) => {
  try {
    const timeLessNftContract = new Contract(
      smartcontractaddress,
      smartcontractaddressABI,
      provider
    );

    const timeLessNftCurrentWeek = await timeLessNftContract.currentWeek();
    return timeLessNftCurrentWeek;
  } catch (err) {
    console.error(err);
  }
};
 
export const getCurrentHighestBidder = async (provider) => {
  try {
    const timeLessNftContract = new Contract(
      smartcontractaddress,
      smartcontractaddressABI,
      provider
    );

    const currentHighestBidder =
      await timeLessNftContract.currentHighestBidder();
    return currentHighestBidder;
  } catch (err) {
    console.error(err);
  }
};

export const getCurrentHighestBid = async (provider) => {
  try {
    const timeLessNftContract = new Contract(
      smartcontractaddress,
      smartcontractaddressABI,
      provider
    );

    const currentHighestBid =
      await timeLessNftContract.currentHighestBid();
    return currentHighestBid;
  } catch (err) {
    console.error(err);
  }
};

export const getBids = async (provider) => {
  try {
    const timeLessNftContract = new Contract(
      smartcontractaddress,
      smartcontractaddressABI,
      provider
    );

    const bid =
      await timeLessNftContract.bidsStore();
    return bid;
  } catch (err) {
    console.error(err);
  }
};

export const bidsStore = async (signer) => {
  try {
    const timeLessNftContract = new Contract(
      smartcontractaddress,
      smartcontractaddressABI,
      signer
    );

    const bid = 
    await timeLessNftContract.getbids();
    return bid;
  } catch (err) {
    console.error(err);
  }
};