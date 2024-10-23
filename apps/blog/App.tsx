/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { helloworld } from '@yyp/shared';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
  Button
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';



function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={{ alignSelf: 'center', alignItems: 'center', paddingTop: 100 }}>
          <Text style={{backgroundColor: 'blue', color: 'red'}}>{'hello monorepo'}</Text>
          <Button 
            title='call shared function'
            onPress={() => {
              helloworld()
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
