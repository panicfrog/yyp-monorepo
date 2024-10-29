/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { helloworld } from '@yyp/shared';
import { codeGenerate, OllamaApiClient } from '@yyp/llm_unit_test';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
  Button,
  TextInput,
  StyleSheet
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';



function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [text, setText] = useState('');
  const apiClient = new OllamaApiClient();

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
        keyboardDismissMode="interactive"
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={{ alignSelf: 'center', alignItems: 'center', paddingTop: 100 }}>
          <TextInput
            style={styles.textInput}
            // inputAccessoryViewID={inputAccessoryViewID}
            onChangeText={setText}
            value={text}
            placeholder={'Please type here…'}
          />
          <Button 
            title='call shared function'
            onPress={() => {
              helloworld()
            }}
          />
           <Button 
            title='GenCode'
            onPress={async () => {
              if (text.length <= 0 ) {
                return
              }
              try {
                const completion = await apiClient.generateCompletion({
                  model: 'llama3.2',
                  prompt: text
                });
                console.log('补全结果:', completion.response);
              } catch (error: any) {
                console.log(error)
              }
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  textInput: {
    padding: 16,
    borderColor: 'black',
    borderWidth: 1,
  },
});

export default App;
