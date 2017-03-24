'use strict';
import Joi from 'joi'
import chai, { expect, assert } from 'chai'
import JoiValidateRequest from '../src/index'

const joiValidateRequest = JoiValidateRequest({
  errorGetter: errors => {
    const boom = new Error('Wrong parameters')
    boom.details = errors
    return boom
  }
})

const bodySchema = Joi.object().keys({
  username: Joi.string().required()
})
const querySchema = Joi.object().keys({
  skip: Joi.number().required()
})
const paramsSchema = Joi.object().keys({
  id: Joi.number().required()
})
const requestSchema = {
  body: bodySchema,
  query: querySchema,
  params: paramsSchema
}

describe('Joi Validate tests', () => {
  it('Should not dispatch error', done => {
    const req = {
      body: {
        username: 'Rafael'
      },
      query: {
        skip: 10
      },
      params: {
        id: 2
      }
    }

    const requestValidator  = joiValidateRequest(requestSchema)

    requestValidator(req, null, (err) => {
      assert.isUndefined(err)
      done()
    })
  })

  it('Should dispatch error', done => {
    const req = {
      body: {
        // username: 'Rafael'
      },
      query: {
        skip: 10
      },
      params: {
        id: 2
      }
    }

    const requestValidator  = joiValidateRequest(requestSchema)

    requestValidator(req, null, (err) => {
      assert(err instanceof Error, 'should be instance of error')
      expect(err.details).to.deep.equal({
        body: [
          {
            path: 'username',
            message: '\"username\" is required'
          }
        ]
      })
      done()
    })
  })
})
