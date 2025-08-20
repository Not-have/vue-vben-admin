import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    children: [
      {
        meta: {
          title: $t('demos.elementPlus'),
        },
        name: 'NaiveDemos',
        path: '/demos/element',
        component: () => import('#/views/demos/element/index.vue'),
      },
      {
        meta: {
          title: $t('demos.form'),
        },
        name: 'BasicForm',
        path: '/demos/form',
        component: () => import('#/views/demos/form/basic.vue'),
      },
      {
        meta: {
          title: 'schema',
        },
        name: 'Schema',
        path: '/demos/schema',
        children: [
          {
            meta: {
              title: 'form',
            },
            name: 'SchemaForm',
            path: '/demos/schema/form',
            component: () => import('#/views/demos/schema/form.vue'),
          },
          {
            meta: {
              title: 'table',
            },
            name: 'SchemaTable',
            path: '/demos/schema/table',
            component: () => import('#/views/demos/schema/table.vue'),
          },
          {
            meta: {
              title: 'search',
            },
            name: 'SchemaSearch',
            path: '/demos/schema/search',
            component: () => import('#/views/demos/schema/search.vue'),
          },
        ],
      },
    ],
  },
];

export default routes;
