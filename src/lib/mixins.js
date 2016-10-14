import _ from 'underscore';

import { validate } from 'lib/inspector';

class OaForm {

  constructor(component, fields, validation) {
    this.component = component;
    this.listeners = {};
    this.validation = validation;
    let _fields = {};
    if (_.isArray(fields)) {
      _.each(fields, key => {
        _fields[key] = null;
      });
    } else {
      _fields = fields;
    }
    let stateFields = {};
    _.each(_fields, (value, key) => {
      if (_.isObject(value)) {
        _.each(value, (item, key1) => {
          if (key1.indexOf('on') == 0 && _.isFunction(item)) {
            let type = key1.replace(/^on/, '').toLowerCase();
            this.addEventListener(key, type, item);
          }
        });
        value = value.value || '';
      }
      stateFields[key] = {
        value: value,
        error: null,
      };
    });
    _.extend(component.state, {fields: stateFields});
    component.form = this;
  }

  addEventListener(key, type, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = {
        [type]: [],
      };
    }
    this.listeners[key][type].push(callback);
  }

  removeEventListener(key, type, callback) {
    if (!this.listeners[key] || !this.listeners[key][type]) {
      return;
    }
    let index = _.findIndex(this.listeners[key][type], callback);
    if (index >= 0) {
      this.listeners[key][type].splice(index, 1);
    }
  }

  emitEvent(key, type, ...params) {
    const events = this.listeners[key];
    if (events && events[type]) {
      _.each(events[type], callback => callback(...params, this));
    }
  }

  getField(key) {
    const { fields } = this.component.state;
    return fields[key];
  }

  getValue(key) {
    return this.getField(key).value;
  }

  getError(key) {
    return this.getField(key).error;
  }

  setError(key, error) {
    const { state } = this.component;
    let field = this.getField(key);
    this.component.setState({
      ...state, fields: {
        ...state.fields, [key]: {
          ...field,
          error,
        },
      },
    });
  }

  setErrors(errors) {
    const { state } = this.component;
    const { fields } = state;
    let newFields = _.mapObject(fields, (item, key) => {
      let errorItem = errors[key];
      if (errorItem) {
        return { value: item.value, error: errorItem.message };
      } else {
        return { value: item.value, error: null };
      }
    });
    this.component.setState({
      ...state,
      fields: newFields,
    });
  }

  getValues() {
    const { fields } = this.component.state;
    return _.mapObject(fields, field => field.value);
  }

  getEventValue(object) {
    if (_.isObject(object)) {
      if (object.type && object.type == 'checkbox') {
        return !!object.checked;
      } else if (object.value !== undefined) {
        return object.value;
      } else if (object.checked !== undefined) {
        return object.checked;
      } else if (object.target) {
        return this.getEventValue(object.target);
      }
    }
    return object;
  }

  validateOne(key, value) {
    if (!this.validation) {
      return null;
    }
    let error = validate(this.validation, {[key]: value}, [key]);
    if (error) {
      return error[key].message;
    }
    return null;
  }

  validate(options) {
    if (!this.validation) {
      return null;
    }
    let values = this.getValues();
    let error = validate(this.validation, values, options);
    if (error) {
      return error[key].message;
    }
    return null;
  }

  handleChange(key, event) {
    const { state } = this.component;
    let value = this.getEventValue(event);
    let error = this.validateOne(key, value);
    this.component.setState({
      ...state, fields: {
        ...state.fields, [key]: {
          error,
          value,
        },
      },
    }, () => {
      this.emitEvent(key, 'change', value);
    });
  }

  props() {
    const { fields } = this.component.state;
    return _.mapObject(fields, (field, key) => {
      return {
        ...field,
        hasError: !!field.error,
        onChange: (event) => this.handleChange(key, event),
      };
    });
  }

}

export function createForm(...params) {
  return new OaForm(...params);
}
