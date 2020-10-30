## Installation of NodeJs and NPM (Node Package Manager)
* NodeJs
```
sudo apt install nodejs
```
* NPM
```
sudo apt install npm
```
* Check version
```
node -v
```
Note: v12.11.1

## Initialize the service (local):

* Install dependencies
```
npm install
```

## Database configuration
* Path: config / config.default.js rename to config.js 
```
const config = {
  innovationsFonden: {
    hostNeo4j: '',
    userNeo4j: '',
    passNeo4j: '',
    endpoint: ''
  }
}

```

* Run command to up service
```
npm run dev
```

Note : nodejs server as debug.


## Use the service
* Open Postman

Note: To install postman go to https://www.postman.com/

URL: 127.0.0.1:3000/api/v1/vosviewer/cypher

Method: POST

Body:
```
{
    "cypher":"MATCH (o1:Topic)--(d:Document)--(o2:Topic) MATCH (d)--(org:Organisation) WHERE ID(o1)<ID(o2) AND ((o1.titlealias = 'Social Sciences' AND o2.titlealias = 'Social Sciences')) AND ID(org) = 978732",
    "limit": 10
}
```
Response:
```
{
    "message": "successful",
    "url": "https://app.vosviewer.com/?json=http://0.0.0.0:3000/cypher_files/07242a5ddf44e519bd6245bb296c2399.json"
}
```



Official url:  https://opera-vos-services.dataverz.com/api/v1/vosviewer/cypher

Body:
```
{
    "cypher":"MATCH (o1:Organisation {TwoorMoreDKUniv: 'true'})--(d:Document)--(o2:Organisation {TwoorMoreDKUniv: 'true'}) MATCH (d)--(o:Organisation) WHERE (o1.targetdkuniversities = 'true' AND o2.targetdkuniversities = 'true') AND ( TOINTEGER(d.`when-year`) >= 2014 AND TOINTEGER(d.`when-year`) <= 2019 )",
    "limit": 1000,
    "cache": false
}
```

response:
```
{
    "message": "successful",
    "url": "https://app.vosviewer.com/?json=https://opera-vos-services.dataverz.com/cypher_files/opera_ed14d9c32e8c8684b40ecc5e4080a5fc.json"
}
``` 