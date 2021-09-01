const { assert, expect } = require("chai");
//const { Contract } = require("ethers");
const { ethers } = require("hardhat");
const passTime = (time) => ethers.provider.send('evm_increaseTime', [time]);
const oneWeek = 60 * 60 * 24 * 7;

describe("SecurityDeposit", function () {
  let deposit = ethers.utils.parseEther("1");
  let securityDeposit;
  const tenant = ethers.provider.getSigner(0);
  const landlord = ethers.provider.getSigner(1);

  beforeEach(async () => {
    const SecurityDeposit = await ethers.getContractFactory("SecurityDeposit");
    securityDeposit = await SecurityDeposit.deploy(await landlord.getAddress(), {value: deposit});
    await securityDeposit.deployed();
  });

  it("should be holding the deposit amount", async() => {
    const newBalance = await ethers.provider.getBalance(securityDeposit.address);
    assert(deposit.eq(newBalance));
  });

  it("should not allow the landlord to immediately take out the deposit", async() => {
    await expect(securityDeposit.connect(landlord).withdrawFunds()).to.be.reverted;
  });

  it("should allow the tenant to take back the funds right away", async() => {
    const beforeBalance = await ethers.provider.getBalance(tenant.getAddress());
    await securityDeposit.withdrawFunds();
    const afterBalance = await ethers.provider.getBalance(tenant.getAddress());
    assert(afterBalance.gt(beforeBalance));
  });

  it("should not allow tenant to call withdraw twice", async() => {
    await securityDeposit.withdrawFunds();
    await expect(securityDeposit.withdrawFunds()).to.be.reverted;
  });
  
  it("should not accept more ether after deployed", async() => {
    await expect(tenant.sendTransaction({
      to: securityDeposit.address,
      value: ethers.utils.parseEther("1"),
    })).to.be.reverted;
  });

  describe("after waiting the delay period", function () {
    it("should allow the landlord to withdraw the funds", async() => {
      await passTime(oneWeek*4);
      const beforeBalance = await ethers.provider.getBalance(landlord.getAddress());
      await securityDeposit.connect(landlord).withdrawFunds();
      const afterBalance = await ethers.provider.getBalance(landlord.getAddress());
      assert(afterBalance.gt(beforeBalance));
    });

    it("should not allow the tenant to take back the funds", async() => {
      await passTime(oneWeek*4);
      await expect(securityDeposit.withdrawFunds()).to.be.reverted;
    });

    it("should not allow landlord to call withdraw twice", async() => {
      await passTime(oneWeek*4);
      await securityDeposit.connect(landlord).withdrawFunds();
      await expect(securityDeposit.connect(landlord).withdrawFunds()).to.be.reverted;
    });
  });
});
