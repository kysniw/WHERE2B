import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	useColorScheme,
	RefreshControl,
	ScrollView,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import {
	Chip,
	Appbar,
	Divider,
	List,
	Paragraph,
	FAB,
} from "react-native-paper";

import { RootStackScreenProps } from "../../../types";
import RestaurantListDetailsDialog from "../../components/RestaurantListDetailsDialog";
import RestaurantListItemView from "../../components/RestaurantListItemView";
import Api from "../../network/Api";
import {
	RestaurantCategoryModel,
	RestaurantListResponseModel,
	RestaurantModel,
} from "../../network/generated";
import UserStorage from "../../storage/UserStorage";

export default function MainUserScreen({
	navigation,
}: RootStackScreenProps<"MainUserScreen">) {
	const colorScheme = useColorScheme();

	const [categories, setCategories] = useState<RestaurantCategoryModel[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<boolean[]>([]);
	const [restaurants, setRestaurants] = useState<RestaurantModel[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const [restaurantObject, setRestaurantObject] = useState<RestaurantModel>();
	const [dialogVisible, setDialogVisible] = useState(false);

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
		getLocation();
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		loadCategories();
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		loadRestaurants();
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

	const loadCategories = async () => {
		await Api.restaurantsApi
			.restaurantCategoriesList()
			.then((response) => {
				const results = response.data.results;
				setCategories(results);
				setSelectedCategories(new Array(results.length).fill(false));
			})
			.catch((error) => {
				console.log(error.message);
				console.log(error.response.data);
			});
	};

	const loadRestaurants = async () => {
		if (refreshing) return;
		setRefreshing(true);

		const selectedCategoryQuery = categories
			.filter((_, index) => selectedCategories[index])
			.map((category) => `categories=${category.id!}`)
			.join("&");

		const url = `${Api.serverApiUrl}/restaurants/restaurant/?${selectedCategoryQuery}`;

		await Api.axiosInstance
			.get<RestaurantListResponseModel>(url)
			.then((response) => {
				const results = response.data.results;
				setRestaurants(results);
			})
			.catch((error) => {
				console.log(error.message);
				console.log(error.response.data);
			})
			.finally(() => setRefreshing(false));
	};

	const showRestaurantDialogDetails = (item: RestaurantModel) => {
		setRestaurantObject(item);
		setDialogVisible(true);
	};

	const renderRestaurants = restaurants.map((item) => {
		return (
			<RestaurantListItemView
				key={item.id}
				restaurant={item}
				dialogDetailsAction={showRestaurantDialogDetails}
			/>
		);
	});

	const toogleChecked = (categoryIndex: number) => {
		const newSelected = selectedCategories.map((value, index) =>
			index === categoryIndex ? !value : value
		);
		setSelectedCategories(newSelected);
	};

	const goToMakeReservationScreen = () => {
		setDialogVisible(false);

		if (restaurantObject) {
			navigation.navigate("MakeReservationScreen", {
				restaurant: restaurantObject,
			});
		}
	};

	const renderCategories = categories.map((value, index) => (
		<Chip
			style={styles.categoryItem}
			key={value.id}
			selected={selectedCategories[index]}
			onPress={() => toogleChecked(index)}
		>
			{value.name}
		</Chip>
	));

	const renderRestaurantsMarkers = restaurants.map((item) => {
		return (
			<Marker
				key={item.id}
				title={item.name}
				coordinate={{
					latitude: parseFloat(item.latitude!),
					longitude: parseFloat(item.longitude!),
				}}
				pinColor="red"
				onCalloutPress={() => {
					showRestaurantDialogDetails(item);
				}}
			>
				<Callout>
					<View>
						<Paragraph style={styles.black_text}>
							{item.name}
						</Paragraph>
						<Paragraph style={styles.black_text}>
							Kliknij, aby przejść do szczegółów
						</Paragraph>
					</View>
				</Callout>
			</Marker>
		);
	});

	const Tab = createBottomTabNavigator();

	const [region, setRegion] = useState({
		latitude: location.latitude,
		longitude: location.longitude,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
	});

	return (
		<View style={styles.view}>
			<Appbar.Header>
				<Appbar.Content
					title="User Panel"
					subtitle="Your restaurants"
				/>
				<Appbar.Action
					icon="logout"
					onPress={async () =>
						await UserStorage.deleteData().then((response) => {
							console.log(response);
							navigation.navigate("UserLogin");
						})
					}
				/>
			</Appbar.Header>

			<List.Accordion
				title="Kategorie"
				style={
					colorScheme === "dark"
						? styles.categoryCollapsibleViewDark
						: styles.categoryCollapsibleViewLight
				}
			>
				<ScrollView
					style={styles.categoryContainer}
					contentContainerStyle={styles.categoryList}
					scrollEnabled={false}
				>
					{renderCategories}
				</ScrollView>
			</List.Accordion>
			<Divider />

			<Tab.Navigator>
				<Tab.Screen
					name="Lista wyników"
					children={() => {
						return (
							<ScrollView
								style={styles.scrollview}
								refreshControl={
									<RefreshControl
										refreshing={refreshing}
										onRefresh={loadRestaurants}
									/>
								}
							>
								{renderRestaurants}
							</ScrollView>
						);
					}}
					options={{
						tabBarLabel: "Lista",
						headerShown: false,
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="list" color={color} size={size} />
						),
					}}
				/>
				<Tab.Screen
					name="Znaczniki na mapie"
					children={() => {
						return (
							<View style={styles.container}>
								<MapView
									style={styles.map}
									region={region}
									onRegionChangeComplete={(region) =>
										setRegion(region)
									}
									showsUserLocation={true}
								>
									{renderRestaurantsMarkers}
								</MapView>
								{/*Display user's current region:*/}
								<Paragraph style={styles.text}>
									Current latitude: {region.latitude}
								</Paragraph>
								<Paragraph style={styles.text}>
									Current longitude: {region.longitude}
								</Paragraph>
								<FAB
									style={styles.iconbutton}
									icon="refresh"
									onPress={loadRestaurants}
									disabled={refreshing}
								/>
							</View>
						);
					}}
					options={{
						tabBarLabel: "Mapa",
						headerShown: false,
						tabBarIcon: ({ color, size }) => (
							<Ionicons
								name="map-outline"
								color={color}
								size={size}
							/>
						),
					}}
				/>
			</Tab.Navigator>

			<RestaurantListDetailsDialog
				visible={dialogVisible}
				categories={categories}
				restaurantObject={restaurantObject}
				onDismissAction={() => setDialogVisible(false)}
				onMakeReservationAction={goToMakeReservationScreen}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	view: {
		height: "100%",
		flexDirection: "column",
	},
	iconbutton: {
		position: "absolute",
		left: 20,
		bottom: 20,
	},
	scrollview: {
		paddingTop: 10,
		alignSelf: "center",
		width: "100%",
	},
	card: {
		marginTop: 5,
		marginBottom: 5,
		width: "80%",
		alignSelf: "center",
		flexDirection: "row",
	},
	categoryCollapsibleViewLight: {
		backgroundColor: "#f2f2f2",
	},
	categoryCollapsibleViewDark: {
		backgroundColor: "#000000",
	},
	categoryContainer: {
		flexGrow: 0,
		marginBottom: 10,
	},
	categoryList: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	categoryItem: {
		marginVertical: 2,
		marginHorizontal: 4,
	},
	container: {
		...StyleSheet.absoluteFillObject,
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
	text: {
		color: "#fff",
	},
	black_text: {
		color: "#000",
	},
});
