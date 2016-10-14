import _ from 'underscore';
import Promise from 'bluebird';
import schemaInspector from 'schema-inspector';
import { isEmail } from './utils';

const sanitizationCustom = {
  emptyArray: function (schema, post) {
    this.report();
    return [];
  },
};

const validationCustom = {
  objectId: function (schema, candidate) {
    if (!schema.$objectId) {
      return;
    }
    if (candidate && !ObjectId.isValid(candidate)) {
      this.report('invalid ObjectId: ' + candidate);
    }
  },
  enum: function(schema, candidate) {
    if (!_.isArray(schema.$enum) || !schema.$enum.length) {
      return;
    }
    if (-1 == schema.$enum.indexOf(candidate)) {
      this.report('invalid value: ' + candidate);
    }
  },
  email: function(schema, candidate) {
    if (!_.isString(candidate) ||
      !/^[a-z0-9\.]+@([a-z0-9\-]+\.)+[a-z]+$/.test(candidate)) {
      this.report('invalid email: ' + candidate);
    }
  },
  mobile: function(schema, candidate) {
    if (!_.isString(candidate) ||
      !/^1[3|4|5|7|8]\d{9}$/.test(candidate)) {
      this.report('invalid mobile: ' + candidate);
    }
  }
};
schemaInspector.Validation.extend(validationCustom);
schemaInspector.Sanitization.extend(sanitizationCustom);

export function sanitizeObject(schema, data) {
  schemaInspector.sanitize({
    type: 'object',
    strict: true,
    properties: schema
  }, data);
}

export function validateObject(schema, data) {
  return schemaInspector.validate({
    type: 'object',
    strict: true,
    properties: schema
  }, data);
}

export function formatValidationError(error) {
  let errorObject = {};
  _.each(error, item => {
    let { code, message, property } = item;
    let key = property.replace('@.', '');
    errorObject[key] = {
      code,
      message,
    };
    return errorObject;
  });
  return errorObject;
}

export class ValidationError {
  constructor(error) {
    this.message = error;
  }
}

export function mapObjectAlias(object, aliases) {
  let newSchema = {};
  _.each(aliases, (key, alias) => {
    if (object[key]) {
      newSchema[alias] = object[key];
    }
  });
  return newSchema;
}

// options can be string, array, object:
//   string: 'key1,key2,alias3 as key3'
//   array: ['key1', 'key2', {alias3: key3}]
//   object: {alias1: key1, alias2: key2}
export function selectRules(schema, options) {
  if (options == null) {
    return schema;
  }
  if (_.isString(options)) {
    options = options.split(/,\s?/);
  }
  if (_.isObject(options) && !_.isArray(options)) {
    return mapObjectAlias(schema, options);
  }
  if (_.isArray(options)) {
    let newSchema = {};
    _.each(options, item => {
      if (_.isString(item)) {
        let [key, alias] = item.split(/ as /i);
        if (!alias) {
          alias = key;
        }
        if (schema[key]) {
          newSchema[alias] = schema[key];
        }
      } else if (_.isObject(item)) {
        _.extend(newSchema, mapObjectAlias(schema, item));
      }
    });
    return newSchema;
  }
  throw new Error('invalid rule options');
}

export function validate(schema, data, options) {
  schema = selectRules(schema, options);
  let result = validateObject(schema, data);
  if (result.valid) {
    return null;
  } else {
    return formatValidationError(result.error);
  }
}

export default schemaInspector;
