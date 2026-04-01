import type { Preview } from '@storybook/vue3';
import { GLOBAL_ANNOTATE_MODE } from './constants';
import { withAnnotations } from './preview/withAnnotations';

const annotationPreview: Partial<Preview> = {
  decorators: [withAnnotations],
  initialGlobals: {
    [GLOBAL_ANNOTATE_MODE]: false,
  },
};

export const decorators = annotationPreview.decorators!;
export const initialGlobals = annotationPreview.initialGlobals!;

export default annotationPreview;
