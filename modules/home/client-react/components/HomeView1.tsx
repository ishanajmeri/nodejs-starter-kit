import React from 'react';
import { enquireScreen } from 'enquire-js';

import { PageLayout, MetaTags } from '@gqlapp/look-client-react';
import { TranslateFunction } from '@gqlapp/i18n-client-react';
import { translate } from '@gqlapp/i18n-client-react';
import settings from '@gqlapp/config';

import Banner0 from './AntdLanding/Banner0';
import Content5 from './AntdLanding/Content5';
import Feature0 from './AntdLanding/Feature0';
import Feature3 from './AntdLanding/Feature3';

let isMobile: boolean;
enquireScreen((b: boolean) => {
  isMobile = b;
});

export interface HomeViewProps {
  t: TranslateFunction;
}

export interface HomeViewState {
  isMobile: boolean;
  show: boolean;
}

class HomeView extends React.Component<HomeViewProps, HomeViewState> {
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
    const { t } = this.props;
    const children = [
      <Banner0 id="Banner0_0" key="Banner0_0" isMobile={this.state.isMobile} />,
      <Feature0 id="Feature0_0" key="Feature0_0" isMobile={this.state.isMobile} />,
      <Content5 id="Content5_0" key="Content5_0" isMobile={this.state.isMobile} />,
      <Feature3 id="Feature3_0" key="Feature3_0" isMobile={this.state.isMobile} />
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

export default translate('home')(HomeView);
