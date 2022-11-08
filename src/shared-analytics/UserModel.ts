// Copied from https://github.com/rye-com/dev-console/blob/ccdaf725d7a9782cdd1a020b7b97399e4aaa4528/src/app/firebase/collections/users.ts#L6
enum AuthProvider {
  Local = 'local',
  Google = 'google',
}

export interface UserModel {
  apiKey: string;
  authProvider: AuthProvider.Local | AuthProvider.Google;
  email: string | null;
  uid: string;
  webhookURL: string;
  marginAmount: number;
  marginIsPercent: boolean; // $ = any > 0, % = 0-100
}
