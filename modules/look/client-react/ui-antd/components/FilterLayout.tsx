import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { DebounceInput } from 'react-debounce-input';
import { Link } from 'react-router-dom';
import { StickyContainer, Sticky } from 'react-sticky';

import Heading from './Heading';
import Affix from './Affix';
import Collapse from './Collapse';
import CollapsePanel from './CollapsePanel';
import Space from './Space';
import Icon from './Icon';
import Form from './Form';
import AddIcon from './actions/AddIcon';
import FormItem from './FormItem';
import Input from './Input';
import Row from './Row';
import Col from './Col';
import Button from './Button';
import Card from './Card';

// const HideMobile = styled.div`
//   @media screen and (max-width: 780px) {
//     display: none;
//   }
// `;

const MarginBtm = styled.div`
  margin-bottom: 5px;
  height: 100%;
`;

const FilterTitle = styled.div`
  position: absolute;
  top: 24%;
`;

export interface FilterLayoutProps {
  verticalLayout?: boolean;
  icon: string;
  title: string;
  searchTitle: string;
  searchText: string;
  addRoute?: string;
  expandChildren: (resetBtn: JSX.Element) => JSX.Element;
  onFiltersRemove: () => void;
  onSearchTextChange: (searchText: string) => void;
}

const FilterLayout: React.FC<FilterLayoutProps> = props => {
  const {
    verticalLayout = false,
    icon,
    title,
    searchTitle,
    searchText,
    onSearchTextChange,
    addRoute,
    expandChildren,
    onFiltersRemove
  } = props;

  const handleFilterRemove = useRef(() => {});

  handleFilterRemove.current = () => {
    onFiltersRemove();
  };

  useEffect(() => {
    return () => handleFilterRemove.current();
  }, []);

  const resetBtn = (
    <Button block color="primary" onClick={handleFilterRemove.current}>
      <Icon type={'UndoOutlined'} /> Reset
    </Button>
  );

  const AddBtn = addRoute && (
    <Link to={addRoute}>
      <AddIcon shape="sqaure" /* color="default" */ />
    </Link>
  );
  return (
    <MarginBtm>
      {verticalLayout ? (
        <StickyContainer style={{ height: '100%' /* , zIndex: '1' */ }}>
          <Sticky>
            {({ style, isSticky }: { style: object; isSticky: boolean }) => (
              <div style={{ ...style }}>
                <div style={{ height: isSticky ? '90px' : '0px' }} />
                <Col lg={24} md={24} xs={0}>
                  <Card>{expandChildren(resetBtn)}</Card>
                </Col>
              </div>
            )}
          </Sticky>
          <Col lg={0} md={0} xs={24}>
            <Card>{expandChildren(resetBtn)}</Card>
          </Col>
        </StickyContainer>
      ) : (
        <Affix offsetTop={44}>
          <Collapse>
            <CollapsePanel
              header={
                <FilterTitle>
                  <Heading type="2">
                    <Icon type={icon} />
                    &nbsp;
                    {title}
                  </Heading>
                </FilterTitle>
              }
              extra={
                <Row type="flex">
                  <Col lg={24} md={24} xs={0}>
                    <Space align="center">
                      <FormItem
                        label={
                          <Space align="center">
                            <Icon type="SearchOutlined" />
                            {searchTitle}
                          </Space>
                        }
                        style={{ width: '100%', marginBottom: '0px' }}
                      >
                        <DebounceInput
                          minLength={2}
                          debounceTimeout={300}
                          placeholder={searchTitle}
                          element={Input}
                          value={searchText}
                          onChange={e => onSearchTextChange(e.target.value)}
                        />
                      </FormItem>
                      {AddBtn}
                    </Space>
                  </Col>
                  <Col lg={0} md={0} xs={24}>
                    {AddBtn}
                  </Col>
                </Row>
              }
            >
              <Form onSubmit={{}}>
                <Row gutter={24}>
                  <Col lg={0} md={0} xs={24}>
                    <FormItem
                      label={
                        <Space align="center">
                          <Icon type="SearchOutlined" />
                          {searchTitle}
                        </Space>
                      }
                      style={{ width: '100%' }}
                    >
                      <DebounceInput
                        minLength={2}
                        debounceTimeout={300}
                        placeholder={searchTitle}
                        element={Input}
                        value={searchText}
                        onChange={e => onSearchTextChange(e.target.value)}
                      />
                    </FormItem>
                  </Col>
                </Row>
                {expandChildren(resetBtn)}
              </Form>
            </CollapsePanel>
          </Collapse>
        </Affix>
      )}
    </MarginBtm>
  );
};

export default FilterLayout;
