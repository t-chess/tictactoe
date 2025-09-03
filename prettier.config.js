export default {
  semi: true,
  tabWidth: 2,
  singleQuote: true,
  printWidth: 120,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^react$',
    '<THIRD_PARTY_MODULES>',
    '@(assets|components|const|hooks|pages|services|src|utils)/(.*)$',
    '^[./](?:(?!/index)).+(?<!.scss)$',
    'scss$',
    '^[.](?=/index|$)',
  ],
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
};
