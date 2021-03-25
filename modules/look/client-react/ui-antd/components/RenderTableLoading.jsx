import React from 'react';
import PropTypes from 'prop-types';
import { Skeleton } from 'antd';

import settings from '@gqlapp/config';

import Table from './Table';

const { itemsNumber } = settings.pagination.web;

const RenderTableLoading = ({ columns, tableProps = {} }) => {
  const { expandable, ...restTableProps } = tableProps;
  const renderSkeleton = align => (
    <div align={align}>
      <Skeleton title={{ width: '60%' }} paragraph={false} active />
    </div>
  );
  const loadingColumn = columns.map(i => {
    return {
      title: i.title,
      dataIndex: i.dataIndex,
      key: i.key,
      fixed: i.fixed,
      width: i.width,
      align: i.align,
      render: () => renderSkeleton(i.align)
    };
  });
  return (
    <Table
      expandable={{
        ...expandable
        // expandIcon: renderSkeleton,
      }}
      {...restTableProps}
      dataSource={[...Array(itemsNumber).keys()]}
      columns={loadingColumn}
    />
  );
};

RenderTableLoading.propTypes = {
  columns: PropTypes.array,
  tableProps: PropTypes.object
};

export default RenderTableLoading;
