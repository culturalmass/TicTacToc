import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from "react-native";
import React, { ReactElement } from "react";
import Text from "../text/text";
import styles from "./button.style";

type ButtonProps = {
    title: string;
    loading?: boolean;
} & TouchableOpacityProps;

const Button = ({ title, style, loading, ...props }: ButtonProps): ReactElement => {
    return (
        <TouchableOpacity {...props} disabled={loading} style={[styles.button, style]}>
            {loading ? (
                <ActivityIndicator color="#000" />
            ) : (
                <Text style={styles.buttonText}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

export default Button;
