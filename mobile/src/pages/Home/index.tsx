import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface Select {
  label: string;
  value: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<Select[]>([]);
  const [cities, setCities] = useState<Select[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => {
          return {
            label: uf.sigla,
            value: uf.sigla
          }
        });

      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if(selectedUf === '0') {
      return;
    }

    axios
    .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(response => {
      const cityNames = response.data.map(city => {
        return {
          label: city.nome,
          value: city.nome
        }
      });

      setCities(cityNames);
    });
  }, [selectedUf])

  function handleNavigationToPoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    });
  }

  return (
    <KeyboardAvoidingView 
    style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
              placeholder={{label: 'Selecione uma UF', value: ''}}
              onValueChange={(value) => setSelectedUf(value)}
              items={ufs}
              style={{
                viewContainer: {
                  borderWidth: 1,
                  borderColor: '#34CB79',
                  marginBottom: 15,
                  borderRadius: 5,
                  padding: 5,
                }
              }}
          />

          <RNPickerSelect
              placeholder={{label: 'Selecione uma cidade', value: ''}}
              onValueChange={(value) => setSelectedCity(value)}
              items={cities}
              style={{
                viewContainer: {
                  borderWidth: 1,
                  borderColor: '#34CB79',
                  marginBottom: 15,
                  borderRadius: 5,
                  padding: 5,
                }
              }}
          />

          <RectButton style={styles.button} onPress={handleNavigationToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name='arrow-right' color='#fff' size={24} />
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;