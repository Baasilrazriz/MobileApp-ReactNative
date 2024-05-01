import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  View,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
const api_key = "b03bfee75a2f29f4c48ec39b1653d17f"; // Replace with your own API key.
let url = `http://api.openweathermap.org/data/3.0/onecall?&units=metric&exclude=minutely&appid=${api_key}`;
let counter = 0;
const Weather = () => {
  const [Forecast, setForecast] = useState(null);
  const [Refreshing, setRefreshing] = useState(false);

  const loadForecast = async () => {
    if (Refreshing) {
      return;
    } else {
      setRefreshing(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log(Refreshing);
      if (status != "granted") {
        Alert.alert("Access to location is needed to run the app");
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      const response = await fetch(`${url}&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      if (!response.ok) {
        setForecast(null);
        Alert.alert("Error", data.message);
      } else {
        counter++;
        setForecast(data);
        console.log(counter);
        console.log(data);
      }
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log(Refreshing);
    loadForecast();
    console.log(Refreshing);
    console.log("ok beta");
  }, []);
  if (!Forecast) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }
  const current = Forecast.current.weather[0];
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={Refreshing}
            onRefresh={() => {
              loadForecast();
            }}
          />
        }
        style={{ marginTop: 50 }}
      >
        <Text style={styles.title}>Current Weather</Text>
        <Text style={{ alignItems: "center", textAlign: "center" }}>
          Your Location:{Forecast.timezone.split('/')[1]}
        </Text>
        <View style={styles.current}>
          <Image
            style={styles.largeIcon}
            source={{
              uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png`,
            }}
          />
          <Text style={styles.currentTemp}>
            {Math.round(Forecast.current.temp)}*C
          </Text>
        </View>
        <Text style={styles.currentDescription}>{current.description}</Text>
        <View style={styles.extraInfo}>
<View style={styles.info}>
  <Image 
  source={require('../assets/temperature.png')}
  style={{
    width:40,
    height:40,
    borderRadius:40/2,
    marginLeft:50
  }}
  />
<Text style={styles.text}>{Forecast.current.feels_like}*C
</Text>
<Text>Feels Like</Text>
</View>
<View style={styles.info}>
  <Image 
  source={require('../assets/humidity.png')}
  style={{
    width:40,
    height:40,
    borderRadius:40/2,
    marginLeft:50
  }}
  />
<Text style={styles.text}>{Forecast.current.humidity}%
</Text>
<Text>Humidity</Text>
</View>
        </View>
        <View >
          <Text style={styles.subtitle}>Hourly Forecast</Text>
        </View>
<FlatList
horizontal
data={Forecast.hourly.slice(0,24)}
keyExtractor={(item,index)=>{index.toString()}}
renderItem={(hour)=>{
  const weather=hour.item.weather[0];
  var dt=new Date(hour.item.dt *1000);
  return(
    <View style={styles.hour}>
      <Text style={{fontWeight:"bold",color:'#346751'}}>{dt.toLocaleTimeString().replace(/:\d+/,'')}</Text>

      <Image
        style={styles.hourIcon}
        source={{
          uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
        }}
      />
      <Text style={{fontWeight:"bold",color:'#346751'}}>{Math.round(hour.item.temp)}*C</Text>
      <Text style={{fontWeight:"bold",color:'#346751'}}>{weather.description}</Text>
    </View>
  )
}}>
</FlatList>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Weather;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ECDBBA",
  },
  title: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold",
    color: "#C84B31",
  },
  current: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  largeIcon: {
    width: 300,
    height: 250,
  },
  currentTemp: {
    fontSize: 32,
    fontWeight: "bold",
    alignItems: "center",
    color: "#C84B31",
  },
  currentDescription: {
    width: "100%",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "200",
    marginBottom: 5,
  },
  extraInfo:{
    flexDirection:"row",
    marginTop:20,
    justifyContent:"space-between",
    padding:10
  },
info:{
  width:Dimensions.get('screen').width/2.5,
  backgroundColor:"rgba(0,0,0,0.5)",
  padding:10,
  borderRadius:15,
  justifyContent:'Center'
},
text:{
  fontSize:20,
  color:"white",
  fontWeight:"bold",
  textAlign: "center",
},
subtitle:{
  fontSize:24,
  marginVertical:12,
  marginLeft:7,
  color:"#C84B31",
  fontWeight: "bold",
},
hour:{
padding:6,
alignItems:"center"
},
hourIcon:{
width:100,
height:100
}
});
