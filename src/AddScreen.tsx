import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text, 
  View, 
  Image, 
  KeyboardAvoidingView, 
  Platform, TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";

// モジュールを追加
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from "expo-image-picker";

import Icon from "react-native-vector-icons/FontAwesome";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import * as FileSystem from "expo-file-system";

import moment from "moment";
import * as MediaLibrary from "expo-media-library";
import { savePictureInfoAsync } from "./Store";

// ナビゲーション情報を設定
// Propsとして、Propsの中のnavigationだけを取ってきている
type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Add'>;
};

const screenWidth = Dimensions.get('screen').width

export default function AddScreen({ navigation }: Props) {
  const [titleText, setTitleText] = useState("");
  const [pictureURI, setPictureURI] = useState("");

  const pictureURICache = React.useRef("");

  // カメラを起動して画像を取得する
  const takePictureFromCameraAsync = async () => {
    const result = await ImagePicker.launchCameraAsync({
      aspect: [3, 4],
      allowsEditing: true,
    });
    if (result.cancelled) return;
    setPictureURI(result.uri);
    // useRefにも保存する
    pictureURICache.current = result.uri;
  };

  React.useEffect(() => {
    return () => {
      // キャッシュを削除
      if (pictureURICache.current !== "") {
        FileSystem.deleteAsync(pictureURICache.current, { idempotent: true });
      }
    };
  }, []);
  
//----------------------------------------------------------------------------------
// 保存ボタンの処理
const saveAsync = async () => {
  // タイトルが設定されていないとアラート
  if (titleText === "") {
    alert("タイトルを入力してください");
    return;
  }
  // タイトルが設定されていないとアラート
    if (pictureURI === "") {
      alert("写真が有りません");
      return;
    }
    
    // カメラロールへ画像を保存
    const asset = await MediaLibrary.createAssetAsync(pictureURI);

    // ストレージの画像リストに追加
    const newPictureInfo: PictureInfo = {
      title: titleText,
      uri: asset.uri,
      createdAt: moment.now(),
    };
    await savePictureInfoAsync(newPictureInfo);
    
    // キャッシュを削除
    FileSystem.deleteAsync(pictureURI);

    // Homeへ
    navigation.goBack();
  };
  //----------------------------------------------------------------------------------
  
  const Preview = () => {
    return <Image style={styles.preview} source={{ uri: pictureURI }} />;
  };

  const Camera = () => {
    return (
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={takePictureFromCameraAsync}
      >
        <Icon name="camera" size={100} />
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.titleInputConatiner}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <TextInput
            style={styles.titleInput}
            placeholder="タイトル"
            onChangeText={(value) => setTitleText(value)}
            maxLength={100}
          />
        </KeyboardAvoidingView>

        <View style={styles.previewContainer}>
          {pictureURI ? <Preview /> : <Camera />}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={saveAsync}>
            <Text style={styles.buttonText}>保存</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>キャンセル</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  titleInputConatiner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  titleInput: {
    flex: 0.9,
    color: "#000",
    fontSize: 20,
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 3,
  },

  cameraButton: {
    width: screenWidth * 0.8,
    height: (screenWidth * 0.8 * 4) / 3,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  previewContainer: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
  },

  preview: {
    width: screenWidth * 0.8,
    height: (screenWidth * 0.8 * 4) / 3,
  },

  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  
  saveButton: {
    backgroundColor: "#77f",
    padding: 5,
    borderRadius: 10,
    width: 120,
    alignItems: "center",
  },
  
  cancelButton: {
    backgroundColor: "#f77",
    padding: 5,
    borderRadius: 10,
    width: 120,
    alignItems: "center",
  },
  
  buttonText: {
    fontSize: 20,
  },
  
});
