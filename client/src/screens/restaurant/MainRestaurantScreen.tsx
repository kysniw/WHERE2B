import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Appbar, IconButton, Paragraph } from "react-native-paper";
import { View } from "../../../components/Themed";

export default function MainRestaurantScreen({ navigation }) {
	return (
		<View>
			<Appbar.Header>
				<Appbar.Content
					title="Restaurant Panel"
					subtitle="Your restaurants"
				/>
			</Appbar.Header>
			<ScrollView>
				<Paragraph>There will be showed your restaurants</Paragraph>
			</ScrollView>
			<IconButton
				icon="plus"
				onPress={() => navigation.navigate("AddRestaurant")}
			/>
		</View>
	);
}
