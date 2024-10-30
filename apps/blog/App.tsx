/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { helloworld } from '@yyp/shared';
import { OllamaApiClient } from '@yyp/llm_unit_test';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
  Button,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Text,
  Keyboard
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';



function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [text, setText] = useState('');
  const [generateText, setGenerateText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const apiClient = new OllamaApiClient();

  const backgroundStyle = {
    // backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    backgroundColor: Colors.lighter,
    flex: 1
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.textInputContainer}>
       <TextInput
          onChangeText={setText}
          multiline={true}
          value={text}
          placeholder={'Please type here…'}
        />
      </View>
           <Button 
            title='generate'
            onPress={async () => {
              if (text.length <= 0 ) {
                return
              }
              try {
                Keyboard.dismiss()
                setLoading(true)
                setGenerateText(null)
                const completion = await apiClient.generateCompletion({
                  model: 'llama3.2',
                  prompt: text
                });
                setLoading(false)
                console.log('补全结果:', completion.response);
                setGenerateText(completion.response)
              } catch (error: any) {
                setLoading(false)
                console.log(error)
              }
            }}
          />
      <ScrollView
        keyboardDismissMode="none"
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={{ alignSelf: 'center', alignItems: 'center', paddingTop: 40 }}>
           
          {
            generateText ? <Text style={{marginHorizontal: 15}}>{generateText}</Text> : null
          } 
           <ActivityIndicator animating={loading} size="large" />
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
  textInputContainer: {
    padding: 5,
    alignSelf: 'center',
    minHeight: 60,
    width: '80%',
    borderColor: 'black',
    borderWidth: 1,
  },
});

export default App;
