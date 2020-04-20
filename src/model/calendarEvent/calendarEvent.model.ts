export interface CalendarEvent {
    key?: string;
    userid: string;
    goalid: string;
    startTime: any;
    endTime: any;
    title: string;
    allDay: boolean;
    color?: string;
    active?: boolean;
    actionid?: string;
    delegationid?: string;
    event_id?: string;
    eventLocation?: string;
}