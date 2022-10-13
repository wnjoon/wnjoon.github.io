---
layout: post
title:  "그래프(Graph)와 탐색(DFS, BFS) 방법" 
excerpt: "그래프는 노드와 노드를 연결하는 간선(edge)의 모음으로, 트리는 그래프의 한 종류이다. 그래프의 탐색 방법은 코딩테스트에서 가장 많이 나오는 유형으로, 깊이 우선 탐색(DFS)과 넓이 우선 탐색(BFS) 방법이 있다."
date:   2021-09-15 15:00:00 +0900
categories: algorithm
tags: [graph, DFS, BFS]
---

<br>

## 그래프(Graph)

그래프는 노드와 노드를 연결하는 간선(edge)의 모음이다. 트리와 헷갈리는 경우가 가끔 있는데, 트리는 그래프의 한 종류다.  
하지만 모든 그래프가 트리라고 볼 수는 없다. 트리와 그래프는 사이클의 유무로 결정되는데, <u>트리는 사이클이 없는 하나의 연결된 그래프(connected graph)</u>이다. 

그래프의 특징을 정리해보면 다음과 같다.
- 그래프는 방향성이 있을 수도, 혹은 없을 수도 있다. 방향성이 있다면 일방통행, 없다면 양방통행이다.
- 그래프는 여러 개의 고립된 그래프(isolated subgraphs)들로 구성될 수 있다. 노드와 노드 사이에 경로가 존재한다면, 연결 그래프라고 표현한다.
- 그래프에는 사이클이 존재할 수도, 혹은 없을 수도 있다. 사이클이 없는 그래프는 비순환 그래프(acyclic graph)라고 표현한다.

<br>

## 탐색

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbF2qFL%2Fbtrfc7qkp7P%2FAsJnzmkeLxhanBcMXKQ3g0%2Fimg.png)  
*@그림 1: DFS와 BFS 각각에 따른 그래프 탐색 순서*

### DFS(Depth-First Search)

깊이 우선 탐색이라고 부르며, 특정 노드로부터 시작하여 다음 분기(branch)로 넘어가기 전에 해당 분기에 대한 모든 조건을 탐색하는 방법을 말한다.  
주로 그래프에서 모든 노드를 빠짐없이 탐색하고자 할 때 사용한다. 재귀(Recursive) 방식으로 구현하는데, 주의해야할 사항은 어떤 노드를 방문했고 아직 방문하지 않았는지에 대한 여부를 꼭 기록해두어야 한다. 그렇지 않으면 프로그램의 종료 시점을 체크할 수 없기 때문에 무한루프가 될 가능성이 크다.

```java
void dfsSearch(Node node) {
    if (node != null) {
    	visit(node);

        // 방문 여부 체크
        node.visited = true;    
        
        for each (Node n in node.adjacent) {
        	if (n.visited == false) {
            	dfsSearch(n);
            }
        }
    }
}
```

### BFS(Breadth-First Search)

넓이 우선 탐색이라고 부르며, 특정 노드로부터 시작해서 인접한 노드를 먼저 모두 탐색하는 방식이다.  
두 노드간 최단 경로를 탐색하거나 혹은 임의의 노드로 갈 수 있는 최적의 경로를 확인하고 싶을 때 사용한다. 큐(Queue)를 이용하여 구현되는데, DFS와 동일하게 어떤 노드를 방문했는지에 대해 꼭 기록해두어야 한다. 

```java
void bfsSearch(Node node) {
    Queue queue = new Queue();
    node.marked = true;

    // 인접한 노드를 큐에 삽입
    // 큐는 삽입 순서대로 실행되기 때문에, 인접한 노드부터 우선 검색한다.
    queue.enqueue(node);	
    
    while (!queue.isEmpty()) {

        // 큐에서 노드 가져오기
    	node r = queue.dequeue();	
        visit(r);
        foreach(Node n in r.adjacent) {
            if (n.marked == false) {
            	
                // 방문 여부 체크
                n.marked = true;
                queue.enqueue();
            }
        }
    }
}
```

## 참고자료 
- Cracking The Coding Test - 그래프

