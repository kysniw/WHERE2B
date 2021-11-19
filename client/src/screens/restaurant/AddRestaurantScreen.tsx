import { useTheme } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
	Button,
	HelperText,
	Switch,
	TextInput,
	Text,
	Title,
	Checkbox,
	Subheading,
} from "react-native-paper";
import Api from "../../network/Api";

import {
	RestaurantCategoryModel,
	RestaurantModel,
	RestaurantsApi,
} from "../../network/generated";
import UserStorage from "../../storage/UserStorage";

export default function AddRestaurantScreen({ navigation }) {
	const [name, setName] = useState("");
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [max_number_of_people, setMaxNumber] = useState("");
	const [is_making_reservations, setIsReservation] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [categories, setCategories] = useState<RestaurantCategoryModel[]>([]);
	const [categoriesSet, setCategoriesSet] = useState(new Set<number>());
	let number = categories.length;

	const [checked, setChecked] = useState(new Array(9).fill(false));

	console.log(number);
	console.log(checked);

	useEffect(() => {
		getRestaurantCategories();
	}, []);

	const getRestaurantCategories = async () => {
		await Api.restaurantsApi
			.restaurantCategoriesList()
			.then(async (response) => {
				setCategories(response.data.results);
			})
			.catch((error) => {
				console.log(error.message);
				console.log(error.response.data);
			});
	};

	const onRegisterClicked = async () => {
		if (isLoading) return;
		setIsLoading(true);

		checked.forEach((el, index) => {
			if (el) categoriesSet.add(index);
		});

		const request: RestaurantModel = {
			name,
			latitude,
			longitude,
			max_number_of_people: parseInt(max_number_of_people),
			is_making_reservations,
			categories: categoriesSet,
		};

		await Api.restaurantsApi
			.restaurantCreate(request)
			.then(async (response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error(error.response.data);
			});
	};

	const handleCheck = (position) => {
		const updateCategories = checked.map((item, index) =>
			index === position ? !item : item
		);

		setChecked(updateCategories);
	};

	const categoriesCheckBoxes = categories.map(({ name }, id) => {
		return (
			<View key={id}>
				<Checkbox.Item
					label={name}
					status={checked[id] ? "checked" : "unchecked"}
					onPress={() => handleCheck(id)}
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
					<Subheading>Table reservation</Subheading>
					<Switch
						value={is_making_reservations}
						onValueChange={() =>
							setIsReservation(!is_making_reservations)
						}
					/>
				</View>
				<ScrollView>{categoriesCheckBoxes}</ScrollView>
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
		justifyContent: "space-between",
	},
	title: {
		flex: 1,
		backgroundColor: "#222",
		marginTop: 50,
	},
});
