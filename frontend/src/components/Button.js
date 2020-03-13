import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { colors } from '../config/theme';

const Button = ({
  content,
  backgroundColor,
  foregroundColor,
  activeColor,
  disabledColor,
  onClick,
  disabled,
  width
}) => (
  <Wrapper
    width={width}
    onClick={onClick}
    disabled={disabled}
    backgroundColor={backgroundColor}
    foregroundColor={foregroundColor}
    activeColor={activeColor}
    disabledColor={disabledColor}
  >
    {content}
  </Wrapper>
);

Button.propTypes = {
  width: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  foregroundColor: PropTypes.string.isRequired,
  activeColor: PropTypes.string.isRequired,
  disabledColor: PropTypes.string.isRequired
};

Button.defaultProps = {
  width: '100%',
  disabled: false
};

const Wrapper = styled.button`
  width: ${props => props.width};
  height: 48px;
  margin-top: 8px;
  border: none;
  outline: none;
  background: ${props => props.backgroundColor};
  color: ${props => props.foregroundColor};
  font-size: 16px;
  cursor: pointer;

  :active {
    background: ${props => props.activeColor};
  }

  :disabled {
    background: ${props => props.disabledColor};
  }
`;

export const PrimaryButton = ({
  content,
  disabled,
  onClick,
  children,
  width
}) => (
  <Button
    width={width}
    content={content || children}
    disabled={disabled}
    onClick={onClick}
    backgroundColor={colors.blue_vivid_700}
    foregroundColor={colors.blue_vivid_050}
    activeColor={colors.blue_vivid_800}
    disabledColor={colors.cool_grey_700}
  />
);

export const DangerButton = ({
  content,
  disabled,
  onClick,
  children,
  width
}) => (
  <Button
    width={width}
    content={content || children}
    disabled={disabled}
    onClick={onClick}
    backgroundColor={colors.red_vivid_500}
    foregroundColor={colors.red_vivid_050}
    activeColor={colors.red_vivid_600}
    disabledColor={colors.cool_grey_700}
  />
);

export const SecondaryButton = ({
  content,
  disabled,
  onClick,
  children,
  width
}) => (
  <Button
    width={width}
    content={content || children}
    disabled={disabled}
    onClick={onClick}
    backgroundColor={colors.cool_grey_500}
    foregroundColor={colors.cool_grey_050}
    activeColor={colors.cool_grey_600}
    disabledColor={colors.cool_grey_700}
  />
);

export const WarningButton = ({
  content,
  disabled,
  onClick,
  children,
  width
}) => (
  <Button
    width={width}
    content={content || children}
    disabled={disabled}
    onClick={onClick}
    backgroundColor={colors.yellow_vivid_500}
    foregroundColor={colors.yellow_vivid_050}
    activeColor={colors.yellow_vivid_600}
    disabledColor={colors.cool_grey_700}
  />
);