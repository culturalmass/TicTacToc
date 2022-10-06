import { StyleSheet, View, Image } from "react-native";
import React from "react";
import { Game, Home } from "@screens";
import { Text } from "@components";
import {
    useFonts,
    DeliusUnicase_400Regular,
    DeliusUnicase_700Bold
} from "@expo-google-fonts/delius-unicase";

const App = () => {
    const [fontLoaded] = useFonts({
        DeliusUnicase_400Regular,
        DeliusUnicase_700Bold
    });
    if (!fontLoaded) return null;
    return (
        <View style={styles.container}>
            <Text
                onPress={() => {
                    alert(true);
                }}
                style={{ fontSize: 25 }}
            >
                Hello World! <Text weight="400">Test</Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    }
});

export default App;
