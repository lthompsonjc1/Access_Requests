import type { Meta, StoryObj } from '@storybook/vue3';
import { defineComponent, reactive, ref } from 'vue';
import ServerDialogPhase01 from './ServerDialogPhase01.vue';
import { phase01AuthStyleOptions } from '../shared/data';
import type { Phase01ServerFormState } from '../shared/types';

const meta: Meta<typeof ServerDialogPhase01> = {
  title: 'Projects/Burak - AI Connector/Parts/Server',
  component: ServerDialogPhase01,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ServerDialogPhase01>;

export const EditServerGithub: Story = {
  name: 'Edit Server (GitHub)',
  render: () =>
    defineComponent({
      components: { ServerDialogPhase01 },
      setup() {
        const visible = ref(true);
        const serverForm = reactive<Phase01ServerFormState>({
          prefix: 'GITHUB',
          name: 'Github',
          url: 'https://api.githubcopilot.com/mcp/',
          authStyle: 'API Token',
          apiDocumentationUrl: '',
        });
        return {
          visible,
          serverForm,
          phase01AuthStyleOptions,
        };
      },
      template: `
        <div class="h-screen bg-neutral-surface_alt">
          <ServerDialogPhase01
            v-model:visible="visible"
            mode="edit"
            edit-header-title="Github"
            editing-server-slug="github"
            editing-server-name="Github"
            :server-form="serverForm"
            :auth-style-options="phase01AuthStyleOptions"
            @cancel="visible = false"
            @save="visible = false"
          />
        </div>
      `,
    }),
};
