//import React from 'react';
import { View } from 'react-native';
import InputWithButton from './InputWithButton.js';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        padding: 0,
        alignItems: 'center',
        backgroundColor: '#15202b', // Ensure the background is dark
        paddingBottom: 20,
      }}
    >
      <InputWithButton/>
    </View>
  );
}

