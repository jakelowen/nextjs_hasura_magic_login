import React from 'react';
import cx from 'classnames';

const TextInput = ({
  type,
  id,
  label,
  error,
  value,
  onChange,
  help,
  ...props
}) => (
  <div className="measure sans-serif black-80">
    <label htmlFor={id} className="">
      <span className="f6 b db mb2">{label}</span>

      <input
        id={id}
        className={cx('input-reset ba pa2 mb2 db w-100', {
          'b--black-20': !error,
          'b--red': !!error,
        })}
        type={type}
        value={value}
        onChange={onChange}
        {...props}
      />
      {help && (
        <small id={id} className="f6 db mb2">
          {help}
        </small>
      )}
      {error && (
        <small id={id} className="f6 red db mb2">
          {error}
        </small>
      )}
    </label>
  </div>
);

export default TextInput;
