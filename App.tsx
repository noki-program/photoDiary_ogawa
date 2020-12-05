import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// モジュールを追加
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//Screenを読み込み
import HomeScreen from './src/HomeScreen';
import AddScreen from './src/AddScreen';

// ナビゲーションでApp.d.tsで設定したRootStackParamListを読み込み
const Stack = createStackNavigator<RootStackParamList>();

// ナビゲーションからの値を受け取るため、引数を設定 (Propsのnavigationを分割代入)
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Propsの中のComponentとしてHomeを受け取っている */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "ホーム画面" }}
        />

        <Stack.Screen
          name="Add"
          component={AddScreen}
          options={{ title: "入力画面" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
