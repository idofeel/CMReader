module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'syntax-decorators',
    'transform-decorators-legacy',
    '@babel/plugin-proposal-decorators',
    {
      legacy: true,
    },
  ],
};
