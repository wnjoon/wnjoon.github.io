---
layout: post
title:  "Managing Complex Application Architectures with Apache Kafka"
description: Apache Kafka is an open-source distributed event streaming platform originally developed by LinkedIn.
date:   2022-12-23 15:00:00 +0900
categories: kafka
keywords: kafka
comments: true
---

## Table of Contents

- [Summary](#summary)
- [The Growing Complexity of Application Structures](#the-growing-complexity-of-application-structures)
- [What is Kafka?](#what-is-kafka)
- [Key Features of Kafka](#key-features-of-kafka)
- [High Availability: Partition Replication](#high-availability-partition-replication)
- [Kafka Partitioner](#kafka-partitioner)
- [Consumer Lag](#consumer-lag)

## Summary

Reasons to use Kafka:

- Decouples source and target applications
- Scalable & Fault-Tolerant architecture
- Supports high-throughput data streaming
- Flexible partitioning and replication
- Handles real-time data processing efficiently

## The Growing Complexity of Application Structures

As the number of source (sending) and target (receiving) applications increases, data pipelines become more complex, requiring efficient data processing systems.

![image](https://user-images.githubusercontent.com/39115630/209517275-c2b158c6-01d8-47f1-b15f-a01e1201f57d.png)
@Figure 1: Increasing complexity in application data pipelines

Challenges of Complex Data Pipelines:

- Difficult Deployment: More dependencies lead to complex release cycles.
- Harder Issue Detection: Identifying failure points becomes challenging.
- Protocol Diversity: Different applications use different communication methods, increasing processing workload.

## What is Kafka?

Apache Kafka is an open-source distributed event streaming platform originally developed by LinkedIn.
If you’re interested in Kafka’s implementation at LinkedIn, check out [Kafka Ecosystem at LinkedIn](https://engineering.linkedin.com/blog/topic/kafka).

### Why Use Kafka?

Kafka’s primary goal is to decouple source and target applications, ensuring:

- Producers (source applications) only need to send data to Kafka.
- Consumers (target applications) only need to fetch data from Kafka.

For example, in an e-commerce system:

- Source Applications (Producers): Log user actions (e.g., product clicks, purchases).
- Target Applications (Consumers): Store and process logs.
- Kafka: Acts as a central hub, reducing system dependencies.

### Benefits of Kafka

- Fault Tolerance – Handles failures without losing data.
- Low Latency & High Throughput – Efficiently processes large volumes of real-time data.

![image](https://user-images.githubusercontent.com/39115630/209498379-9f169a13-7c74-4575-af84-71e5049b29d7.png)
@Figure 2: Kafka simplifies the architecture by providing a unified event streaming platform. ([reference](https://www.youtube.com/watch?v=waw0XXNX-uQ&t=87s))

![image](https://user-images.githubusercontent.com/39115630/209517445-4d67d84c-0da9-4d47-847b-85dd2e8c89c2.png)
@Figure 3: How Kafka facilitates data transmission between producers and consumers.

## Key Features of Kafka

### 1. Topics

Kafka organizes data into topics (message queues).

- Producers send messages to topics.
- Consumers subscribe to topics to retrieve messages.

![image](https://user-images.githubusercontent.com/39115630/209517498-68e12f8b-092d-47a7-ac92-9a85a3bb9e94.png)
@Figure 4: Kafka Topics - Message queues for data processing.

Characteristics of Kafka Topics:

- Multiple topics can exist in Kafka, similar to database tables or file system folders.
- Topics have unique names to ensure clarity and maintainability.

### 2. Partitions

Kafka splits topics into partitions to distribute data across multiple brokers.

![image](https://user-images.githubusercontent.com/39115630/209517559-f91efd2b-8c6a-4271-9b1c-add89e7087a6.png)
@Figure 5: Kafka partitions - distributing data across multiple consumers.

Advantages of Partitions:

- Fault Tolerance: If a server fails, Kafka can recover data.
- Parallel Processing: Multiple consumers can read different partitions simultaneously.
- Multi-System Integration: The same data can be ingested into multiple platforms (e.g., Elasticsearch, Hadoop).

How Kafka Assigns Data to Partitions:

- Without a key: Data is assigned using Round Robin.
- With a key: Data is sent to a partition based on its hash value.

Important while managing partitions:

- Increasing partitions is allowed.
- Decreasing partitions is not possible once they are created.

When to Increase Partitions:

- If consumer count increases, partition count should also increase.
- More partitions -> More consumers -> Faster parallel processing.

### 3. Partition Retention & Deletion

Messages are not immediately deleted after being read.
Kafka retains messages for new consumers or in case of re-processing.

Conditions for Retaining Messages:

- A different consumer group requests the data.
- The consumer offset reset policy allows access (`auto.offset.reset` = earliest).

Message Deletion is Configurable:

- `log.retention.ms`: Maximum time a message is stored.
- `log.retention.bytes`: Maximum size of stored messages.

## High Availability: Partition Replication

### 1. Brokers

A Kafka broker is a server running Kafka.
Recommended setup: At least 3 brokers for redundancy.

Message Broker vs. Event Broker:

| Type | Function |
| --- | --- |
| Message Broker | Deletes messages after processing |
| Event Broker (Kafka) | Retains messages for later use |

### 2. Replication

Kafka replicates partitions across multiple brokers to prevent data loss.

![image](https://user-images.githubusercontent.com/39115630/209517629-d3b2010d-ef03-4fc8-ac67-f934bad93890.png)
@Figure 6: Kafka’s In-Sync Replica (ISR) mechanism for high availability.

#### Leader and Followers

- Leader Partition: Handles all writes and reads.
- Follower Partitions: Replicated copies of the leader.

#### Acknowledgment (acks) Levels

| acks Setting | Behavior | Speed | Data Loss Risk |
| --- | --- | --- | --- |
| 0 | No confirmation from leader or followers | Fastest | Highest risk |
| 1 | Leader confirms receipt, but followers may not replicate | Moderate | Some risk |
| all | Leader and followers confirm replication | Slowest | Minimal risk |

In the best practice, set `replication.factor = 3` for 3+ brokers.

## Kafka Partitioner

The partitioner decides how messages are assigned to partitions.

![image](https://user-images.githubusercontent.com/39115630/209518144-06a6f576-a118-49f3-b9f8-dc803ea95ea3.png)
@Figure 7: Kafka Producer Partitioning Strategy.

| Message Key | Assignment Strategy | Characteristics |
| --- | --- | --- |
| Yes | Uses a hash function on the key | Ordered processing |
| No | Round-robin distribution | Balanced distribution |

Example Use Case:

- For weather logs, using "Seoul" as a key ensures all "Seoul" logs go to the same partition, preserving order.

## Consumer Lag

Consumer Lag occurs when producers send data faster than consumers can process it.

![image](https://user-images.githubusercontent.com/39115630/209518167-0daa77dd-cfe5-4f6e-83a5-9c7ecd444717.png)
@Figure 8: Consumer lag – The gap between producer and consumer processing speed.

In the consumer lag diagram, the left side represents the last offset read by the consumer, while the right side shows the last offset delivered by the producer.

### Why is Consumer Lag a Problem?

- Causes delays in data processing.
- Can overload Kafka, reducing performance.

### Monitoring Consumer Lag

- Avoid consumer-based monitoring, as failures prevent lag reporting.
- Use Burrow (by LinkedIn) for real-time lag monitoring.

#### Burrow

- Monitors multiple Kafka clusters.
- Categorizes consumer status as ERROR, WARNING, OK.
- Provides HTTP APIs for integration.
