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
+   <Route path="/bulletin-board" element={<BulletinBoardPage />} />
    ...
  </FlatRoutes>
);

```

Add a **Bulletin Board icon to the Sidebar**. In `packages/app/src/components/Root/Root.tsx` add:

```diff
+ import DashboardIcon from '@material-ui/icons/Dashboard';

  <SidebarGroup label="Menu" icon={<MenuIcon />}>
    ...
+   <SidebarItem icon={DashboardIcon} to="bulletin-board" text="Bulletin Board" />
    ...
  </SideGroup>
```
