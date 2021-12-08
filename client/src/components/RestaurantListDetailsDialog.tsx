import React from "react";
import {
	Colors,
	Dialog,
	IconButton,
	Paragraph,
	Portal,
} from "react-native-paper";

import { RestaurantCategoryModel, RestaurantModel } from "../network/generated";
import UserStorage from "../storage/UserStorage";

interface Props {
	visible: boolean;
	restaurantObject: RestaurantModel | undefined;
	categories: RestaurantCategoryModel[];
	onEditRestaurantAction?: () => void;
	onDeleteRestaurantAction?: (id: number) => Promise<void>;
	onMakeReservationAction?: () => void;
	onDismissAction: () => void;
}

export default function RestaurantListDetailsDialog(props: Props) {
	const renderCategories = props.categories
		.filter((x) => props.restaurantObject?.categories.includes(x.id!))
		.map((item) => <Paragraph key={item.id}>{item.name}</Paragraph>);

	return (
		<Portal>
			{props.restaurantObject ? (
				<Dialog
					visible={props.visible}
					onDismiss={props.onDismissAction}
				>
					<Dialog.Title onPressIn onPressOut>
						{props.restaurantObject.name}
					</Dialog.Title>
					<Dialog.Content>
						<Paragraph>
							Szerokość: {props.restaurantObject.latitude}
						</Paragraph>
						<Paragraph>
							Wysokość: {props.restaurantObject.longitude}
						</Paragraph>
						<Paragraph>
							{props.restaurantObject.is_making_reservations ===
							true
								? "Obsługuje rezerwacje"
								: "Nie obsługuje rezerwacji"}
						</Paragraph>
						<Paragraph>
							Maksymalna liczba klientów:{" "}
							{props.restaurantObject.max_number_of_people}
						</Paragraph>
						<Paragraph>Kategorie: </Paragraph>
						{renderCategories}
					</Dialog.Content>
					{UserStorage.isRestaurantProfile && (
						<Dialog.Actions>
							<IconButton
								icon="pencil"
								onPress={props.onEditRestaurantAction}
							/>
							<IconButton
								color={Colors.red700}
								icon="delete"
								onPress={async () => {
									if (
										typeof props.restaurantObject?.id ===
											"number" &&
										props.onDeleteRestaurantAction !==
											undefined
									)
										await props.onDeleteRestaurantAction(
											props.restaurantObject.id
										);
								}}
							/>
						</Dialog.Actions>
					)}
					{!UserStorage.isRestaurantProfile && (
						<Dialog.Actions>
							<IconButton
								icon="calendar-plus"
								onPress={() => {
									if (
										props.onMakeReservationAction !==
										undefined
									)
										props.onMakeReservationAction();
								}}
							/>
						</Dialog.Actions>
					)}
				</Dialog>
			) : (
				<Dialog
					visible={props.visible}
					onDismiss={props.onDismissAction}
				>
					Nothing to show
				</Dialog>
			)}
		</Portal>
	);
}
