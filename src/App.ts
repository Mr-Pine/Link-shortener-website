import Vue from "vue";
import LinkArea from "./components/LinkArea.vue";
import secrets from "./secrets";

let linksData = [] as { shortUri: string; destinationUrl: string; caseSensitive: boolean; new: boolean }[];

const host = secrets.host

export default Vue.extend({
    name: "App",

    components: {
        LinkArea,
    },

    methods: {
        async asyncStart() {
            const res = await fetch(host + "api/get");
            const rawlinksData = (await res.json()) as {
                shortUri: string;
                destinationUrl: string;
                caseSensitive: boolean;
            }[];
            console.log(rawlinksData)
            rawlinksData.forEach((element) => {
                linksData = [
                    {
                        shortUri: element.shortUri,
                        destinationUrl: element.destinationUrl,
                        caseSensitive: element.caseSensitive,
                        new: false,
                    },
                ].concat(linksData);
            });

            const urlParams = new URLSearchParams(window.location.search);

            const hasStartLink = urlParams.has('new-link');
            const newDestination = hasStartLink ? urlParams.get('new-link') as string : ""

            linksData = [{ shortUri: "", destinationUrl: newDestination, caseSensitive: false, new: true }].concat(linksData);
            this.links = linksData
            console.log(linksData);
        },
        async addLink(data: { shortUri: string, destinationUrl: string, caseSensitive: boolean }, onOK: () => void) {
            if (this.links.find(element => element.shortUri == data.shortUri)) {alert("Already exists"); return}
            console.log(data);
            try {
                const res = await fetch(host + "api/add", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                if (res.status == 200) {
                    onOK()
                    linksData.splice(
                        0,
                        1,
                        ...[
                            { shortUri: "", destinationUrl: "", caseSensitive: false, new: true },
                            { shortUri: data.shortUri, destinationUrl: data.destinationUrl, caseSensitive: data.caseSensitive, new: false },
                        ]
                    );
                    this.links = linksData
                } else {
                    alert("An error occurred. Please try again")
                }
            } catch (e: any) {
                alert("An error occurred. Please try again later")
            }
        },
        async deleteLink(shortUri: string) {
            const res = await fetch(host + "api/delete", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ shortUri: shortUri })
            })
            if (res.status == 200) {
                linksData.splice(
                    linksData.findIndex(element => element.shortUri == shortUri),
                    1,
                );
                this.links = linksData
            }
        },
        async editLink(data: { shortUri: string, target: string, shortUriOld: string }) {
            const res = await fetch(host + "api/edit", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            console.log(res.status)
        }
    },

    created() {
        this.asyncStart()
    },

    data: () => ({
        links: linksData,
    }),
});