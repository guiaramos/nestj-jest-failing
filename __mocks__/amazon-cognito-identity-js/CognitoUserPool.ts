import { CognitoUserAttribute, NodeCallback } from 'amazon-cognito-identity-js';

export class CognitoUserPool {
  signUp(
    username: string,
    password: string,
    userAttributes: CognitoUserAttribute[],
    validationData: CognitoUserAttribute[],
    callback: NodeCallback<Error, any>
  ) {
    return callback(null, true);
  }
}
