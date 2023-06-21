import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import UserInfo from '../screens/UserInfo';
import UserList from '../screens/UserList';
const Stack = createStackNavigator();
export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserInfo">
        <Stack.Screen
          name="UserInfo"
          component={UserInfo}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="UserList"
          component={UserList}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
