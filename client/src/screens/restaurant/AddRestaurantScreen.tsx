import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
	Button,
	HelperText,
	Switch,
	TextInput,
	Text,
	Title,
	Checkbox,
} from "react-native-paper";
import Api from "../../network/Api";

import {
	RestaurantCategoryModel,
	RestaurantModel,
	RestaurantsApi,
} from "../../network/generated";

export default function AddRestaurantScreen({ navigation }) {
	const [name, setName] = useState("");
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [max_number_of_people, setMaxNumber] = useState("");
	const [is_making_reservations, setIsReservation] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [categories, setCategories] = useState<RestaurantCategoryModel[]>([]);
	const [checked, setChecked] = useState(
		new Array(categories.length).fill(false)
	);

	const getRestaurantCategories = async () => {
		await Api.restaurantsApi
			.restaurantCategoriesList()
			.then(async (response) => {
				console.log(response.data.results[3]);
				setCategories(response.data.results);
			})
			.catch((error) => {
				console.log(error.message);
				console.log(error.response.data);
			});
	};

	useEffect(() => {
		getRestaurantCategories();
	}, []);

	const onRegisterClicked = async () => {
		if (isLoading) return;
		setIsLoading(true);

		const api = new RestaurantsApi(); // api should be injected
		const request: RestaurantModel = {
			name,
			latitude,
			longitude,
			max_number_of_people: parseInt(max_number_of_people),
			is_making_reservations,
			categories,
		};

		await api
			.restaurantCreate(request)
			//.then((_) => move to login form)
			.catch((error: Error) => {
				// this type checking and casting may be not necessary if errors documented in swagger document
				console.log(error.message);
			})
			.finally(() => {
				setIsLoading(false);
				Alert.alert("Zostałeś poprawnie zarejestrowany! Zaloguj się");
			});
	};

	const categoriesCheckBoxes = categories.map(({ name }, id) => {
		return (
			<View>
				<Checkbox.Item
					label={name}
					status={checked[id] ? "checked" : "unchecked"}
					onPress={() =>
						setChecked(
							checked.map((item, index) => {
								index === id ? !item : item;
							})
						)
					}
				/>
			</View>
		);
	});

	return (
		<View style={styles.container}>
			<Title style={styles.title}>Restaurant</Title>
			<View style={styles.form}>
				<TextInput
					dense
					mode="outlined"
					label="Name"
					value={name}
					onChangeText={setName}
				/>
				<TextInput
					dense
					mode="outlined"
					label="Latitude"
					value={latitude}
					onChangeText={setLatitude}
				/>
				<TextInput
					dense
					mode="outlined"
					label="Longitude"
					value={longitude}
					onChangeText={setLongitude}
				/>
				<TextInput
					dense
					mode="outlined"
					label="Max people count"
					keyboardType="numeric"
					value={max_number_of_people}
					onChangeText={setMaxNumber}
				/>
				<View style={styles.switch_view}>
					<Text>Table reservation</Text>
					<Switch
						style={{ flexDirection: "row-reverse" }}
						value={is_making_reservations}
						onValueChange={() =>
							setIsReservation(!is_making_reservations)
						}
					/>
				</View>
				{categoriesCheckBoxes}
				<Button
					style={{ marginTop: 10 }}
					mode="contained"
					onPress={onRegisterClicked}
					loading={isLoading}
				>
					Add restaurant
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "80%",
		maxWidth: 500,
		alignSelf: "center",
	},
	form: { flex: 9, justifyContent: "center" },
	changeFormButton: { marginBottom: 10 },
	switch_view: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
	},
	title: {
		flex: 1,
		backgroundColor: "#222",
		marginTop: 50,
	},
});
