// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Interview Prep Hub',
  tagline: 'Everything you need to crack technical interviews 🚀',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'SomnathKar000', // Usually your GitHub org/user name.
  projectName: 'Interview-Questions', // Usually your repo name.

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/SomnathKar000/Interview-Questions/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/SomnathKar000/Interview-Questions/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Interview Prep Hub',
        style: 'dark',
        logo: {
          alt: 'Interview Prep Hub Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'dropdown',
            label: 'JavaScript',
            position: 'left',
            items: [
              { label: 'How JavaScript Works',   to: '/docs/javascript/how-javascript-works' },
              { label: 'Execution & Call Stack',  to: '/docs/javascript/execution-and-call-stack' },
              { label: 'Hoisting',                to: '/docs/javascript/hoisting' },
              { label: 'Closures',                to: '/docs/javascript/closures' },
              { label: 'Async & Event Loop',      to: '/docs/javascript/async-javascript-event-loop' },
              { label: 'Promises',                to: '/docs/javascript/promises' },
              { label: 'Async / Await',           to: '/docs/javascript/async-await' },
            ],
          },
          {
            type: 'dropdown',
            label: 'React',
            position: 'left',
            items: [
              { label: 'Overview',            to: '/docs/react/react-overview' },
              { label: 'Hooks',               to: '/docs/react/hooks' },
              { label: 'Component Lifecycle', to: '/docs/react/component-lifecycle' },
              { label: 'Redux Toolkit',       to: '/docs/react/redux-toolkit' },
              { label: 'React Deep Dive',   to: '/docs/react/react-deep-dive' },
            ],
          },
          {
            type: 'dropdown',
            label: 'Vue',
            position: 'left',
            items: [
              { label: 'Composition API',          to: '/docs/vue/composition-api' },
              { label: 'Reactivity Deep Dive',     to: '/docs/vue/reactivity-system-deep-dive' },
              { label: 'Pinia & Lifecycle Hooks',   to: '/docs/vue/pinia-or-vuex-lifecycle-hooks' },
              { label: 'Performance Tips',          to: '/docs/vue/performance-tips-in-vue' },
            ],
          },
          {
            type: 'dropdown',
            label: 'Backend',
            position: 'left',
            items: [
              { label: 'How Node.js Works',  to: '/docs/backend/how-nodejs-works' },
              { label: 'HTTP Status Codes',  to: '/docs/backend/http-status-codes' },
              { label: 'Kafka Basics',       to: '/docs/backend/kafka/kafka-basic' },
              { label: 'SSH',               to: '/docs/backend/ssh' },
            ],
          },
          {
            type: 'dropdown',
            label: 'More',
            position: 'left',
            items: [
              { label: 'SQL vs NoSQL',              to: '/docs/database/sql-vs-nosql' },
              { label: 'Database Transactions',      to: '/docs/database/database-transactions' },
              { label: 'Horizontal vs Vertical Scaling', to: '/docs/cloud/horizontal-vs-vertical-scaling' },
              { label: 'DSA Operators',              to: '/docs/dsa/operators' },
            ],
          },
          {
            href: 'https://github.com/SomnathKar000/Interview-Questions',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
