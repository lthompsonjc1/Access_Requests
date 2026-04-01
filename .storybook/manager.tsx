import { addons, types, useGlobals, useStorybookApi } from 'storybook/internal/manager-api';
import { IconButton } from 'storybook/internal/components';
import React from 'react';

const ADDON_ID = 'open-in-new-tab';

function OpenInNewTab() {
  const api = useStorybookApi();
  const [globals] = useGlobals();
  const story = api.getCurrentStoryData();

  if (!story) return null;

  const FORWARDED_GLOBALS = ['theme', 'annotateMode'];
  const globalsQuery = Object.entries(globals)
    .filter(([k, v]) => FORWARDED_GLOBALS.includes(k) && v != null)
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
  const href = `/iframe.html?id=${story.id}&viewMode=story${globalsQuery ? `&globals=${globalsQuery}` : ''}`;

  return React.createElement(
    'a',
    {
      href,
      target: '_blank',
      rel: 'noopener noreferrer',
      title: 'Open story in new tab',
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        color: 'inherit',
        opacity: 0.7,
      },
    },
    React.createElement('svg', {
      width: 14,
      height: 14,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      xmlns: 'http://www.w3.org/2000/svg',
    },
      React.createElement('path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }),
      React.createElement('polyline', { points: '15 3 21 3 21 9' }),
      React.createElement('line', { x1: 10, y1: 14, x2: 21, y2: 3 }),
    ),
  );
}

addons.register(ADDON_ID, () => {
  addons.add(`${ADDON_ID}/tool`, {
    type: types.TOOL,
    title: 'Open in new tab',
    render: OpenInNewTab,
  });
});

// Pinned comments addon — manager-side registration
import '../src/addons/storybook-comments/manager';
