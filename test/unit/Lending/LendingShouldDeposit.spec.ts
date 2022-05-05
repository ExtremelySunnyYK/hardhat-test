import { assert, expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

export const shouldDeposit = (): void => {
  //   // to silent warning for duplicate definition of Transfer event
  //   ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.OFF);

  context(`#deposit`, async function () {
    it(`Revert if token amount less than 0`, async function () {
        const amount = ethers.constants.Zero;

        // Alice is calling the deposit function
        await expect(this.lending.connect(this.signers.alice)
        .deposit(this.mocks.mockUsdc.address,amount))
        .to.be.revertedWith("NeedsMoreThanZero"); // revert with the proper error message
    });
    it(`should emit proper event`, async function () {
        const amount : BigNumber = ethers.constants.One;

        await expect(this.lending.connect(this.signers.alice).deposit(this.mocks.mockUsdc.address,amount)).to.emit(this.lending, "Deposit");
        
        // await with argument
        await expect(this.lending.connect(this.signers.alice)
        .deposit(this.mocks.mockUsdc.address,amount))
        .to.emit(this.lending, "Deposit").withArgs(this.signers.alice.address, this.mocks.mockUsdc.address, amount);

      })
    it(`should update storage variable properly`, async function () {
        const previousAccountToTokenDeposits : BigNumber = await this.lending.s_accountToTokenDeposits(this.signers.alice.address, 
          this.mocks.mockUsdc.address);
          console.log(previousAccountToTokenDeposits);

        const amount : BigNumber = ethers.constants.One;
        await this.lending.connect(this.signers.alice).deposit(this.mocks.mockUsdc.address,amount);
        const currentAccountToTokenDeposits : BigNumber = await this.lending.s_accountToTokenDeposits(this.signers.alice.address,
          this.mocks.mockUsdc.address);
          console.log(currentAccountToTokenDeposits);

          
        assert(currentAccountToTokenDeposits.toBigInt() == previousAccountToTokenDeposits.add(amount).toBigInt()
        ,"New value should equal prev plus amount"); //using add due to big number
        
      })


    //it.only runs the current test
  });
};
