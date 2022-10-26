import { ScrollView, View, TouchableOpacity, Switch } from "react-native";
import React, { ReactElement } from "react";
import { GradientBackground, Text } from "@components";
import { colors } from "@utils";
import styles from "./settings.styles";
import { useSettings, difficulties } from "@contexts/settings-context";
import { useAuth } from "@contexts/auth-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigatorParams } from "@config/navigator";

type SettingsScreenNavigationProp = NativeStackNavigationProp<StackNavigatorParams, "Settings">;

type SettingsProps = {
    navigation: SettingsScreenNavigationProp;
};

const Settings = ({ navigation }: SettingsProps): ReactElement | null => {
    const { user } = useAuth();
    const { settings, saveSetting } = useSettings();
    if (!settings) return null;

    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.field}>
                    <Text style={styles.label}>Bot Difficulty</Text>
                    <View style={styles.choices}>
                        {Object.keys(difficulties).map(level => {
                            return (
                                <TouchableOpacity
                                    onPress={() =>
                                        saveSetting(
                                            "difficulty",
                                            level as keyof typeof difficulties
                                        )
                                    }
                                    style={[
                                        styles.choice,
                                        {
                                            backgroundColor:
                                                settings.difficulty === level
                                                    ? colors.lightPurple
                                                    : colors.lightGreen
                                        }
                                    ]}
                                    key={level}
                                >
                                    <Text
                                        style={[
                                            styles.choiceText,
                                            {
                                                color:
                                                    settings.difficulty === level
                                                        ? colors.lightGreen
                                                        : colors.darkPurple
                                            }
                                        ]}
                                    >
                                        {difficulties[level as keyof typeof difficulties]}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
                <View style={[styles.field, styles.switchField]}>
                    <Text style={styles.label}>Sounds</Text>
                    <Switch
                        trackColor={{
                            false: colors.purple,
                            true: colors.lightPurple
                        }}
                        thumbColor={colors.lightGreen}
                        ios_backgroundColor={colors.purple}
                        value={settings.sounds}
                        onValueChange={() => saveSetting("sounds", !settings.sounds)}
                    />
                </View>
                <View style={[styles.field, styles.switchField]}>
                    <Text style={styles.label}>Haptics/Vibrations</Text>
                    <Switch
                        trackColor={{
                            false: colors.purple,
                            true: colors.lightPurple
                        }}
                        thumbColor={colors.lightGreen}
                        ios_backgroundColor={colors.purple}
                        value={settings.haptics}
                        onValueChange={() => saveSetting("haptics", !settings.haptics)}
                    />
                </View>
                {user && (
                    <View style={[styles.field, styles.switchField]}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("ChangePassword");
                            }}
                        >
                            <Text style={[styles.label, { textDecorationLine: "underline" }]}>
                                Change Password
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </GradientBackground>
    );
};
export default Settings;
