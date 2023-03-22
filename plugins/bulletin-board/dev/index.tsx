import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { bulletinBoardPlugin, BulletinBoardPage } from '../src/plugin';

createDevApp()
  .registerPlugin(bulletinBoardPlugin)
  .addPage({
    element: <BulletinBoardPage />,
    title: 'Root Page',
    path: '/bulletin-board'
  })
  .render();
