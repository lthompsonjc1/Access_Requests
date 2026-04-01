import { addons, types } from 'storybook/internal/manager-api';
import React from 'react';
import { ADDON_ID, PANEL_ID, TOOL_ID } from './constants';
import { AnnotateModeTool } from './manager/AnnotateModeTool';
import { CommentsPanel } from './manager/CommentsPanel';

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Annotate',
    match: ({ tabId, viewMode }) => !tabId && viewMode === 'story',
    render: () => <AnnotateModeTool />,
  });

  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Comments',
    match: ({ tabId, viewMode }) => !tabId && viewMode === 'story',
    render: ({ active }) => <CommentsPanel active={Boolean(active)} />,
  });
});
