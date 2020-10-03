import React from 'react';

import ClientModule from '@gqlapp/module-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import loadable from '@loadable/component';

import { Route, NavLink } from 'react-router-dom';
import { IfLoggedIn, AuthRoute } from '@gqlapp/user-client-react/';
import { MenuItem, Icon } from '@gqlapp/look-client-react';

import resolvers from './resolvers';
import resources from './locales';
import ROUTES from './routes';

const NavLinkUserWithI18n = translate('review')(({ t }: { t: TranslateFunction }) => (
  <NavLink to={ROUTES.myReview} className="nav-link" activeClassName="active">
    <Icon type="book" /> &nbsp;
    {t('review:navLinkUser')}
  </NavLink>
));

const NavLinkWithI18n = translate('review')(({ t }: { t: TranslateFunction }) => (
  <NavLink to={ROUTES.review} className="nav-link" activeClassName="active">
    {t('review:navLinkTest')}
  </NavLink>
));

const NavLinkAdminWithI18n = translate('review')(({ t }: { t: TranslateFunction }) => (
  <NavLink to={ROUTES.adminPanel} className="nav-link" activeClassName="active">
    {t('review:navLinkAdmin')}
  </NavLink>
));

export default new ClientModule({
  route: [
    <Route exact path={ROUTES.review} component={loadable(() => import('./containers/Review').then(c => c.default))} />,
    <AuthRoute
      exact
      role={['admin']}
      path={ROUTES.add}
      component={loadable(() => import('./containers/AddReview').then(c => c.default))}
    />,
    <AuthRoute
      exact
      role={['admin']}
      path={ROUTES.edit}
      component={loadable(() => import('./containers/EditReview').then(c => c.default))}
    />,
    <AuthRoute
      exact
      role={['admin', 'user']}
      path={ROUTES.myReview}
      component={loadable(() => import('./containers/MyReview').then(c => c.default))}
    />,
    <AuthRoute
      exact
      role={['admin']}
      path={ROUTES.adminPanel}
      component={loadable(() => import('./containers/Reviews.web').then(c => c.default))}
    />
  ],
  navItemUser: [
    <IfLoggedIn key={ROUTES.myReview}>
      <MenuItem>
        <NavLinkUserWithI18n />
      </MenuItem>
    </IfLoggedIn>
  ],
  navItemAdmin: [
    <IfLoggedIn>
      <MenuItem key={ROUTES.adminPanel}>
        <NavLinkAdminWithI18n />
      </MenuItem>
    </IfLoggedIn>
  ],
  // navItemTest: [
  //   <MenuItem key={ROUTES.review}>
  //     <NavLinkWithI18n />
  //   </MenuItem>
  // ],
  resolver: [resolvers],
  localization: [{ ns: 'review', resources }]
});