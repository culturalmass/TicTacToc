import { colors } from "@utils";
import { StyleSheet } from "react-native";
import { globalStyles } from "@utils";

const styles = StyleSheet.create({
    container: {
        ...globalStyles.container
    },
    text: {
        color: colors.lightGreen,
        marginBottom: 20
    }
});

export default styles;
