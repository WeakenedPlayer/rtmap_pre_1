export class MarkerInfo {
    constructor(
            public readonly key: string,
            public readonly ts: number,
            public lat: number,
            public lng: number,
            public icon: string
            ) {}
}
