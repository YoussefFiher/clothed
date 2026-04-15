import { Article } from "./articles.model";
export interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    articleId: number;
    isRead?: boolean;
    createdAt?: Date;
    article?: Article;
}
