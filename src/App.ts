import Vue from "vue";
import LinkArea from "./components/LinkArea.vue";
import secrets from "./secrets";

let linksData = [] as { short: string; target: string; caseSensitive: boolean; new: boolean }[];

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
                short_uri: string;
                destination_url: string;
                case_sensitive: boolean;
            }[];
            rawlinksData.forEach((element) => {
                linksData = [
                    {
                        short: element.short_uri,
                        target: element.destination_url,
                        caseSensitive: element.case_sensitive,
                        new: false,
                    },
                ].concat(linksData);
            });

            const urlParams = new URLSearchParams(window.location.search);

            const hasStartLink = urlParams.has('new-link');
            const newTarget = hasStartLink ? urlParams.get('new-link') as string : ""

            linksData = [{ short: "", target: newTarget, caseSensitive: false, new: true }].concat(linksData);
            this.links = linksData
            console.log(linksData);
        },
        async addLink(data: { short: string, target: string, caseSensitive: boolean }) {
            if (this.links.find(element => element.short == data.short)) return
            console.log(data);
            const res = await fetch(host + "api/add", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (res.status == 200) {
                linksData.splice(
                    0,
                    1,
                    ...[
                        { short: "", target: "", caseSensitive: false, new: true },
                        { short: data.short, target: data.target, caseSensitive: data.caseSensitive, new: false },
                    ]
                );
                this.links = linksData
            }
        },
        async deleteLink(short: string) {
            const res = await fetch(host + "api/delete", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ short: short })
            })
            if (res.status == 200) {
                linksData.splice(
                    linksData.findIndex(element => element.short == short),
                    1,
                );
                this.links = linksData
            }
        },
        async editLink(data: { short: string, target: string, oldShort: string }) {
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