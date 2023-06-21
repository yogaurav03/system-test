import React, {useContext} from 'react';
import {View, StyleSheet, Text, FlatList, Image} from 'react-native';
import {AppContext} from '../context/AppContext';

const UserList = () => {
  const {users} = useContext(AppContext);
  const renderItem = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        height: 100,
        alignItems: 'center',
        borderWidth: 0.5,
        marginVertical: 10,
      }}>
      <View style={{flex: 1}}>
        <Image
          resizeMode="cover"
          source={{uri: item.imageUrl}}
          style={{width: '100%', height: 100}}
        />
      </View>
      <View
        style={{
          width: 1,
          height: 100,
          backgroundColor: 'gray',
          marginRight: 10,
        }}
      />
      <View style={{flex: 1}}>
        <Text>Device ID: {item.deviceId}</Text>
        <Text>Latitude: {item.latitude}</Text>
        <Text>Longitude: {item.longitude}</Text>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>User List</Text>
      </View>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderWidth: 1,
    alignItems: 'center',
    padding: 20,
    marginBottom: 30,
  },
});
