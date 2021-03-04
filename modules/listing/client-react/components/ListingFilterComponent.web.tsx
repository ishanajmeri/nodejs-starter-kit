import React, { ChangeEvent, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import styled from 'styled-components';

import { FieldAdapter as Field } from '@gqlapp/forms-client-react';
import { SORT_BY, DISCOUNT } from '@gqlapp/listing-common';
import { translate } from '@gqlapp/i18n-client-react';
import {
  CheckBox,
  Space,
  Option,
  FormItem,
  Input,
  Row,
  Col,
  RenderSelect,
  Icon,
  RenderCheckBox,
  Rate,
  FilterLayout
} from '@gqlapp/look-client-react';
import { CategoryTreeComponent } from '@gqlapp/category-client-react';
import { MODAL } from '@gqlapp/review-common';
import { compose } from '@gqlapp/core-common';

import ROUTES from '../routes';
import FilterSliderControlledComponent from './FilterSliderControlledComponent';
import { withGetBrandList } from '../containers/ListingOperations';

// types
import { ListingViewProps } from './ListingView';

const RateDiv = styled.div`
  height: 22px;
  cursor: pointer;

  &:hover {
    color: rgb(0, 98, 190);
    text-decoration: underline;
  }
`;

export interface ListingsFilterComponentProps extends ListingViewProps {
  categoryId: number;
  layout: string;
  getBrandList: string[];
}

const ListingsFilterComponent: React.FC<ListingsFilterComponentProps> = props => {
  const {
    loadingState,
    filter: { searchText, lowerCost, upperCost, isActive, categoryFilter, discount, brand },
    getBrandList,
    onIsActiveChange,
    onCategoryChange,
    onSearchTextChange,
    onLowerCostChange,
    onUpperCostChange,
    onFiltersRemove,
    onDiscountChange,
    onBrandChange,
    onRatedChange,
    listings,
    showIsActive = false,
    showCategoryFilter = false,
    orderBy,
    onOrderBy,
    t,
    layout
  } = props;
  const [selectedBrand, setSelectedBrand] = useState(brand || []);

  const rangeValues = listings && listings.rangeValues;
  const handleChangeSlider = (e: number[]) => {
    onLowerCostChange(e[0]);
    onUpperCostChange(e[1]);
    // console.log(e);
  };

  // const handleOrderBy = (order, name) => {
  //   return onOrderBy({ column: name, order });
  // };

  const minCostRangeValues = Math.round(rangeValues && rangeValues.minCost);
  const maxCostRangeValues = Math.round(rangeValues && rangeValues.maxCost);
  const costMarks = {
    [`${minCostRangeValues}`]: minCostRangeValues,
    [`${maxCostRangeValues}`]: maxCostRangeValues
  };
  const categoryTreeField = showCategoryFilter && (
    <Field
      component={CategoryTreeComponent}
      filter={{ modalName: MODAL[1].value }}
      // disableParent={true}
      inFilter={true}
      nullable={true}
      onChange={(e: number) => onCategoryChange({ categoryId: e, allSubCategory: false })}
      type="number"
      name="categoryId"
      placeholder="Category"
      icon={'ProfileOutlined'}
      label={'Category'}
      value={categoryFilter.categoryId}
    />
  );

  const listingSortBy = (width: string, inFilter = true) => {
    const index = SORT_BY.findIndex(
      (x: { value: string; column: string; sortBy: string }) => x.value === orderBy.column && x.sortBy === orderBy.order
    );
    return (
      <Field
        name="sortBy"
        component={RenderSelect}
        icon={'FilterOutlined'}
        label={t('listingFilter.sortBy')}
        // defaultValue={orderBy.order}
        onChange={(e: number) =>
          SORT_BY[e].sortBy === ''
            ? onOrderBy({ order: SORT_BY[e].sortBy, column: '' })
            : onOrderBy({
                order: SORT_BY[e].sortBy,
                column: SORT_BY[e].value
              })
        }
        style={{ width: '100%' }}
        value={index > -1 && SORT_BY[index].label}
        inFilter={inFilter}
        selectStyle={{ width }}
      >
        <Option key={1} value="">
          None
        </Option>
        {SORT_BY.map((sB: { label: string }, i: number) => (
          <Option key={i + 2} value={i}>
            {sB.label}
          </Option>
        ))}
      </Field>
    );
  };

  const listingBrand = (width: string, inFilter = true) => {
    return (
      <Field
        name="brand"
        component={RenderSelect}
        icon={'FireOutlined'}
        label={t('listingFilter.brand')}
        style={{ width: '100%' }}
        inFilter={inFilter}
        selectStyle={{ width }}
        onChange={() => {}}
      >
        {(getBrandList || loadingState) && (
          <>
            <Option key={1} value="">
              <CheckBox
                checked={selectedBrand.length === 0}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.checked) {
                    setSelectedBrand([]);
                    onBrandChange([]);
                  } else {
                    setSelectedBrand([]);
                    onBrandChange([]);
                  }
                }}
              >
                None
              </CheckBox>
            </Option>
          </>
        )}
        {!loadingState && getBrandList ? (
          getBrandList.map((sB: string, i: number) => (
            <>
              <Option key={i + 2} value={i}>
                <CheckBox
                  checked={selectedBrand.includes(sB)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      setSelectedBrand([...selectedBrand, sB]);
                      onBrandChange([...selectedBrand, sB]);
                    } else {
                      setSelectedBrand(selectedBrand.filter((bnd: string) => bnd !== sB));
                      onBrandChange(selectedBrand.filter((bnd: string) => bnd !== sB));
                    }
                  }}
                >
                  {sB}
                </CheckBox>
              </Option>
            </>
          ))
        ) : (
          <Option key={0} value="">
            <Icon type="LoadingOutlined" />
          </Option>
        )}
      </Field>
    );
  };

  const listingDiscount = (width: string, inFilter = true) => {
    return (
      <Field
        name="discount"
        component={RenderSelect}
        icon={'PercentageOutlined'}
        label={t('listingFilter.discount')}
        onChange={(e: string) => {
          // tslint:disable-next-line: no-unused-expression
          e === '' ? onDiscountChange(0) : DISCOUNT[e] ? onDiscountChange(DISCOUNT[e].value) : null;
        }}
        style={{ width: '100%' }}
        value={discount === 0 ? '' : discount}
        inFilter={inFilter}
        selectStyle={{ width }}
      >
        <Option key={1} value="">
          None
        </Option>
        {DISCOUNT.map((d: { label: string }, i: number) => (
          <Option key={i + 2} value={i}>
            {d.label}
          </Option>
        ))}
      </Field>
    );
  };

  const listingByRating = (infilter: boolean) => {
    return (
      <FormItem
        label={
          <Space align="center">
            <Icon type="SmileOutlined" />
            {'Avg. Customer Review'}
          </Space>
        }
        labelCol={infilter && { span: 24 }}
        wrapperCol={infilter && { span: 24 }}
      >
        {[5, 4, 3, 2, 1].map((i: number) => (
          <RateDiv onClick={() => onRatedChange(i)}>
            <Rate disabled defaultValue={i} style={{ fontSize: '18px' }} /> &nbsp; {'& up'}
          </RateDiv>
        ))}
      </FormItem>
    );
  };

  const sliderControlled = (infilter: boolean) => (
    <FilterSliderControlledComponent
      style={{
        width: '100%',
        background: 'white'
      }}
      label={t('listingFilter.costFilter')}
      max={Math.round(rangeValues && rangeValues.maxCost + 1)}
      min={Math.floor(rangeValues && rangeValues.minCost)}
      marks={costMarks}
      range
      value={[lowerCost, upperCost]}
      // disabled={false}
      inFilter={infilter}
      handleSliderChange={(e: number[]) => handleChangeSlider(e)}
    />
  );

  const searchField = (infilter: boolean) => {
    const obj = infilter
      ? {}
      : {
          labelCol: { span: 24 },
          wrapperCol: { span: 24 }
        };
    return (
      <FormItem
        label={
          <Space align="center">
            <Icon type="SearchOutlined" />
            {t('listingFilter.search')}
          </Space>
        }
        style={{ /* height: '60px', */ width: '100%', marginBottom: '0px' }}
        {...obj}
      >
        <DebounceInput
          minLength={2}
          debounceTimeout={300}
          placeholder={t('listingFilter.search')}
          element={Input}
          value={searchText}
          onChange={e => onSearchTextChange(e.target.value)}
        />
      </FormItem>
    );
  };

  const activeField = (infilter: boolean) => (
    <Field
      name="isActive"
      icon={'CheckCircleOutlined'}
      component={RenderCheckBox}
      type="checkbox"
      onChange={() => onIsActiveChange(!isActive)}
      label={t('listingFilter.isActive')}
      inFilter={infilter}
      checked={isActive}
    />
  );

  return (
    <FilterLayout
      verticalLayout={layout === 'vertical'}
      icon={'SolutionOutlined'}
      addRoute={ROUTES.add}
      title={t('list.subTitle')}
      // search
      searchTitle={t('listingFilter.search')}
      searchText={searchText}
      onSearchTextChange={onSearchTextChange}
      // components
      onFiltersRemove={() =>
        onFiltersRemove(
          {
            searchText: '',
            lowerCost: 0,
            upperCost: 0,
            discount: 0,
            popularity: 0,
            categoryFilter: {
              categoryId: 0,
              allSubCategory: true
            },
            isActive: true
          },
          { column: '', order: '' }
        )
      }
      expandChildren={(resetBtn: JSX.Element) =>
        layout === 'vertical' ? (
          <Row type="flex" align="middle">
            <Col span={24}>
              <Row gutter={24}>
                <Col span={24}>{searchField(false)}</Col>
                <Col span={24}>{showIsActive && activeField(false)}</Col>
                <Col span={24}>{categoryTreeField}</Col>
                <Col span={24}>{listingSortBy('100%', false)}</Col>
                <Col span={24}>{listingDiscount('100%', false)}</Col>
                <Col span={24}>{listingBrand('100%', false)}</Col>
                <Col span={24}>{listingByRating(true)}</Col>
                <Col span={22}>{sliderControlled(false)}</Col>
                <Col span={24}>
                  <br />
                  {resetBtn}
                </Col>
              </Row>
            </Col>
          </Row>
        ) : (
          <Row gutter={48}>
            <Col span={19}>
              <Row gutter={24}>
                <Col span={8}>{searchField(true)}</Col>
                <Col span={8}>{categoryTreeField}</Col>
                <Col span={8}>{showIsActive && activeField(true)}</Col>
                <Col lg={24} xs={24} md={12}>
                  <Row type="flex" gutter={24}>
                    <Col lg={8} md={8} xs={24}>
                      {listingBrand('100%', true)}
                    </Col>
                    <Col lg={8} md={8} xs={24}>
                      {listingSortBy('100%')}
                    </Col>
                    <Col lg={8} md={8} xs={24}>
                      {listingDiscount('100%')}
                    </Col>
                    <Col lg={24} md={24} xs={24} align="left">
                      {sliderControlled(false)}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={5}>
              {listingByRating(true)}
              {resetBtn}
            </Col>
          </Row>
        )
      }
    />
  );
};

export default compose(withGetBrandList, translate('listing'))(ListingsFilterComponent);
