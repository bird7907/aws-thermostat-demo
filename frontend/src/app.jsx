import { PageLoading } from '@ant-design/pro-layout';
import { history, Link } from 'umi';
import {Button} from 'antd';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
// import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { getToken } from './services/aws/login';

import awsconfig from './awsConfig';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
/** 获取用户信息比较慢的时候会展示一个 loading */

export const initialStateConfig = {
  loading: <PageLoading />,
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState() {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }

    return undefined;
  }; // 如果是登录页面，不执行

  const fetchAwsToken = async () => {
    // try {
    //   const params = {"response_type":"token",
    //   "client_id": awsconfig.aws_user_pools_web_client_id,
    //   "redirect_url": awsconfig.redirect_url
    //  }

    //   const msg = await getToken(params);
    //   return msg.data;
    // } catch (error) {
    //   console.error(error)
    //   // history.push(loginPath);
    // }
    console.log('check awsToken');
    console.log('awsToken='+ localStorage.getItem('awsToken') );
    if( localStorage.getItem('awsToken') == 'undefined' || !localStorage.getItem('awsToken')){
      console.log('awsToken='+localStorage.getItem('awsToken') );

      // history.push(loginPath);
    }

    return undefined;
  }; // 如果是登录页面，不执行

  if (history.location.pathname !== loginPath) {
    // const currentUser = await fetchUserInfo();
    const currentUser = "Test";
    
    const awsToken = await fetchAwsToken();
    // localStorage.setItem('awsToken', awsToken);
    

    return {
      fetchUserInfo,
      currentUser,
      awsToken,
      settings: {},
    };
  }

  return {
    fetchUserInfo,
    settings: {},
  };  
} // ProLayout 支持的api https://procomponents.ant.design/components/layout

export const layout = ({ initialState }) => {
const isLogin = localStorage.getItem('awsToken') == 'undefined' || !localStorage.getItem('awsToken');

  return {
    rightContentRender: () =>   isLogin && 
     <Button
    href={`https://${awsconfig.cognito_hosted_domain}/login?response_type=token&client_id=${awsconfig.aws_user_pools_web_client_id}&redirect_uri=${window.location.href}`}
    color="primary"
    className="mt-5 float-center"
  >
    Log In
  </Button>
   ,
    disableContentMargin: false,
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    // footerRender: () => <Footer />,
    // onPageChange: () => {
    //   const { location } = history; // 如果没有登录，重定向到 login

    //   if (!initialState?.currentUser && location.pathname !== loginPath) {
    //     history.push(loginPath);
    //   }
    // },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // ...initialState?.settings,
  };
};


const addToken =(async (url, options) => {  // 此处为拦截器，每次发送请求之前判断能否取到token
  if (localStorage.getItem('awsToken')) {
    const headers = {
      'access_token': `${localStorage.getItem('awsToken')}`,
    };
    return {
      url,
      options: { ...options, headers },
    };
  }
});

export const request = {
  errorHandler: (error) => {
    const { response } = error;
 
    if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
 
    throw error;
  },
  requestInterceptors:[addToken]
}
