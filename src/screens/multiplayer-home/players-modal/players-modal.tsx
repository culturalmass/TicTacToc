import {
    View,
    Alert,
    TextInput as NativeTextInput,
    FlatList,
    ActivityIndicator,
    TouchableOpacity
} from "react-native";
import { Text, GradientBackground, TextInput } from "@components";
import React, { ReactElement, useEffect, useState, useRef } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { searchPlayers } from "../multiplayer-home.graphql";
import { GraphQLResult } from "@aws-amplify/api";
import { searchPlayersQuery } from "@api";
import { colors } from "@utils";
import styles from "./players-modal.styles";

type PlayersListType = Exclude<searchPlayersQuery["searchPlayers"], null>["items"];

type PlayerModalProps = { onItemPress: (username: string) => void };

const PlayerModal = ({ onItemPress }: PlayerModalProps): ReactElement => {
    const [players, setPlayers] = useState<PlayersListType>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<NativeTextInput | null>(null);
    const fetchPlayers = async (searchString: string) => {
        setLoading(true);
        setSubmittedQuery(searchString);
        try {
            const players = (await API.graphql(
                graphqlOperation(searchPlayers, {
                    limit: 10,
                    searchString
                })
            )) as GraphQLResult<searchPlayersQuery>;
            if (players.data?.searchPlayers) {
                setPlayers(players.data.searchPlayers.items);
            }
        } catch (error) {
            Alert.alert("Error!", "An error has occurred. Please try again later!");
        }
        setLoading(false);
    };

    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 250);
    }, []);

    return (
        <View style={styles.modalContainer}>
            <GradientBackground>
                <View style={styles.searchContainer}>
                    <TextInput
                        ref={inputRef}
                        value={searchQuery}
                        onChangeText={text => setSearchQuery(text)}
                        onSubmitEditing={() => {
                            fetchPlayers(searchQuery);
                        }}
                        style={{ borderBottomWidth: 0, backgroundColor: colors.darkPurple }}
                        placeholder="Type to search by username or name"
                        returnKeyType="search"
                    />
                </View>
                <View style={{ flex: 1 }}>
                    {loading ? (
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <ActivityIndicator color={colors.lightGreen} />
                        </View>
                    ) : (
                        <FlatList
                            contentContainerStyle={{ padding: 20 }}
                            data={players}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (item) {
                                                onItemPress(item?.username);
                                            }
                                        }}
                                        style={styles.playerItem}
                                    >
                                        <Text style={{ color: colors.lightGreen, fontSize: 17 }}>
                                            {item?.name}
                                        </Text>
                                        <Text weight="400" style={{ color: colors.lightGreen }}>
                                            {item?.username}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                            keyExtractor={player => player?.username || `${new Date().getTime()}`}
                            ListEmptyComponent={() => {
                                return (
                                    <View>
                                        <Text style={{ color: colors.lightGreen }}>
                                            {submittedQuery
                                                ? "No result found!"
                                                : "Type to search by name or username"}
                                        </Text>
                                    </View>
                                );
                            }}
                        />
                    )}
                </View>
            </GradientBackground>
        </View>
    );
};

export default PlayerModal;
