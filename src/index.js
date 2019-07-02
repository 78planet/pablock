//클레이튼 블록체인과 소통할 수 있는 caver.js 불러오고 bapp안에서 쓸 수 있도록 instance화 한다.
import Caver from "caver-js";
import {Spinner} from "spin.js";

const config = {    //환경설정 상수
  rpcURL: 'https://api.baobab.klaytn.net:8651'  //어떤 클레이튼 노드에 연결할지 정의를 한 것 .
}

const cav = new Caver(config.rpcURL);   //rpcURL을 Caver생성자에 넘겨서 instance화 하는 작업

const agContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS); //bapp내에 쓸 수 있는 전역상수
const agContract2 = new cav.klay.Contract(DEPLOYED_ABI_2, DEPLOYED_ADDRESS_2); //bapp내에 쓸 수 있는 전역상수

//컨트랙 배포하고 나서 deployedABI와 deployedAddress를 읽어서 전역 상수로 쓸 수 있도록 webpack에서 설정을 한다.
//webpack에서 생성된 전역상수를 통해 값이 넘어 간다.
const PRIVATE_KEY = '0xaf58306cb6c0b347abbe2e4a64592e66ce0f42fc4ddc8f1110e2a783387b9608'    ///비밀키 담는 상수

const App = {
  auth: {   //auth object안에 3가지 타입 
    accessType: 'keystore',   //인증방식 accessType에는 privateType도 있음
    keystore:'',  //keystore파일의 전체 내용을 저장
    password: ''    //keystore파일과 조합되는 비밀번호.
  },

  
  start: async function () {
    // this.callOwner().then(function(contractAddress){
    //     $('#address').append('<br>'+'<p>'+'현재 컨트랙 주소: '+ contractAddress + '</p>');

    // })
    //sessionStorage에 저장된 계정 정보를 불러옴
    

    const walletFromSession = sessionStorage.getItem('walletInstance');
    if(walletFromSession){
      try{
        cav.klay.accounts.wallet.add(JSON.parse(walletFromSession));
        this.changeUI(JSON.parse(walletFromSession));
      }catch(e){
        sessionStorage.removeItem('walletInstance');
      }
    }

  },

  sendData: function() {
    this.integrateWallet(PRIVATE_KEY);
    var spinner;
    const walletInstance = this.getWallet(); //트랜잭션에 필요한 인증된 계정 필요
    if(!walletInstance){
      alert("계정이 없다네..");
      return;
    } 

    var tx,tx2;

    agContract2.methods.getCareeHash(em_code).call().then(function(name){
      if(name==""){
        $("#bloNotice").show();
        spinner = App.showSpinner();
        agContract2.methods.addCareehash(em_code, hashCareinfo).send({
          //send 파라미터 안에는 트랜잭션 object를 보내야함(누가 함수 호출하는지, 가스한도)
          from: walletInstance.address,   //계정 인증이 된 내 주소
          gas: '250000'
          //value는 payable이 아니라 안넘겨도 됨. 
        }).then(function(receipt){
          if(receipt.status){    //receipt 오브젝트 안에 status필드가 true면 트랜잭션 성공 
                console.log("경력 저장 완료");
                /* ***************************근로계약서********************************** */
                agContract.methods.getContHash(c_code).call().then(function(name){            
                  if(name==""){
                        console.log("계약서 저장 중.");
                         agContract.methods.addConhash(c_code, hashContinfo).send({
                          from: walletInstance.address,  
                          gas: '10000000'
                        }).then(function(receipt2){                   
                          if(receipt2.status){  
                              console.log("계약서 저장완료 ");
                              console.log(receipt);
                              console.log(receipt2);
                              $('#transaction').append("<a href='https://baobab.klaytnscope.com/tx/"+ receipt2.transactionHash + "' class='button green bigrounded'>근로계약서 정보 클레이튼 Scope에서 트랜잭션 확인</a>");
                              $('#transaction').append("<a href='https://baobab.klaytnscope.com/tx/"+ receipt.transactionHash + "' class='button green bigrounded'>경력 정보 클레이튼 Scope에서 트랜잭션 확인</a>");
                             
                              App.readContHash();
                              App.readCareerHash();
                              tx = receipt.transactionHash;                         
                              tx2 = receipt2.transactionHash;
                              App.stortxDb(tx, tx2);
                              spinner.stop();               
                              $("#bloNotice").hide();
                          }
                        }).then(`error`, (error) => {
                            alert("** contract error ** "+error.message);
                        })
                  }else{
                      spinner.stop();
                      alert("!!데이터가 이미 저장되어 있다!!"); 
                      App.readData();
                      App.getData();
                      // App.txPage();
                  }
                 })        
                /* ************************************************************* */
            }
        }).then(`error`, (error) => {
            alert("** 1 **"+error.message);
        })
      }else{
          alert("!!데이터가 이미 저장되어 있다!!"); 
          App.readContHash();
          App.readCareerHash();
          // App.txPage();
      }
     })

  },

  readContHash : function() {
    $("#myContInfo").show();

    agContract2.methods.getCareeHash(em_code).call().then(function(data){
        if(data){
          console.log(data);
            $(".cmain").after("<tr><td>경력해쉬값</td><td>"+decodeURI(data) +"</td></tr>");
        }else{
            alert("x"); 
        }
       })
  },

  readCareerHash: function() {
    $("#myContInfo").show();
    agContract.methods.getContHash(c_code).call().then(function(name){
      if(name){
        console.log(name);
          $(".cmain").after("<tr><td>계약서해쉬값</td><td>"+decodeURI(name) +"</td></tr>");
      }else{
          alert("x"); 
      }
      })
  },


  stortxDb :function(tx, tx2){                                
    // $.ajax({
    //     crossOrigin : true,
    //     dataType : "json",
    //     data : {
    //             "em_code": em_code,
    //             "tx": tx,
    //             "c_code": c_code,
    //             "tx1": tx1,
    //             "tx2": tx2,
    //             "tx3": tx3      
    //            },
    //     url : "http://39.127.7.84:8080/proalba/cross",
    //     complete : function(data) {
    //         var a = JSON.stringify(data.responseJSON);
    //         var pars = JSON.parse(a);
    //         console.log(pars.name);
    //         console.log("dd");
    //     }
    // });
  
    
    $.getJSON("http://39.127.7.53:8080/proalba/cross?em_code="+em_code+"&tx="+tx+"&c_code="+c_code+"&tx2="+tx2+"&hashCareinfo="+hashCareinfo+"&hashContinfo="+hashContinfo, function(data) {
      console.log("cress!!");
      console.log(data);
      //self.close(); 
    });

  },


  showSpinner: function () {
    var target = document.getElementById("spin");
    return new Spinner(opts).spin(target);
  },

  handlePassword: async function () {
    //비밀번호의 값을 전역변수에 저장
    this.auth.password = event.target.value;  //onchange이벤트를 통해 값을 불러오고, 전역 변수에 저장 
  },

  handleLogin: async function () {
    if(this.auth.accessType == 'keystore'){   //먼저 accessType이 keystore인지 확인, private key 사용할 수 있으니깐
      //keystore와 password를 통해 private key를 가져와야 함 
      try{
        const privateKey = cav.klay.accounts.decrypt(this.auth.keystore, this.auth.password).privateKey;
        //cav인스턴스의 account멤버를 통해 decrypt함수를 쓸 수 있다. 어떻게 decrypt하나? 파일 내용과 passwrod를 통해 decrypt된 계정 object를 가져온다. 그 object중에는 여러가지 멤버가 있다.
        //그 중  private key 를 가져와서 상수에다가 저장을 시킨다. 

        //비밀키를 통해 instance를 만든다.
        this.integrateWallet(privateKey);
      } catch(e){
        $('#message').text('비밀번호가 일치하지 않습니다.');
      }
    }
  },

  integrateWallet: function (privateKey) {
    //인자로 private key를 사용해서 원래 instance를 가져오는 코드  
    const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
    //walletInstance가 내 계정정보를 가지고 있음, 이 인스턴스를 월릿에 추가를 한다.
    cav.klay.accounts.wallet.add(walletInstance);
    //cav월릿에 내 계정을 추가하게 되면 앞으로 어떤 트랜잭션을 생성하게 될 때 쉽게 내 계정정보를 caver instance를 통해 다시 불러 올 수 있어 트랜잭션을 처리할 수 있다.

    //session 스토리지에다가 walletInstance저장할꺼임 , 계정의 로그인된 상태를 새로고침을 해도 계속 유지하기 위해서 씀
    //sessionStorage 는 탭이 닫히거나 웹브라우저가 꺼지기 전가지 인스턴스를 저장하게 됨.
    sessionStorage.setItem('walletInstance',JSON.stringify(walletInstance));
    //setItem : key, value를 쌍으로 받음. 

    this.changeUI(walletInstance);
  },

  changeUI: async function (walletInstance) {
    $('#loginModal').modal('hide');
    $('#login').hide();
    $('#logout').show();
    $('#address').append('<br>'+'<p>'+'내 계정 주소: '+ walletInstance.address + '</p>');

    //owner 계정 주소와 로그인된 계정 주소가 같을 때 
    // if(await this.callOwner() === walletInstance.address){
    //   $('#owner').show();
    // }else{
    //     $('#employer').show();
    // }
  },

  handleLogout: async function () {
    this.removeWallet();  //월릿과 세션슽리지 클리어

    //페이지 새로고침 코드, 새로고침하는 이유 : 처음 ui로 돌아가기 위해서 
    location.reload();
  },

  removeWallet: function () {
    cav.klay.accounts.wallet.clear();
    sessionStorage.removeItem('walletInstance');
    this.reset();  //전역변수 auth 초기화 시킴
  },
  reset: function () {
    this.auth = {
      keystore: '',
      password: ''
    };
  },

  getWallet: function () {
    if(cav.klay.accounts.wallet.length) { //cav.klay.accounts.wallet에 length가 있다면, 계정이 추가가 되어 있다면
      return cav.klay.accounts.wallet[0]; //제일 첫번재에 있는 account를 반환, 지금 내가 로그인된 계정.
    }
  },

  createAcc: function() {
    const newAccount = cav.klay.accounts.create();
    console.log(newAccount.address);
    console.log(newAccount.privateKey);
    const privateKey = newAccount.privateKey;
    this.integrateWallet(privateKey);
  },

  nodeB: function(){
    return "####";
  }

};

var opts = {
  lines: 10, // The number of lines to draw
  length: 30, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: '#5bc0de', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  position: 'absolute' // Element positioning
};

window.App = App;

window.addEventListener("load", function () {
  App.start();
});

document.addEventListener('DOMContentLoaded', function() {
  console.log("load 완료");
  console.log("complet : "+c_code);
  App.sendData();
}, false);