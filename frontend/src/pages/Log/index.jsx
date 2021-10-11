import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';

import { getAllLogs } from '@/services/aws/api';


const TableList = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */

  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns = [
    {
      title: 'cognito_username',
      dataIndex: 'cognito_username',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'textarea',
    },
    {
      title: 'creation_date',
      sorter: true,
      dataIndex: 'creation_date',
      valueType: 'dateTime',
    },
    {
      title: 'lastupdate_date',
      sorter: true,
      dataIndex: 'lastupdate_date',
      valueType: 'dateTime',
    },
    {
      title: 'action',
      sorter: true,
      dataIndex: 'action',
    },
    {
      title: 'body',
      sorter: false,
      dataIndex: 'body',
      render: (val, record) => JSON.stringify(val)
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle='Log List'
        actionRef={actionRef}
        rowKey="id"
        search={false}
        request={async (
          params,
          sort,
          filter,
        ) => {

          const msg = await getAllLogs({
            page: params.current,
            pageSize: params.pageSize,
          });

          const data = msg.data;

          // if (data) {
          //   data.Items.forEach(i => i.key = i.id);
          // }

          return {
            data: data.Items,
            success: true,
            total: msg.Count,
          };
        }
        }
        columns={columns}
      />


    </PageContainer>
  );
};

export default TableList;
