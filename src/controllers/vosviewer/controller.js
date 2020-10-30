const neo4j = require('neo4j-driver')
const crypto = require('crypto')
const fs = require('fs').promises
const config = require('../../../config/config')
module.exports = class VosViewerController {
  constructor () {
    this.create = this.create.bind(this)
  }

  async create (req, res) {
    try {
      const pathFile = 'public/cypher_files'
      const formData = req.body
      const account = (formData.account) ? formData.account : 'opera'
      if (!formData.cypher) return res.status(400).send({ message: 'cypher field required' })
      const limit = (formData.limit) ? formData.limit : 1000
      const driver = neo4j.driver(
        config[account].boltNeo4j,
        neo4j.auth.basic(config[account].userNeo4j, config[account].passNeo4j)
      )

      const query = []
      let returnQuery
      if (formData.returnQuery) {
        returnQuery = formData.returnQuery
      } else {
        returnQuery =
        `
        RETURN  ID(o1) AS source_id,  
        o1.title AS source_title,  
        o1.defaultid as source_defaultid,  
        ID(o2) AS target_id,  
        o2.title AS target_title,  
        o2.defaultid as target_defaultid,  
        COUNT (DISTINCT d) AS weight ORDER BY weight DESC LIMIT ${limit}
        `
      }

      query.push(formData.cypher)
      query.push(returnQuery)
      const cypher = query.join('\n')
      console.log(cypher)

      const session = driver.session()
      const nodes = []
      const links = []
      const hashNameJson = crypto.createHash('md5').update(cypher).digest('hex') + '.json'
      const nameFile = `${account}_${hashNameJson}`
      console.log(cypher)
      if (!formData.cache) {
        try {
          await fs.unlink(`${pathFile}/${nameFile}`)
        } catch (e) {
          console.log('not exists')
        }
      }

      const url = `${config[account].hostVos}/?json=https://${config[account].host}/cypher_files/${nameFile}`
      const isFileExists = await this.fileExists(`${pathFile}/${nameFile}`)

      if (isFileExists) {
        return res.status(200).send({ message: 'successful', url: url })
      }

      session
        .run(cypher, {})
        .then(async result => {
          if (result.records.length > 0) {
            for (const record of result.records) {
              nodes.push({ id: record.get('source_id').toString(), label: record.get('source_title') })

              nodes.push({ id: record.get('target_id').toString(), label: record.get('target_title') })

              links.push({
                source_id: record.get('source_id').toString(),
                target_id: record.get('target_id').toString(),
                strength: parseInt(record.get('weight'))
              })
            }
            var uniqueArray = await this.removeDuplicates(nodes, 'id')
            const response = {
              network: {
                items: uniqueArray,
                links: links
              }
            }

            await fs.writeFile(`${pathFile}/${nameFile}`, JSON.stringify(response))

            return res.status(200).send({ message: 'successful', url: url })
          } else {
            await fs.writeFile(`${pathFile}/${nameFile}`, JSON.stringify({
              network: {
                items: [],
                links: []
              }
            }))

            return res.status(200).send({ message: 'successful', url: url })
          }
        })
        .catch(error => {
          console.log(error)
          res.json('error query')
        })
        .then(() => session.close())
    } catch (e) {
      console.log(e)
      res.status(500).send({ internalCode: '500', message: e })
    }
  }

  async removeDuplicates (originalArray, prop) {
    var newArray = []
    var lookupObject = {}

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i]
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i])
    }
    return newArray
  }

  async fileExists (path) {
    try {
      if (await fs.lstat(path)) {
        return true
      }
    } catch (e) {
      return false
    }
  }
}
