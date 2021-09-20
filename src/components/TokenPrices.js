import React, {useState, useEffect} from 'react';
import './TokenPrices.css';
import eViralLogo from "../img/eViralLogo2.png";
import beViralLogo from "../img/beviral.png";
import { Moralis } from 'moralis';
import { useMoralis } from 'react-moralis';

function TokenPrices() {
    const { isInitialized } = useMoralis();


    const [eViralPrice, setEViralPrice] = useState(0);
    const [beViralPrice, setBEViralPrice] = useState(0);
    const init = 0;

    const getPrices = async() => {

        const options1 = {
            address: "0x7cec018ceef82339ee583fd95446334f2685d24f",
            chain: "bsc",
            exchange: "pancakeswap-v2"
        };
        const bscPrice = await Moralis.Web3API.token.getTokenPrice(options1);
        const beViral = bscPrice.usdPrice.toFixed(10);
        console.log(`beViral: ${beViral}`)
        setBEViralPrice(beViral);
        const options2 = {
            address: "0x7cec018ceef82339ee583fd95446334f2685d24f",
            chain: "eth",
            exchange: "uniswap-v2"
        };
        const ethPrice = await Moralis.Web3API.token.getTokenPrice(options2);
        const eViral = ethPrice.usdPrice.toFixed(10);
        console.log(`eViral: ${eViral}`)
        setEViralPrice(eViral);
    }

    useEffect(() => {
        if(isInitialized){
         getPrices();
        }
      }, [isInitialized])



    return (
        
            <div className="tokenPrices">
                <div className="tokenPrices-wrapper">
                    <div className="eViral-price">
                        <img className="eViralLogo" src={eViralLogo}/>${eViralPrice}
                    </div>
                    <div className="beViral-price">
                        <img className="eViralLogo" src={beViralLogo}/>${beViralPrice}
                    </div>
                </div>
            </div>     
        
    )
}

export default TokenPrices