Crowd Survey API
================

Crowd Survey Backend using [LoopBack](https://strongloop.com/node-js/loopback-framework/)

Install
-------

### Requirements

#### Main dependencies
- nodeJS
- npm
- mongodb


##### CentOS
```
yum install mongodb-server.x86_64
yum install mongodb.x86_64
yum install nodejs-npm-registry-client.noarch
yum install npm.noarch
```


### Installing from source

```
git clone https://github.com/edina/crowdsurvey-api
cd crowdsurvey-api
npm install
```

Development
-----------

Not essential but if you want to use some tools from strongloop (Scaffolding, Arc Console, Process Manager) install them for the user using:

```
npm install -g strongloop
```



Run
---

```
cd crowdsurvey-api
node .
```