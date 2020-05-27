import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import PoolV2ABI from '@pooltogether/pooltogether-contracts/abis/BasePool.json'

const pt = require('pooltogetherjs')

let provider = ethers.getDefaultProvider()

// Mainnet Dai Pool v2 Contract:
const contractAddress = '0x29fe7D60DdF151E5b52e5FAB4f1325da6b2bD958'

const USDCcontractAddress = '0x0034Ea9808E620A0EF79261c51AF20614B742B24'

// v2 Pool Contract ABI from '@pooltogether/pooltogether-contracts':
const abi = PoolV2ABI

const contract = new ethers.Contract(
  contractAddress,
  abi,
  provider
)


const usdcContract = new ethers.Contract(
  USDCcontractAddress,
  abi,
  provider
)



const contractDataEffect = async () => {
  const accountedBalance = await contract.accountedBalance()

  // Balance is a non-constant function (more on this here: https://docs.ethers.io/ethers.js/html/api-contract.html)
  // so we need to craft the call data manually
  const balanceCallData = contract.interface.functions.balance.encode([])
  
  const result = await provider.call({ to: contract.address, data: balanceCallData })
  const balance = contract.interface.functions.balance.decode(result)
  console.log("YO " + balance/1e18)
  // const supplyRatePerBlock = contract.interface.functions.supplyRatePerBlock.decode(result);
  // We need the current draw ID to get the current Draw data
  const currentOpenDrawId = await contract.currentOpenDrawId()
  const currentDraw = await contract.getDraw(currentOpenDrawId)

  const usdcaccountedBalance = await usdcContract.accountedBalance() 
  const usdcBalanceCallData = usdcContract.interface.functions.balance.encode([])
  const usdcresult = await provider.call({ to: usdcContract.address, data: usdcBalanceCallData })
  const usdcbalance = usdcContract.interface.functions.balance.decode(usdcresult)
  console.log("YO " + usdcbalance/1e6)
  const currentusdcOpenDrawId = await usdcContract.currentOpenDrawId()
  const usdcCurrentDraw = await contract.getDraw(currentusdcOpenDrawId)

  return {
    balance,
    accountedBalance,
    currentDraw,
    usdcbalance,
    usdcaccountedBalance,
    usdcCurrentDraw

  }
}



export default function Home() {
  const [data, setData] = useState({})

  useEffect(() => {
    const getData = async () => {
      const data = await contractDataEffect()
      setData(data)
    }
    getData()
  }, [])

  const {
    balance,
    accountedBalance,
    currentDraw,
    usdcbalance,
    usdcaccountedBalance,
    usdcCurrentDraw
  } = data


  let prize = ethers.utils.bigNumberify(0)
  let total_deposits = ethers.utils.bigNumberify(0)
  if (balance) {
    total_deposits = balance
    prize = pt.utils.calculatePrize(
      balance,
      accountedBalance,
      currentDraw.feeFraction
    )
  }


  let prizeUSDC = ethers.utils.bigNumberify(0)
  let total_depositsUSDC = ethers.utils.bigNumberify(0)
  if (usdcbalance) {
    total_depositsUSDC = usdcbalance
    prizeUSDC = pt.utils.calculatePrize(
      usdcbalance,
      usdcaccountedBalance,
      usdcCurrentDraw.feeFraction
    )
  }



  let remainingBlocks = ethers.utils.bigNumberify(0)
  let days = ethers.utils.bigNumberify(0)
  if (balance) {
    const awardAtMs = Date.parse('29 May 2020 12:00:00 PST');
    const remainingTimeS = (awardAtMs - (new Date()).getTime()) / 1000
    days = remainingTimeS /60/60/24 
    remainingBlocks = Math.round(remainingTimeS / 15)
     // about 15 second block periods
    // const blockFixedPoint18 = ethers.utils.parseEther(remainingBlocks) 
  }

  return (
    <div
      className="container"
      style={{
        background: 'rgb(131,58,180)',
        background: ' linear-gradient(45deg, rgba(29,253,203,1) 0%, rgba(131,58,180,1) 100%)',
        // padding: 100%,
        color: '#fff',
        padding: 100,
        fontFamily: 'Arial',
      }}
    >
   <div style= {{fontSize: 80}}>
PodVE - Fixed Borrow Dashboard
<hr />
</div>
      <div   style={{
          fontSize: 30
        }}>

          Please wait a moment for the data to load from PoolTogetherJs :) 

          <br />
      Total interest-bearing DAI Deposited (Fixed Borrow Limit)
      <br />
      {ethers.utils.formatUnits(total_deposits.toString(), 18)}  
      <br /> 
      Total interest-bearing USDC Deposited (Fixed Borrow Limit)
      <br />
      {ethers.utils.formatUnits(total_depositsUSDC.toString(), 6)}  
      <br />
      Days Until Next Weekly Borrow Period
      <br />
      { days.toString() }
      <br />
     Blocks Until Borrow Period
     <br />
       { remainingBlocks.toString() }
 <br />

   Current Fixed Borrow DAI Claimed
   <br />
   0 /  {ethers.utils.formatUnits(total_deposits.toString(), 18)}  

   <br />
   Current Fixed-DAI Utilization Rate  
   <br />
   0%
   <br />
   Current Fixed Borrow USDC Claimed
   <br />
   0 / {ethers.utils.formatUnits(total_depositsUSDC.toString(), 6)}   
   


   <br />
   Current Fixed-DAI Utilization Rate  
   <br />
   0%

 
      </div>

         <div
        style={{
          fontSize: 30
        }}
      >
        Current Value of Weekly Prize In DAI:
        <br />
        {ethers.utils.formatUnits(prize.toString(), 18)}  
<br />
Current Value of Daily Prize In USDC:
        <br />
        {ethers.utils.formatUnits(prizeUSDC.toString(), 6)}  

      </div>
      
    </div>
  )
}
