import admin from "@/lib/firebase-admin";
import { DocumentData, DocumentSnapshot } from "@google-cloud/firestore";
import { UserData } from "@/types/user";

export const getUser = async (userId: string): Promise<DocumentSnapshot<DocumentData, DocumentData>> => {
	const fs = admin.firestore();
	const userRef = fs.collection("users").doc(userId);
	const user = await userRef.get();
	return user;
};

export const createUser = async (
	userId: string,
	email: string,
): Promise<UserData | null> => {
	try {
		const fs = admin.firestore();
		const userRef = fs.collection("users").doc(userId);

		const user: UserData = {
			id: userId,
			email: email,
			createdAt: new Date(),
		};
		await userRef.set(user);
		return user;
	} catch (error) {
		console.error("Error adding user: ", error);
		return null;
	}
};