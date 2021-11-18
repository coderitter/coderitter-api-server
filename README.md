# Coderitter API Architecture

<img src="./readmeFiles/coderitterApi.png" alt="My cool logo"/>

The Coderitter API Architecture is a cloud application architecture which emphasizes programming instead of configuring. It is not a framework but a guidance on how to program.

## Features

- Development, testing and production configurations
- Change log levels without rebooting the server
- Sophisticated data validation
- Library-styled ORM
- Database transactions
- Database migrations
- **Tracking of database changes to support offline apps and an undo functionality**
- **Powerful generalized data API**
- Remote Method Call API instead of REST API
- Business-logic to API approach
- Support for API versions
- Typed JSON lets you recreate the exact type of an object when deserializing
- **Subscription to WebSocket-based data change events to support instant UI updates in your apps**
- No framework but architectural patterns in combination with libraries
- Very lean, very little dependencies

## Programming instead of configuring

Frameworks are blackboxes which hide their inner workings. They are supposed to be adjusted by configuring them. For example, the programer can set certain properties or provide a piece of code which then at a later point in time is executed by the framework. The programer gives control to the framework.

There are a few problems arising from this approach. While frameworks hide details to create certain layers of convenience, it is at the same time very unconvenient if something does not work as expected or is not supported. In these cases a framework needs to rely on excellent documentation. Documentation has the problems that it can be hard to understand, that details are missing or that it is not up to date.

If the documentation does not suffice, it is the next step to look at the framework source code. In the long, the programer has to understand what is going on inside a framework if she/he wants to make informed decisions.

Another problem is that the programer will rather earlier than later hit the limits of a framework. It then becomes really painful to work around its limitiations. A feature rich framework also become very complex real fast because every added framework feature can increase the complexity exponentially. The more opiniated a framework is, the harder it is for the framework designer to put all the opinions into it. A framework creator will need artisticly designed code to include every wanted feature. Eventually, that will make the code hard to understand.

These problems arises from the wish to hide the code which in turn enforces configurabilty. That is why the Coderitter API Architecture focuses on code which is visible to and adjustable by the programer. Instead of hiding the application flow it exposed. Complicated functionality is hidden in small and focused libraries which serve the programer as a hammer rather than a robot which is configured to swing the hammer.

The Coderitter API Architecture gives back control to the programer. Programming skills and styles can and must be developed and evolved. It brings back the craft and the fun.

## Overview

The server consists of domain objects which are stored in a PostgreSQL database. The business logic belonging to these domain objects is directly exposed via an HTTP API which is using a Remote Method Call style instead of REST. A WebSocket API delivers steady change events to all connected clients with which they keep their local data up to date.

### Docker

### Main entry point and services

The class `App` is the main entry point of the application. It uses the class `Services` to starts all services, including the HTTP server providing the HTTP API or the PostgreSQL database pool.

### Config

The file `config.ts` contains three configurations `dev`, `test` and `prod` by default. Dev is the base config which properties are selectively overwritten by the test and the prod config. There are two functions `getConfigByArgv` and `getConfigByEnv` to determine a config either by a given command line parameter or by a set environment variable.

### Log output

There is a `loglevels.json.template` file in the root of the server directory. Create a copy of it and rename it to `loglevels.json`. Now you can add filenames, function/method names and class names any combination to activate log levels for them. If you want to set a global log level you can use the key `globalLevel`. The logging facility that is used is [knight-log](https://github.com/c0deritter/knight-log). Please refer to its [documentation](https://github.com/c0deritter/knight-log#readme) for more information.

### A domain object

A domain object represents a thing of the domain you are programming software for. It is basically part of your data model and will be stored into the database. Here is one simple example.

```typescript
class Cow {
  id: number
  dataOfBirth: Date

  calculateAge(): number {
    return ...
  }
}
```

This class is also used in the browser application. Thus you can add any method to this class as long as it does not need to access the database or any other system resource which is only available on the server.

### The business logic

Every domain object also has a corresponding logic object which provides service dependent functionality like storing an object into the database or sending an email. In most cases does a logic object want to implement all or some CRUD methods. CRUD stands for create, read, update and delete. Also a count is useful most of the times.

This architecture uses a Remote Method Call API instead of a REST API. Methods of the logic object will be directly exposed to that API. The only requirement your business logic methods need to fullfill for this is that they have to return an instance of the `Result` class from package [coderitter-api-remote-method-call](https://github.com/c0deritter/remote-method-call/tree/coderitter-api). Instances of that class can be in one of the three states `value`, `misfit` or `remoteError`. The first one signalises that the remote method call was successful and that it returned a value. The second one signalises a misfit in the given parameters. It uses the class `Misfit` of package [knight-validation](https://github.com/c0deritter/knight-validation) to provide information about particular problems. The last one signalises that there was an unexpected error while executing the remote method call. Since the `Result` class does not define any property to store the result values, you need to sub class it.

```typescript
import { Result } from 'coderitter-api-remote-method-call'

class CowCreateResult extends Result {
  created: Cow

  constructor(cow?: Cow) {
    this.created = cow as any
  }
}
```

Here we use a little bit JavaScript style to be able to have no argument constructor but still not having to check if the `created` property exists before accessing it. We will need that no argument constructor later on when we want to convert from and to JSON.

Now we can define our basic business logic methods.

```typescript
import { Criteria, ReadCriteria } from 'knight-criteria'

class CowLogic {
  create(cow: Cow): Promise<CowCreateResult> {
    ...
  }

  read(criteria: ReadCriteria): Promise<CowReadResult> {
    ...
  }

  count(criteria: Criteria): Promise<CowCountResult> {
    ...
  }

  update(cow: Cow): Promise<CowUpdateResult> {
    ...
  }

  delete(cow: number): Promise<CowDeleteResult> {
    ...
  }
}
```

Methods `read` and `count` are using criteria objects from package [knight-criteria](https://github.com/c0deritter/knight-criteria). They offer a rich way to describe database queries as JavaScript objects.

### The Change object

There is already one object included in this package. The `Change` class is based on the package [knight-change](https://github.com/c0deritter/knight-change) which offers ways to describe changes and change subscription patterns. It is used to create a history of changes throughout your application. This is used for sending clients the changes that were made when they were not connected to the WebSocket API. Afterwards clients are up to date again and will display the newest data.

### Database migration

After you created your domain objects you will want to create the corresponding database schema. Since you will make changes to the schema during the development process you will need a way to migrate you database schema. This architecture uses the package [knight-pg-migration](https://github.com/c0deritter/knight-pg-migration) to solve this problem.

### Database schema

This architecture uses the package [knight-orm](https://github.com/c0deritter/knight-orm) to provide convenient and object-oriented means to access the database. This ORM is lightweight in the way that it does not have any automatic state management. It simply takes an object tree and put it inside the different tables of a database. To be able to do that it needs to be told on which way the objects map to tables. Please refer to the knight-orm [documentation](https://github.com/c0deritter/knight-orm#readme) to learn about how to do that.

### Database queries

You are free to access the database any way you like or you need. The most direct way is to create SQL strings which will be useful for very specific and optimized queries. If you need a little help with the concatination of strings you can use the package [knight-sql](https://github.com/c0deritter/knight-sql) which lets you describe a query in an object-oriented manner. This tool was designed to enable a natural looking flow which means that you can even put whole SQL string into it. You do not need to build the query through an endless chaining of methods that have many parameters.

The most sophistitated way to access the database is through the use of the functions of [knight-orm](https://github.com/c0deritter/knight-orm). There are five functions `create`, `read`, `count`, `update` and `delete`. Please refer to the [documention](https://github.com/c0deritter/knight-orm#readme) to learn about how to use them.

Another useful package might be [knight-sql-criteria-filler](https://github.com/c0deritter/knight-sql-criteria-filler) which takes criteria from the package [knight-criteria](https://github.com/c0deritter/knight-criteria) and fill them into a query of [knight-sql](https://github.com/c0deritter/knight-sql).

### Database transactions

Database transactions rely on the package [knight-pg-transaction](https://github.com/c0deritter/knight-pg-transaction). It provides a simple yet useful class to begin, commit and rollback PostgreSQL database transcations. This architecture defines a sophisticated `ChangeSendingTransaction` which is to be used in conjunction with `create`, `update` and `delete` functionality. This kind of transaction will send a change event to all clients via the WebSocket API. That way every connected client stays up-to-date.

### Demo data

To create demo data you can use and fill the class `DemoData`. The NPM specific file `package.json` defines a script `demoData` which you can execute with `npm run demoData`. It will create your demo data.

### HTTP API

The HTTP API is based Remote Method Call instead of REST. The data is transfered with via a POSTonly HTTP usage style instead of the REST usage style. While the latter one uses every possible location of an HTTP message to put data into,  POSTonly puts its data solely in the HTTP body and uses the HTTP request method POST only.

The class `HttpApi` appends a simple request listener to a native Node HTTP server which handles the POSTonly styled request, tries to execute the Remote Method Call and sends back a `Result` object to the client. It uses package [coderitter-api-remote-method-call](https://github.com/c0deritter/remote-method-call/tree/coderitter-api) which contains the interface `RemoteMethodCall` and the `Result` class.

To define which of your methods is called through a remote method call you can use the package [coderitter-api-remote-method-api](https://github.com/c0deritter/remote-method-api/tree/coderitter-api). It contains a class which provides a simple mapping from a remote method name to a function.

### WebSocket API

### Testing