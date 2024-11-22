# Forum Api

### Flow coding
1. First, create feature entities. entities is like schema of payload request and response with their validation
2. Then, create feature repository abstraction. repository is class that store all method in this feature
3. create feature usecase. usecase like implementing repository abstraction with real functionality and call real implementation method in real repository
4. create real repository, real repository is implementation of repository abastraction. all logic of this feature, database query done here
5. create feature inteface http. route and handler of http request
6. Register interface http to http server
7. Register real repository and usecase in container (Dependency Injection)
8. Register domain error to domain error translator

### TDD
Every step in Flow Coding must begin with writing their unit test ...