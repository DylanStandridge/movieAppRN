import * as React from 'react';
import { useEffect } from 'react';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}
// jira: movies-5
// description: create a reusable header for the entire component by putting it on the top level of router dom
const drawerWidth = 240;
const navItems = [{ name: 'Movies', link: '/' }, { name: 'Favorites', link: '/favorites' }];

export default function DrawerAppBar(props: Props) {

  const drawer = (
   <view></view>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <view></view>


  );
}
