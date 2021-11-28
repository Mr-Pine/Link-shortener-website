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
    addLink(data: { short: string, target: string }) {
      console.log(data)
      this.$emit("addLink", data)
    },
    deleteLink(short: string) {
      console.log("deleting " + short)
      this.$emit("deleteLink", short)
    },
    editLink(data: { short: string, target: string, oldShort: string }) {
      console.log(data)
      this.$emit("editLink", data)
    }
  },

  data: () => ({
  })
})
