var store = [{
        "title": "회고록 - 2020년",
        "excerpt":"개인 주말연애와 주말부부의 시작 2020년 2월. 아내가 이직하고 처음으로 발령받았다. 서울에 오기를, 최소한 경기도에는 가기를 희망했는데 강원도로 가버렸다. 덕분에 우리는 결혼전부터 주말부부가 되었다. 처음에는 주말부부가 너무 싫었다. 뭐 지금 좋다는건 아니지만, 신혼때 가장 많이 무너진다는 삶의 균형을 조금 더 연습하라고 주신 시간이라고 받아들이기로 했다. 덕분에 주중에는 운동, 공부, 회사 일...","categories": ["Retrospect"],
        "tags": ["회고"],
        "url": "http://localhost:4000/retrospect/2020_retrospect/",
        "teaser": null
      },{
        "title": "[🧑‍🏫 강의 정리] 이더리움 입문 바이블 - 모든 이더리움 입문자를 위하여",
        "excerpt":"📒 본 포스팅은 인프런에서 제공하는 무료 강의 ‘이더리움 입문 바이블 - 모든 이더리움 입문자를 위하여’를 본 후 내용을 정리하였습니다. 이더리움의 사상이나 만들어진 배경은 생략하고, 기술적인 관점에서만 정리하였습니다. 이더리움 아키텍처(Architecture) 이더리움의 아키텍처를 정확하게 알기 위해, 기존의 웹 어플리케이션(서버-클라이언트) 아키텍처를 비교해본다. @그림 1: 서버-클라이언트 구조의 웹 어플리케이션 아키텍처 사용자는 웹브라우저를 통해 HTML,...","categories": ["Ethereum"],
        "tags": ["Blockchain","Ethereum","강의 정리"],
        "url": "http://localhost:4000/ethereum/ethereum_bible1_inflearn/",
        "teaser": null
      },{
        "title": "이더리움 표준(ERC)",
        "excerpt":"ERC-20 Ethereum Request for Comment 20의 약자로, 이더리움 네트워크를 관리하는 단체인 EIPs(Ethereum Improvement Proposals)에서 관리하는 공식 프로토콜이다. 이더리움 블록체인 네트워크에서 정한 표준 토큰 스펙이다. 만들어진 배경 ERC-20은 이더리움 네트워크 상에서 유통되는 토큰의 호환성을 보장하기 위하여 제작되었다. 실제로 대다수의 암호화폐(토큰)가 이더리움 기반으로 생성되었고, 이러한 토큰은 자체 메인넷을 출시하면서 다른 이더리움 기반...","categories": ["Ethereum"],
        "tags": ["Blockchain","Ethereum","Protocol"],
        "url": "http://localhost:4000/ethereum/erc/",
        "teaser": null
      },{
        "title": "시간복잡도(Time Complexity)",
        "excerpt":"Big O Big-O는 알고리즘의 효율성을 나타내는 지표로, 알고리즘이 이전보다 빨라졌는지 혹은 느려졌는지, 혹은 이전보다 메모리를 더 많이 사용하는지 적게 사용하는지의 등을 판단하는 기준이 된다. 알고리즘에 대한 결과를 판단할 때 가장 중요하게 사용되며, 개발자라면 꼭 알고 계산할 수 있어야 하는 부분이다. 시간 복잡도 시간복잡도로서의 Big-O는 접근적 실행시간(asymptotic runtime)을 나타내는 지표로 사용된다....","categories": ["Algorithm"],
        "tags": ["Algorithm","Time Complexity","Big-O"],
        "url": "http://localhost:4000/algorithm/time_complexity/",
        "teaser": null
      },{
        "title": "라이트닝 네트워크(Lightning Network)",
        "excerpt":"라이트닝 네트워크 라이트닝 네트워크(lightning network)는 메인 체인의 블록 크기는 그대로 고정하되 블록체인 외부 네트워크를 활용하여 블록에 입력되는 거래 내역을 줄이는 방안으로, 오프체인이 라이트닝 네트워크를 기반으로 한다고 보면 된다. 비트코인에서의 예시 비트코인을 예로 들어보자. 하나의 블록에 수많은 거래들이 들어갈 경우, 자연스럽게 블록의 크기는 증가할 것이고 이에 블록을 만들기 위한 수수료 또한...","categories": ["Blockchain"],
        "tags": ["Blockchain","Bitcoin","Offchain"],
        "url": "http://localhost:4000/blockchain/lightning_network/",
        "teaser": null
      },{
        "title": "웹브라우저 형식의 VScode, code-server 구성하기",
        "excerpt":"code-server 개발자들에게 가장 사랑받는 IDE가 무엇일까? 재미있는건 개발자들이 사랑한다고 해서 점유율이 높은건 아닌데, 기존에 많이 사용되었던 IDE일수록 기존에 있던 기능들을 deprecated 하기가 쉽지 않고 이를 통해 시스템이 점점 더 무거워지기 때문은 아닐까 생각된다. 개발자 입장에서는 가볍고, 확장성이 좋고, 단순한 IDE를 사랑할 수 밖에 없다. 내가 원하는 코드를 가벼운 환경에서 작성할...","categories": ["Tools"],
        "tags": ["Tools","IDE","VScode","iPad"],
        "url": "http://localhost:4000/tools/code-server/",
        "teaser": null
      },{
        "title": "HD(Hierarchical Deterministic) Wallet",
        "excerpt":"HD wallet HD(Hierarchical Deterministic) wallet은 하나의 마스터 키로부터 다수의 키들을 계층적으로 파생할 수 있는 지갑으로, 하나의 Root Key로부터 시작되는 계층적(Hierarchical)인 구조를 지닌다. 아래의 그림은 BIP-32 기준의 HD wallet 흐름도이며, 계층적 구조라는 측면에서는 다른 버전의 BIP(39, 44)와 큰 차이를 갖지 않는다. BIP는 Bitcoin Improvement Proposal의 약자로, 비트코인의 기술을 논의하기 위해 작성하거나...","categories": ["Blockchain"],
        "tags": ["Blockchain","Wallet","Golang","Bitcoin","Ethereum"],
        "url": "http://localhost:4000/blockchain/hd_wallet/",
        "teaser": null
      },{
        "title": "시스템 설계와 규모 확장성",
        "excerpt":"📒 본 포스팅은 Cracking The Coding Interview의 시스템 설계 및 규모 확장성과 HiredInTech 내용을 학습한 후 작성하였습니다. 시스템 설계 방법 TinyURL(URL을 축소해서 이를 원래 URL과 매핑해주는 시스템)을 설계한다고 가정하자. 문제의 범위 한정하기: 내가 생각하는 시스템의 목적과 방향이 면접관과 일치하는지 확실히 해야 한다. 예를 들어 개개인이 축약된 URL을 직접 만들 수...","categories": ["System Design"],
        "tags": ["Architecture","System Design","Scalability"],
        "url": "http://localhost:4000/system%20design/system_design_and_scalability/",
        "teaser": null
      },{
        "title": "디앱(DApp, Decentralized Application)",
        "excerpt":"DApp 디앱(DApp)은 Decentralized Application의 약자로, 이더리움, 큐텀, 이오스와 같은 플랫폼 코인 위에서 동작하는 탈중앙화 분산 어플리케이션을 의미한다. 디앱에서 사용되는 암호화폐는 일반적으로 코인(coin)이 아닌 토큰(token)으로 불린다. 디앱에서 가장 많이 사용하는 블록체인 플랫폼은 이더리움으로, 그 다음을 이오스와 트론이 차지하고 있다. 블록체인 기반으로 돌아가는 어플리케이션이라는 디앱의 특성상, 디앱에서 상호작용하는 모든 데이터들은 해당 블록체인...","categories": ["Blockchain"],
        "tags": ["Blockchain","DApp","Decentralized","Application"],
        "url": "http://localhost:4000/blockchain/dapp/",
        "teaser": null
      },{
        "title": "Infura로 이더리움 테스트용 노드 만들기",
        "excerpt":"Infura 일반적으로 디앱(DApp)를 개발할 때에는 로컬에서 Ganashe 또는 Truffle develop을 사용하거나 geth를 이용한 private network를 구성한다. 물론 디앱에 국한되지 않더라도 대부분의 앱 또한 로컬에서 개발 -&gt; 테스트 -&gt; 실제 환경과 유사한 개발환경에서 테스트 -&gt; 배포와 같은 순서를 갖는다. 디앱은 여기서 조금 다른 부분이 테스트넷 환경에서 실제로 구성된 노드에 직접 테스트해봐야...","categories": ["Ethereum"],
        "tags": ["Blockchain","Ethereum"],
        "url": "http://localhost:4000/ethereum/infura/",
        "teaser": null
      },{
        "title": "CDN(Content Delivery Network)",
        "excerpt":"CDN(Content Delivery Network) 엣지 컴퓨팅(Edge Computing)의 한 방식으로, 웹 어플리케이션 또는 스트리밍 서비스에서의 각종 컨텐츠를 빠르게 전송하기 위해 전 세계에 분산된 서버를 구성하는 플랫폼이다. 마치 각 지역마다 물류센터가 있어서 빠르게 택배를 제공받는 방식과 같은데, 중앙 클라우드 서버 외에 각 지역마다(전 세계적으로) 분산된 서버를 전진배치 시켜서 이 곳에서 먼저 빠르게 컨텐츠를...","categories": ["Architecture"],
        "tags": ["Architecture","Network"],
        "url": "http://localhost:4000/architecture/cdn/",
        "teaser": null
      },{
        "title": "확장 가능한 웹 아키텍처 및 분산 시스템",
        "excerpt":"📒 본 포스팅은 Kate Matsudaira의 Scalable Web Architecture and Distributed Systems 내용을 학습한 후 작성하였습니다. 웹 분산 시스템 설계의 원리 확장 가능한 웹 사이트 또는 애플리케이션을 구축하고 운영한다는 것은, 기본적으로는 인터넷을 통해 원격의 리소스와 사용자를 연결하는 것이고 더 나아가 리소스 또는 해당 리소스에 접근할 수 있는 서버를 여러곳에 분산시켜 확장...","categories": ["System Design"],
        "tags": ["Architecture","System Design","Scalability"],
        "url": "http://localhost:4000/system%20design/scalable-web-architecture-and-distributed-systems/",
        "teaser": null
      },{
        "title": "해시 테이블(Hash Table)",
        "excerpt":"해시 테이블 해시 테이블은 효율적인 탐색을 위한 자료구조로서, 키(key)를 값(value)에 대응시킨 구조다. 연결 리스트(linked-list)를 이용한 해시 테이블 구현 해시 테이블을 구현하는 방법은 여러가지가 있지만, 앞으로 설명할 연결리스트 활용 방식이 가장 간단하면서도 흔하게 사용된다고 한다. 간단한 해시 테이블을 구현하기 위해, 연결리스트(linked list)와 해시코드 함수(hash code function)가 필요하다. 해시 테이블에 사용되는 키는...","categories": ["Algorithm"],
        "tags": ["Algorithm","Data Structure"],
        "url": "http://localhost:4000/algorithm/hash_table-copy/",
        "teaser": null
      },{
        "title": "STAR 방식으로 설명하기",
        "excerpt":"S.T.A.R 많은 기업에서 면접을 볼 때, STAR 방식으로 설명할 것을 강조한다. 간략하게 무엇인지 살펴보자. S : Situation Describe the situation that you were in or the task that you needed to accomplish. You must describe a specific event or situation, not a generalized description of what you have done in...","categories": ["Etc"],
        "tags": ["Interview","Communication Skill","EN"],
        "url": "http://localhost:4000/etc/star_way/",
        "teaser": null
      },{
        "title": "에어팟 맥스(Max) 2달 사용기",
        "excerpt":"받(?)게 된 배경 몇달 전 생일이었다. 생일 3달전부터 아내가 갖고싶은게 없느냐 물었는데, 생각보다 물욕이 없어서 그런가 딱히 생각나는게 없었다. 10년도 훨씬 넘은, 아빠에게 물려받은 전기면도기를 바꿔주겠다고 했는데, 정말 오랜 세월동안 작동한 녀석 치고는 아직도 끄떡없어서 바꾸기가 애매했다. 그러던 중, 정말 아무 의미없이 던진 한마디에 내 선물이 급 정해졌다. 사실 정해졌다기보다는...","categories": ["Review"],
        "tags": ["후기","애플","에어팟"],
        "url": "http://localhost:4000/review/airpodmax/",
        "teaser": null
      },{
        "title": "정렬(Sorting)",
        "excerpt":"배열 vs 리스트 정렬을 구현하는 방식은 크게 배열을 이용하거나 리스트를 이용하는 두가지 방법이 존재한다. 배열: 구현이 용이함, 병합할 부분 배열을 담아 둘 추가적인 보조 배열이 필요함. 리스트: 구현이 복잡함, 병합할 부분 배열을 담아 둘 추가적인 보조 배열이 필요하지 않음. 본 포스팅에서는 각 정렬의 구현 방식을 일반적으로 사용되는 ‘배열(array)’로 진행한다. Quick...","categories": ["Algorithm"],
        "tags": ["Algorithm","Sorting"],
        "url": "http://localhost:4000/algorithm/sorting/",
        "teaser": null
      }]
