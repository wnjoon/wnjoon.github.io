var store = [{
        "title": "CHFA(하이퍼레저 패브릭 자격증) 후기",
        "excerpt":"Hyperledger Fabric이란? 블록체인 기술은 원장을 공개하는 범위에 따라 공개형(Public/Permissionless)과 허가형(Private/Permissioned)으로 구분된다. 이 중 허가형의 경우 우리나라를 포함한 전 세계적으로 가장 많이 쓰이는 플랫폼 중 리눅스 재단(The Linux Foundation)에서 운영하고 있는 Hyperledger fabric이 있다. CHFA(Certified Hyperledger Fabric Administrator)는 현재까지 Hyperledger fabric에 대한 유일한 공식 자격증이며, 본 포스팅에서는 해당 자격증을 취득하는 과정에서...","categories": ["Hyperledger"],
        "tags": ["Blockchain","Hyperledger","자격증","후기"],
        "url": "http://localhost:4000/hyperledger/chfa/",
        "teaser": null
      },{
        "title": "회고록 - 2020년",
        "excerpt":"개인 주말연애와 주말부부의 시작 2020년 2월. 아내가 이직하고 처음으로 발령받았다. 서울에 오기를, 최소한 경기도에는 가기를 희망했는데 강원도로 가버렸다. 덕분에 우리는 결혼전부터 주말부부가 되었다. 처음에는 주말부부가 너무 싫었다. 뭐 지금 좋다는건 아니지만, 신혼때 가장 많이 무너진다는 삶의 균형을 조금 더 연습하라고 주신 시간이라고 받아들이기로 했다. 덕분에 주중에는 운동, 공부, 회사 일...","categories": ["Retrospect"],
        "tags": ["회고"],
        "url": "http://localhost:4000/retrospect/2020_retrospect/",
        "teaser": null
      },{
        "title": "하이퍼레저 패브릭에서 생성된 블록은 어디에 있을까?",
        "excerpt":"컨테이너로 구성된 피어 하이퍼레저 패브릭에서 원장, 즉 블록을 저장하고 있는 주체인 피어(Peer)는 기본적으로 컨테이너 형태로 구성된다. 그러므로 피어에 생성되고 있는 블록 또한 컨테이너 내부에 위치하는 셈인데, 그렇다면 컨테이너의 어디에 블록이 위치하고 있을까? To see the physical location of these data you can go to /var/hyperledger/production in each peer container in...","categories": ["Hyperledger"],
        "tags": ["Blockchain","Hyperledger","Docker","Container"],
        "url": "http://localhost:4000/hyperledger/physically_block_location/",
        "teaser": null
      },{
        "title": "Jenkins 설치해보기",
        "excerpt":"TDD(Test Driven Development)가 좋기는하다. 하지만.. 사실 형상관리는 이미 개발과정에서는 필수요소가 된지 오래다. CI를 단순히 ‘손쉬운 형상관리 + 자동 배포’로만 인식하면 이전과 크게 다를바 없어 보이지만, 테스트 자동화의 관점에서 보면 TDD가 가지고 있던 단점들을 어느정도 해결해준다. 일반적으로 TDD는 유닛테스트 기반으로, 우리가 학부시절에 코딩하던 수준이 아닌 production level에서 볼 수 있는 엄청난...","categories": ["Backend"],
        "tags": ["Backend","Jenkins","CI/CD","형상관리"],
        "url": "http://localhost:4000/backend/jenkins/",
        "teaser": null
      },{
        "title": "맥OS Big Sur에서는 VirtualBox 말고 Vmware를 쓰자",
        "excerpt":"개요 리눅스 기반에서 시스템을 테스트할 때, 일반적으로 윈도우나 맥 모두 VirtualBox(버추얼박스)를 가장 많이 사용한다. 무료라는 엄청난 장점과 더불어 간편하게 가상화 PC를 만들 수 있기 때문인데, 특히 여러 개의 서버를 복합적으로 설계할 때 아주 효과적이다. 하지만 정말 아쉽게도 이번 맥OS의 업데이트로 인하여 Big Sur에서는 더 이상 버추얼박스를 사용하는게 어려울 것으로 보인다....","categories": ["Tools"],
        "tags": ["Tools","MacOS","VMware","VirtualBox","가상화"],
        "url": "http://localhost:4000/tools/vmwareinbigsur/",
        "teaser": null
      },{
        "title": "하드포크, 그리고 소프트포크에 대하여",
        "excerpt":"하드포크(Hard fork) 비트코인과 비트코인캐시, 이더리움과 이더리움 클래식 등 무언가 비슷하지만 서로 달라진(갈라진이라고 표현해야 맞는가) 블록체인들을 볼 수 있다. 전문적인 용어로 이를 ‘하드포크(Hard fork)’되었다고 하는데, 블록을 연결하는 체인이 새롭게 만들어졌다는 의미로 결국에는 '새로운 블록체인'이 만들어졌다고 보면 된다. 하드포크가 일어나는 원인은 다양한데, 가장 정상적(?)으로 발생하는 경우는 해당 블록체인의 하드포크 일정(Roadmap)에 맞게 진행되는...","categories": ["Blockchain"],
        "tags": ["Blockchain","Fork"],
        "url": "http://localhost:4000/blockchain/fork/",
        "teaser": null
      },{
        "title": "하이퍼레저 패브릭의 MVCC(다중 버전 동시성 제어)",
        "excerpt":"Concurrency Control(동시성 제어) @그림 1: 동시성 제어 예시 그림 DBMS에서 다수의 사용자 간 동시에 처리되는 트랜잭션으로부터 데이터베이스를 보호하는 방법으로, 동시에 하나의 컬럼에 접근하는 경우 값의 일관성이 낮아질 수 있는 오류를 막기 위하여 사용된다. 위의 그림을 보면 Commit이 이루어지지 않은, 값이 변경되고 있는 도중에 해당 값을 사용하는 과정에서 의도하지 않은 결과가...","categories": ["Hyperledger"],
        "tags": ["Blockchain","Hyperledger","DBMS"],
        "url": "http://localhost:4000/hyperledger/mvcc/",
        "teaser": null
      },{
        "title": "증권형 토큰 발행(STO)에 대해서",
        "excerpt":"증권형 토큰(Security Token) 증권형 토큰은 주식, 채권, 부동산 등 실물자산을 블록체인 기반의 암호화폐에 고정(페깅)한 디지털 자산으로, 증권형 토큰의 소유는 해당 토큰과 연동된 자산의 소유권을 가짐을 의미하며 해당 자산의 규제 안에서만 거래가 가능하다. 토큰 발행 주체에서 창출되는 수익에 대한 배당, 청구 및 의사결정 권리를 가지며, 증권형 토큰을 통해 특정 자산의 분배를...","categories": ["Blockchain"],
        "tags": ["Blockchain","STO","암호화폐"],
        "url": "http://localhost:4000/blockchain/sto/",
        "teaser": null
      },{
        "title": "Raft 합의 알고리즘에 대하여",
        "excerpt":"Raft란? 클라이언트가 입력한 데이터를 분산된 노드(특정 서버) 간 동기화 하기 위한 알고리즘으로, Distributed consensus의 한 방법이다. 기존에는 Paxos 모델을 사용했으나 현재는 Leader-follower 모델을 사용한다. Leader-follower 모델은 전체 노드 중 하나의 리더를 선정하고, 해당 리더가 클라이언트로부터 데이터를 받아 이를 다른 노드들에 전달하는 방식을 말한다. Raft에서의 노드 상태(State) Raft 알고리즘은 노드를 총...","categories": ["Algorithm"],
        "tags": ["Algorithm","Blockchain","합의알고리즘","CFT"],
        "url": "http://localhost:4000/algorithm/raft/",
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
        "tags": ["Algorithm","Time Complexity","Big-O","ctci"],
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
        "title": "[🧑‍🏫 강의 정리] Service - ClusterIP, NodePort, LoadBalancer",
        "excerpt":"📒 본 포스팅은 인프런에서 제공하는 강의 ‘대세는 쿠버네티스 [초급~중급] - 김태민’를 본 후 내용을 정리하고 있습니다. 서비스(Service)의 필요성 서비스의 필요성을 알기 위해서는 쿠버네티스의 기본 사상에 대해 알아야 한다. 쿠버네티스는 1개 이상의 컨테이너로 구성된 파드(Pod)로 동작한다. 쿠버네티스에서 파드란 언제든지 없어지고 생겨날 수 있는 유동적인 존재이다. 배달의민족에서 할인권을 배포하는 이벤트를 진행했다고 가정하자....","categories": ["Kubernetes"],
        "tags": ["Kubernetes","Network","InfraStructure","강의 정리"],
        "url": "http://localhost:4000/kubernetes/service/",
        "teaser": null
      },{
        "title": "[🧑‍🏫 강의 정리] Volume - emptyDir, hostPath, PV/PVC",
        "excerpt":"📒 본 포스팅은 인프런에서 제공하는 강의 ‘대세는 쿠버네티스 [초급~중급] - 김태민’를 본 후 내용을 정리하고 있습니다. 볼륨(Volume)의 필요성 컨테이너로 이루어진 파드는 서비스 때 언급한 것과 마찬가지로 생성과 삭제가 매우 빈번하게 이루어지는 단위이다. 문제는 파드가 삭제되면 파드 내 컨테이너에 저장되어 있던 데이터 또한 삭제된다는 것이다. 이를 방지하기 위해 쿠버네티스에서는 다양한 방법으로...","categories": ["Kubernetes"],
        "tags": ["Kubernetes","Network","InfraStructure","강의 정리"],
        "url": "http://localhost:4000/kubernetes/volume/",
        "teaser": null
      },{
        "title": "[🧑‍🏫 강의 정리] Object - ConfigMap, Secret",
        "excerpt":"📒 본 포스팅은 인프런에서 제공하는 강의 ‘대세는 쿠버네티스 [초급~중급] - 김태민’를 본 후 내용을 정리하고 있습니다. ConfigMap과 Secret의 필요성 SSH를 예로 들어보자. 물론 개발환경에서도 SSH 적용을 하면 좋을 수 있지만, 개발환경의 성능과 불필요한 귀찮음을 배제하기 위해서라도 사용하지 않는 경우가 많다. 개발환경과 운영환경에서 사용되는 ID, 비밀번호도 다를 것이다. 이러한 환경변수는 쿠버네티스...","categories": ["Kubernetes"],
        "tags": ["Kubernetes","Network","InfraStructure","강의 정리"],
        "url": "http://localhost:4000/kubernetes/configmap_secret/",
        "teaser": null
      },{
        "title": "[🧑‍🏫 강의 정리] Object - Namespace, ResourceQuota, LimitRange",
        "excerpt":"📒 본 포스팅은 인프런에서 제공하는 강의 ‘대세는 쿠버네티스 [초급~중급] - 김태민’를 본 후 내용을 정리하고 있습니다. 자원 분배의 필요성 쿠버네티스는 클러스터에 따라 사용할 수 있는 자원의 한계가 있다. 마치 우리가 클라우드 혹은 외장하드와 같은 별도의 장치나 서비스를 사용하지 않는다면 PC에 연결된 하드 또는 SSD의 용량만 사용할 수 있는 것과 같다....","categories": ["Kubernetes"],
        "tags": ["Kubernetes","Network","InfraStructure","강의 정리"],
        "url": "http://localhost:4000/kubernetes/nsrqlr/",
        "teaser": null
      },{
        "title": "[🧑‍🏫 강의 정리] Controller - ReplicaSet",
        "excerpt":"📒 본 포스팅은 인프런에서 제공하는 강의 ‘대세는 쿠버네티스 [초급~중급] - 김태민’를 본 후 내용을 정리하고 있습니다. 컨트롤러의 기능 @그림 1: Controller가 제공하는 기능 - 출처: 강의자료 컨트롤러는 쿠버네티스의 서비스를 관리 및 운영하는데 사용된다. (1) Auto Healing 특정 파드 혹은 노드 전체에 장애가 발생하였을 때, 이를 복구해주는 기능이다. 단순히 파드를 재생성할...","categories": ["Kubernetes"],
        "tags": ["Kubernetes","Network","InfraStructure","강의 정리"],
        "url": "http://localhost:4000/kubernetes/rs/",
        "teaser": null
      },{
        "title": "HD(Hierarchical Deterministic) Wallet",
        "excerpt":"HD wallet HD(Hierarchical Deterministic) wallet은 하나의 마스터 키로부터 다수의 키들을 계층적으로 파생할 수 있는 지갑으로, 하나의 Root Key로부터 시작되는 계층적(Hierarchical)인 구조를 지닌다. 아래의 그림은 BIP-32 기준의 HD wallet 흐름도이며, 계층적 구조라는 측면에서는 다른 버전의 BIP(39, 44)와 큰 차이를 갖지 않는다. BIP는 Bitcoin Improvement Proposal의 약자로, 비트코인의 기술을 논의하기 위해 작성하거나...","categories": ["Blockchain"],
        "tags": ["Blockchain","Wallet","Golang","Bitcoin","Ethereum"],
        "url": "http://localhost:4000/blockchain/hd_wallet/",
        "teaser": null
      },{
        "title": "[🧑‍🏫 강의 정리] Controller - Deployment",
        "excerpt":"📒 본 포스팅은 인프런에서 제공하는 강의 ‘대세는 쿠버네티스 [초급~중급] - 김태민’를 본 후 내용을 정리하고 있습니다. 버전 변경(업그레이드) 방법 @그림 1: 버전 변경 방법에 대한 간략한 예시 - 출처: 강의자료 쿠버네티스에서는 각 파드의 버전에 따른 업그레이드와 다운그레이드를 위해 Deployment를 사용한다. 아래의 4가지 방법은 쿠버네티스에서 제공하는 버전 관리 방법으로, 이 중...","categories": ["Kubernetes"],
        "tags": ["Kubernetes","Network","InfraStructure","강의 정리"],
        "url": "http://localhost:4000/kubernetes/deployment/",
        "teaser": null
      },{
        "title": "[🧑‍🏫 강의 정리] Controller - DaemonSet, Job, CronJob",
        "excerpt":"📒 본 포스팅은 인프런에서 제공하는 강의 ‘대세는 쿠버네티스 [초급~중급] - 김태민’를 본 후 내용을 정리하고 있습니다. 특수한 목적에 맞게 사용되는 파드 @그림 1: DaemonSet과 Job, CronJob 예시 - 출처: 강의자료 파드는 일종의 유목민(?)과 같이 여러 노드에 필요에 따라 생성과 삭제가 빈번히 발생한다고 생각할 수 있지만, 특수한 목적을 가진 파드들은 이러한...","categories": ["Kubernetes"],
        "tags": ["Kubernetes","Network","InfraStructure","강의 정리"],
        "url": "http://localhost:4000/kubernetes/dsjobcronjob/",
        "teaser": null
      },{
        "title": "시스템 설계와 규모 확장성",
        "excerpt":"📒 본 포스팅은 Cracking The Coding Interview의 시스템 설계 및 규모 확장성과 HiredInTech 내용을 학습한 후 작성하였습니다. 시스템 설계 방법 TinyURL(URL을 축소해서 이를 원래 URL과 매핑해주는 시스템)을 설계한다고 가정하자. 문제의 범위 한정하기: 내가 생각하는 시스템의 목적과 방향이 면접관과 일치하는지 확실히 해야 한다. 예를 들어 개개인이 축약된 URL을 직접 만들 수...","categories": ["System Design"],
        "tags": ["Architecture","System Design","Scalability","ctci"],
        "url": "http://localhost:4000/system%20design/system_design_and_scalability/",
        "teaser": null
      },{
        "title": "디앱(DApp, Decentralized Application)",
        "excerpt":"DApp 디앱(DApp)은 Decentralized Application의 약자로, 이더리움, 큐텀, 이오스와 같은 플랫폼 코인 위에서 동작하는 탈중앙화 분산 어플리케이션을 의미한다. 디앱에서 사용되는 암호화폐는 일반적으로 코인(coin)이 아닌 토큰(token)으로 불린다. 디앱에서 가장 많이 사용하는 블록체인 플랫폼은 이더리움으로, 그 다음을 이오스와 트론이 차지하고 있다. 블록체인 기반으로 돌아가는 어플리케이션이라는 디앱의 특성상, 디앱에서 상호작용하는 모든 데이터들은 해당 블록체인...","categories": ["Blockchain"],
        "tags": ["Blockchain","DApp","Decentralized","Application"],
        "url": "http://localhost:4000/blockchain/dapp/",
        "teaser": null
      },{
        "title": "그래프(Graph)와 탐색(DFS, BFS) 방법",
        "excerpt":"그래프(Graph) 그래프는 노드와 노드를 연결하는 간선(edge)의 모음이다. 트리와 헷갈리는 경우가 가끔 있는데, 트리는 그래프의 한 종류다. 하지만 모든 그래프가 트리라고 볼 수는 없다. 트리와 그래프는 사이클의 유무로 결정되는데, 트리는 사이클이 없는 하나의 연결된 그래프(connected graph)이다. 그래프의 특징을 정리해보면 다음과 같다. 그래프는 방향성이 있을 수도, 혹은 없을 수도 있다. 방향성이 있다면...","categories": ["Algorithm"],
        "tags": ["Algorithm","Graph","DFS","BFS","Searching","Recursive","Queue","ctci"],
        "url": "http://localhost:4000/algorithm/graph(dfs,bfs)/",
        "teaser": null
      },{
        "title": "합의 알고리즘의 비교 (BFT vs CFT)",
        "excerpt":"합의 알고리즘의 구분 블록체인을 지탱하고 있는 가장 큰 특징이라고 한다면 합의 알고리즘일 것이다. 거래 내역이 저장된 블록들이 하나의 체인으로 연결되어 있는데, 이렇게 만들어진 블록들의 체인이 여러 노드에 저장되어 위변조를 방지할 수 있게 된다. 물론 이를 위해서 모든 노드들이 거래 내역에 대한 상태(State)를 동일하게 유지해야 하는데, 이를 위해 합의 알고리즘이 필요하게...","categories": ["Blockchain"],
        "tags": ["Blockchain","합의알고리즘","BFT","CFT"],
        "url": "http://localhost:4000/blockchain/consensus/",
        "teaser": null
      },{
        "title": "Infura로 이더리움 테스트용 노드 만들기",
        "excerpt":"Infura 일반적으로 디앱(DApp)를 개발할 때에는 로컬에서 Ganashe 또는 Truffle develop을 사용하거나 geth를 이용한 private network를 구성한다. 물론 디앱에 국한되지 않더라도 대부분의 앱 또한 로컬에서 개발 -&gt; 테스트 -&gt; 실제 환경과 유사한 개발환경에서 테스트 -&gt; 배포와 같은 순서를 갖는다. 디앱은 여기서 조금 다른 부분이 테스트넷 환경에서 실제로 구성된 노드에 직접 테스트해봐야...","categories": ["Ethereum"],
        "tags": ["Blockchain","Ethereum"],
        "url": "http://localhost:4000/ethereum/infura/",
        "teaser": null
      },{
        "title": "CDN(Content Delivery Network)",
        "excerpt":"CDN(Content Delivery Network) 엣지 컴퓨팅(Edge Computing)의 한 방식으로, 웹 어플리케이션 또는 스트리밍 서비스에서의 각종 컨텐츠를 빠르게 전송하기 위해 전 세계에 분산된 서버를 구성하는 플랫폼이다. 마치 각 지역마다 물류센터가 있어서 빠르게 택배를 제공받는 방식과 같은데, 중앙 클라우드 서버 외에 각 지역마다(전 세계적으로) 분산된 서버를 전진배치 시켜서 이 곳에서 먼저 빠르게 컨텐츠를...","categories": ["Network"],
        "tags": ["Network","Cloud","Edge","Distributed Computing"],
        "url": "http://localhost:4000/network/cdn/",
        "teaser": null
      },{
        "title": "[📝 번역 정리] 확장 가능한 웹 아키텍처 및 분산 시스템",
        "excerpt":"📒 본 포스팅은 Kate Matsudaira의 Scalable Web Architecture and Distributed Systems 내용을 학습한 후 작성하였습니다. 웹 분산 시스템 설계의 원리 확장 가능한 웹 사이트 또는 애플리케이션을 구축하고 운영한다는 것은, 기본적으로는 인터넷을 통해 원격의 리소스와 사용자를 연결하는 것이고 더 나아가 리소스 또는 해당 리소스에 접근할 수 있는 서버를 여러곳에 분산시켜 확장...","categories": ["System Design"],
        "tags": ["Architecture","System Design","Scalability"],
        "url": "http://localhost:4000/system%20design/scalable-web-architecture-and-distributed-systems/",
        "teaser": null
      },{
        "title": "해시 테이블(Hash Table)",
        "excerpt":"해시 테이블 해시 테이블은 효율적인 탐색을 위한 자료구조로서, 키(key)를 값(value)에 대응시킨 구조다. 연결 리스트(linked-list)를 이용한 해시 테이블 구현 해시 테이블을 구현하는 방법은 여러가지가 있지만, 앞으로 설명할 연결리스트 활용 방식이 가장 간단하면서도 흔하게 사용된다고 한다. 간단한 해시 테이블을 구현하기 위해, 연결리스트(linked list)와 해시코드 함수(hash code function)가 필요하다. 해시 테이블에 사용되는 키는...","categories": ["Algorithm"],
        "tags": ["Algorithm","Data Structure","Hashing","ctci"],
        "url": "http://localhost:4000/algorithm/hash_table/",
        "teaser": null
      },{
        "title": "STAR 방식으로 설명하기",
        "excerpt":"S.T.A.R 많은 기업에서 면접을 볼 때, STAR 방식으로 설명할 것을 강조한다. 간략하게 무엇인지 살펴보자. S : Situation Describe the situation that you were in or the task that you needed to accomplish. You must describe a specific event or situation, not a generalized description of what you have done in...","categories": ["Etc"],
        "tags": ["Interview","Communication Skill","EN"],
        "url": "http://localhost:4000/etc/star_way/",
        "teaser": null
      },{
        "title": "사이드체인(Sidechain)에 대한 정리",
        "excerpt":"사이드체인이란? 사이드체인은 2014년에 발표된 Enabling Blockchain Innovations with Pegged Sidechains이라는 논문에서 처음 등장했다. 오프체인에서 트랜잭션을 처리하는 방법 중 하나로 알려져 있는데, 퍼블릭 블록체인에서 점점 증가하는 노드 내 데이터 크기 및 노드 자체의 갯수로 인한 높아지는 수수료 문제를 통해 ‘실생활에서의 블록체인 접근이 가능할 수 있도록’하기 위한 방안으로 사용되어진다. 결국 메인체인에서의 트랜잭션을...","categories": ["Blockchain"],
        "tags": ["Blockchain","Sidechain","상호운용성"],
        "url": "http://localhost:4000/blockchain/sidechain/",
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
        "tags": ["Algorithm","Sorting","Recursive","ctci"],
        "url": "http://localhost:4000/algorithm/sorting/",
        "teaser": null
      },{
        "title": "Geth을 이용한 이더리움 dev mode 구성하기",
        "excerpt":"Geth란? Geth는 Go Ethereum의 약자로, 이더리움에서 스마트컨트랙트를 호출할 수 있도록 하는 공식 클라이언트 어플리케이션 중 하나이다. Geth를 이용하면 퍼블릭 이더리움과 연결하거나 프라이빗 이더리움을 별도로 구성할 수 있는데, 또한 노드 1개로 이루어진 이더리움을 구성해서 빠르고 간편하게 스마트컨트랙트를 개발하고 이를 테스트할 수도 있다. 본 포스팅에서는 위의 종류 중 3번째인 테스트용 이더리움, 개발...","categories": ["Ethereum"],
        "tags": ["Blockchain","Ethereum","geth"],
        "url": "http://localhost:4000/ethereum/devmode_using_geth/",
        "teaser": null
      },{
        "title": "Factory Method pattern (팩토리 메서드 패턴)",
        "excerpt":"팩토리 메서드 패턴이란? 어떤 클래스의 객체를 생성하기 위한 인터페이스를 제공해서, 하위 클래스에서 어떤 클래스로 생성할지 결정할 수 있도록 도와주는 디자인 패턴이다. 구현 방법은 크게 2가지가 있다. Factory 메서드 자체에 대한 구현은 제공하지 않고, 객체를 생성하는 클래스를 abstract로 선언하는 방법 Factory 메서드를 실제로 구현한 Creator(생성)클래스를 만들고, 인자 값으로 생성해야 하는 클래스를...","categories": ["Algorithm"],
        "tags": ["Algorithm","Design Pattern","OOP","ctci"],
        "url": "http://localhost:4000/algorithm/factorymtehod/",
        "teaser": null
      },{
        "title": "Singleton pattern (싱글톤 패턴)",
        "excerpt":"싱글톤 패턴이란? 싱글톤 패턴은 어떤 클래스가 오직 하나의 객체만을 갖도록 하는 방식을 말하며, 프로그램 전반에 걸쳐 그 객체 하나만 사용되도록 보장해야 한다. 그렇기 때문에 정확히 하나만 생성되어야 하는 ‘전역 객체(global object)’를 구현해야 할 때 유용하다. 생성 시점은 객체가 필요한 시기(just-in-time) 혹은 프로그램이 초기화(initialization on first use)될 때 두가지로 구분된다. 싱글톤...","categories": ["Algorithm"],
        "tags": ["Algorithm","Design Pattern","OOP","ctci"],
        "url": "http://localhost:4000/algorithm/singleton/",
        "teaser": null
      },{
        "title": "0x 프로토콜",
        "excerpt":"0x 프로토콜 0x 프로토콜은 거래소의 탈중앙화를 위해 erc20 거래에 사용할 수 있는 공통된 프로토콜을 만들고자 하는 니즈에서 출발했다. 코인의 거래가 활발해짐에 따라 반번하게 발생하는 거래소를 겨냥한 DDoS 공격 또는 해킹을 해결하기 위함이다. 0x 프로토콜은 스마트컨트랙트로 작성되어 이더리움 위에서 돌아간다. 코스모스나 비트쉐어처럼 중간자를 경유하지 않고도, 0x 프로토콜을 사용하면 직접 이더리움 토큰을...","categories": ["Ethereum"],
        "tags": ["Blockchain","Ethereum"],
        "url": "http://localhost:4000/ethereum/0xprotocol/",
        "teaser": null
      },{
        "title": "[📝 번역 정리] How does Ethereum work, anyway?",
        "excerpt":"블록체인에 대한 정의 Blockchain definition 블록체인은 \"Cryptographically secure transitional singleton machine with shared-state\" 로 정의된다. Cryptographically secure: 깨기 어려운 복잡한 수학적 알고리즘을 기반으로 암호화폐가 생성된다. Transitional singleton machine: 정상적으로 생성된 하나의 객체는 시스템 상에서 생성되는 모든 트랜잭션에 대해 책임을 가지며, 이는 모든 구성원으로부터 신뢰받는 global truth를 생성한다. With shared-state: 저장되는...","categories": ["Ethereum"],
        "tags": ["Blockchain","Ethereum"],
        "url": "http://localhost:4000/ethereum/how_does_ethereum_works/",
        "teaser": null
      },{
        "title": "Geth을 이용한 이더리움 private network 구성하기",
        "excerpt":"Dev mode와 Private network의 차이 이전 포스팅 ‘Geth을 이용한 이더리움 dev mode 구성하기’에서 geth를 이용한 개발모드를 구성하는 방법에 대해 공유했다. 개발모드는 자동으로 제네시스 블록을 생성해주는 것은 물론이고, 트랜잭션 처리에 필요한 가스 비용을 전부 0으로 만들어주고 심지어 PoA 방식의 합의 알고리즘을 통해 블록 생성 및 검증을 더욱 빠르게 하여 스마트컨트랙트를 개발하고...","categories": ["Ethereum"],
        "tags": ["Blockchain","Ethereum","geth"],
        "url": "http://localhost:4000/ethereum/private_network_using_geth/",
        "teaser": null
      },{
        "title": "Web3j를 이용하여 ERC20 토큰 다뤄보기",
        "excerpt":"Web3j란? @그림 1: Web3j에 대한 간략한 구조 - 출처: docs.web3j Web3j는 이더리움 네트워크와 통신하거나 스마트컨트랙트를 배포 및 호출하는 등 전반적인 클라이언트 기능을 구현할 수 있도록 제공하는 자바 기반의 라이브러리이다. 비슷한 종류로 노드기반의 Web3js가 존재한다. 일반적으로 노드 기반의 Web3js가 널리 사용되는데, 웹 기반으로 구성되는 대부분의 이더리움 클라이언트의 성질을 반영한다고 보면 된다....","categories": ["Ethereum"],
        "tags": ["Blockchain","Ethereum","web3j","java"],
        "url": "http://localhost:4000/ethereum/erc20_using_web3j/",
        "teaser": null
      },{
        "title": "Github 리포지토리에 Token 적용하기",
        "excerpt":"Password -&gt; Token 2021년 8월 13일 기준으로 깃헙에서 기존의 패스워드 방식의 인증을 더이상 사용하지 않고 토큰을 이용하여 사용자를 인증하겠다고 발표했다. 이미 필자는 토큰 방식으로 변경해놓은 상태이지만, 오늘 만료기간이 지나 토큰을 재생성해야 하는 상황이 생겼고 이를 기록으로 남겨놓으면 좋을 것 같다고 생각하여 글을 작성한다. 토큰 생성 토큰을 생성하는 방법에 대해서는 여러...","categories": ["Tools"],
        "tags": ["Tools","Github"],
        "url": "http://localhost:4000/tools/githubtoken/",
        "teaser": null
      },{
        "title": "PoA 기반의 이더리움 네트워크 구축하기",
        "excerpt":"Dev mode와 PoW의 장단점 이전 포스팅 ‘Geth을 이용한 이더리움 dev mode 구성하기’에서 geth의 Dev mode를 활용한 네트워크 구성 및 이에 대한 장단점을 분석하고, 범용적인 테스트 환경의 이더리움 네트워크를 구축하기 위해 PoW 기반의 합의 알고리즘을 적용해보았다. 이를 간략하게 정리해보면 다음과 같다. 종류 장점 단점 Dev mode - 환경을 쉽게 구성할 수...","categories": ["Ethereum"],
        "tags": ["Blockchain","Ethereum","geth","poa"],
        "url": "http://localhost:4000/ethereum/poa_network/",
        "teaser": null
      },{
        "title": "맥에서 외장모니터 음향과 밝기를 키보드로 조절하기",
        "excerpt":"외장모니터 구매 작년 수많은 재택을 하면서 몸과 마음의 편안함은 얻었지만, 그와 동시에 허리아픔과 눈의 침침함을 얻게 되었다. 큰맘을 먹고 사무용 책상을 구매하면서 LG의 외장모니터도 같이 구매하게 되었는데, 맥에서는 울트라파인과 같이 공식모니터가 아닌 외장모니터를 사용하게 되면 키보드에 달려있는 버튼으로는 밝기나 음향조절이 불가능하다는 것을 알게 되었다. 사실 밝기야 크게 어려움이 없는데, 음향의...","categories": ["Tools"],
        "tags": ["Tools","외부모니터","음향밝기조절"],
        "url": "http://localhost:4000/tools/extramonitor/",
        "teaser": null
      },{
        "title": "블로그에 favicon 적용하기",
        "excerpt":"favicon favicon 즐겨찾기 아이콘. 즐겨찾기(favorites)와 아이콘(icon)의 합성어로, 주소창에 조그만 아이콘으로 표시되어 있다. 아이콘 에디터로 16x16 크기의 적당한 아이콘을 만든 후 그 이름을 favicon.ico로 한 다음 웹 사이트의 루트 디렉터리에 갖다 넣으면 된다. (출처: 아보느 포스트) favicon을 정상적으로 적용할 경우, 웹브라우저 상단에 내가 적용한 아이콘이 같이 표출된다. 적용 방법 아이콘으로 사용할...","categories": ["Tools"],
        "tags": ["Tools","favicon"],
        "url": "http://localhost:4000/tools/favicon/",
        "teaser": null
      },{
        "title": "회고록 - 2021년",
        "excerpt":"개인 끝나지 않았던 펜데믹 2021년에도 코로나로 인한 펜데믹이 이어지면서 여러 활동에 제약이 있었다. 오히려 100명 남짓한 확진자에도 두려워하던 2020년보다 10배 아니 100배가 넘는 확진자가 발생하고 있는 현재가 체감상으로는 더 두렵지만, 이제는 점점 이러한 상황이 익숙하게만 느껴진다. 어른아이 할 것 없이 집앞에 쓰레기를 버리러가는 상황에도 마스크는 필수로 착용하고 있고, 회사에서 누군가와...","categories": ["Retrospect"],
        "tags": ["회고"],
        "url": "http://localhost:4000/retrospect/2021_retrospect/",
        "teaser": null
      },{
        "title": "n을 이용하여 Nodejs 버전 간단하게 변경하기",
        "excerpt":"n n은 npm에서 제공하는 Nodejs 버전 관리용 패키지로, 이전까지는 nvm이 더욱 많이 사용되었다. 하지만 최근에는 n을 이용한 버전관리가 훨씬 많이 사용되는데, 이는 극도의 간편함 때문이라고 볼 수 있다. https://www.npmjs.com/package/n 설치 방법 $ sudo npm install -g n $ n --version # n의 버전을 확인할 수 있다. 사용 방법 n stable...","categories": ["Backend"],
        "tags": ["Backend","Nodejs","npm","n"],
        "url": "http://localhost:4000/backend/nodeversionchange/",
        "teaser": null
      },{
        "title": "JPA를 이용하여 Postgresql에 접속하기",
        "excerpt":"JPA(Java Persistence API) JPA에 대해서 간략하지만 자세하게 분석해놓은 글은 ‘JPA란? - 권희정‘을 참조하자. 간략하게 설명하면, 어플리케이션과 JDBC 사이에서 동작하는 ORM 기술 표준을 의미한다. 그렇다면 ORM(Object Relational Mapping)은 무엇일까? ORM은 객체와 테이블을 매핑해서 패러다임의 불일치를 개발자 대신 해결해주는 역할을 한다. &lt;그림 1: JPA에 대한 간략한 구성도 - 출처 : Gitbook&gt; Postgresql...","categories": ["Backend"],
        "tags": ["Backend","Web3j","Database","JPA","Postgresql"],
        "url": "http://localhost:4000/backend/jpa/",
        "teaser": null
      },{
        "title": "[📝 GoQuorum Docs] Architecture",
        "excerpt":"GoQuorum에 대한 High-level 구조도 &lt;그림 1: High-level 구조로 보는 GoQuorum&gt; Geth와 GoQuorum 간의 관계 ‘Geth에 대하여 포스팅한 내용‘이 있으므로, 이를 참조하면 좋다. Geth는 Go Ethereum의 약자로, 이더리움에서 스마트컨트랙트를 호출할 수 있도록 하는 공식 클라이언트 어플리케이션 중 하나를 말한다. GoQuorum은 기본적으로 Geth의 성질을 따라가지만, 이더리움의 Public한 환경이 아닌 Private한 네트워크를 구성하므로...","categories": ["Quorum"],
        "tags": ["Quorum","Blockchain"],
        "url": "http://localhost:4000/quorum/architecture/",
        "teaser": null
      }]
