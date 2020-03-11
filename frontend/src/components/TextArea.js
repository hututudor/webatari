import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { colors } from '../config/theme';

const TextArea = ({
  hasLabel,
  label,
  value,
  error,
  onChange,
  onBlur,
  autoComplete,
  type,
  placeholder,
  width,
  required,
  name,
  mb
}) => (
  <Wrapper width={width} error={!!error} mb={mb}>
    {hasLabel && (
      <label>
        {label}
        {required ? '*' : ''}
      </label>
    )}
    <textarea
      rows={4}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      autoComplete={autoComplete === false ? 'off' : ''}
      placeholder={placeholder}
      required={required}
      className={error ? 'error' : ''}
      name={name}
    />
    <div className="error-label">{error || ''}</div>
  </Wrapper>
);

const Wrapper = styled.div`
  margin-top: 8px;
  margin-bottom: ${props => props.mb};
  width: ${props => props.width};
  display: flex;
  flex-direction: column;

  textarea {
    resize: none;
    margin: 8px 0 0 0;
    background: ${colors.cool_grey_900};
    color: ${colors.cool_grey_050};
    padding: 8px 8px;
    border: 0;
    outline: 0;
    font-size: 16px;
    border-bottom: 1px solid
      ${props => (props.error ? colors.red_vivid_500 : colors.cool_grey_800)};
    transition: all 0.15s;
    font-family: 'Press Start 2P', serif !important;

    &:focus {
      border-bottom: 1px solid
        ${props => (props.error ? colors.red_vivid_500 : colors.cool_grey_050)};
    }
  }

  label {
    margin-left: 2px;
  }

  .error-label {
    margin-left: 2px;
    margin-top: 6px;
    font-size: 10px;
    color: ${colors.red_vivid_500};
    min-height: 10px;
  }
`;

TextArea.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  autoComplete: PropTypes.bool,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  width: PropTypes.string,
  hasLabel: PropTypes.bool,
  required: PropTypes.bool,
  name: PropTypes.string,
  mb: PropTypes.string
};

TextArea.defaultProps = {
  label: 'Label',
  value: '',
  error: false,
  autoComplete: false,
  type: 'text',
  placeholder: '',
  width: '100%',
  hasLabel: false,
  required: false,
  mb: 0
};

export default TextArea;
