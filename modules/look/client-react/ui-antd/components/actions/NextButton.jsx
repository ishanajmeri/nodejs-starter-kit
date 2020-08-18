import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

class NextButton extends React.Component {
  render() {
    const { children = 'Next', color = 'default', type, size, ...props } = this.props;

    let buttonSize = 'default';

    if (size === 'sm') {
      buttonSize = 'small';
    } else if (size === 'lg') {
      buttonSize = 'large';
    }

    return (
      <Button type={color} htmlType={type} size={buttonSize} icon="arrow-right" {...props}>
        {children}
      </Button>
    );
  }
}

NextButton.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.string
};

export default NextButton;
