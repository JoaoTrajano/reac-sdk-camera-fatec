import React, { useState, useEffect, useRef } from 'react'; /* Hooks */
import { StyleSheet, View, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import { Camera } from 'expo-camera'; /* Import do SDK da camera  */
import { StatusBar } from 'expo-status-bar'
import { FontAwesome, AntDesign, Entypo } from '@expo/vector-icons' /* Import dos icones já padrão do Expo */


export default function App() {

  const camRef = useRef(null); /* Referencia a camera para poder tirar a foto */
  const [permissao, setPermissao] = useState(null);
  const [tipoCamera, setTipoDiracaoCamera] = useState(Camera.Constants.Type.back);
  const [fotoCapturada, setFoto] = useState(null);
  const [open, setAbrirFoto] = useState(null);
  const [flashLigado, setFlash] = useState(Camera.Constants.FlashMode.off);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setPermissao(status === 'granted');
    })();
  }, []); /* Pergunta se o aplicativo pode acessar a camera */

  if (permissao === null) {
    return <View />;
  }

  if (permissao === false) {
    return Alert.alert(
      "Acesso",
      "Acesso a camera negado!",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );
  }

  async function tirarFoto() {

    if (camRef) {
      const opcoes = { quality: 0.5 };
      const foto = await camRef.current.takePictureAsync(opcoes);

      setFoto(foto.uri);
      setAbrirFoto(true);

    }
  }

  function ligarFlash() {

    if (flashLigado) {
      setFlash(Camera.Constants.FlashMode.off)
      Alert.alert(
        "Flash",
        "Flash Desligado!",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    } else {
      setFlash(Camera.Constants.FlashMode.on)
      Alert.alert(
        "Flash",
        "Flash Ligado!",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    }

  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={tipoCamera}
        flashMode={flashLigado}
        ref={camRef}
      >
        <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>

          <TouchableOpacity style={{ position: 'absolute', bottom: 20, left: 20 }}
            onPress={() => {
              setTipoDiracaoCamera(
                tipoCamera === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <AntDesign name="retweet" size={40} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={{ position: 'absolute', bottom: 20, right: 20 }} onPress={ligarFlash}>
            <Entypo name="flash" size={40} color="#FFF" />
          </TouchableOpacity>

        </View>
      </Camera>

      <TouchableOpacity
        style={styles.botaoTirarFoto}
        onPress={tirarFoto}
      >
        <FontAwesome name="camera" size={30} color="#FFF" />
      </TouchableOpacity>


      {fotoCapturada &&
        <Modal
          animationType="slide"
          transparent={false}
          visible={open}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20 }}>
            <TouchableOpacity style={{ margin: 10 }} onPress={() => setOpen(false)}>
              <FontAwesome name="window-close" size={50} color="#ff0000" />
            </TouchableOpacity>
            <Image
              style={{ width: '100%', height: 300, borderRadius: 30 }}
              source={{ uri: fotoCapturada }}>

            </Image>
          </View>
        </Modal>}


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  botaoTirarFoto: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#121212",
    padding: 16,
    margin: 20,
    height: 50

  }
});


