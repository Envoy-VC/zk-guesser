/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  useTabs: false,
  singleQuote: true,
  jsxSingleQuote: true,
  importOrder: [
    '^react',
    '^next/(.*)$',
    '^~/lib/hooks/(.*)$',
    '^~/lib/helpers/(.*)$',
    '^~/lib/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^~/components/(.*)$',
    '^~/assets/(.*)$',
    '^[./]',
    '^~/types/(.*)$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default config;
