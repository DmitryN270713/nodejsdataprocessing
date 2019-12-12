'use strict'

const sha1 = require('sha1')

// DB worker
const dbWorker =  async (db) => {

    const collection = db.collection('qsas')
    await collection.createIndex({ id: 1 }, { sparse: true, unique: true })

    // Placeholder for now
    const getAllData = (toskip, perreq) => {
        return new Promise((resolve, reject) => {
            const projection = {_id: 0, weather: 0}
            const qaPairs = []
            const addQA = (qaPair) => {
                qaPairs.push(qaPair)
            }
            const sendQA = (err) => {
                if (err) {
                    return reject(new Error(`An error occured fetching all QA pairs: ${err}`))
                }
                
                resolve(qaPairs.slice())
            }
            const cursor = collection.aggregate([{ $skip: parseInt(toskip) }, { $limit: parseInt(perreq)}, { $project: projection}])
            cursor.forEach(addQA, sendQA)
        })
    }

    // Placeholder for now
    const getQAData = (id) => {
        return new Promise((resolve, reject) => {
            const projection = { _id: 0, id: 0 }
            
            const sendQA = (err, qaPair) => {
                if (err) {
                    return reject(new Error(`An error occured fetching QA pair for: ${id}, err: ${err}`))
                }
                
                resolve(qaPair)
            }

            collection.findOne({ id: id }, { projection: projection }, sendQA)
        })
    }

    const addNewQuestionAnswer = (intent, question, answer) => {
        return new Promise((resolve, reject) => {
            const sendInsertQA = (err, newQA) => {
                if (err) {
                    return reject(new Error(`An error occured adding new QA pair ${err}`))
                }
                
                resolve(newQA)
            }
            
            collection.insertOne({ id: sha1(question), intent: intent, question: question, answer: answer }, sendInsertQA)
        })
    }

    // Placeholder for now
    const removeQuestionAnswer = (id) => {
        return new Promise((resolve, reject) => {
            const sendRemoved = (err, id) => {
                if (err) {
                    return reject(new Error(`Cannot remove specified Question and Answer pair: ${err}`))
                }

                resolve(id)
            }

            collection.deleteOne({id: id}, sendRemoved)
        })
    }

    // Disconnect from DB
    const disconnect = () => {
        db.close()
    }

    return Object.create({
        getQAData,
        getAllData,
        addNewQuestionAnswer,
        removeQuestionAnswer,
        disconnect
    })
}

const establishConnection = (connection) => {
    return new Promise((resolve, reject) => {
        if (!connection) {
            return reject(new Error("Connection object was not provided"))
        }

        resolve(dbWorker(connection))
    }).catch((err) => {
        console.error(err)
    })
}

module.exports = Object.assign({}, {establishConnection})