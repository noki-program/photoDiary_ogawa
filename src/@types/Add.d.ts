interface PictureInfo {
    title: string;
    uri: string;
    createdAt: number;
}

type RootStackParamList = {
  //  受け取るパラメータは無いのでundefined
    Home: undefined;
    Add: undefined;
}