+++
title = "RabbitMQ #1: Understanding RabbitMQ"
description = "Understanding the basic terms of RabbitMQ and how a basic producer/consumer works"
date = 2024-02-25T00:00:00Z
updated = 2024-02-25T00:00:00Z
draft = false
slug = "rabbitmq-p1"
+++

RabbitMQ is a popular message broker. For some time, i have been working on the same but something didn't sit in my mind. So, i got back to the basics and started from scratch again.
This blog will try to cover how RabbitMQ works and the basics.

## Basics of RabbitMQ

There are few terms which are needed to understand how Rabbitmq works.
- Queue
- Exchange
- Producer
- Consumer
- Bind

#### Queue
Queue is the place where messages are sent. Messages are enqueued/dequeued from the queue.
#### Exchange
Every message needs to go to the queue via an exchange. There are different purpose exchanges, but the idea is that: a message can be enqueued to the queue only by an exchange.
#### Producer
Anyone who pushes message to the exchange is a Producer. There can be multiple producers for a queue.
#### Consumer
Anyone who consumes message from the queue is a Consumer. There can be multiple consumers for a queue.
#### Bind
Before the exchange can send the message to a queue, it needs to be binded to the queue. So that the exchange can be sure to which queue(s) it has to send the message to.

## A very basic producer and consumer
Lets say, I have a producer and a consumer; and I want to produce and consume from a queue.

```py
queue_name = "first_queue"
connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
channel = connection.channel()
channel.queue_declare(queue_name)
channel.basic_publish(exchange="", routing_key=queue_name, body="hello, world")
```
Here, we create a connection and then a channel. We can use this channel to make operations.

#### queue_declare
Whenever we're going to use a queue, we need to make sure it exists. Hence, we do a `queue_declare`. 
#### basic_publish
Used to publish a message to a queue via an exchange. If the `exchange_name` is empty, RabbitMQ will use the default exchange. `routing_key` is the queue to which the message is to be delivered.

Let us now consume from the queue `first_queue`

```py
queue_name = "first_queue"
connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
channel = connection.channel()
channel.queue_declare(queue_name)
def callback(ch, method, properties, body):
    print(f" [x] Received {body}")

def consume(queue_name):
    channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
    channel.start_consuming()

consume(queue_name)
```
We're mostly doing the same thing, creating a connection, channel, declaring the queue. But instead of `basic_publish`, we're using `basic_consume` and `start_consuming`

#### basic_consume
This tells RabbitMq that the client is subscribing to consume from the given queue. And when messages are received send it to the function given in `on_message_callback`.
#### start_consuming
This is a blocking function call. It blocks the thread and listens to the messages coming in to the given queue.

This is how a basic producer and a consumer works. If you want multiple consumers listening to different queues, use threads and invoke each `start_consuming()` in a separate thread.

References

[https://www.rabbitmq.com/tutorials/tutorial-one-python](https://www.rabbitmq.com/tutorials/tutorial-one-python)