import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useColorScheme from "../../hooks/useColorScheme";
import {
	NavigationContainer,
	DarkTheme,
	DefaultTheme,
} from "@react-navigation/native";
import LoginScreen from "../screens/login/LoginScreen";
import RegisterScreen from "../screens/login/RegisterScreen";
import AddRestaurantScreen from "../screens/restaurant/AddRestaurantScreen";
import RegisterRestauratorScreen from "../screens/login/RegisterRestauratorScreen";
import UserScreen from "../screens/user/MainScreen";

export default function Navigation() {
	const Stack = createNativeStackNavigator();
	const colorScheme = useColorScheme();

	return (
		<NavigationContainer
			theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<Stack.Navigator initialRouteName="AddRestaurant">
				<Stack.Screen
					name="UserLogin"
					component={LoginScreen}
					options={{
						title: "Logowanie użytkownika",
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="UserRegister"
					component={RegisterScreen}
					options={{
						title: "Rejestracja użytkownika",
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="RestauratorRegister"
					component={RegisterRestauratorScreen}
					options={{
						title: "Rejestracja właściciela restauracji",
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="AddRestaurant"
					component={AddRestaurantScreen}
					options={{
						title: "Dodawanie danych restauracji",
						headerShown: false,
					}}
				/>
				<Stack.Screen name="UserScreen" component={UserScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
