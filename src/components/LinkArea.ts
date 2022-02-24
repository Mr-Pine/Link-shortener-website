import Vue from 'vue'
import LinkRow from './LinkRow.vue'

export default Vue.extend({
  name: 'LinkArea',

  components: {
    LinkRow
  },

  props: [
    'links'
  ],

  methods: {
    addLink(data: { shortUri: string, destinationUrl: string }, onOK: () => void) {
      console.log(data)
      this.$emit("addLink", data, onOK)
    },
    deleteLink(short: string) {
      console.log("deleting " + short)
      this.$emit("deleteLink", short)
    },
    editLink(data: { shortUri: string, destinationUrl: string, shortUrlOld: string }) {
      console.log(data)
      this.$emit("editLink", data)
    }
  },

  data: () => ({
  })
})
