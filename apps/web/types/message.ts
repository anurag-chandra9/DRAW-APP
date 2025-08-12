export interface Message {
    id: number;
    message: string;
    roomId: number;
    userId: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}