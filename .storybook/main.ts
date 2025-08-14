import type { StorybookConfig } from '@storybook/react-webpack5';
import { buildCssLoader } from '../config/build/loaders/buildCssLoader';
import path from 'path';
import { DefinePlugin } from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],

  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    'storybook-addon-mock',
  ],

  framework: {
    name: '@storybook/react-webpack5',

    options: {
      builder: {
        fsCache: true,
      },
    },
  },

  webpackFinal: async (config) => {
    config.resolve!.alias = {
      ...(config.resolve!.alias || {}),
      '@': path.resolve(__dirname, '../src'),
    };

    const paths = {
      build: '',
      html: '',
      entry: '',
      src: path.resolve(__dirname, '..', '..', 'src'),
    };

    config!.resolve!.modules!.push(paths.src);
    config!.resolve!.extensions!.push('.ts', '.tsx');

    config!.module!.rules = config!.module!.rules || [];

    // @ts-ignore
    config!.module!.rules = config!.module!.rules!.map((rule: RuleSetRule) => {
      if (/svg/.test(rule.test as string)) {
        return { ...rule, exclude: /\.svg$/i };
      }

      return rule;
    });

    config!.module!.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    config!.module!.rules.push(buildCssLoader(true, true));

    config!.plugins!.push(
      new DefinePlugin({
        __IS_DEV__: JSON.stringify(true),
      }),
    );

    return config;
  },

  swc: () => ({
    jsc: {
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
    },
  }),

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  staticDirs: ['../public'],
};
export default config;
