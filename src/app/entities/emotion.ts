export class Emotion {
    label: string
    value: number

    salesData = [
        {label: "Basic", color: "#3366CC"},
        {label: "Plus", color: "#DC3912"},
        {label: "Lite", color: "#FF9900"},
        {label: "Elite", color: "#109618"},
        {label: "Delux", color: "#990099"}
    ];

    constructor() {}

    randomData() {
        return this.salesData.map(function (d) {
            return {label: d.label, value: 1000 * Math.random(), color: d.color};
        });
    }
}
