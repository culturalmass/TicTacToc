/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onUpdateGameById = /* GraphQL */ `
    subscription OnUpdateGameById($id: ID!) {
        onUpdateGameById(id: $id) {
            id
            status
            owners
            initiator
            turn
            state
            winner
            createdAt
            updatedAt
            players {
                items {
                    id
                    createdAt
                    gameID
                    playerUsername
                    owners
                    updatedAt
                }
                nextToken
            }
        }
    }
`;
export const onCreatePlayer = /* GraphQL */ `
    subscription OnCreatePlayer {
        onCreatePlayer {
            id
            cognitoID
            username
            name
            email
            createdAt
            updatedAt
            games {
                items {
                    id
                    createdAt
                    gameID
                    playerUsername
                    owners
                    updatedAt
                }
                nextToken
            }
            tokens {
                items {
                    id
                    token
                    playerUsername
                    createdAt
                    updatedAt
                }
                nextToken
            }
        }
    }
`;
export const onUpdatePlayer = /* GraphQL */ `
    subscription OnUpdatePlayer {
        onUpdatePlayer {
            id
            cognitoID
            username
            name
            email
            createdAt
            updatedAt
            games {
                items {
                    id
                    createdAt
                    gameID
                    playerUsername
                    owners
                    updatedAt
                }
                nextToken
            }
            tokens {
                items {
                    id
                    token
                    playerUsername
                    createdAt
                    updatedAt
                }
                nextToken
            }
        }
    }
`;
export const onDeletePlayer = /* GraphQL */ `
    subscription OnDeletePlayer {
        onDeletePlayer {
            id
            cognitoID
            username
            name
            email
            createdAt
            updatedAt
            games {
                items {
                    id
                    createdAt
                    gameID
                    playerUsername
                    owners
                    updatedAt
                }
                nextToken
            }
            tokens {
                items {
                    id
                    token
                    playerUsername
                    createdAt
                    updatedAt
                }
                nextToken
            }
        }
    }
`;
export const onCreatePlayerGame = /* GraphQL */ `
    subscription OnCreatePlayerGame {
        onCreatePlayerGame {
            id
            createdAt
            gameID
            playerUsername
            owners
            updatedAt
            player {
                id
                cognitoID
                username
                name
                email
                createdAt
                updatedAt
                games {
                    nextToken
                }
                tokens {
                    nextToken
                }
            }
            game {
                id
                status
                owners
                initiator
                turn
                state
                winner
                createdAt
                updatedAt
                players {
                    nextToken
                }
            }
        }
    }
`;
export const onUpdatePlayerGame = /* GraphQL */ `
    subscription OnUpdatePlayerGame {
        onUpdatePlayerGame {
            id
            createdAt
            gameID
            playerUsername
            owners
            updatedAt
            player {
                id
                cognitoID
                username
                name
                email
                createdAt
                updatedAt
                games {
                    nextToken
                }
                tokens {
                    nextToken
                }
            }
            game {
                id
                status
                owners
                initiator
                turn
                state
                winner
                createdAt
                updatedAt
                players {
                    nextToken
                }
            }
        }
    }
`;
export const onDeletePlayerGame = /* GraphQL */ `
    subscription OnDeletePlayerGame {
        onDeletePlayerGame {
            id
            createdAt
            gameID
            playerUsername
            owners
            updatedAt
            player {
                id
                cognitoID
                username
                name
                email
                createdAt
                updatedAt
                games {
                    nextToken
                }
                tokens {
                    nextToken
                }
            }
            game {
                id
                status
                owners
                initiator
                turn
                state
                winner
                createdAt
                updatedAt
                players {
                    nextToken
                }
            }
        }
    }
`;
export const onCreateGame = /* GraphQL */ `
    subscription OnCreateGame($owners: String) {
        onCreateGame(owners: $owners) {
            id
            status
            owners
            initiator
            turn
            state
            winner
            createdAt
            updatedAt
            players {
                items {
                    id
                    createdAt
                    gameID
                    playerUsername
                    owners
                    updatedAt
                }
                nextToken
            }
        }
    }
`;
export const onUpdateGame = /* GraphQL */ `
    subscription OnUpdateGame($owners: String) {
        onUpdateGame(owners: $owners) {
            id
            status
            owners
            initiator
            turn
            state
            winner
            createdAt
            updatedAt
            players {
                items {
                    id
                    createdAt
                    gameID
                    playerUsername
                    owners
                    updatedAt
                }
                nextToken
            }
        }
    }
`;
export const onDeleteGame = /* GraphQL */ `
    subscription OnDeleteGame($owners: String) {
        onDeleteGame(owners: $owners) {
            id
            status
            owners
            initiator
            turn
            state
            winner
            createdAt
            updatedAt
            players {
                items {
                    id
                    createdAt
                    gameID
                    playerUsername
                    owners
                    updatedAt
                }
                nextToken
            }
        }
    }
`;
export const onCreateExpoToken = /* GraphQL */ `
    subscription OnCreateExpoToken($playerUsername: String) {
        onCreateExpoToken(playerUsername: $playerUsername) {
            id
            token
            playerUsername
            createdAt
            updatedAt
        }
    }
`;
export const onUpdateExpoToken = /* GraphQL */ `
    subscription OnUpdateExpoToken($playerUsername: String) {
        onUpdateExpoToken(playerUsername: $playerUsername) {
            id
            token
            playerUsername
            createdAt
            updatedAt
        }
    }
`;
export const onDeleteExpoToken = /* GraphQL */ `
    subscription OnDeleteExpoToken($playerUsername: String) {
        onDeleteExpoToken(playerUsername: $playerUsername) {
            id
            token
            playerUsername
            createdAt
            updatedAt
        }
    }
`;
export const onCreateExpoTicketsObjets = /* GraphQL */ `
    subscription OnCreateExpoTicketsObjets {
        onCreateExpoTicketsObjets {
            id
            tickets
            createdAt
            updatedAt
        }
    }
`;
export const onUpdateExpoTicketsObjets = /* GraphQL */ `
    subscription OnUpdateExpoTicketsObjets {
        onUpdateExpoTicketsObjets {
            id
            tickets
            createdAt
            updatedAt
        }
    }
`;
export const onDeleteExpoTicketsObjets = /* GraphQL */ `
    subscription OnDeleteExpoTicketsObjets {
        onDeleteExpoTicketsObjets {
            id
            tickets
            createdAt
            updatedAt
        }
    }
`;
