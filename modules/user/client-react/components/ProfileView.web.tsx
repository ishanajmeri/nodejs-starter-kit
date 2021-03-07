import React from 'react';
import { Link } from 'react-router-dom';
import { match as Match } from 'react-router-dom';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';

import { StripeSubscriptionProfile } from '@gqlapp/payments-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import {
  Row,
  Col,
  Card,
  //  CardGroup,
  CardText,
  //  CardTitle,
  PageLayout,
  Heading,
  EditIcon,
  Icon,
  MetaTags,
  Divider,
  Spin as Loader
} from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';

import ROUTES from '../routes';
import UserVerificationsComponent from './verification/UserVerificationsComponent.web';
import ProfileHeadComponent from './components/ProfileHeadComponent.web';
// import UsersCardComponent from './UsersCardComponent';
import AddressCardComponent from './components/AddressCardComponent.web';
import userCardData from '../helpers/userCardData';
import { currentUser_currentUser as CurrentUser } from '../graphql/__generated__/currentUser';

// To Do Abstract Out

interface ProfileViewProps {
  match: Match<{ id: string }>;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  t: TranslateFunction;
  currentUser: CurrentUser;
  currentUserLoading: boolean;
}

const ProfileView: React.FunctionComponent<ProfileViewProps> = props => {
  const getUserId = () => {
    let id = 0;
    if (props.match) {
      id = Number(props.match.params.id);
    } else if (props.navigation) {
      id = Number(props.navigation.state.params.id);
    }
    return id;
  };

  const { t, currentUser, currentUserLoading } = props;

  // console.log('bleh', props);
  if (currentUserLoading && !currentUser) {
    return (
      <PageLayout select={ROUTES.profile}>
        <MetaTags title={t('profile.title')} description={t('profile.meta')} />
        <Loader text={t('profile.loadMsg')} />
      </PageLayout>
    );
  } else if (currentUser) {
    return (
      <PageLayout select={ROUTES.profile}>
        <MetaTags title={t('profile.title')} description={t('profile.meta')} />

        <Row gutter={5}>
          <Col xs={{ span: 24 }} lg={{ span: 16 }}>
            <Card style={{ display: 'block' }}>
              <h2
                style={{
                  fontSize: '23px',
                  fontWeight: 'bold',
                  height: '61px',
                  marginBottom: '0px',
                  position: 'relative'
                }}
              >
                <Heading type="2">
                  <Icon type="UserOutlined" /> {t(`profile.card.title`)}
                </Heading>
                <div align="right" style={{ position: 'absolute', top: '0px', right: '10px' }}>
                  <Link to={`${ROUTES.editLink}${currentUser.id}`}>
                    <EditIcon />
                  </Link>
                </div>
              </h2>

              <ProfileHeadComponent
                profile={currentUser.profile && currentUser.profile}
                description={userCardData(t, currentUser, getUserId()).profileHead}
              />
              <Divider />
              <Row type="flex" justify="space-around" align="middle">
                <Col align="left" style={{ borderRight: '2px solid #23B195' }} span={12}>
                  <div>
                    <h2>
                      <Icon type="UserOutlined" /> {t('profile.card.group.name')}:
                    </h2>
                    <CardText>{currentUser.username}</CardText>
                  </div>
                  <div>
                    <h2>
                      <Icon type="SolutionOutlined" /> {t('profile.card.group.about')}:
                    </h2>

                    <CardText>
                      {currentUser.profile && currentUser.profile.about ? currentUser.profile.about : 'Not Provided'}
                    </CardText>
                  </div>

                  <div>
                    <h2>
                      <Icon type="TeamOutlined" />
                      {t('profile.card.group.role')}:
                    </h2>
                    <CardText>{currentUser.role ? currentUser.role : 'Not Provided'}</CardText>
                  </div>

                  {/* Portfolios */}
                  <h2>
                    <Icon type="PaperClipOutlined" /> {t('profile.card.group.portfolios.title')}
                  </h2>
                  {currentUser.portfolios && currentUser.portfolios.length !== 0
                    ? currentUser.portfolios.map((portfolio, key) => (
                        <div key={key}>
                          <CardText>
                            {portfolio.platform} : {portfolio.portfolioUrl}
                          </CardText>
                        </div>
                      ))
                    : 'Not Provided'}
                </Col>
                <Col align="right" span={12}>
                  <div>
                    <h2>
                      <Icon type="MailOutlined" /> {t('profile.card.group.email')}:
                    </h2>

                    <CardText>{currentUser.email ? currentUser.email : 'Not Provided'}</CardText>
                  </div>

                  <div>
                    <h2>
                      <Icon type="ShakeOutlined" /> Mobile
                    </h2>
                    <CardText>
                      {currentUser.profile && currentUser.profile.mobile ? currentUser.profile.mobile : 'Not Provided'}
                    </CardText>
                  </div>
                </Col>
              </Row>
              <Divider />
              <h2>
                <Icon type="ContactsOutlined" /> {t('profile.card.group.addresses.title')}
              </h2>
              <Row gutter={10}>
                {currentUser.addresses && currentUser.addresses.length !== 0
                  ? currentUser.addresses.map((address, key: number) => (
                      <Col xs={{ span: 24 }} md={{ span: 12 }} key={key}>
                        <AddressCardComponent
                          address={address}
                          subTitle={t('profile.card.group.addresses.subTitle')}
                          index={key}
                        />
                      </Col>
                    ))
                  : 'Not Provided'}
              </Row>

              {/* Credit card info (Stripe subscription module)*/}
              {settings.stripe.subscription.enabled &&
                settings.stripe.subscription.publicKey &&
                currentUser.role === 'user' && <StripeSubscriptionProfile />}
            </Card>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 8 }}>
            <Row gutter={10} type="flex" justify="space-around" align="middle">
              <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 24 }} style={{ height: '100%' }}>
                <UserVerificationsComponent
                  data={currentUser.verification}
                  verification={userCardData(t, currentUser, getUserId()).verification}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        <MetaTags title={t('profile.title')} description={t('profile.meta')} />
        <h2>{t('profile.errorMsg')}</h2>
      </PageLayout>
    );
  }
};

export default translate('user')(ProfileView);
