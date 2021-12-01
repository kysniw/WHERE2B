import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
	NavigationContainer,
	DarkTheme,
	DefaultTheme,
} from "@react-navigation/native";
import LoginScreen from "../screens/login/LoginScreen";
import RegisterScreen from "../screens/login/RegisterScreen";
import AddRestaurantScreen from "../screens/restaurant/AddRestaurantScreen";
import RegisterRestauratorScreen from "../screens/login/RegisterRestauratorScreen";
import MainUserScreen from "../screens/user/MainUserScreen";
import MainRestaurantScreen from "../screens/restaurant/MainRestaurantScreen";

import { RootStackParamList } from "../../types";
import LinkingConfig from "./LinkingConfig";
import { useColorScheme } from "react-native";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
	const colorScheme = useColorScheme();
	return (
		<NavigationContainer
			linking={LinkingConfig}
			theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<Stack.Navigator initialRouteName="UserLogin">
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
				<Stack.Screen
					name="MainUserScreen"
					component={MainUserScreen}
					options={{
						title: "Panel główny",
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="MainRestaurantScreen"
					component={MainRestaurantScreen}
					options={{
						title: "Panel główny restauracji",
						headerShown: false,
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
