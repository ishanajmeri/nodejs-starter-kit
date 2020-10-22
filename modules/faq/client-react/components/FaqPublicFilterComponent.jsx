import React from 'react';
import PropTypes from 'prop-types';
import { DebounceInput } from 'react-debounce-input';
import { Input, Icon } from 'antd';
import { translate } from '@gqlapp/i18n-client-react';
import { Form, FormItem } from '@gqlapp/look-client-react';

const FaqFilterComponent = props => {
  const {
    filter: { searchText },
    // orderBy,
    onSearchTextChange
    // onIsFeaturedChange
  } = props;

  return (
    <Form layout="inline">
      <FormItem>
        <DebounceInput
          minLength={2}
          debounceTimeout={300}
          placeholder="Search FAQ's"
          element={p => {
            return <Input {...p} suffix={<Icon type="search" />} />;
          }}
          value={searchText}
          onChange={e => onSearchTextChange(e.target.value)}
        />
      </FormItem>
    </Form>
  );
};

FaqFilterComponent.propTypes = {
  filter: PropTypes.object.isRequired,
  onSearchTextChange: PropTypes.func.isRequired,
  onFaqCategoryChange: PropTypes.func.isRequired,
  onIsFeaturedChange: PropTypes.func
};

export default translate('events')(FaqFilterComponent);
