import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import {
	Button,
	Switch,
	TextInput,
	Appbar,
	Checkbox,
	Subheading,
	Divider,
	Paragraph,
	IconButton,
	Text,
} from "react-native-paper";

import { RootStackScreenProps } from "../../../types";
import Api from "../../network/Api";
import {
	RestaurantCategoryModel,
	RestaurantModel,
	TableListResponseModel,
	TableModel,
} from "../../network/generated";

export default function AddRestaurantScreen({
	navigation,
}: RootStackScreenProps<"AddRestaurant">) {
	const [name, setName] = useState("");
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [max_number_of_people, setMaxNumber] = useState("");
	const [is_making_reservations, setIsReservation] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [address, setAddress] = useState("");
	const [categories, setCategories] = useState<RestaurantCategoryModel[]>([]);
	const [categoriesNumber, setCategoriesNumber] = useState<number[]>([]);
	const [checked, setChecked] = useState<boolean[]>([]);
	const [street_name, setStreetName] = useState("");
	const [street_number, setStreetNumber] = useState("");
	const [city_name, setCityName] = useState("");
	const [postal_code, setPostalCode] = useState("");
	const [flat_number, setFlatNumber] = useState("");
	const [seatsCount, setSeatsCount] = useState(1);
	const [avaibleSeats, setAvaibleSeats] = useState(0);
	const [tableArray, setTableArray] = useState<TableModel[]>([]);
	const [registerStatus, setRegisterStatus] = useState<number>(0);

	const [location, setLocation] = useState({
		latitude: 0,
		longitude: 0,
		latitudeDelta: 0.003,
		longitudeDelta: 0.003,
	});

	useEffect(() => {
		console.log(location);
		setRegion(location);
	}, [location]);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		getRestaurantCategories();
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		getLocation();
	}, []);

	const getLocation = async () => {
		await Location.requestForegroundPermissionsAsync().then((response) => {
			if (!response.granted) {
				console.log("brak pozwolenia");
			}
		});
		await Location.getCurrentPositionAsync({}).then((response) => {
			setLocation({
				latitude: response.coords.latitude,
				longitude: response.coords.longitude,
				latitudeDelta: location.latitudeDelta,
				longitudeDelta: location.longitudeDelta,
			});
		});
	};

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

		checked.forEach((item, index) => {
			if (item === true) categoriesNumber.push(index + 1);
		});
		setCategoriesNumber(categoriesNumber);
		console.log(categoriesNumber);

		const request: RestaurantModel = {
			name,
			latitude,
			longitude,
			city_name,
			street_name,
			street_number,
			flat_number,
			postal_code,
			max_number_of_people: parseInt(max_number_of_people, 10),
			is_making_reservations,
			categories: categoriesNumber,
		};

		await Api.restaurantsApi
			.restaurantCreate(request)
			.then((response) => {
				setIsLoading(false);
				console.log(response.data);
				if (is_making_reservations === true) setRegisterStatus(1);
				else setRegisterStatus(2);
			})
			.catch((error) => {
				setIsLoading(false);
				console.error(error.response.data);
			});
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

	function AddTablesView() {
		setAvaibleSeats(parseInt(max_number_of_people, 10));
		return (
			<View>
				<Appbar.Header>
					<Appbar.Content
						title="Add Tables"
						subtitle="Write your restaurant's data"
					/>
				</Appbar.Header>
				<Text onPressIn onPressOut style={{ alignSelf: "center" }}>
					Number of seats
				</Text>
				<View style={styles.tableContainer}>
					<IconButton
						disabled={seatsCount <= 1}
						icon="minus"
						onPress={() => setSeatsCount(seatsCount - 1)}
					/>
					<Text onPressIn onPressOut style={styles.tableText}>
						{seatsCount}
					</Text>
					<IconButton
						icon="plus"
						onPress={() => setSeatsCount(seatsCount + 1)}
					/>
				</View>
				<View style={styles.switch_view}>
					<Subheading>Outside</Subheading>
					<Switch
						value={is_making_reservations}
						onValueChange={() =>
							setIsReservation(!is_making_reservations)
						}
					/>
				</View>
			</View>
		);
	}

	function AddWorkingHoursView() {
		return (
			<View>
				<Appbar.Header>
					<Appbar.BackAction onPress={() => navigation.goBack()} />
					<Appbar.Content
						title="Add Working Hours"
						subtitle="Choose days and hours"
					/>
				</Appbar.Header>
				<Text onPressIn onPressOut style={{ alignSelf: "center" }}>
					Number of seats
				</Text>
				<View style={styles.tableContainer}>
					<IconButton
						disabled={seatsCount <= 1}
						icon="minus"
						onPress={() => setSeatsCount(seatsCount - 1)}
					/>
					<Text onPressIn onPressOut style={styles.tableText}>
						{seatsCount}
					</Text>
					<IconButton
						icon="plus"
						onPress={() => setSeatsCount(seatsCount + 1)}
					/>
				</View>
			</View>
		);
	}

	const setCoordinates = async () => {
		setAddress(city_name + ", " + street_name + " " + street_number + " ");
		await Location.requestForegroundPermissionsAsync().then((response) => {
			if (!response.granted) {
				console.log("brak pozwolenia");
			}
		});
		await Location.geocodeAsync(address).then((response) => {
			if (response.length === 1) {
				setLatitude(response[0].latitude.toFixed(7));
				setLongitude(response[0].longitude.toFixed(7));
				setLocation({
					latitude: response[0].latitude,
					longitude: response[0].longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				});
			}
		});
	};

	const [region, setRegion] = useState({
		latitude: location.latitude,
		longitude: location.longitude,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
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
			<ScrollView style={styles.form}>
				<TextInput
					autoComplete="name"
					dense
					mode="outlined"
					label="Name"
					value={name}
					textContentType="name"
					onChangeText={setName}
				/>
				<Divider />
				<TextInput
					autoComplete
					dense
					mode="outlined"
					label="Street name"
					value={street_name}
					textContentType="streetAddressLine1"
					onChangeText={setStreetName}
					onChange={setCoordinates}
				/>
				<TextInput
					autoComplete
					dense
					mode="outlined"
					label="Street number"
					value={street_number}
					textContentType="streetAddressLine2"
					onChangeText={setStreetNumber}
					onChange={setCoordinates}
				/>
				<TextInput
					autoComplete
					dense
					mode="outlined"
					label="Flat number (optional)"
					value={flat_number}
					onChangeText={setFlatNumber}
				/>
				<TextInput
					autoComplete
					dense
					mode="outlined"
					label="City name"
					value={city_name}
					textContentType="addressCity"
					onChangeText={setCityName}
					onChange={setCoordinates}
				/>
				<TextInput
					autoComplete="postal-code"
					dense
					mode="outlined"
					label="Postal code"
					value={postal_code}
					textContentType="postalCode"
					onChangeText={setPostalCode}
				/>
				<Button
					style={styles.changeFormButton}
					mode="contained"
					onPress={setCoordinates}
				>
					Refresh map
				</Button>
				<MapView
					style={styles.map}
					liteMode
					region={region}
					onRegionChange={(region) => setRegion(region)}
					showsUserLocation={true}
				>
					<Marker
						coordinate={{
							latitude: region.latitude,
							longitude: region.longitude,
						}}
					/>
				</MapView>
				<Paragraph>Current latitude: {region.latitude}</Paragraph>
				<Paragraph>Current longitude: {region.longitude}</Paragraph>
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
				<View>{categoriesCheckBoxes}</View>
				{is_making_reservations === true ? <AddTablesView /> : null}
				<Button
					style={styles.changeFormButton}
					mode="contained"
					onPress={onAddRestaurantClicked}
					loading={isLoading}
				>
					Add restaurant
				</Button>
			</ScrollView>
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
	map: {
		marginTop: 10,
		width: "100%",
		height: 400,
	},
	tableContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	tableText: {
		fontSize: 16,
		borderWidth: 1,
		borderRadius: 4,
		marginHorizontal: 10,
		paddingHorizontal: 10,
		paddingVertical: 4,
		textAlign: "center",
	},
});
