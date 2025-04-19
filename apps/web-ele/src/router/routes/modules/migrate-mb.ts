import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: '迁移',
    },
    name: 'migrate-mb',
    path: '/migrate-mb',
    children: [
      {
        meta: {
          title: 'UI',
        },
        name: '"Ui"',
        path: '/migrate-mb/ui',
        component: () => import('#/views/migrate-mb/ui/index.vue'),
      },
      {
        meta: {
          title: 'Demo01',
        },
        name: 'Demo01',
        path: '/migrate-mb/demo01',
        component: () => import('#/views/migrate-mb/demo-01/index.vue'),
      },
      {
        meta: {
          title: 'Demo02',
        },
        name: 'Demo02',
        path: '/migrate-mb/demo02',
        component: () => import('#/views/migrate-mb/demo-02/index.vue'),
      },
    ],
  },
];

export default routes;
