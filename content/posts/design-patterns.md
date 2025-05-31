+++
title = "Making time to learn software design patterns"
description = "Exploring different design patterns in Python"
date = 2024-07-28T00:00:00Z
updated = 2024-07-28T00:00:00Z
draft = false
slug = "design-patterns"
+++

Inorder to write well structured, extensible, and readable code - design patterns help. I have recently started to read and follow more on this path. Until now, I didn't care much about these patterns (although some design patterns are just patterns we do frequently without knowing).

In 1994, 4 people came together to write the book `Design Patterns: Elements of Reusable Object-Oriented Software`. It became a standard for the design patterns and since then the book was also called as `The gang-of-four(gof) book`.

Before patterns, there are different types of patterns:

1. Creational Patterns: Patterns used to create classes/objects
2. Structural Patterns: Patterns used to connect different objects/classes
3. Behavioural Patterns: Patterns to take care of communication and responsibility between objects/classes

## Creational Patterns

#### Factory
Factory pattern is used to create objects instead of directly creating objects. This can be extended to create different types of objects.

```python
from abc import ABC, abstractmethod

class Factory(ABC):
    @abstractmethod
    def create(self):
        pass
	
class UserFactory(Factory):
    def create(self):
        return User()
		
class PostFactory(Factory):
    def create(self):
        return Post()
		
user_factory = UserFactory()
user1 = user_factory.create()
user2 = user_factory.create()
...

post_factory = PostFactory()
post1 = post_factory.create()
post2 = post_factory.create()
...
```

Factory, Abstract factory, Simple factory, etc... are nearly same. Read [this](https://refactoring.guru/design-patterns/factory-method/python/example) to find out the differences.

#### Singleton
Every time a class is called, an object is created. Singleton pattern is used to use a single object for the class however many times it is called.

This can be achieved by overriding the `__call__` method in python. We maintain a global instance object and see if its None or not None.

```python
class DatabaseConnectionSingleton:
    _instance = None

    def __call__(self):
        if DatabaseConnectionSingleton._instance is None:
            DatabaseConnectionSingleton._instance = self

        return DatabaseConnectionSingleton._instance
		
db_conn1 = DatabaseConnectionSingleton()
db_conn2 = DatabaseConnectionSingleton()
print(db_conn1 == db_conn2) # True, since its a singleton class
```

#### Builder
Instead of having a class which returns an object with completely arranged pieces, builder class has methods for individual parts which can be used by the objects.

```python
from abc import ABC

class ComputerBuilder(ABC):
    @abstractmethod
    def attach_monitor(self):
        pass
        
    @abstractmethod
    def attach_cpu(self):
        pass
        
    @abstractmethod
    def attach_keyboard(self):
        pass
        
    @abstractmethod
    def attach_mouse(self):
        pass
		
class PCBuilder(ComputerBuilder):
    def attach_monitor(self):
        print("attaching monitor to PC")
        
    def attach_cpu(self):
        print("attaching cpu to PC")
        
    def attach_keyboard(self):
        print("attaching keyboard to PC")
        
    def attach_mouse(self):
        print("attaching mouse to PC")

class Director:
    def __init__(self):
        self._builder = None

    def builder(self):
        return self._builder
        
    @builder.setter
    def builder(self, builder):
        self._builder = builder
        
    def build_single_monitor_pc(self):
        self._builder.attach_monitor()
        self._builder.attach_cpu()
        self._builder.attach_keyboard()
        self._builder.attach_mouse()
        
    def build_multi_monitor_pc(self):
        self._builder.attach_monitor()
        self._builder.attach_monitor()
        self._builder.attach_monitor()
        
        self._builder.attach_cpu()
        self._builder.attach_keyboard()
        self._builder.attach_mouse()

builder = ComputerBuilder()
director = Director()
director.builder = builder

director.build_single_monitor_pc()
director.build_multi_monitor_pc()
```

Here, we have a `ComputerBuilder` abstract base class. Using this, we build using the `PCBuilder` to build PCs with multiple configurations. Finally, the `Director` class is used in builder patterns to handle the assembling of parts. We have 2 methods `build_single_monitor_pc` and `build_multi_monitor_pc` using the builder.

Then, we use the director to build single monitor pc and multi monitor pc using the same builder class.

## Structural Patterns

#### Adapter Pattern
Adapter pattern is used to connect old/incompatible classes with required usecases. For example, there is a old class `OldClass` which has a `call_specific_api_and_get_weather_data` method.
But, the response from this method is much different than the latest classes use. We do not want to modify this `OldClass` since it might break something.

Hence we add a adapter inbetween to translate the response from the OldClass method.

```python
class OldClass:
    def call_specific_api_and_get_weather_data(self, city):
        ...
        return {"result": { "city": "city1", "weather": {...} } }

class LatestClass:
    def request_weather(self, city):
        ...
        return { "city": "city1", "weather": "25 C" }

class WeatherAdapter(OldClass, LatestClass):
    def request_weather(self, city):
        old_response = self.call_specific_api_and_get_weather_data(city)
        return { "city": city, "weather": old_response.get("result", {}).get("weather") }

def caller(target, city):
    target.request_weather(city)

target = LatestClass()
adaptee = WeatherAdapter()

caller(target, "Chennai")
caller(adaptee, "Chennai")
```

We have converted the `OldClass` api response to something the client can understand.

#### Facade Pattern
This pattern helps to do operations at a single place in a complex system with many interfaces, APIs.

```python
class Facade:
    def __init__(self, a, b):
        self._a = a
        self._b = b
        
    def get_random_number(self):
        return self._a.random() + self._b.random()
		
class A:
    def __init__(self):
        pass

    def random(self):
        return rand(100)

class B:
    def __init__(self):
        pass

    def random(self):
        return rand(1000)
		
a = A()
b = B()
facade = Facade(a, b)
print(facade.process()) # a.random() + b.random()
```

All the above code does is that: it adds 2 random numbers by calling `random()` function of those objects. Just that, in the `Facade` class we use the a and b objects to get a result.

## Behavioural Patterns

#### Command Pattern
The Command pattern is used when one wants to do an operation but make it extensible use objects instead of directly doing the operation.

```python
from abc import ABC, abstractmethod

class Command(ABC):
    @abstractmethod
    def execute(self):
        pass
		
		
class HelloWorldCommand(Command):
    def __init__(self, name):
        self.name = name
        
    def execute(self):
        print(f"Hello, {self.name}")
		
HelloWorldCommand("python").execute() # Hello, python
```

#### Strategy Pattern
The Strategy pattern uses a context variable to interchange strategy whenever required.

```python
from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self):
        pass
		
class CreditCardPaymentStrategy(PaymentStrategy):
    def pay(self):
        print("Paying via credit card")

class CashPaymentStrategy(PaymentStrategy):
    def pay(self):
        print("Paying via cash")
		
class PaymentContext(ABC):
    def __init__(self, strategy: PaymentStrategy):
        self._strategy = strategy

    @property
    def strategy(self):
        return self._strategy

    @strategy.setter
    def strategy(self, strategy: Strategy):
        self._strategy = strategy
        
    def process(self):
        ...
        self._strategy.pay()
        ...
	
context = PaymentContext(CashStrategy())
context.process() # pay using cash

context.strategy = CreditCardPaymentStrategy()
context.process() # pay using credit-card
```

#### State Pattern
The State pattern is used when modifying the state of the class in-between. This is helpful when there are a lot of switch statements in the flow.

For example, a Vending machine starts with an `IdleState`. When a coin is inserted, it moves to `HasCoinState`. The same actions will be available for both states, but the implementation depends on the logic of the application. Here, when the machine is in IdleState, we cannot dispatch the food whereas in HasCoinState, we can dispatch the food if there is required amount in the machine.

```python
from abc import ABC, abstractmethod

class State(ABC):
    @abstractmethod
    def insert_coin(self, machine, amount):
        pass

    @abstractmethod
    def return_change(self, machine):
        pass
        
    @abstractmethod
    def select_product(self, machine, price):
        pass
		
class IdleState(State):
    def insert_coin(self, machine, amount):
        machine.amount += amount
        machine.set_state(HasCoinState())

    def return_change(self, machine):
        print("No coins to return")
        
    def select_product(self, machine, price):
        print("Add coins to select product")

class HasCoinState(State):
    def insert_coin(self, machine, amount):
        machine.amount += amount

    def return_change(self, machine):
        return machine.amount
        
    def select_product(self, machine, price):
        if machine.amount <= price:
            print("Selecting product")
            machine.amount = price - machine.amount
            if machine.amount == 0:
                machine.set_state(IdleState())
        else:
            print(f"Add {price-machine.amount} coins to select product")

class VendingMachine:
    def __init__(self):
        self.state = IdleState()
        self.amount = 0
        
    def set_state(self, state):
        self.state = state
        
    def insert_coin(self, amount):
        self.state.insert_coin(self, amount)
        
    def select_product(self, price):
        self.state.select_product(self, price)
        
    def return_change(self):
        self.state.return_change(self)

v = VendingMachine() # IdleState
v.insert_coin(5) # HasCoinState
v.insert_coin(5)
v.select_product(10) # IdleState, since machine.amount = 0

v.return_change()

v.select_product(10) # no coins in the machine
```

#### Observer Pattern
As the name says, observer pattern is used to push updates/notifications to the registered observers.

```python
import time

class Observer:
    def __init__(self):
        self._observers = []

    def attach(self, observer):
        self._observers.append(observer)
        
    def detach(self, observer):
        self._observers.remove(observer)
        
    def notify(self, stock_name, stock_price):
        for observer in self._observers:
            observer.notify(stock_name, stock_price)
            
    def get_and_update_stock_price(self, stock_name):
        stock_price = api_response.get(stock_name)
        self.notify(stock_name, stock_price)

class StockPriceObserver(Observer):	
    def notify(self, stock_name, stock_price):
        print("Stock {stock_name} updated with latest value {stock_price}")
		
observer = Observer()
stock_price_observer = StockPriceObserver()

observer.attach(stock_price_observer)

while True:
	observer.get_and_update_stock_price()
	time.sleep(10)
```

These are some the design patterns that exists - refer [refactoring.guru](https://refactoring.guru/design-patterns) for more exhaustive list of patterns.