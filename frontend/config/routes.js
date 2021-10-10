export default [
  {
    path: '/',
    component: '../layouts/index',
    menu: {
      flatMenu: true,
    },
    routes: [
      // {
      //   path: '/user',
      //   layout: false,
      //   routes: [
      //     {
      //       path: '/user',
      //       routes: [
      //         {
      //           name: 'login',
      //           path: '/user/login',
      //           component: './user/Login',
      //         },
      //       ],
      //     },
      //     {
      //       component: './404',
      //     },
      //   ],
      // },
      // {
      //   path: '/welcome',
      //   name: 'welcome',
      //   icon: 'smile',
      //   component: './Welcome',
      // },
      // {
      //   path: '/admin',
      //   name: 'admin',
      //   icon: 'crown',
      //   // access: 'canAdmin',
      //   component: './Admin',
      //   routes: [
      //     {
      //       path: '/admin/sub-page',
      //       name: 'sub-page',
      //       icon: 'smile',
      //       component: './Welcome',
      //     },
      //     {
      //       component: './404',
      //     },
      //   ],
      // },
      // {
      //   name: 'list.table-list',
      //   icon: 'table',
      //   path: '/list',
      //   component: './TableList',
      //   layout: 'BasicLayout',
      // },
      {
        name: 'thermostat',
        icon: 'table',
        path: '/thermostat',
        component: './ThermostatList',
        layout: 'BasicLayout',
      },
      {
        path: '/',
        redirect: '/thermostat',
      },
      {
        component: './404',
      },
    ]
  },
];
