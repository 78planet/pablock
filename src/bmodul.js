const Caver = require('caver-js');
const fs = require('fs');
const test = "test3";

const config = {    //환경설정 상수
    rpcURL: 'https://api.baobab.klaytn.net:8651'  //어떤 클레이튼 노드에 연결할지 정의를 한 것 .
  }
// const DEPLOYED_ABI = JSON.stringify(fs.existsSync('../deployedABI') && fs.readFileSync('../deployedABI', 'utf8'));
// const DEPLOYED_ADDRESS = JSON.stringify(fs.existsSync('../deployedAddress') && fs.readFileSync('../deployedAddress', 'utf8'));
const DEPLOYED_ABI = JSON.parse(fs.existsSync('./deployedABI') && fs.readFileSync('./deployedABI', 'utf8'));
const DEPLOYED_ADDRESS = fs.readFileSync('./deployedAddress', 'utf8').replace(/\n|\r/g, "");

const cav = new Caver(config.rpcURL);   //rpcURL을 Caver생성자에 넘겨서 instance화 하는 작업

const agContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS); //bapp내에 쓸 수 있는 전역상수
//   const agContract2 = new cav.klay.Contract(DEPLOYED_ABI_2, DEPLOYED_ADDRESS_2); //bapp내에 쓸 수 있는 전역상수

const Bapp = {

    binforead : function(){ 
        //console.log(DEPLOYED_ABI);
        //console.log(DEPLOYED_ADDRESS);

        //console.log(test);
        return DEPLOYED_ABI;
    },



    getHashCont : function(c_code){
        return new Promise(function(resolve, reject){            
            agContract.methods.getContHash(c_code).call().then(function(name){
                if(name){
                    console.log("bmodul: "+name);  
                    resolve(name);
                }else{
                    console.log("No value in the blockchain");  
                }
                reject(new Error("No value in the blockchain."));
            })
          });
    }
}

exports.getHashCont = Bapp.getHashCont
exports.binforead = Bapp.binforead