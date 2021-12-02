import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
	Button,
	Switch,
	TextInput,
	Appbar,
	Checkbox,
	Subheading,
	Divider,
} from "react-native-paper";

import { RootStackScreenProps } from "../../../types";
import Api from "../../network/Api";
import {
	RestaurantCategoryModel,
	RestaurantModel,
} from "../../network/generated";

export default function EditRestaurantScreen({
	route,
	navigation,
}: RootStackScreenProps<"EditRestaurant">) {
	const [name, setName] = useState(route.params.restaurant.name);
	const [latitude, setLatitude] = useState(route.params.restaurant.latitude);
	const [longitude, setLongitude] = useState(
		route.params.restaurant.longitude
	);
	const [max_number_of_people, setMaxNumber] = useState(
		route.params.restaurant.max_number_of_people?.toString()
	);
	const [is_making_reservations, setIsReservation] = useState(
		route.params.restaurant.is_making_reservations
	);
	const [isLoading, setIsLoading] = useState(false);
	const [categories, setCategories] = useState<RestaurantCategoryModel[]>([]);
	const [categoriesNumber, setCategoriesNumber] = useState<number[]>([]);
	const [checked, setChecked] = useState<boolean[]>([]);

	console.log(route.params.restaurant.categories);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		getRestaurantCategories();
	}, []);

	const getRestaurantCategories = async () => {
		await Api.restaurantsApi
			.restaurantCategoriesList()
			.then((response) => {
				setCategories(response.data.results);
				setChecked(
					new Array<boolean>(response.data.results.length)
						.fill(false)
						.map((item, index) =>
							route.params.restaurant.categories.includes(
								index + 1
							) === true
								? !item
								: item
						)
				);
			})
			.catch((error) => {
				console.log(error.message);
				console.log(error.response.data);
			});
	};

	console.log(checked);

	const onEditRestaurantClicked = async () => {
		if (isLoading) return;
		setIsLoading(true);

		checked.forEach((item, index) => {
			if (item === true) categoriesNumber.push(index + 1);
		});
		setCategoriesNumber(categoriesNumber);
		console.log(categoriesNumber);

		let max_number_of_people_int = 0;

		if (typeof max_number_of_people === "string")
			max_number_of_people_int = parseInt(max_number_of_people, 10);
		else if (typeof max_number_of_people === "number")
			max_number_of_people_int = max_number_of_people;

		const request: RestaurantModel = {
			name,
			latitude,
			longitude,
			max_number_of_people: max_number_of_people_int,
			is_making_reservations,
			categories: categoriesNumber,
		};
		if (typeof route.params.restaurant.id === "number") {
			await Api.restaurantsApi
				.restaurantUpdate(route.params.restaurant.id, request)
				.then((response) => {
					setIsLoading(false);
					console.log(response.data);
					navigation.goBack();
				})
				.catch((error) => {
					setIsLoading(false);
					console.error(error.response.data);
				});
		}
	};

	const handleCheck = (position: number) => {
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
					autoComplete="name"
					dense
					mode="outlined"
					label="Name"
					value={name}
					onChangeText={setName}
				/>
				<TextInput
					autoComplete
					dense
					mode="outlined"
					label="Latitude"
					keyboardType="numeric"
					value={latitude}
					onChangeText={setLatitude}
				/>
				<TextInput
					autoComplete
					dense
					mode="outlined"
					label="Longitude"
					keyboardType="numeric"
					value={longitude}
					onChangeText={setLongitude}
				/>
				<TextInput
					autoComplete
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
				<Divider />
				<ScrollView>{categoriesCheckBoxes}</ScrollView>
				<Button
					style={styles.changeFormButton}
					mode="contained"
					onPress={onEditRestaurantClicked}
					loading={isLoading}
				>
					Edit restaurant
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignSelf: "center",
		width: "100%",
	},
	form: {
		flex: 9,
		alignSelf: "center",
		justifyContent: "center",
		width: "80%",
		maxWidth: 400,
	},
	changeFormButton: { marginBottom: 10, marginTop: 10 },
	switch_view: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 10,
		marginBottom: 10,
	},
	title: {
		flex: 1,
		backgroundColor: "#222",
		marginTop: 50,
	},
});
