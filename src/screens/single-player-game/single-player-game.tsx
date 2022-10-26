import { SafeAreaView, View, Dimensions, Alert } from "react-native";
import React, { ReactElement, useEffect, useState } from "react";
import styles from "./single-player-game.style";
import { Board, GradientBackground, Text, Button } from "@components";
import {
    isEmpty,
    BoardState,
    isTerminal,
    getBestMove,
    Cell,
    useSounds,
    getErrorMessage
} from "@utils";
import { useSettings, difficulties } from "@contexts/settings-context";

//Adding Ads to the App
// import { Platform } from "react-native";
// import { AdMobInterstitial, setTestDeviceIDAsync } from "expo-ads-admob";
// import * as Device from "expo-device";

// setTestDeviceIDAsync("EMULATOR");
// const addUnitID = Platform.select({
//     ios: Device.isDevice && !__DEV__ ? "¨ProdID" : "TestID", //ADD UNIT FROM ADMOB AFTER CONF THE ADS --USE TEST ADS
//     android: Device.isDevice && !__DEV__ ? "¨ProdID" : "TestID" //ADD UNIT FROM ADMOB AFTER CONF THE ADS --USE TEST ADS
// });

const SCREEN_WIDTH = Dimensions.get("screen").width;

const SinglePlayerGame = (): ReactElement => {
    // prettier-ignore
    const [state, setState] = useState<BoardState>([
        null, null, null,
        null, null, null,
        null, null, null
    ]);

    const [turn, setTurn] = useState<"HUMAN" | "BOT">(Math.random() < 0.5 ? "HUMAN" : "BOT");
    const [isHumanMaximizing, setIsHumanMaximizing] = useState<boolean>(true);
    const [gamesCount, setGamesCount] = useState({
        wins: 0,
        losses: 0,
        draws: 0
    });

    const playSound = useSounds();
    const { settings } = useSettings();

    const gameResult = isTerminal(state);

    const insertCell = (cell: number, symbol: "x" | "o"): void => {
        const stateCopy: BoardState = [...state];
        if (stateCopy[cell] || isTerminal(stateCopy)) return;
        stateCopy[cell] = symbol;
        setState(stateCopy);
        try {
            symbol === "x" ? playSound("pop1") : playSound("pop2");
        } catch (error: any) {
            Alert.alert("Error!", getErrorMessage(error));
        }
    };

    const handleOnCellPressed = (cell: number): void => {
        if (turn !== "HUMAN") return;
        insertCell(cell, isHumanMaximizing ? "x" : "o");
        setTurn("BOT");
    };

    const getWinner = (winnerSymbol: Cell): "HUMAN" | "BOT" | "DRAW" => {
        if (winnerSymbol === "x") {
            return isHumanMaximizing ? "HUMAN" : "BOT";
        }
        if (winnerSymbol === "o") {
            return isHumanMaximizing ? "BOT" : "HUMAN";
        }
        return "DRAW";
    };
    const newGame = () => {
        setState([null, null, null, null, null, null, null, null, null]);
        const aleatoryTurn = Math.random() < 0.5 ? "HUMAN" : "BOT";
        setTurn(aleatoryTurn);
        setIsHumanMaximizing(aleatoryTurn === "HUMAN" ? true : false);
    };

    //Function Ads
    // const showAd = async () => {
    //     if (!addUnitID) return;
    //     try {
    //         await AdMobInterstitial.setAdunitID(addUnitID);
    //         await AdMobInterstitial.requestAdAsync({
    //             servePersonalizedAds: true
    //         });
    //         await AdMobInterstitial.showAdAsync();
    //     } catch (error) {
    //         //Report
    //     }
    // };

    useEffect(() => {
        if (gameResult) {
            const winner = getWinner(gameResult.winner);
            if (winner === "HUMAN") {
                playSound("win");
                setGamesCount({ ...gamesCount, wins: gamesCount.wins + 1 });
            }
            if (winner === "BOT") {
                playSound("loss");
                setGamesCount({ ...gamesCount, losses: gamesCount.losses + 1 });
            }
            if (winner === "DRAW") {
                playSound("draw");
                setGamesCount({ ...gamesCount, draws: gamesCount.draws + 1 });
            }
            //SHOW ADS every "SET" games
            // const totalGames = gamesCount.wins + gamesCount.draws + gamesCount.losses;
            // if (totalGames % 5 === 0) {
            //     showAd();
            // }
        } else {
            if (turn === "BOT") {
                if (isEmpty(state)) {
                    const centersAndCorners = [0, 2, 6, 8, 4];
                    const firstMove =
                        centersAndCorners[Math.floor(Math.random() * centersAndCorners.length)];
                    insertCell(firstMove, "x");
                    setIsHumanMaximizing(false);
                    setTurn("HUMAN");
                } else {
                    const best = getBestMove(
                        state,
                        !isHumanMaximizing,
                        0,
                        parseInt(settings ? settings.difficulty : "-1")
                    );
                    insertCell(best, isHumanMaximizing ? "o" : "x");
                    setTurn("HUMAN");
                }
            }
        }
    }, [state, turn]);

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View>
                    <Text style={styles.difficulty}>
                        Difficulty: {settings ? difficulties[settings.difficulty] : "Impossible"}
                    </Text>
                    <View style={styles.results}>
                        <View style={styles.resultsBox}>
                            <Text style={styles.resultsTitle}>Wins</Text>
                            <Text style={styles.resultsCount}>{gamesCount.wins}</Text>
                        </View>
                        <View style={styles.resultsBox}>
                            <Text style={styles.resultsTitle}>Draws</Text>
                            <Text style={styles.resultsCount}>{gamesCount.draws}</Text>
                        </View>
                        <View style={styles.resultsBox}>
                            <Text style={styles.resultsTitle}>Losses</Text>
                            <Text style={styles.resultsCount}>{gamesCount.losses}</Text>
                        </View>
                    </View>
                </View>
                <Board
                    disabled={Boolean(isTerminal(state)) || turn !== "HUMAN"}
                    onCellPressed={cell => {
                        handleOnCellPressed(cell);
                    }}
                    size={SCREEN_WIDTH - 60}
                    gameResult={gameResult}
                    state={state}
                />
                {gameResult && (
                    <View style={styles.modal}>
                        <Text style={styles.modalText}>
                            {getWinner(gameResult.winner) === "HUMAN" && "You Won"}
                            {getWinner(gameResult.winner) === "BOT" && "You Lost"}
                            {getWinner(gameResult.winner) === "DRAW" && "It's a Draw"}
                        </Text>
                        <Button
                            onPress={() => {
                                newGame();
                            }}
                            title="Play again"
                        ></Button>
                    </View>
                )}
            </SafeAreaView>
        </GradientBackground>
    );
};

export default SinglePlayerGame;
