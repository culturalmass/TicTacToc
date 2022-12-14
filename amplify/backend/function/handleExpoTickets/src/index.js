/* Amplify Params - DO NOT EDIT
	API_TICTACTOE_GRAPHQLAPIENDPOINTOUTPUT
	API_TICTACTOE_GRAPHQLAPIIDOUTPUT
	API_TICTACTOE_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const appsync = require("aws-appsync");
const gql = require("graphql-tag");
require("cross-fetch/polyfill");
const { Expo } = require("expo-server-sdk");

const ticketsQuery = gql`
    query listExpoTicketsObjects {
        listExpoTicketsObjects {
            items {
                tickets
                id
                createdAt
            }
        }
    }
`;

const deleteExpoToken = gql`
    mutation deleteExpoToken($token: String!) {
        deleteExpoToken(input: { token: $token }) {
            token
        }
    }
`;

const deleteExpoTicketsObject = gql`
    mutation deleteExpoTicketsObject($id: ID!) {
        deleteExpoTicketObject(input: { id: $id }) {
            id
        }
    }
`;

exports.handler = async event => {
    const graphqlClient = new appsync.AWSAppSyncClient({
        url: process.env.API_TICTACTOE_GRAPHQLAPIENDPOINTOUTPUT,
        region: process.env.REGION,
        auth: {
            type: "AWS_IAM",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                sessionToken: process.env.AWS_SESSION_TOKEN
            }
        },
        disableOffline: true
    });
    const ticketsRes = await graphqlClient.query({
        query: ticketsQuery
    });
    const ticketsObjects = ticketsRes.data.listExpoTicketsObjects.items;
    for (const ticketsObject of ticketsObjects) {
        const currentDate = new Date();
        const ticketsObjectDate = new Date(ticketsObject.createdAt);
        const timeDiff = (currentDate.getTime() - ticketsObjectDate.getTime()) / (1000 * 60 * 60);
        if (timeDiff < 1) {
            continue;
        }
        const tickets = JSON.parse(ticketsObject.tickets);
        const expo = new Expo();
        const receiptIdChunks = expo.chunkPushNotificationReceiptIds(Object.keys(tickets));
        for (const chunk of receiptIdChunks) {
            try {
                const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
                for (let receiptId in receipts) {
                    const { status, details } = receipts[receiptId];
                    if (status === "error") {
                        if (details && details.error && details.error === "DeviceNotRegistered") {
                            try {
                                await graphqlClient.mutate({
                                    mutation: deleteExpoToken,
                                    variables: {
                                        token: tickets[receiptId]
                                    }
                                });
                            } catch (error) {
                                //Report
                            }
                        }
                    }
                }
            } catch (error) {
                //Report
            }
        }
        try {
            await graphqlClient.mutate({
                mutation: deleteExpoTicketsObject,
                variables: {
                    id: ticketsObject.id
                }
            });
        } catch (error) {
            //Report
        }
    }
};
