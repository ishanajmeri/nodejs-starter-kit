import React from 'react';
import { Row, Col, SlickCarousel } from '@gqlapp/look-client-react';
// types
import { review_review_reviewMedia as ReviewMedia } from '../graphql/__generated__/review';

interface ImagesSlickComponentProps {
  images: ReviewMedia;
}

const ImagesSlickComponent: React.FunctionComponent<ImagesSlickComponentProps> = props => {
  const { images } = props;
  // console.log('props', props);
  const itemLength = images && images.length;

  const SlickComponent = ({ img }: { img: ReviewMedia }) => (
    <Row align="middle" type="flex" justify="center">
      <Col span={24}>
        {img.type === 'image' ? (
          <img alt="" style={{ height: '100px' }} src={img.url} />
        ) : (
          <div key="video">
            <iframe
              width="100px"
              height="100px"
              src={img.url.replace('watch?v=', 'embed/')}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </Col>
    </Row>
  );

  const carouselSettings = (ItemLength: number) => {
    return {
      className: 'slider variable-width',
      variableWidth: true,
      autoplay: true,
      easing: 1000,
      infinite: true,
      speed: 500,
      autoplaySpeed: 2000,
      slidesToShow: ItemLength >= 4 ? 4 : ItemLength,
      slidesToScroll: 1,
      swipeToSlide: true,

      arrows: true,
      dots: false,
      responsive: [
        {
          breakpoint: 1440,
          settings: {
            slidesToShow: ItemLength >= 4 ? 4 : ItemLength,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: ItemLength >= 3 ? 3 : ItemLength,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: ItemLength >= 2 ? 2 : ItemLength,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
  };

  return images ? (
    <SlickCarousel
      Compo={SlickComponent}
      settings={carouselSettings(itemLength)}
      itemName={'img'}
      data={images}
      showArrow={false}
      height={'115px'}
      node={false}
      componentStyle={{
        margin: '0 20px 0 0',
        width: '250px'
      }}
    />
  ) : null;
};
export default ImagesSlickComponent;
