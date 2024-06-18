---
layout: post
title:  "JPA를 이용하여 Postgresql에 접속하기" 
excerpt: "Web3j로 작성한 이더리움 클라이언트에 사용할 Postgresql 기반의 데이터베이스로 JPA를 이용하여 접속해본다."
date:   2021-03-08 15:00:00 +0900
categories: java
tags: [jpa, database, web3j, postgresql]
---

<br>

## JPA(Java Persistence API)

> JPA에 대해서 간략하지만 자세하게 분석해놓은 글은 '[JPA란? - 권희정](https://gmlwjd9405.github.io/2019/08/04/what-is-jpa.html)'을 참조하자.

간략하게 설명하면, 어플리케이션과 JDBC 사이에서 동작하는 ORM 기술 표준을 의미한다.  
그렇다면 ORM(Object Relational Mapping)은 무엇일까? ORM은 객체와 테이블을 매핑해서 패러다임의 불일치를 개발자 대신 해결해주는 역할을 한다. 

![image](https://user-images.githubusercontent.com/39115630/157138970-b19a4939-84f8-4d5b-8069-dc7b71a5a51c.png)  
*@그림 1: JPA에 대한 간략한 구성도 - 출처 : [Gitbook](https://ultrakain.gitbooks.io/jpa/content/chapter1/chapter1.3.html)*

<br>

## Postgresql 구성하기

인프런의 유명한 강사이신 김영한님께서 JPA에 대해 훌륭한 강의를 제공하시는데, 해당 강의에서는 h2로 간단한 데이터베이스를 구성한다.  
지난번 프로젝트에서 postgresql로 작성해서 mybatis로 연결해본 간략한 데이터베이스가 있어서, 이녀석을 JPA로 연결해보는 작업을 진행해보려고 한다.  

조금 더 자세한 내용에 대해서는 '[Docker로 postgreSQL Database 설치하기 - 취미로 코딩하는 개발자](https://devinlife.com/postgresql/run-postgresql-on-docker/)'를 참조하자.

### 1. Docker로 실행

```sh
$ docker run -d -v $PWD/data:/var/lib/postgresql/data \
  p 7070:5432 --name pgsql -e TZ=Asia/Seoul \
  -e POSTGRES_PASSWORD=postgrespw postgres:12
```
- Username : postgres(따로 작성하지 않으면 자동으로 postgres로 생성됨)
- Password : POSTGRES_PASSWORD의 값을 넣어준다.

### 2. 테이블 생성

테이블은 도커 내에서 실행할 수도 있고, 혹은 주어진 스크립트를 사용할 수도 있다.

#### 2.1. 도커 내에서 직접 실행

도커 내부로 진입한다.

```sh
$ docker exec -it pgsql bash
```

도커 내에서 postgresql을 실행한다.

```sh
$ psql -U postgres
``` 

테이블을 생성하는 스크립트를 실행한다. 아래 스크립트를 복사해서 실행된 postgresql 안에 붙여넣으면 된다.  

```sql
drop database if exists marketplacedb;
drop user if exists marketplace;

create database marketplacedb;

create user marketplace;
alter user marketplace with password 'marketplace';
GRANT CONNECT ON DATABASE marketplacedb TO marketplace;
GRANT ALL PRIVILEGES ON DATABASE marketplacedb TO marketplace;
```

마지막으로 예시로 사용할 컬럼들을 삽입한다. 총 5명의 사용자와 각 사용자들의 이더리움상 주소 및 개인키를 DB상에 보관한다.  

```sql
begin;

DROP TABLE IF EXISTS "public"."tb_user";
CREATE TABLE "public"."tb_user" (
    "user_id" bigint NOT NULL,
    "username" varchar(50) NOT NULL,
    "password" varchar(50) NOT NULL,
    "address" varchar(50) NOT NULL,
    "privatekey" varchar(100) NOT NULL,    
    PRIMARY KEY ("user_id")
);

INSERT INTO "public"."tb_user" ("user_id", "username", "password", "address", "privatekey") VALUES
('0', 'marketplace', '1111', '0xf70e0e6ba284481deb1d53765fce4a49df5e1624', '0x35c8bfc9b62d9613bb9abc56a6015c7470b0dcaa38d2c32bb461e660e67fa431'),
('1', 'user1', '1111', '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73', '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63'),
('2', 'user2', '1111', '0x627306090abaB3A6e1400e9345bC60c78a8BEf57', '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'),
('3', 'user3', '1111', '0xf17f52151EbEF6C7334FAD080c5704D77216b732', '0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f'),
('4', 'user4', '1111', '0x90d48232C2873a76f2547CDa324b3C8bc761374c', '0xa53e056ee968e2abe96d0ee178488606d9e3f140e1fe9d577a1a544cfa638a6d');

commit;
```

#### 2.2. 스크립트 사용

'[Github : nft-marketplace](https://github.com/wnjoon/nft-marketplace/tree/master/marketplace/database/postgresql)'에서 스크립트 및 이를 활용하는 방법을 확인할 수 있다.

### 3. DBeaver로 데이터베이스 확인하기

데이터베이스를 확인할 수 있는 다양한 방법이 있지만, 이 중 DBeaver를 사용해보고자 한다.  
무료이고, 간단한 작업은 다 확인가능하다.

#### 3.1. 설치

'[DBeaver Community - Downloads](https://dbeaver.io/download/)'에서 원하는 OS와 버전을 설치한다.

#### 3.2. 데이터베이스 접속

Postgresql에 접속할 것이기 때문에, 이를 선택한다.

![image](https://user-images.githubusercontent.com/39115630/157146573-6438d038-320b-4d3a-abf9-bff58c22ee2f.png)
*@그림 2: Postgresql 선택*

네트워크 접속 정보를 작성한다.

![image](https://user-images.githubusercontent.com/39115630/157146503-860ce5a7-2b6b-4744-95b4-ec3c3d295cc3.png)
*@그림 3: 접속할 데이터베이스 네트워크 설정*

- Host : 우리는 로컬호스트에 데이터베이스를 구축하였기 때문에, 해당 주소를 넣어준다.
- Port : 도커를 이용하여 7070 포트의 컨테이너를 생성하였기 때문에 이를 넣어준다.
- Database : 위에서 만든 데이터베이스를 넣어준다. 우리는 marketplacedb라는 데이터베이스를 만들었다.
- Username, Password : 도커로 컨테이너를 만들 때, 사용자명과 비밀번호를 같이 입력한 것을 알 수 있다. 

<br>

## 적용해보기

### 1. pom.xml

```xml
    <!-- JPA -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>

		<!-- postgre -->	
		<dependency>
			<groupId>org.postgresql</groupId>
			<artifactId>postgresql</artifactId>
		</dependency>	
```
Spingboot와 연결하기 위해서는 기타 다양한 dependency도 고려해야하지만, 우선 가장 필요한 두가지는 위와 같다.  
pom.xml의 업데이트 완료 후, mvn을 다시 install해주는 것을 잊지 말자.

### 2. 코드 작성

작성된 전체적인 데이터베이스 연결 소스는 '[Github : nft-marketplace/database](https://github.com/wnjoon/nft-marketplace/tree/master/marketplace/src/main/java/com/exercise/marketplace/user)'에서 확인할 수 있다.

#### 2.1. Model

Postgresql에 작성한 데이터베이스와 동일한 컬럼을 JPA를 통해 가져올 수 있도록 모델을 만들어줘야 한다.  
각 항목에 대한 설명은 주석으로 대체한다.

```java
package com.exercise.marketplace.user.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Data # 본 클래스가 JPA에서 사용할 모델이라는 것을 의미함
@AllArgsConstructor # 모든 컬럼이 들어간 생성자(constructor) 생성
@NoArgsConstructor # 아무런 컬럼도 없는 빈 생성자 생성
@Entity # 본 클래스가 JPA에서 사용될 엔티티라는 것을 의미함
@Getter # 각 컬럼 별 getter 자동 생성
@Setter # 각 컬럼 별 setter 자동 생성
@ToString # 클래스에 대한 toString 자동 생성
@Table(name = "tb_user") # 이 클래스는 위에서 생성한 tb_user라는 테이블과 매칭됨
public class UserInfo {
    
    @Id # 테이블의 id. 클래스 내에 꼭 하나는 있어야 함
    @GeneratedValue(strategy = GenerationType.AUTO) # 값을 incremental하게 자동으로 생성
    @Column(name = "user_id") # 해당 값이 데이터베이스 상 어떤 컬럼과 매칭되는지 연결
    private long user_id;
    
    @Column(name = "username")
    private String userName;

    @Column(name = "password")
    private String password;

    @Column(name = "address")
    private String address;

    @Column(name = "privatekey")
    private String privateKey;
}
```

#### 2.2. Repository

JPA와 연결되는 Repository를 생성한다.  

```java
package com.exercise.marketplace.user.repository;

import com.exercise.marketplace.user.model.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserInfo, Long> {
  # Long 타입의 ID를 기반으로 위에서 생성한 UserInfo 클래스에 맞는 엔티티를 반환한다.
  # interface 형태로 JpaRepository를 상속하기 때문에
  # ID 기반의 등록, 조회, 삭제 등 기본적인 기능들이 자동으로 제공된다.
}
```

![image](https://user-images.githubusercontent.com/39115630/157146635-766dbe6a-42a5-4839-9204-748d2d6888fa.png)
*@그림 4: JpaRepository를 통해 Override 할 수 있는 다양한 기능들*

#### 2.3. Service

위에서 만들어준 엔티티를 리포지토리를 통해 받아올 서비스 레벨을 작성한다.  
우리가 작성할 부분은 이 중 '입력된 ID에 해당하는 사용자 컬럼을 반환'하는 기능을 작성한다. 

```java
package com.exercise.marketplace.user.service;

import java.util.Optional;

import com.exercise.marketplace.user.model.UserInfo;
import com.exercise.marketplace.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

@Service("userService")
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    /*
     * Get User Info From Database using JPA
     */
    public ResponseEntity<UserInfo> getUserInfo(@PathVariable("user_id") long user_id) {
        
        Optional<UserInfo> user = userRepository.findById(user_id);
        if(user.isPresent()) {
            return new ResponseEntity<>(user.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    public UserInfo getUser(String user_id) {
        ResponseEntity<UserInfo> userByDatabase = getUserInfo(Long.parseLong(user_id));
        System.out.println(Long.parseLong(user_id));
        if(userByDatabase.getStatusCode() == HttpStatus.NOT_FOUND) {
            return null;
        }

        return userByDatabase.getBody();
    }
}
```

사용자는 다른 응용계층의 서비스에서 getUser 함수를 호출하고, 이 함수 내에서 JpaRepository를 통해 UserInfo를 받아오는 getUserInfo를 수행하도록 작성하였다. Postman에서 수행할 때 user_id를 문자열(String)으로 받아오고 이를 Long 타입으로 변환해서 넘겨주도록 작성해보았다.

<br>

## 참고자료
- [JPA란? - 권희정](https://gmlwjd9405.github.io/2019/08/04/what-is-jpa.html)
- [Gitbook - JPA](https://ultrakain.gitbooks.io/jpa/content/chapter1/chapter1.3.html)
- [Docker로 postgreSQL Database 설치하기 - 취미로 코딩하는 개발자](https://devinlife.com/postgresql/run-postgresql-on-docker/)
- [Spring Boot, JPA/Hibernate, PostgreSQL example with Maven - BezKoder](https://www.bezkoder.com/spring-boot-postgresql-example/)