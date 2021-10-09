/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */

  import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
  import React from 'react';
  import { Link } from 'umi';
  import { GithubOutlined } from '@ant-design/icons';
//   import RightContent from '@/components/GlobalHeader/RightContent';
  import logo from '../../public/aws.png';
  import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

  
  const menuDataRender = (menuList) =>
    menuList.map((item) => {
      return {
        ...item,
        children: item.children ? menuDataRender(item.children) : undefined,
      };
    });
  
  const defaultFooterDom = (
    <DefaultFooter
    //   copyright={`${new Date().getFullYear()} 蚂蚁集团体验技术部出品`}
    //   links={[
    //     {
    //       key: 'Ant Design Pro',
    //       title: 'Ant Design Pro',
    //       href: 'https://pro.ant.design',
    //       blankTarget: true,
    //     },
    //     {
    //       key: 'github',
    //       title: <GithubOutlined />,
    //       href: 'https://github.com/ant-design/ant-design-pro',
    //       blankTarget: true,
    //     },
    //     {
    //       key: 'Ant Design',
    //       title: 'Ant Design',
    //       href: 'https://ant.design',
    //       blankTarget: true,
    //     },
    //   ]}
    />
  );
  
const BasicLayout = (props) => {
    const {
      children,
      location = {
        pathname: '/',
      },
    } = props;
  
    const { formatMessage } = useIntl();
  
    return (
      <ProLayout
        logo={logo}
        formatMessage={formatMessage}
        {...props}
        onCollapse={handleMenuCollapse}
        onMenuHeaderClick={() => history.push('/')}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (
            menuItemProps.isUrl ||
            !menuItemProps.path ||
            location.pathname === menuItemProps.path
          ) {
            return defaultDom;
          }
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({ id: 'menu.home' }),
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={() => defaultFooterDom}
        menuDataRender={menuDataRender}
        rightContentRender={() => <AmplifySignOut /> }
      >
        {children}
      </ProLayout>
    );
  };
  
export default withAuthenticator(BasicLayout);
