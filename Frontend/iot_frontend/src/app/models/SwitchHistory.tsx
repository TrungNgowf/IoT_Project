interface SwitchHistory {
    id: number;
    state: boolean;
    switchType: number;
    switchName: string;
    creationTime: Date;
}
interface SwitchHistoryList {
    items: SwitchHistory[];
    totalPages: number;
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
}