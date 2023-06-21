import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  Image,
  PermissionsAndroid,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {getDeviceId} from 'react-native-device-info';
import Geolocation from '@react-native-community/geolocation';
import {AppContext} from '../context/AppContext';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const UserInfo = () => {
  const deviceId = getDeviceId();
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {setUsers} = useContext(AppContext);

  const saveInfo = async () => {
    setIsLoading(true);
    const URL = 'https://httpbin.org/post';
    const headers = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    };
    const formData = new FormData();
    formData.append('deviceid', deviceId);
    formData.append('photo', {
      uri: image?.fileName,
      type: image?.type,
      name: image?.uri,
    });
    formData.append('lat', location?.latitude);
    formData.append('log', location?.longitude);

    await axios
      .post(URL, formData, headers, {
        timeout: 3000,
      })
      .then(async response => {
        const newUser = {
          imageUrl: image?.uri || '',
          latitude: location?.latitude || '',
          longitude: location?.longitude || '',
          deviceId: deviceId || '',
        };

        setUsers(prevUsers => [...prevUsers, newUser]);
        setIsLoading(false);
        navigation.navigate('UserList');
        ToastAndroid.show(
          ToastAndroid.SHORT,
          'User information saved successfully',
        );
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
        ToastAndroid.show(ToastAndroid.SHORT, 'User information is not saved.');
      });
  };

  const handleTakePhoto = () => {
    launchCamera({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.error) {
        setImage(response?.assets[0]);
      }
    });
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
        requestLocationPermission();
      } else {
        requestLocationPermission();
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            setLocation(position.coords);
          },
          error => {
            Alert.alert('Location Error', 'Failed to fetch current location.');
          },
        );
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const renderLoader = () => {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>User Information</Text>
      </View>
      {isLoading && renderLoader()}
      <View style={styles.bodyContainer}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={handleTakePhoto}>
          {image ? (
            <Image
              source={{uri: image?.uri}}
              resizeMode="cover"
              style={styles.image}
            />
          ) : (
            <Text>Photo from Cam</Text>
          )}
        </TouchableOpacity>

        <View style={styles.subCon}>
          <Text style={styles.firstTxt}>Device Id</Text>
          <Text style={styles.secondTxt}>{deviceId}</Text>
        </View>
        <View style={styles.subCon}>
          <Text style={styles.firstTxt}>Lat</Text>
          <Text style={styles.secondTxt}>{location?.latitude}</Text>
        </View>
        <View style={styles.subCon}>
          <Text style={styles.firstTxt}>Long</Text>
          <Text style={styles.secondTxt}>{location?.longitude}</Text>
        </View>
      </View>
      <View style={styles.btn}>
        <Button title="Save" color="black" onPress={saveInfo} />
      </View>
      <View style={styles.btn}>
        <Button
          title="User List"
          color="blue"
          onPress={() => navigation.navigate('UserList')}
        />
      </View>
    </View>
  );
  r;
};

export default UserInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderWidth: 1,
    alignItems: 'center',
    padding: 20,
  },
  bodyContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    height: 150,
    width: 150,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  image: {
    height: 150,
    width: 150,
  },
  subCon: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  firstTxt: {
    width: '20%',
  },
  secondTxt: {
    width: '50%',
    padding: 10,
    borderWidth: 1,
  },
  btn: {
    marginHorizontal: 30,
    marginVertical: 20,
  },
});
