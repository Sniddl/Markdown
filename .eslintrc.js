module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: false,
    node: true
  },
  extends: 'standard',
  plugins: [
    'html'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-extend-native': ["error",{"exceptions": ["String"] }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'camelcase': [2, {"properties": "never"}]

  }
}
