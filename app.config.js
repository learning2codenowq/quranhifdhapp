module.exports = {
  expo: {
    ...require('./app.json').expo,
    plugins: [
      ...(require('./app.json').expo.plugins || []),
      [
        'expo-build-properties',
        {
          android: {
            compileSdkVersion: 34,
            targetSdkVersion: 34,
            buildToolsVersion: '34.0.0',
            kotlinVersion: '1.9.0',
            enableProguardInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true,
          },
        },
      ],
    ],
  },
};