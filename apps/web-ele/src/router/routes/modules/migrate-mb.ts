import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: '迁',
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
    ],
  },
];

export default routes;
