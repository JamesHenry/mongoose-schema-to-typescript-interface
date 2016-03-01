declare module avct {
	interface IAccount {
		enabled: boolean;
		created: Date;
	}
	interface IUser {
		name: string;
		age: number;
		gender: 'male' | 'female';
		email?: string;
	}
}
