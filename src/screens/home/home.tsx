import { View, ScrollView, Image, Alert } from "react-native";
import React, { ReactElement, useState } from "react";
import styles from "./home.style";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigatorParams } from "@config/navigator";
import { GradientBackground, Button, Text } from "@components";
import { useAuth } from "@contexts/auth-context";
import { signOut } from "@utils";

type HomeProps = {
    navigation: NativeStackNavigationProp<StackNavigatorParams, "Home">;
};

export default function Home({ navigation }: HomeProps): ReactElement {
    const { user } = useAuth();
    const [signingOut, setSigningOut] = useState(false);
    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <Image style={styles.logo} source={require("@assets/logo.png")} />
            </ScrollView>
            <View style={styles.buttons}>
                <Button
                    onPress={() => navigation.navigate("SinglePlayerGame")}
                    style={styles.button}
                    title="Single Player"
                />
                <Button
                    onPress={() => {
                        if (user) {
                            navigation.navigate("MultiplayerHome");
                        } else {
                            navigation.navigate("Login", { redirect: "MultiplayerHome" });
                        }
                    }}
                    style={styles.button}
                    title="Multiplayer"
                />
                <Button
                    loading={signingOut}
                    onPress={async () => {
                        if (user) {
                            setSigningOut(true);
                            try {
                                await signOut();
                            } catch (error) {
                                Alert.alert("Error", "Error signing out");
                            }
                        } else {
                            navigation.navigate("Login");
                        }
                        setSigningOut(false);
                    }}
                    style={styles.button}
                    title={user ? "Logout" : "Login"}
                />
                <Button
                    onPress={() => navigation.navigate("Settings")}
                    style={styles.button}
                    title="Settings"
                />
                {user && (
                    <Text weight="400" style={styles.loggedInText}>
                        Logged in as <Text weight="700">{user.username}</Text>{" "}
                    </Text>
                )}
            </View>
        </GradientBackground>
    );
}
