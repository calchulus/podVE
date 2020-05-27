## PodVE

Using Pool Together Pods to provide an alternative approach to better stable interest rate loans.

**Closing the Stable Spread**

On May 26th at roughly 12PM UTC time, the spread between stable and variable rates for stablecoins on Aave ranged from 1.72% on USDT and 1.82% on USDC to 11.78% for TUSD and 12.19 for sUSD. Even compared to the 30 day average rates, only Tether’s stable rate  was within the ballpark of its last 30 days; for TUSD and BUSD, the spread between the average was 7 and 11.5%, respectively. This spread makes it very unattractive to lock in a stable rate for a longer term.

In reality, locking in stable rates for a longer time **_should be_** more expensive - it’s like buying insurance against rate volatility for a longer term - the longer the term, the more likely it can be exercised. However, if priced too high, it will stay underused.

Meanwhile, PoolTogether has introduced the “Pod” feature, allowing users to pool their shares together to increase the chance of payout, splitting the winnings with other Pod members.

PoolTogether pools operate daily and weekly rounds to distribute interest winnings, which essentially act as “fixed term” lending products, as users cannot withdraw early their tickets from the pool they enter.

Thus, these pools act as the perfect “other side of the market” to help create a new Aave product: **fixed term stable rates.**

**Introducing Fixed Term Stable Rates**

Fixed Term Stable Rates can come in two varieties: 



1. **Fixed obligation** to borrow, in which the borrower is on the hook for the estimated interest rate over the entire borrow duration, so pre-payment in effect will give the user no benefit - they would be better off supply the same asset as a lender to Aave until their payment period.
2. **Option to borrow**, in which a user pays a premium to lock in this interest rate, which can be exercised for any time within this fixed period. While this option is more useful for the end user, it creates an issue of **maturity mismatch**, in we are already obligated to pay out interest to the fixed term lenders on Pool Together, that if a user only pays a fee and borrows for a portion of the pool period, it could cause the interest to drop for those locked in to lending via the pool. Thus, in this implementation, we will match the Pool deposit rounds with fixed obligation borrowing. In the future, we can explore further on how to create a fee structure and prepayment penalty that may compensate for this flexibility to the borrower.

Since PoolTogether has daily and weekly pools, we go on to construct matching term length loans via Aave.

Additionally, if Pools accept aTokens as collateral, you can guarantee that these tokens will not be clawed back during the duration of the round because it acts like a fixed term lend, so you know a portion of the total available liquidity is fixed. This improves the usability of Aave for those who are reliant on variable rates.

**Higher Yields For Pool Participants**

If stable yields are strictly higher than variable rewards, and a more robust stable yield system is in place, lenders also stand to benefit, as higher utilization rates means a smaller spread between the lending and borrowing rate. This should attract more users in to the lending pool, as more prizes may be given out. This is particularly synergistic for PoolTogether, as we can incentivze a larger pot for aToken-powered pools as a result.

**Higher Theoretical  LTVs**

To incentivize users to try out this feature, fixed term borrows can also have lower overcollateralization rates (higher LTV) than open ended borrows. This is due to the difference between an American option and a European option - with a fixed term obligation to borrow, it does not matter if a loan is undercollateralized at some point within the period, as long as the collateral value returns to above the collateralization rate at the end of the period, the user has an incentive to pay back the loan and reclaim his valuable collateral. In an open CDP position where the user has no fixed term borrow,, if at any point in time his collateral is worth less than his asset, he should use his borrowed money to buy more of the collateral he is losing in the CDP, and walk away with still a profit. This is not possible to exercise during the duration of the fixed borrow. This also means that under this model, more volatile assets, such as non-stablecoins, may also participate in this model.

With 13.3 second average block times currently on Ethereum, we can create a 6500block Day and a 45500 block week in which a user locks in the borrow rate for this period of time. 

**Fees**

Current, there’s a 0.25% percent fixed borrow fee, and there’s a 0.09% fee for flash loans.

Initially, we propose a fixed 0.15% fee, somewhere in between these two, as fixed term loans last longer than flash loans but should be cheaper to execute than flexible borrow times - we can call them “Thunder loans”, as thunder comes after the flash of lightning. This flat fee for both daily and weekly borrows can incentivize more users to pick weekly borrows (a less regressive cost), which creates a longer, more stable borrow for the ecosystem and the utilization rate. Better predictability of utilization rates and consequently variable rates can be a positive externality that entices more people into the world of defi overall.

An additional optional variable to adjust is the max cap of how much capital may be borrowed at these fixed rates, either per address, or totally across each cycle. If there’s more demand, you can structure multiple pods or multiple tranches.

**Future applications**

For uniswap or Bancor Liquidity Providers, there could be LP pools that offer a higher than pool weight for those who remain in the pool for longer terms. Then, they can also match with fixed term borrows through this system.

With the difference between the daily and the weekly borrows, there’s also a second class of borrows that can be created, which are conditional statements to create an asset that is flexible for the first day, and then turned into a fixed term for 6 day if the user doesn’t cancel. This allows users to maintain 1 day in which they can “early cancel”, but then earn the higher interest for 6/7 of the week. This type of flexibility may attract more users to participate.

Borrowers could also signal **preorder** liquidity for future pool periods by putting down some prepayment deposit, in order to get a discount rebate after successfully borrowing - then other parties who want to project for longer term investments can lend in anticipation and vice versa. This should also help increase the payout for any future PoolTogether rounds as well.
