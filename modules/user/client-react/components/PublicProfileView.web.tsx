import React from 'react';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { match as Match } from 'react-router-dom';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { Icon, Card, MetaTags, PageLayout, Row, Col, Divider } from '@gqlapp/look-client-react';
import { USER_ROUTES } from '@gqlapp/user-client-react';

import ProfileHeadComponent from './components/ProfileHeadComponent.web';
import userCardData from '../helpers/userCardData';
// types
import { currentUser_currentUser } from '../graphql/__generated__/currentUser';

interface ProfileViewProps {
  t: TranslateFunction;
  match: Match<{ id: string }>;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  user: { user: currentUser_currentUser };
}

const ProfileView: React.FunctionComponent<ProfileViewProps> = props => {
  const getUserId = () => {
    let id = '0';
    if (props.match) {
      id = props.match.params.id;
    } else if (props.navigation) {
      id = props.navigation.state.params.id;
    }
    return id;
  };

  const { t, user } = props;
  const { profile } = user && user.user;

  if (profile) {
    return (
      <PageLayout select={`${USER_ROUTES.profile}`}>
        <MetaTags title={t('profile.title')} description={t('profile.meta')} />

        <Row gutter={5}>
          <Col xs={{ span: 24 }} lg={{ span: 24 }}>
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
                <Icon type="UserOutlined" /> {user.user.username}
              </h2>
              <ProfileHeadComponent
                profile={profile && profile}
                description={userCardData(t, user, getUserId()).profileHead}
              />
              <Divider />
              {/* <UserListings user={user.user} history={history} /> */}
            </Card>
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
