# Backstage Plugin Bulletin Board (Frontend Setup)

Add the frontend plugin package:

```bash
# From your Backstage root directory
yarn add --cwd packages/app backstage-plugin-bulletin-board
```

Modify your app routes in `packages/app/src/App.tsx`:

```diff
+ import { BulletinBoardPage } from 'backstage-plugin-bulletin-board';

const routes = (

  <FlatRoutes>
    ...
+    <Route path="/bulletin-board" element={<BulletinBoardPage />} />
    ...
  </FlatRoutes>
);

```