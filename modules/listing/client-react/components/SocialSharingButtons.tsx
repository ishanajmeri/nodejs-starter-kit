import React from 'react';
import styled from 'styled-components';

import {
  Icon,
  ModalDrawer,
  Col,
  Message,
  Button,
  Row,
  Input,
  Collapse,
  CollapsePanel
} from '@gqlapp/look-client-react';
import { TranslateFunction } from '@gqlapp/i18n-client-react';

import MailButtonForm from './MailButtonForm';

// types
import { ShareListingByEmailInput } from '../../../../packages/server/__generated__/globalTypes';

const Img = styled.img`
  &:hover {
    transform: scale(1.2);
  }
`;

export interface SocialSharingButtonsProps {
  hideEmailButton?: boolean;
  whatsappMessage: string;
  twitterMessage: {
    text: string;
    hashtag: string;
    link: string;
  };
  link: string;
  onShare?: (values: ShareListingByEmailInput) => void;
  emailMessage: string;
  t: TranslateFunction;
}

const SocialSharingButtons: React.FC<SocialSharingButtonsProps> = props => {
  const [activeKey, setActiveKey] = React.useState('');
  const { twitterMessage, whatsappMessage, link, hideEmailButton, t } = props;
  const sharingMenu = (
    <div>
      <Row type="flex" justify="space-between">
        <Col span={24}>
          <Row justify="space-between">
            <Col>
              <a href={`http://www.facebook.com/share.php?u=${link}`} target="_blank" rel="noopener noreferrer">
                <Button shape="circle" color="link" ghost size="lg" style={{ fontSize: '22px' }}>
                  <Img
                    src={
                      'https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-facebook-2019-circle-64.png'
                    }
                    height="50"
                    width="50"
                    align="centre"
                    style={{ borderRadius: '90px' }}
                  />
                  <h5 style={{ fontSize: '10px', paddingTop: '10px' }}>Facebook</h5>
                </Button>
              </a>
            </Col>
            <Col>
              <a
                href={`http://www.reddit.com/submit?url=${link}&title=Checkout%20this%20Listing`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button shape="circle" color="link" ghost size="lg" style={{ fontSize: '22px' }}>
                  <Img
                    src={
                      'https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-reddit-circle-64.png'
                    }
                    height="50"
                    width="50"
                    align="centre"
                    style={{ borderRadius: '90px' }}
                  />
                  <h5 style={{ fontSize: '10px', paddingTop: '10px' }}>Reddit</h5>
                </Button>
              </a>
            </Col>
            <Col>
              <a
                href={`https://twitter.com/share?url=${twitterMessage.link}&amp;text=${twitterMessage.text}&amp;hashtags=${twitterMessage.hashtag}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button shape="circle" color="link" ghost size="lg" style={{ fontSize: '22px' }}>
                  <Img
                    src={
                      'https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-twitter-circle-64.png'
                    }
                    height="50"
                    width="50"
                    align="centre"
                    style={{ borderRadius: '90px' }}
                  />
                  <h5 style={{ fontSize: '10px', paddingTop: '10px' }}>Twitter</h5>
                </Button>
              </a>
            </Col>
            <Col>
              <a
                href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
                dataAction="share/whatsapp/share"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button shape="circle" color="link" ghost size="lg" style={{ fontSize: '22px' }}>
                  <Img
                    src={
                      'https://cdn2.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-whatsapp-circle-64.png'
                    }
                    height="50"
                    width="50"
                    align="centre"
                    style={{ borderRadius: '90px' }}
                  />
                  <h5 style={{ fontSize: '10px', paddingTop: '10px' }}>Whatsapp</h5>
                </Button>
              </a>
            </Col>
            <Col>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${link}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button shape="circle" color="link" ghost size="lg" style={{ fontSize: '22px' }}>
                  <Img
                    src={
                      'https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-linkedin-circle-64.png'
                    }
                    height="50"
                    width="50"
                    align="centre"
                    style={{ borderRadius: '90px' }}
                  />
                  <h5 style={{ fontSize: '10px', paddingTop: '10px' }}>Linkedin</h5>
                </Button>
              </a>
            </Col>
            {!hideEmailButton && (
              <>
                <Col>
                  <Button
                    shape="circle"
                    color="link"
                    ghost
                    size="lg"
                    style={{ fontSize: '22px' }}
                    onClick={() => setActiveKey(activeKey === 'mail' ? '' : 'mail')}
                  >
                    <Img
                      src={'https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Mail-64.png'}
                      height="50"
                      width="50"
                      align="centre"
                      style={{ borderRadius: '90px' }}
                    />
                    <h5 style={{ fontSize: '10px', paddingTop: '10px' }}>Mail</h5>
                  </Button>
                </Col>
              </>
            )}
          </Row>
          <br />
          {!hideEmailButton && (
            <Collapse bordered={false} ghost={true} destroyInactivePanel={true} activeKey={activeKey}>
              <CollapsePanel
                key="mail"
                header={<div style={{ display: activeKey !== 'mail' && 'none' }}>{t('socialSharingButton.title')}</div>}
                showArrow={false}
              >
                <MailButtonForm {...props} />
              </CollapsePanel>
            </Collapse>
          )}
        </Col>
      </Row>
      <Row type="flex" style={{ paddingTop: '15px' }}>
        <Col span={24}>
          <Row type="flex" gutter={24}>
            <Col lg={18} xs={24}>
              <Input value={link} />
            </Col>
            <Col xs={24} lg={0}>
              <br />
            </Col>
            <Col lg={6} xs={24}>
              <Button
                color="primary"
                ghost={true}
                block
                onClick={async () => {
                  await window.navigator.clipboard.writeText(link);
                  Message.success('Copied to clipboard!');
                }}
              >
                Copy
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );

  return (
    <Col span={24} style={{ height: '50px' }}>
      <ModalDrawer
        buttonText={<Icon type="ShareAltOutlined" />}
        modalTitle="Share listing"
        height="auto"
        shape="circle"
        ghost={true}
        block={false}
        type="primary"
      >
        {sharingMenu}
      </ModalDrawer>
    </Col>
  );
};

export default SocialSharingButtons;
