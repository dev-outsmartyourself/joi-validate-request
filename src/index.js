import Joi from 'joi'

export default ({
  errorGetter
}) => (reqSchema) =>
  (req, res, next) => {
    const errors = {}

    const validateObjectKey = key => {
      //  Se não for especificado a key (body, query, etc...) no schema, não preciso validar
      if (!reqSchema[key]) {return}
      Joi.validate(req[key], reqSchema[key], { abortEarly: false }, (err) => {
        if (err) {
          // extrair apenas as informações que preciso
          errors[key] = err.details.map(detail => ({
            message: detail.message, path: detail.path,
          }))
        }
      })
    }
    Object.keys(reqSchema).forEach(key => validateObjectKey(key))

    if (!Object.keys(errors).length) {
      return next()
    }

    const errorObject = errorGetter(errors)
    return next(errorObject)

  }
