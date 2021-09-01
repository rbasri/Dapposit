import {ethers} from 'ethers';
import SecurityDeposit from './artifacts/contracts/SecurityDeposit.sol/SecurityDeposit';
import "./index.scss";

//email imports
const emailjs = require("emailjs-com");
const user_token = 'user_R5pRJFKMbFVOqLbK12aqN';
const template_id = 'template_nip7fpi';
const service_id = 'service_9e3myms';


let connected = false;
let provider;
let signer;
let contractId=0;

document.getElementById("deploy").addEventListener("click", newContract);
document.getElementById("retrieve").addEventListener("click", async() => {
    loadContract(contractId);
    contractId++;
});

async function loadContract(id){
    if(!connected) await connectWeb3();
    
    //Connect to existing smart contract with user-supplied address
    const address = document.getElementById("address").value;
    const contract = new ethers.Contract(address, SecurityDeposit.abi, signer);
    
    //Get variables from the contract
    const tenant = await contract.tenant();
    const landlord = await contract.landlord();
    const amount = await provider.getBalance(address);
    const unlockDateSeconds = await contract.getTransferDate();
    const unlockDate = new Date(unlockDateSeconds.toNumber()*1000);
    
    //Add the new contract to HTML
    const container = document.getElementById("contractContainer");
    container.insertAdjacentHTML("beforeend", `
        <div class="existing-contract" id="${id}">
            <ul className="fields">
            <li>
                <div> Tenant Address: </div>
                <div> ${tenant} </div>
            </li>
            <li>
                <div> Landlord Address: </div>
                <div> ${landlord} </div>
            </li>
            <li>
                <div> Deposited Amount: </div>
                <div> ${ethers.utils.formatEther(amount)} ETH </div>
            </li>
            <li>
                <div> Transfer Date: </div>
                <div> ${unlockDate.toLocaleString()} </div>
            </li>
            <div class="button" id="withdraw">
                Withdraw
            </div>
            <div class="close" id="close-${id}">
                Remove
            </div>
            </ul>
        </div>
    `);

    //Allow user to withdraw funds from a contract
    document.getElementById("withdraw").addEventListener("click", async() => {
        const tx = await contract.withdrawFunds();
        await tx.wait()
    });

    document.getElementById(`close-${id}`).addEventListener("click", () => {
        document.getElementById(id).innerHTML='';
        console.log(id);
    });
}

async function newContract(){
    if(!connected) await connectWeb3();
    const landlord = document.getElementById("landlord").value;
    const value = ethers.utils.parseEther(document.getElementById("amount").value);
    const tenantEmail = document.getElementById("tenant-email").value;
    const landlordEmail = document.getElementById("landlord-email").value;

    const factory = new ethers.ContractFactory(SecurityDeposit.abi, SecurityDeposit.bytecode, signer);
    const contract = await factory.deploy(landlord, { value });
    await contract.deployed;
    const contractAddr = contract.address;

    //Send users an email letting them know the contract has been deployed and wher
    const templateParams = {
        tenant_email: tenantEmail,
        landlord_email: landlordEmail,
        address: contractAddr,
        value: ethers.utils.formatEther(value)
    };
    emailjs.send(service_id, template_id, templateParams, user_token);

    const container = document.getElementById("addrContainer");
    container.innerHTML += `Save this deposit address: ${contractAddr}`;
}

async function connectWeb3(){
    try{
        provider = new ethers.providers.Web3Provider(ethereum);
        await ethereum.request({ method: 'eth_requestAccounts' });
        signer = provider.getSigner();
        connected = true;
    }
    catch(err){
        console.log("Couldn't connect with metamask");
    }
}