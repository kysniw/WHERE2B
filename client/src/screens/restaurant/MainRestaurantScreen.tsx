import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	useColorScheme,
	RefreshControl,
	ScrollView,
} from "react-native";
import { Appbar, IconButton, Paragraph, Colors } from "react-native-paper";

import { RootStackScreenProps } from "../../../types";
import RestaurantListDetailsDialog from "../../components/RestaurantListDetailsDialog";
import RestaurantListItemView from "../../components/RestaurantListItemView";
import Api from "../../network/Api";
import {
	RestaurantModel,
	RestaurantCategoryModel,
} from "../../network/generated";
import UserStorage from "../../storage/UserStorage";

export default function MainRestaurantScreen({
	navigation,
}: RootStackScreenProps<"MainRestaurantScreen">) {
	const colorScheme = useColorScheme();
	const [restaurantsArray, setRestaurantsArray] = useState<RestaurantModel[]>(
		[]
	);
	const [categories, setCategories] = useState<RestaurantCategoryModel[]>([]);
	const [refreshing, setRefreshing] = useState(true);
	const [restaurantObject, setRestaurantObject] = useState<RestaurantModel>();
	const [dialogVisible, setDialogVisible] = useState(false);

	useEffect(() => {
		const getProfileInfo = async () => {
			await Api.usersApi
				.restaurantProfileRead(UserStorage.userId.toString())
				.then((response) => {
					console.log(response.data);
				})
				.catch((error) => {
					console.log(error.message);
				});
		};
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		getProfileInfo();
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		getRestaurantList();
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		getRestaurantCategories();
	}, []);

	const getRestaurantCategories = async () => {
		await Api.restaurantsApi
			.restaurantCategoriesList()
			.then((response) => {
				setCategories(response.data.results);
			})
			.catch((error) => {
				console.log(error.message);
				console.log(error.response.data);
			});
	};

	const getRestaurantList = async () => {
		setRefreshing(true);

		await Api.restaurantsApi
			.userRestaurantsList()
			.then((response) => {
				//	console.log(response.data.results);
				setRestaurantsArray(response.data.results);
			})
			.catch((error) => {
				console.error(error.response.message);
			})
			.finally(() => setRefreshing(false));
	};

	const showRestaurantDialogDetails = (item: RestaurantModel) => {
		setRestaurantObject(item);
		setDialogVisible(true);
	};

	const deleteRestuarant = async (id: number) => {
		await Api.restaurantsApi
			.restaurantDelete(id)
			.then(async () => {
				setDialogVisible(false);
				await getRestaurantList();
			})
			.catch((error) => {
				console.log(error.message);
				console.log(error.response.data);
			});
	};

	const restaurantList = restaurantsArray.map((item) => {
		return (
			<RestaurantListItemView
				key={item.id}
				restaurant={item}
				dialogDetailsAction={showRestaurantDialogDetails}
			/>
		);
	});

	return (
		<View style={styles.view}>
			<Appbar.Header>
				<Appbar.Content
					title="Restaurant Panel"
					subtitle="Your restaurants"
				/>
				<Appbar.Action
					icon="logout"
					onPress={() =>
						UserStorage.deleteData().then((response) => {
							console.log(response);
							navigation.navigate("UserLogin");
						})
					}
				/>
			</Appbar.Header>
			<RestaurantListDetailsDialog
				visible={dialogVisible}
				categories={categories}
				restaurantObject={restaurantObject}
				onEditRestaurantAction={() => {
					setDialogVisible(false);
					if (typeof restaurantObject !== "undefined")
						navigation.navigate("EditRestaurant", {
							restaurant: restaurantObject,
						});
				}}
				onDeleteRestaurantAction={deleteRestuarant}
				onDismissAction={() => setDialogVisible(false)}
			/>
			<ScrollView
				style={styles.scrollview}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={getRestaurantList}
					/>
				}
			>
				{restaurantsArray.length !== 0 ? (
					restaurantList
				) : (
					<Paragraph
						style={{
							alignSelf: "center",
							justifyContent: "center",
							marginTop: 20,
						}}
					>
						There is no restaurant to show
					</Paragraph>
				)}
			</ScrollView>
			<IconButton
				style={
					colorScheme === "dark"
						? sytlesDark.iconbutton
						: styles.iconbutton
				}
				icon="plus"
				size={40}
				onPress={() => navigation.navigate("AddRestaurant")}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	view: {
		height: "100%",
		flex: 1,
	},
	scrollview: {
		paddingTop: 5,
		alignSelf: "center",
		width: "100%",
		flex: 1,
	},

	iconbutton: {
		position: "absolute",
		left: 20,
		bottom: 20,
		backgroundColor: Colors.blue700,
	},

	card: {
		marginTop: 5,
		marginBottom: 5,
		width: "80%",
		alignSelf: "center",
		flexDirection: "row",
	},

	modalcontainer: {
		backgroundColor: Colors.white,
		margin: 20,
	},
});

const sytlesDark = StyleSheet.create({
	iconbutton: {
		position: "absolute",
		left: 20,
		bottom: 20,
		backgroundColor: Colors.deepPurple900,
	},

	modalcontainer: {
		backgroundColor: Colors.grey900,
		margin: 20,
	},
});
