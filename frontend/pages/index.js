import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useProvider, useSigner, useAccount } from "wagmi";
import React, { useState, useEffect } from "react";
import {
  getCurrentHighestBid,
  getCurrentHighestBidder,
  bidsStore,
  getCurrentWeek,
} from "../utils/readFunction";
import { bidNft, mint, withdrawBid } from "../utils/bidNft";
import { BigNumber, ethers, utils } from "ethers";

export default function Home({ initialDate }) {
  const web3Provider = useProvider();
  const { data: signer } = useSigner();
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [currentHighestBidder, setCurrentHighestBidder] = useState(null);
  const [currentHighestBid, setCurrentHighestBid] = useState(null);
  const [bidAmount, setBidAmount] = useState(null);

  const [bids, setBids] = useState([]);
  const { isConnected, isDisconnected, address } = useAccount();
  const [date, setDate] = useState(null);
  const [weeksLeft, setWeeksLeft] = useState(12);
  const [currentTime, setCurrentTime] = useState(1);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [countDown, setCountDown] = useState(false);
  const [alerts, setAlerts] = useState({ show: false, type: "", msg: "" });

  const showAlert = (show = false, type = "", msg = "") => {
    setAlerts({ show, type, msg });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      showAlert();
    }, 4000);
    return () => {
      clearTimeout(timeout);
    };
  }, [alerts.show]);

  const setReadFunctions = async () => {
    try {
      const _currentWeek = await getCurrentWeek(web3Provider);
      const _bids = await bidsStore(signer);
      const _currentHighestBid = await getCurrentHighestBid(web3Provider);
      const _currentHighestBidder = await getCurrentHighestBidder(web3Provider);

      setCurrentWeek(_currentWeek + 1);
      setCurrentHighestBid(
        utils.formatEther(
          _currentHighestBid).toString());
      setBids(_bids);

      const start = _currentHighestBidder.slice(0, 5);
      const end = _currentHighestBidder.slice(
        _currentHighestBidder.length - 5,
        _currentHighestBidder.length - 0
      );

      const result = start + "...." + end;

      setCurrentHighestBidder(result);
    } catch (err) {
      console.error(err);
    }
  };

  const _mintToHighestBidder = async () => {
    try {
      if (currentTime <= 0) {
        showAlert(true, "success", "processing");
        setLoading(true);

        await mint(signer);
        await setReadFunctions();

        setLoading(false);
        setCurrentTime(1);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        setCountDown(false);
        setWeeksLeft(weeksLeft - 1);
        showAlert(
          true, 
          "success", 
          "Nft Minted To HighestBidder"
          );
      } else {
        showAlert(true, "danger", "Too Early To Mint");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const _withdrawBid = async () => {
    try {
      showAlert(true, "success", "processing");
      setLoading(true);

      await withdrawBid(signer);

      setLoading(false);
      showAlert(true, "success", "Bid Withdrawn");
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const _bidNft = async () => {
    try {
      if (currentTime > 0) {
        const startingBid = utils.parseEther("0.0051");
        const _bidAmount = utils.parseEther(bidAmount).toString();

        if (_bidAmount >= startingBid && _bidAmount > currentHighestBid) {
          showAlert(true, "success", "processing");
          setLoading(true);

          await bidNft(_bidAmount, signer);
          await setReadFunctions();

          setCountDown(true);
          setLoading(false);
          showAlert(true, "success", "You have successfully placed a bid");
        } else {
          showAlert(true, "danger", "Your bid is under nft current value");
        }
      } else {
        showAlert(true, "danger", "Bid ended, Come back next week");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    if (countDown) {
      const timer = setInterval(() => {
        const secondsLeft =
          weeksLeft * 7 * 24 * 60 * 60 +
          timeLeft.days * 24 * 60 * 60 +
          timeLeft.hours * 60 * 60 +
          timeLeft.minutes * 60 +
          timeLeft.seconds -
          1;

        setCurrentTime(secondsLeft);
        if (secondsLeft <= 0) {
          clearInterval(timer);
        } else {
          setTimeLeft({
            days: Math.floor(
              (secondsLeft % (7 * 24 * 60 * 60)) / (24 * 60 * 60)
            ),
            hours: Math.floor((secondsLeft % (24 * 60 * 60)) / (60 * 60)),
            minutes: Math.floor((secondsLeft % (60 * 60)) / 60),
            seconds: secondsLeft % 60,
          });
        }
      }, 1000);
      return () => clearInterval(timer);
    } else {
    }
  }, [timeLeft, countDown]);

  useEffect(() => {
    setTimeout(() => {
      setDate(initialDate);
    }, 5000);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isConnected) {
      setReadFunctions();
    }
  }, [isConnected]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="connect-btn">
          <ConnectButton showBalance={false} chainStatus="full" />
        </div>

        <div className="alert-sec1">
          {alerts.show && (
            <p className={`alert1 alert-${alerts.type}`}>{alerts.msg}</p>
          )}
        </div>

        <div className="container timelesscontainer">
          <div className="timecontainer">
            <div className="headingtitle">
              <div className="landing">
                <span>T</span>
                <span>i</span>
                <span>m</span>
                <span>e</span>
                <span>l</span>
                <span>e</span>
                <span>s</span>
                <span>s</span>
                <span className="br"></span>
                <span>N</span>
                <span>f</span>
                <span>t</span>
              </div>

              {date ? <p>{date.toLocaleString()}</p> : <p>Loading...</p>}
              <p>Weeks Left: {weeksLeft}</p>
            </div>

            <div className="timesection">
              <p>Time left:</p>
              <p>{timeLeft.days} days</p>
              <p>{timeLeft.hours} hours</p>
              <p>{timeLeft.minutes} minutes</p>
              <p>{timeLeft.seconds} seconds</p>
            </div>

            <div className="bidderinfo">
              <p>
                current Highest Bid: Eth{" "}
                <small className="bidsmall">{currentHighestBid}</small>{" "}
              </p>
              <p>
                current Highest Bidder:{" "}
                <small className="bidsmall">{currentHighestBidder}</small>{" "}
              </p>
              <p>
                current week: <small className="bidsmall">{currentWeek}</small>{" "}
              </p>
            </div>

            {currentTime <= 0 ? (
              <div className="mintbtn">
                <small>Mint To Highest Bidder</small>
                <button onClick={_mintToHighestBidder} className="btn mint">
                  "Mint"
                </button>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="bidsection">
            <div className="bidcenter">
              <p>place bid: </p>
              <input
                type="number"
                placeholder={`Bid ${
                  currentHighestBid > 0 ? currentHighestBid + 1 : "0.0051"
                } or More`}
                onChange={(e) => setBidAmount(e.target.value)}
              />
              <button type="submit" onClick={_bidNft} className="btn">
                "Place Bid"
              </button>
            </div>

            <div className="withdrawbtn">
              <small>If Not Highest Bidder You Can Withdraw Your Bid</small>
              <button onClick={_withdrawBid} className="btn withdraw-btn">
                "withdrawBid"
              </button>
            </div>
          </div>

          <div className="bids">
            <ul>
              <p>all bids</p>

              {bids ? (
                bids.map((bid, id) => (
                  <li key={id} className="bidssmall">
                    <small>
                      Bidder: <small>{bid.Bidder}</small>{" "}
                    </small>
                    <small>
                      NFT ID: <small>{bid.nftId}</small>{" "}
                    </small>
                    <small>
                      Bid: <small>{utils.formatEther(bid.Bid)}</small>
                    </small>
                  </li>
                ))
              ) : (
                <li>
                  <small>NFT ID:</small>
                  <small>Time:</small>
                  <small>Bidder:</small>
                  <small>Bid:</small>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="newunderline">
          <p>
            donate to dev{" "}
            <small>0xfe2521C82baD4316435aF559C54cC3b0b8D9DBF3</small>
          </p>
        </div>
      </main>
    </>
  );
}

Home.getInitialProps = async () => {
  const initialDate = new Date();
  return { initialDate };
};
