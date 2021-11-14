import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, Button, TextInput, FlatList, StatusBar, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [rate, setRate] = useState(0);
  const [valuta, setValuta] = useState('');
  const [valutor, setValutor] = useState([]);
  const [eurovalue, setEurovalue] = useState(0);
  const [answer, setAnswer] = useState('');

  const getRates = () => {
    fetch(`http://api.exchangeratesapi.io/v1/latest?access_key=57dcaafc92ee83411a78f88ab84ee8ae`)
      .then(response => response.json())
      .then(data => {
        let valutor = [];
        let counter = 0;
        for (var currenci in data.rates) {
          valutor.push({ 'id': counter, 'currency': currenci, 'rate': data.rates[currenci] });
          counter++;
        }
        setValutor(valutor);
      })

      .catch(error => {
        Alert.alert('Error', error);
      });
  }

  const writeAnswer = () => {
    setAnswer((eurovalue / rate).toFixed(2) + '€')
  }

  useEffect(() => {
    getRates();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('./assets/euro-icon.png')} style={styles.imageView} />


      <Text style={styles.answer}>{answer}</Text>

      <View style={styles.pickercontainer}>
      
      <TextInput style={{ fontSize: 18, width: 140 }} placeholder='Euro amount'
        onChangeText={text => setEurovalue(text)} keyboardType="numeric" />
      
      <Picker
        selectedValue={valuta}
        onValueChange={(itemValue, itemIndex) => {
          setValuta(valutor[itemIndex - 1].currency);
          setRate(valutor[itemIndex - 1].rate)
        }}
        style={styles.valutapicker}>
        <Picker.Item label="Pick currency" value="" />
        {valutor.map(valuta => (<Picker.Item label={valuta.currency} value={valuta.currency} key={valuta.id} />))}
      </Picker>
      </View>

      <Button title="CONVERT" onPress={writeAnswer} />
      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageView: {
    width: '50%',
    height: 100,
    margin: 7,
    borderRadius: 7
  },

  valutapicker:{
    height: 50, width: 200,
  },

  pickercontainer:{
    flexDirection:'row',
    width:'50%',

  },

  answer: {
    fontSize: 25,
    width: 200,
  }
});
