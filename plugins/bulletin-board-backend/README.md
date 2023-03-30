# Backstage Plugin Bulletin Board (Backend Setup)

Add the backend plugin package:

```bash
# From your Backstage root directory
yarn add --cwd packages/backend backstage-plugin-bulletin-board-backend
```

Create a file in `packages/backend/src/plugins/bulletin-board.ts`:

```ts
import { createRouter } from 'backstage-plugin-bulletin-board-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
  });
}
```

In `packages/backend/src/index.ts` add the following:

```diff
+ import bulletinBoard from './plugins/bulletin-board';

async function main() {
  ...
  const createEnv = makeCreateEnv(config);

  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
+ const bulletinBoardEnv = useHotMemoize(module, () => createEnv('bulletin-board'));
  ...

  const apiRouter = Router();
+ apiRouter.use('/bulletin-board', await bulletinBoard(bulletinBoardEnv));
  ...
  apiRouter.use(notFoundHandler());
  ...
}
```
