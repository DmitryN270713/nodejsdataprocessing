'use strict'

const status = require('http-status')

const qsasApi = (app, weatherDB) => {
    const dbWorker = weatherDB

    app.get('/about', (req, res, next) => {
        res.send("Everyone likes monkeys")
    })

    // Placeholder for now
    app.get('/data/alldata/:toskip/:perreq', (req, res, next) => {
        dbWorker.getAllData(req.params.toskip, req.params.perreq).then(qaData => {
            res.status(status.OK).json(qaData)
        }).catch(next)
    }) 

    // For now this one is placeholder
    app.get('/data/getqa/:id', (req, res, next) => {
        dbWorker.getQAData(req.params.id).then(qaData => {
            res.status(status.OK).json(qaData)
        }).catch(next)
    })

    app.post('/data/addquestionanswer', (req, res, next) => {
        dbWorker.addNewQuestionAnswer(req.body.intent, req.body.question, req.body.answer).then((questionAnswerData) => {
            res.status(status.OK).json(questionAnswerData)
        }).catch(err =>  {
            console.error(`Monkeys are broken ${err}`)
            res.status(status.IM_A_TEAPOT).send({ error : err.message })
            next()
        })
    })

    // This one is inactive for now. Consider it as placeholder
    app.delete('/data/removequestionanswer', (req, res, next) => {
        dbWorker.removeQuestionAnswer(req.body.id).then(removequestionanswerID => {
            res.status(status.OK).json(removequestionanswerID)
        }).catch(err => {
            console.error(`Monkeys are tired to remove entire location ${err}`)
            res.status(status.IM_A_TEAPOT).send({ error : err.message })
            next()
        })
    })
}

module.exports = Object.assign({}, {qsasApi})