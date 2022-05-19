<h1>Simple Farm</h1>

<h3>TLDR</h3>
    defi v1.5 - chainlink keepers based nft rewards for single side farming
<br>
<a href="https://inquisitive-valkyrie-4cfea1.netlify.app/">live app(may or may not be up depending on the free-tier-server uptime) </a>
<br>
<b>
FRONT END IS AWFULLY UGLY SO PLEASE HAVE A BARF-BAG WITH YOU WHEN YOU OPEN THE APP
</b>
<br/>
<h3> Some notes before proceeding
</h3>
<ul>
<li>Code may or may not have bugs(depending on who's reading kek)</li>
<li>The idea of using keepers for automatically distributing is only feasible if a decent revenue is being made</li>
<li>
no front end has been made atm, gonna find the will to do it soon(maybe idk)
</li>
<li>no tests have been written, all of it was manually tested</li>
<li>
most of this was coded on remix(manual testing)
</li>
<li>
</li>
<li>
donot ask why there's a receive and fallback function in the end, it just is.</li>

</ul>
<br/>
<h3>
Spin it up
</h3>
<br/>
<ul>
<li>
considering you have the repo downloaded, use "npm install" in the root folder
</li>
<li>
hardhat config file is likely going to be missing so do initialize it and use 0.8.7 version of solidty
</li>
<li>
I didn't run a chainlink test node locally instead i used rinkeby
</li>
<li>
make sure to register your own keeper with your contract address</li>
<li>
    The current ERC20 address in the deploy script is rinkeby-testnet-dai(0xc3dbf84abb494ce5199d5d4d815b10ec29529ff8), you can change it to another ERC20 if you want
</li>
</ul>

<br/>
<h3>
Constructor args
</h3>
<ul>
<li>ERC20 address that the user will deposit</li>
<li>Time limit after which the keepers will run</li>
<li>NFT address that will be distributed as rewards</li>
</ul>
<br/>
