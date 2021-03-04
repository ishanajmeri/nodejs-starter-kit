import React from 'react';
import { enquireScreen } from 'enquire-js';
import { History } from 'history';

import { compose } from '@gqlapp/core-common';
import { PageLayout, MetaTags } from '@gqlapp/look-client-react';
import { TranslateFunction } from '@gqlapp/i18n-client-react';
import settings from '@gqlapp/config';
import { LABEL } from '@gqlapp/home-common';
import { withCurrentUser } from '@gqlapp/user-client-react/containers/UserOperations';
import { ListingCarousel } from '@gqlapp/listing-client-react';
import { DiscountsCarousel } from '@gqlapp/discount-client-react';

import BannerComponent from '../containers/DCComponents/BannerComponent';
import ImageTabBannerComponent from '../containers/DCComponents/ImageTabBannerComponent';
// types
import { currentUser_currentUser } from '@gqlapp/user-client-react/graphql/__generated__/currentUser';

let isMobile: boolean;
enquireScreen((b: boolean) => {
  isMobile = b;
});

export interface HomeViewProps {
  t: TranslateFunction;
  history: History;
  currentUser: currentUser_currentUser;
}

export interface HomeViewState {
  isMobile: boolean;
  show: boolean;
}

class HomeView5 extends React.Component<HomeViewProps, HomeViewState> {
  constructor(props: HomeViewProps) {
    super(props);

    this.state = {
      isMobile,
      show: true // !location.port, ToDo - find a better approach this
    };
  }
  public componentDidMount() {
    // 适配手机屏幕;
    enquireScreen((b: boolean) => {
      this.setState({ isMobile: !!b });
    });
    // ToDo - find a better approach for below statement
    // if (true) {

    setTimeout(() => {
      this.setState({
        show: true
      });
    }, 500);
    // }
  }

  public render() {
    const { history, currentUser, t } = this.props;
    const children = [
      <BannerComponent
        id="Banner_0"
        key="Banner_0"
        filter={{ label: LABEL[2], isActive: true }}
        isMobile={this.state.isMobile}
        {...this.props}
      />,
      <ListingCarousel
        filter={{ isFeatured: true, isActive: true }}
        onFilter={c => c.node.listingFlags.isFeatured === true}
        currentUser={currentUser}
        title={t('listingCarousel.featuredListings')}
        history={history}
        {...this.props}
      />,
      <ImageTabBannerComponent
        t={t}
        id="Banner_1"
        key="Banner_1"
        filter={{ label: LABEL[1], isActive: true }}
        isMobile={this.state.isMobile}
        {...this.props}
        style={{ backgroundColor: '#f7f7f7' }}
      />,
      <ListingCarousel
        filter={{ isNew: true, isActive: true }}
        onFilter={c => c.node.listingFlags.isNew === true}
        currentUser={currentUser}
        title={t('listingCarousel.latestAdditions')}
        history={history}
        {...this.props}
        // style={{ backgroundColor: '#f7f7f7' }}
      />,
      <DiscountsCarousel
        filter={{ isActive: true, isDiscount: true, onGoing: true }}
        orderBy={{ order: 'asc', column: 'discountDuration.endDate' }}
        currentUser={currentUser}
        title={t('discountsCarousel.onGoing')}
        history={history}
        {...this.props}
      />,
      <DiscountsCarousel
        filter={{ isActive: true, isDiscount: true, upComing: true }}
        orderBy={{ order: 'asc', column: 'discountDuration.startDate' }}
        currentUser={currentUser}
        title={t('discountsCarousel.upComing')}
        history={history}
        {...this.props}
        style={{ backgroundColor: '#f7f7f7' }}
      />
    ];
    return (
      <PageLayout type="home">
        <MetaTags title={t('title')} description={`${settings.app.name} - ${t('meta')}`} />

        <div
          className="templates-wrapper"
          ref={d => {
            this.dom = d;
          }}
        >
          {/* 如果不是 dva 2.0 替换成 {children} start */}
          {this.state.show && children}
          {/* 如果不是 dva 2.0 替换成 {children} end */}
        </div>
      </PageLayout>
    );
  }
}

export default compose(withCurrentUser)(HomeView5);
