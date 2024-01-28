interface SensorHistory {
    id: number;
    temperature: number;
    humidity: number;
    brightness: number;
    creationTime: Date;
}
interface SensorHistoryList {
    items: SensorHistory[];
    totalPages: number;
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
}