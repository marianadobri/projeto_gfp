//CODIGO DOUGLAS
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Image,
    Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enderecoServidor } from '../utils';
import Estilos_Login from '../styles/Estilos_Login';
import Estilos, { corPrincipal, corSecundaria, corFundo, corFundo2, corTextos, corTextos2 } from '../styles/Estilos';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('mariana.dobri@gmail.com');
    const [senha, setSenha] = useState('123');
    const [showPassword, setShowPassword] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [lembrar, setLembrar] = useState(false);

    useEffect(() => {
      const buscarUsuarioLogado = async () => {
          const usuarioLogado = await AsyncStorage.getItem('UsuarioLogado');
          if (usuarioLogado) {
              const usuario = JSON.parse(usuarioLogado);
              if (usuario.lembrar == true){
                navigation.navigate('MenuPrincipal')
              }
          }
      }

      buscarUsuarioLogado();
  }, [])


    const botaoLogin = async () => {

        try {
            if (email == '' || senha == '') {
                throw new Error('Preencha todos os campos');
            }
            //autenticando utilizando a API de backend com o fetch e recebendo o token
            const resposta = await fetch(`${enderecoServidor}/usuarios/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    senha: senha,
                }),
            });
            
            const dados = await resposta.json();

            if (resposta.ok) {
                console.log('Login bem-sucedido:', dados);
                // Aqui você pode armazenar o token em um estado global ou AsyncStorage, se necessário
                AsyncStorage.setItem('UsuarioLogado', JSON.stringify({...dados, lembrar}));
                navigation.navigate('MenuPrincipal')

            } else {
                throw new Error(dados.message || 'Erro ao fazer login');
            }

        } catch (error) {
            console.error('Erro ao realizar login:', error);
            alert(error.message);
            return;
        }
    };

    return (
        <View style={Estilos_Login.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
            <LinearGradient
                colors={['#2c3e50', corPrincipal]}
                style={Estilos_Login.gradientBackground}
            >

                {/* Cabeçalho */}
                <View style={Estilos_Login.header} >
                    <View style={Estilos_Login.logoContainer}>
                        <Image source={require('../assets/logo.png')} style={{ width: 50, height: 50 }} />
                        <View style={Estilos_Login.headerSubTitle}>
                            <Text style={Estilos_Login.logoText}>GFP</Text>
                            <Text style={Estilos_Login.headerSubTitle}>Gestor Financeiro Pessoal</Text>
                        </View>
                    </View>
                </View>

                {/* Card de login */}
                <View style={Estilos_Login.loginCard} >
                    <Text style={Estilos_Login.loginTitle}>Acesse sua conta</Text>

                    {/* Formulário */}
                    <View style={Estilos.inputContainer}>
                        <Ionicons
                            name="mail-outline"
                            size={20}
                            color={isActive === 'email' ? corPrincipal : corTextos2}
                            style={Estilos.inputIcon}
                        />
                        <TextInput
                            style={[
                                Estilos.input,
                                isActive === 'email' && Estilos.inputActive,
                            ]}
                            placeholder="Email"
                            placeholderTextColor={corTextos2}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            onFocus={() => setIsActive('email')}
                            onBlur={() => setIsActive(false)}
                        />
                    </View>

                    <View style={Estilos.inputContainer}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color={isActive === 'password' ? corPrincipal : corTextos2}
                            style={Estilos.inputIcon}
                        />
                        <TextInput
                            style={[
                                Estilos.input,
                                isActive === 'password' && Estilos.inputActive
                            ]}
                            placeholder="Senha"
                            placeholderTextColor={corTextos2}
                            secureTextEntry={!showPassword}
                            value={senha}
                            onChangeText={setSenha}
                            onFocus={() => setIsActive('password')}
                            onBlur={() => setIsActive(false)}
                        />
                        <TouchableOpacity
                            style={Estilos.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={corTextos2}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={Estilos_Login.forgotPasswordContainer}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Switch value={lembrar} onValueChange={setLembrar}/>
                          <Text>Lembrar-me</Text>
                        </View>

                        <TouchableOpacity>
                            <Text style={Estilos_Login.forgotPasswordText}>Esqueceu a senha?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={Estilos.botao}
                        activeOpacity={0.8}
                        onPress={botaoLogin}
                    >
                        <LinearGradient
                            colors={[corPrincipal, corSecundaria]}
                            style={Estilos.degradeBotao}
                        >
                            <Text style={Estilos.botaoTexto}>Entrar</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={Estilos_Login.signUpContainer}>
                        <Text style={Estilos_Login.signUpText}>Não tem uma conta? </Text>
                        <TouchableOpacity>
                            <Text style={Estilos_Login.signUpLink}>Cadastre-se</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                {/* Features */}
                <View
                    style={Estilos_Login.featuresContainer}>
                    <View style={Estilos_Login.featureItem}>
                        <Ionicons name="stats-chart-outline" size={20} color={corTextos} />
                        <Text style={Estilos_Login.featureText}>Acompanhe seus gastos com gráficos</Text>
                    </View>
                    <View style={Estilos_Login.featureItem}>
                        <Ionicons name="notifications-outline" size={20} color={corTextos} />
                        <Text style={Estilos_Login.featureText}>Receba alertas financeiros importantes</Text>
                    </View>

                </View>
            </LinearGradient>
        </View>
    );
};


export default Login;



//MEU CODIGO


// // import React, {useState} from "react";
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { View, Text, Button, StyleSheet, TextInput, Image, TouchableOpacity } from "react-native";
// // import * as Animar from 'react-native-animatable'
// // import { enderecoServidor } from '../utils'; // Importando o endereço do servidor

// //Recebemos como props o navigation, para podermos navegar entre as telas
// const Login = ({navigation}) => {
//     const [email, setEmail] = useState('');
//     const [senha, setSenha] = useState('');

//     async function botaoEntrar() {
    
//         try {
//           if (email == '' || senha == '') {
//             throw new Error('Preencha todos os campos')
//           }
//           //Autenticando utilizando a API de backend com o fetch
//           const resposta = await fetch(`${enderecoServidor}/usuarios/login`,
//             {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json'},
//               body: JSON.stringify({
//                 email: email,
//                 senha: senha,
//               })
//             }
//           )
//           if (resposta.ok) {
//             const dados = await resposta.json();
//             AsyncStorage.setItem('UsuarioLogado', JSON.stringify(dados))
//             navigation.navigate('MenuPrincipal')
//           }else {
//             throw new Error('Email ou senha incorretos ❌');
//           }
    
//         }catch (error) {
//           console.error('Erro ao realizar login:', error);
//           alert(error.message);
//           return;
//         }
//       }
    
//     return (
//         <View style={styles.conteudoHeader}>
//             <Animar.View animation='fadeInLeft' delay={500} style={styles.header} >
//                 <Image source={require('../../assets/icon.png')}
//                         style={styles.logo}
//                         resizeMode="contain" />
//                 <Text style={styles.headerText}>Bem-vindo(a) </Text>
//             </Animar.View>
//             <Animar.View animation={'fadeInUp'} style={styles.conteudoCorpo}>

//                 <Text style={styles.label}> Email:</Text>
//                 <TextInput 
//                     placeholder="Digite um email..." 
//                     style={styles.inputLogin} 
//                     onChangeText={setEmail}
//                     value={email}
//                     />
//                 <Text style={styles.label}> Senha:</Text>
//                 <TextInput 
//                     placeholder="Digite sua senha" 
//                     style={styles.inputLogin} 
//                     secureTextEntry={true} 
//                     onChangeText={setSenha}
//                     value={senha}
//                     />
//                 <TouchableOpacity style={styles.botao}
//                     onPress={botaoEntrar}>
//                     <Text style={styles.textoBotao}> Acessar </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.botao}
//                     onPress={() => navigation.navigate('MenuTopTab')}>
//                     <Text style={styles.textoBotao}> Top Tabs </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.botao}
//                     onPress={() => navigation.navigate('MenuBottomTab')}>
//                     <Text style={styles.textoBotao}> Bottom Tabs </Text>
//                 </TouchableOpacity>
//             </Animar.View>
//         </View>
//     )
// }

// export default Login;



// ESTILO DOUGLAS

// // const corPrincipal = '#0055ff'
// // const corBranco = '#fff'


// // const styles = StyleSheet.create({
// //     conteudoHeader: {
// //         flex: 1,
// //         backgroundColor: corPrincipal
// //     },
// //     header: {
// //         flex: 1,
// //         marginTop: '14%',
// //         marginBottom: '8%',
// //         paddingStart: '5%',
// //         flexDirection: 'row'
// //     },
// //     headerText: {
// //         fontSize: 28,
// //         fontWeight: 'bold',
// //         color: corBranco
// //     },
// //     conteudoCorpo: {
// //         flex: 2,
// //         backgroundColor: corBranco,
// //         borderTopLeftRadius: 25,
// //         borderTopRightRadius: 25,
// //         paddingHorizontal: '5%',
// //         paddingTop: '2%',
// //     },
// //     logo : {
// //         width: 30, 
// //         height: 30, 
// //         marginRight: 20
// //     },
// //     label: {
// //         fontSize: 20,
// //         marginTop: 28
// //     },
// //     inputLogin: {
// //         borderBottomWidth: 1,
// //         height: 40,
// //         fontSize: 16
// //     },
// //     botao: {
// //         backgroundColor: corPrincipal,
// //         borderRadius: 4,
// //         paddingVertical: 8,
// //         width: '100%',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         marginTop: 40,
// //         borderColor: corBranco,
// //         borderWidth: 2
// //     },
// //     textoBotao: {
// //         fontSize: 18,
// //         color: corBranco,
// //         fontWeight: 'bold'
// //     },
// // });


// MEU ESTILO

// // const styles = StyleSheet.create({
// //     conteudoHeader: {
// //       flex: 1,
// //       justifyContent: 'center',
// //       alignItems: 'center',
// //       backgroundColor: '#F5F5F5',
// //       padding: 20,
// //     },
// //     header: {
// //       justifyContent: 'center',
// //       alignItems: 'center',
// //       marginBottom: 40,
// //     },
// //     logo: {
// //       width: 100,
// //       height: 100,
// //       marginBottom: 10,
// //     },
// //     headerText: {
// //       fontSize: 24,
// //       fontWeight: 'bold',
// //       color: '#333',
// //       marginTop: 10,
// //     },
// //     conteudoCorpo: {
// //       width: '100%',
// //       paddingHorizontal: 20,
// //     },
// //     label: {
// //       fontSize: 16,
// //       color: '#333',
// //       marginBottom: 5,
// //       marginTop: 10,
// //     },
// //     inputLogin: {
// //       height: 50,
// //       borderColor: '#DDD',
// //       borderWidth: 1,
// //       borderRadius: 10,
// //       paddingLeft: 15,
// //       marginBottom: 15,
// //       fontSize: 16,
// //       backgroundColor: '#FFF',
// //       shadowColor: '#000',
// //       shadowOpacity: 0.1,
// //       shadowRadius: 5,
// //       elevation: 2,
// //     },
// //     botao: {
// //       backgroundColor: '#00008B',
// //       paddingVertical: 12,
// //       borderRadius: 10,
// //       alignItems: 'center',
// //       marginBottom: 15,
// //       shadowColor: '#000',
// //       shadowOpacity: 0.1,
// //       shadowRadius: 5,
// //       elevation: 2,
// //     },
// //     textoBotao: {
// //       color: '#FFF',
// //       fontSize: 18,
// //       fontWeight: 'bold',
// //     },
// //});






