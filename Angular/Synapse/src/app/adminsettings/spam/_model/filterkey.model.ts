export interface Filterkeyword {
    keywordId?: number;
    keywordName: string;
    status?: number;
}

export interface ApiResponse {
    id: number;
    message: string;
    status: boolean;
  }