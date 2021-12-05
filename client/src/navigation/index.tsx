import {
	NavigationContainer,
	DarkTheme,
	DefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { useColorScheme } from "react-native";

import { RootStackParamList } from "../../types";
import LoginScreen from "../screens/login/LoginScreen";
import RegisterRestauratorScreen from "../screens/login/RegisterRestauratorScreen";
import RegisterScreen from "../screens/login/RegisterScreen";
import AddRestaurantScreen from "../screens/restaurant/AddRestaurantScreen";
import EditRestaurantScreen from "../screens/restaurant/EditRestaurantScreen";
import MainRestaurantScreen from "../screens/restaurant/MainRestaurantScreen";
import MainUserScreen from "../screens/user/MainUserScreen";
import LinkingConfig from "./LinkingConfig";

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
					name="EditRestaurant"
					component={EditRestaurantScreen}
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
