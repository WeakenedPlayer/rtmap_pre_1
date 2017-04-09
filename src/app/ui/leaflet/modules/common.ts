export class MarkerInfo {
    constructor(
            public readonly key: string,
            public readonly exists: boolean,
            public readonly ts: number,
            public lat: number,
            public lng: number,
            public icon: string
            ) {}
}

export class Change {
    constructor( public newValue: MarkerInfo, public oldValue: MarkerInfo ) {}
}
