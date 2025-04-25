import React, {useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Button, StyleSheet, TextInput, Image, TouchableOpacity } from "react-native";
import * as Animar from 'react-native-animatable'
import { enderecoServidor } from '../utils'; // Importando o endereço do servidor


//Recebemos como props o navigation, para podermos navegar entre as telas
const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    async function botaoEntrar() {
    
        try {
          if (email == '' || senha == '') {
            throw new Error('Preencha todos os campos')
          }
          //Autenticando utilizando a API de backend com o fetch
          const resposta = await fetch(`${enderecoServidor}/usuarios/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json'},
              body: JSON.stringify({
                email: email,
                senha: senha,
              })
            }
          )
          if (resposta.ok) {
            const dados = await resposta.json();
            AsyncStorage.setItem('UsuarioLogado', JSON.stringify(dados))
            navigation.navigate('MenuPrincipal')
          }else {
            throw new Error('Email ou senha incorretos ❌');
          }
    
        }catch (error) {
          console.error('Erro ao realizar login:', error);
          alert(error.message);
          return;
        }
      }
    
    return (
        <View style={styles.conteudoHeader}>
            <Animar.View animation='fadeInLeft' delay={500} style={styles.header} >
                <Image source={require('../../assets/icon.png')}
                        style={styles.logo}
                        resizeMode="contain" />
                <Text style={styles.headerText}>Bem-vindo(a) </Text>
            </Animar.View>
            <Animar.View animation={'fadeInUp'} style={styles.conteudoCorpo}>

                <Text style={styles.label}> Email:</Text>
                <TextInput 
                    placeholder="Digite um email..." 
                    style={styles.inputLogin} 
                    onChangeText={setEmail}
                    value={email}
                    />
                <Text style={styles.label}> Senha:</Text>
                <TextInput 
                    placeholder="Digite sua senha" 
                    style={styles.inputLogin} 
                    secureTextEntry={true} 
                    onChangeText={setSenha}
                    value={senha}
                    />
                <TouchableOpacity style={styles.botao}
                    onPress={botaoEntrar}>
                    <Text style={styles.textoBotao}> Acessar </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botao}
                    onPress={() => navigation.navigate('MenuTopTab')}>
                    <Text style={styles.textoBotao}> Top Tabs </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botao}
                    onPress={() => navigation.navigate('MenuBottomTab')}>
                    <Text style={styles.textoBotao}> Bottom Tabs </Text>
                </TouchableOpacity>
            </Animar.View>
        </View>
    )
}

export default Login;

// estilo douglas
// const corPrincipal = '#0055ff'
// const corBranco = '#fff'


// const styles = StyleSheet.create({
//     conteudoHeader: {
//         flex: 1,
//         backgroundColor: corPrincipal
//     },
//     header: {
//         flex: 1,
//         marginTop: '14%',
//         marginBottom: '8%',
//         paddingStart: '5%',
//         flexDirection: 'row'
//     },
//     headerText: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: corBranco
//     },
//     conteudoCorpo: {
//         flex: 2,
//         backgroundColor: corBranco,
//         borderTopLeftRadius: 25,
//         borderTopRightRadius: 25,
//         paddingHorizontal: '5%',
//         paddingTop: '2%',
//     },
//     logo : {
//         width: 30, 
//         height: 30, 
//         marginRight: 20
//     },
//     label: {
//         fontSize: 20,
//         marginTop: 28
//     },
//     inputLogin: {
//         borderBottomWidth: 1,
//         height: 40,
//         fontSize: 16
//     },
//     botao: {
//         backgroundColor: corPrincipal,
//         borderRadius: 4,
//         paddingVertical: 8,
//         width: '100%',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: 40,
//         borderColor: corBranco,
//         borderWidth: 2
//     },
//     textoBotao: {
//         fontSize: 18,
//         color: corBranco,
//         fontWeight: 'bold'
//     },
// })


const styles = StyleSheet.create({
    conteudoHeader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5F5F5',
      padding: 20,
    },
    header: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 40,
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 10,
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginTop: 10,
    },
    conteudoCorpo: {
      width: '100%',
      paddingHorizontal: 20,
    },
    label: {
      fontSize: 16,
      color: '#333',
      marginBottom: 5,
      marginTop: 10,
    },
    inputLogin: {
      height: 50,
      borderColor: '#DDD',
      borderWidth: 1,
      borderRadius: 10,
      paddingLeft: 15,
      marginBottom: 15,
      fontSize: 16,
      backgroundColor: '#FFF',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
    },
    botao: {
      backgroundColor: '#00008B',
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 15,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
    },
    textoBotao: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
