import React, { useState, useEffect } from "react";
import "./TokenPrices.css";
import eViralLogo from "../img/eViralLogo2.png";
import beViralLogo from "../img/beviral.png";
//import { Moralis } from 'moralis';
import { useMoralis } from "react-moralis";

import Logo from "../img/vceth.png";
import LogoBSC from "../img/vcbsc.png";

function TokenPrices() {
  const { isInitialized, Moralis } = useMoralis();

  const [eViralPrice, setEViralPrice] = useState(0);
  const [beViralPrice, setBEViralPrice] = useState(0);
  const init = 0;

  const getPrices = async () => {
    // const options1 = {
    //     address: "0x7cec018ceef82339ee583fd95446334f2685d24f",
    //     chain: "bsc",
    //     exchange: "pancakeswap-v2"
    // };
    // const bscPrice = await Moralis.Web3API.token.getTokenPrice(options1);
    // const beViral = bscPrice.usdPrice.toFixed(10);
    // console.log(`beViral: ${beViral}`)
    // setBEViralPrice(beViral);
    const options2 = {
      address: "0x56A5D6a4a78af419ae83c2a58D9a2cAaB28C5E60",
      chain: "eth",
      exchange: "uniswap-v2",
    };
    const ethPrice = await Moralis.Web3API.token.getTokenPrice(options2);
    const eViral = ethPrice.usdPrice.toFixed(10);
    console.log(`eViral: ${eViral}`);
    setEViralPrice(eViral);
  };

  useEffect(() => {
    if (isInitialized) {
      getPrices();
    }
  }, [isInitialized]);

  return (
    <div className="tokenPrices">
      <div className="tokenPrices-wrapper">
        <div className="token-price">
          <img id="viralToken" src={Logo} />${eViralPrice}
        </div>
        {/* <div className="token-price">
                        <img id="viralToken" src={LogoBSC}/>${beViralPrice}
                    </div> */}
      </div>
    </div>
  );
}

export default TokenPrices;
