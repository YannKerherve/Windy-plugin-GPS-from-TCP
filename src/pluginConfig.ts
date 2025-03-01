import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-gpsfromtcp',
    version: '0.0.01',
    icon: '🛰️',
    title: 'GPS from COM',
    description: 'GPS Position from TCP port.',
    author: 'Yann Kerherve (ENSM)',
    repository: 'https://github.com/windycom/windy-plugin-template',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    routerPath: '/gpsfromtcp',
};

export default config;
