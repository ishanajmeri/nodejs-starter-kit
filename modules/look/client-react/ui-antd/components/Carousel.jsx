import React from 'react';
import PropTypes from 'prop-types';
import { Carousel as ADCarousel } from 'antd';

import Row from './Row';
import Col from './Col';
import { LeftArrow, RightArrow } from './CarouselArrows';

const Carousel = props => {
  let carousel = React.useRef();
  const { children, showArrow = true, ...rest } = props;

  const prevSlide = () => {
    carousel.prev();
  };

  const nextSlide = () => {
    carousel.next();
  };

  return (
    <Row type="flex" justify="center" align="middle">
      <Col span={2} align="center">
        {showArrow && <LeftArrow prevSlide={prevSlide} />}
      </Col>
      <Col span={20} align="center">
        <ADCarousel ref={node => (carousel = node)} {...rest}>
          {children}
        </ADCarousel>
      </Col>
      <Col span={2} align="center">
        {showArrow && <RightArrow nextSlide={nextSlide} />}
      </Col>
    </Row>
  );
};
Carousel.propTypes = {
  children: PropTypes.node,
  showArrow: PropTypes.bool
};

export default Carousel;
