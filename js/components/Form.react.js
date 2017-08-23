/**
 * Form.react.js
 *
 * The form with a username and a password input field, both of which are
 * controlled via the application state.
 *
 */

import React, { Component } from 'react';
import { changeForm } from '../actions/AppActions';
import LoadingButton from './LoadingButton.react';
import ErrorMessage from './ErrorMessage.react';
import observe from '../utils/observer';
import R from 'ramda';
// Object.assign is not yet fully supported in all browsers, so we fallback to
// a polyfill
const assign = Object.assign || require('object.assign');

class LoginForm extends Component {
  _recordKeyInterval(index, evt) {
    if (!this.passwordFieldRecords) {
      this.passwordFieldRecords = [];
    }
    
    if (!this.passwordFieldRecords[index]) {
      this.passwordFieldRecords[index] = observe.interval(this.passwordFields[index].getDOMNode());
    } else {
      this.passwordFieldRecords[index].length = 0;
    }
  }

  isPrintable(keycode) {
    const valid = 
        (keycode > 47 && keycode < 58)   || // number keys
        keycode == 32 || keycode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
        (keycode > 64 && keycode < 91)   || // letter keys
        (keycode > 95 && keycode < 112)  || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223);   // [\]' (in order)

    return valid;
  }

  _updateRecord(index) {
    let keysPressedRecords  = this.passwordFieldRecords[index] || [];
    keysPressedRecords = R.filter(x => this.isPrintable(x.keyCode), keysPressedRecords);

    const sortedRecords = R.sortBy(R.prop("start"))(keysPressedRecords);

    const intervals = [];
    for (let i = 1; i < R.length(sortedRecords); i ++) {
      intervals.push(sortedRecords[i].start - sortedRecords[i - 1].end);
    }

    console.info(intervals);

    const newIntervals = R.clone(this.props.data.intervals) || [];
    newIntervals[index] = intervals;
    var newState = this._mergeWithCurrentState({
      intervals: newIntervals 
    });

    this._emitChange(newState);
  }

  renderPasswordFields = () => {
    const { passwordRepeat } = this.props;
    const {passwords = []} = this.props.data;

    const passwordFields = [];
    this.passwordFields = [];
    for (let i = 0; i < passwordRepeat + 1; i ++) {
      passwordFields.push(
        <div className="form__field-wrapper">
          <input className="form__field-input" 
            ref={(input) => this.passwordFields[i] = input}
            onFocus={this._recordKeyInterval.bind(this, i)}
            onKeyUp={this._updateRecord.bind(this, i)}
            id={"password_" + i}
            type="password"
            value={passwords[i]}
            placeholder="••••••••••" 
            onChange={this._changePassword.bind(this, i)} />
          <label className="form__field-label" htmlFor={"password_" + i}>Password</label>
        </div>
      );
    }

    return passwordFields;
  }
  render() {
    return(
      <form className="form" onSubmit={this._onSubmit.bind(this)}>
        <ErrorMessage />
        <div className="form__field-wrapper">
          <input className="form__field-input" type="text" id="username" value={this.props.data.username} placeholder="frank.underwood" onChange={this._changeUsername.bind(this)} autoCorrect="off" autoCapitalize="off" spellCheck="false" />
          <label className="form__field-label" htmlFor="username">Username</label>
        </div>
        {this.renderPasswordFields()}
        <div className="form__submit-btn-wrapper">
          {this.props.currentlySending ? (
            <LoadingButton />
          ) : (
            <button className="form__submit-btn" type="submit">{this.props.btnText}</button>
          )}
        </div>
      </form>
    );
  }

  // Change the username in the app state
  _changeUsername(evt) {
    var newState = this._mergeWithCurrentState({
      username: evt.target.value
    });

    this._emitChange(newState);
  }

  // Change the password in the app state
  _changePassword(i, evt) {
    const newPasswords = R.clone(this.props.data.passwords) || [];

    if (R.length(evt.target.value) == 1) {
      this.passwordFieldRecords[i].length = 0;
    }

    newPasswords[i] = evt.target.value;
    var newState = this._mergeWithCurrentState({
      passwords: newPasswords
    });

    this._emitChange(newState);
  }

  // Merges the current state with a change
  _mergeWithCurrentState(change) {
    return assign(this.props.data, change);
  }

  // Emits a change of the form state to the application state
  _emitChange(newState) {
    this.props.dispatch(changeForm(newState));
  }

  // onSubmit call the passed onSubmit function
  _onSubmit(evt) {
    evt.preventDefault();
    this.props.onSubmit(this.props.data.username, this.props.data.passwords, this.props.data.intervals);
  }
}

LoginForm.defaultProps = {
  passwordRepeat: 0,
}

LoginForm.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  btnText: React.PropTypes.string.isRequired,
  data: React.PropTypes.object.isRequired,
  passwordRepeat: React.PropTypes.number,
}

export default LoginForm;
