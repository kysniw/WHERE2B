import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
	Button,
	Switch,
	TextInput,
	Appbar,
	Checkbox,
	Subheading,
} from "react-native-paper";
import Api from "../../network/Api";

import {
	RestaurantCategoryModel,
	RestaurantModel,
} from "../../network/generated";

export default function AddRestaurantScreen({ navigation }) {
	const [name, setName] = useState("");
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [max_number_of_people, setMaxNumber] = useState("");
	const [is_making_reservations, setIsReservation] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [categories, setCategories] = useState<RestaurantCategoryModel[]>([]);
	const [categoriesNumber, setCategoriesNumber] = useState(new Array());
	const [checked, setChecked] = useState<boolean[]>([]);

	useEffect(() => {
		getRestaurantCategories();
	}, []);

	const getRestaurantCategories = async () => {
		await Api.restaurantsApi
			.restaurantCategoriesList()
			.then((response) => {
				setCategories(response.data.results);
				setChecked(new Array(response.data.results.length).fill(false));
			})
			.catch((error) => {
				console.log(error.message);
				console.log(error.response.data);
			});
	};

	console.log(checked);

	const onAddRestaurantClicked = async () => {
		if (isLoading) return;
		setIsLoading(true);
		checked.map((item, index) => {
			if (item == true) categoriesNumber.push(index + 1);
		});
		setCategoriesNumber(categoriesNumber);
		console.log(categoriesNumber);

		const request: RestaurantModel = {
			name,
			latitude,
			longitude,
			max_number_of_people: parseInt(max_number_of_people),
			is_making_reservations,
			categories: categoriesNumber,
		};

		await Api.restaurantsApi
			.restaurantCreate(request)
			.then(async (response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error(error.response.data);
			})
			.finally(() => {
				setIsLoading(false);
				navigation.goBack();
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
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					title="Add Restaurant"
					subtitle="Write your restaurant's data"
				/>
			</Appbar.Header>
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
					onPress={onAddRestaurantClicked}
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
		maxWidth: 500,
		alignSelf: "center",
		width: "100%",
	},
	form: {
		flex: 9,
		alignSelf: "center",
		justifyContent: "center",
		width: "80%",
	},
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
