import React from 'react';
import { enquireScreen } from 'enquire-js';

import { PageLayout, MetaTags } from '@gqlapp/look-client-react';
import { TranslateFunction } from '@gqlapp/i18n-client-react';
import { translate } from '@gqlapp/i18n-client-react';

import settings from '@gqlapp/config';
import Banner3 from './AntdLanding/Banner3';
import Teams4 from './AntdLanding/Teams4';
import Content9 from './AntdLanding/Content9';
import Content11 from './AntdLanding/Content11';
import Content12 from './AntdLanding/Content12';
import Contact0 from './AntdLanding/Contact0';

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
      <Banner3 id="Banner3_0" key="Banner3_0" isMobile={this.state.isMobile} />,
      <Teams4 id="Teams4_1" key="Teams4_1" isMobile={this.state.isMobile} />,
      <Content9 id="Content9_0" key="Content9_0" isMobile={this.state.isMobile} />,
      <Contact0 id="Contact0_0" key="Contact0_0" isMobile={this.state.isMobile} />,
      <Content11 id="Content11_0" key="Content11_0" isMobile={this.state.isMobile} />,
      <Content12 id="Content12_0" key="Content12_0" isMobile={this.state.isMobile} />
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
