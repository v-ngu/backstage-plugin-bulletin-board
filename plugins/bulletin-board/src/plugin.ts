import { 
  createPlugin, 
  createRoutableExtension,
  createApiFactory,
  identityApiRef,
  discoveryApiRef,
  fetchApiRef
} from '@backstage/core-plugin-api';
import { bulletinBoardApiRef, BulletinBoardClient } from './api';
import { rootRouteRef } from './routes';

export const bulletinBoardPlugin = createPlugin({
  id: 'bulletin-board',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: bulletinBoardApiRef,
      deps: {
        identityApi: identityApiRef,
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ identityApi, discoveryApi, fetchApi }) =>
      new BulletinBoardClient({ identityApi, discoveryApi, fetchApi }),
    })
  ]
});

export const BulletinBoardPage = bulletinBoardPlugin.provide(
  createRoutableExtension({
    name: 'BulletinBoardPage',
    component: () =>
      import('./components/BulletinBoardPage').then(m => m.BulletinBoardPage),
    mountPoint: rootRouteRef,
  }),
);
