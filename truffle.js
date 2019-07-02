// truffle.js config for klaytn. 배포할 때 어느 네트워크에할지 정의한다. 
const PrivateKeyConnector = require('connect-privkey-to-provider')  //라이브러리 가져오기
const NETWORK_ID = '1001'   //networkID라는 상속을 만든다. 1001: 바오밥 고유의 네트워크를 의미
const GASLIMIT = '20000000'     //배포하는 가스 한도
const URL = 'https://api.baobab.klaytn.net:8651'    //바옹밥 테스트넷
const PRIVATE_KEY = '0xaf58306cb6c0b347abbe2e4a64592e66ce0f42fc4ddc8f1110e2a783387b9608'    ///비밀키 담는 상수

module.exports = {
    networks: {     
        klaytn: {
            provider: new PrivateKeyConnector(PRIVATE_KEY, URL),    //클레이튼 노드를 제공하는 공급자를 명시,(내 계정 비밀키와 풀노드가 돌아가고 있는 네트워크주소를 넘김 )
            network_id : NETWORK_ID,
            gas: GASLIMIT,
            gasPrice: null,     //가스 가격은 바오밥 네트워크에서 자동적으로 가스가격을 잡아주기 때문에 null값
        },
      
    "live": {
      network_id: 1001,
      host: "39.127.7.53",
      port: 8546   // Different than the default below
    }
  
    }
}