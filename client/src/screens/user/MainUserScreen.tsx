import React, { useEffect, useState } from "react";
import { View, StyleSheet, useColorScheme, RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Chip, Appbar, Divider, List } from "react-native-paper";

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

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		loadCategories();
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		loadRestaurants();
	}, []);

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

	const toogleChecked = (categoryIndex: number) => {
		const newSelected = selectedCategories.map((value, index) =>
			index === categoryIndex ? !value : value
		);
		setSelectedCategories(newSelected);
	};

	const showRestaurantDialogDetails = (item: RestaurantModel) => {
		setRestaurantObject(item);
		setDialogVisible(true);
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

	const renderRestaurants = restaurants.map((item) => {
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

			<RestaurantListDetailsDialog
				visible={dialogVisible}
				categories={categories}
				restaurantObject={restaurantObject}
				onDismissAction={() => setDialogVisible(false)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	view: {
		height: "100%",
		flexDirection: "column",
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
});
