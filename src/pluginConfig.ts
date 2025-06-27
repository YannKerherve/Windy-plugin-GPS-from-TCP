import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-gpsfromtcp',
    version: '0.2.5',
    icon: '🛰️',
    title: 'GPS from TCP',
    description: 'GPS Position from TCP port',
    author: 'Yann Kerherve (ENSM)',
    repository: 'https://github.com/YannKerherve/Windy-plugin-GPS-from-TCP',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    routerPath: '/gpsfromtcp',
};

export default config;
