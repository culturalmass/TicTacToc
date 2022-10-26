export type AmplifyDependentResourcesAttributes = {
    auth: {
        tictactoe0c8a94b8: {
            IdentityPoolId: "string";
            IdentityPoolName: "string";
            UserPoolId: "string";
            UserPoolArn: "string";
            UserPoolName: "string";
            AppClientIDWeb: "string";
            AppClientID: "string";
        };
    };
    api: {
        tictactoe: {
            GraphQLAPIIdOutput: "string";
            GraphQLAPIEndpointOutput: "string";
        };
    };
    function: {
        postConfirmation: {
            Name: "string";
            Arn: "string";
            Region: "string";
            LambdaExecutionRole: "string";
        };
        startGame: {
            Name: "string";
            Arn: "string";
            Region: "string";
            LambdaExecutionRole: "string";
        };
        playMove: {
            Name: "string";
            Arn: "string";
            Region: "string";
            LambdaExecutionRole: "string";
        };
        addExpoToken: {
            Name: "string";
            Arn: "string";
            Region: "string";
            LambdaExecutionRole: "string";
        };
        handleExpoTickets: {
            Name: "string";
            Arn: "string";
            Region: "string";
            LambdaExecutionRole: "string";
            CloudWatchEventRule: "string";
        };
        preAuth: {
            Name: "string";
            Arn: "string";
            Region: "string";
            LambdaExecutionRole: "string";
        };
    };
};
