const fs = require('fs')
const ContractTest = artifacts.require('./CareerHash.sol')

module.exports = function (deployer) {
  deployer.deploy(ContractTest)
  .then(() => {
      if(ContractTest._json) {
          fs.writeFile('2_deployedABI', JSON.stringify(ContractTest._json.abi),
            (err) => {
                if(err) throw err;
                console.log("2번째 컨트랙 파일에 ABI 입력 성공");
            }
          )

          fs.writeFile('2_deployedAddress', ContractTest.address,
            (err) => {
                if(err) throw err;
                console.log("2번째 컨트랙 파일에 주소 입력 성공");
            }
        )
      } else{
        console.log("파일에 주소 입력 실패!!!!!!");
      }
  })
}
