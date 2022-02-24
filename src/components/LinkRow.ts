import Vue from 'vue'

export default Vue.extend({
  name: 'LinkRow',

  props: [
    'short',
    'target',
    'caseSensitive',
    'isNew',
  ],

  methods: {
    submitLink() {
      if (this.isNew) {
        this.$emit("addLink", { shortUri: this.shortUrl, destinationUrl: this.targetUrl, caseSensitive: this.caseSensitiveUrl }, () => {
          this.shortUrl = ''
          this.targetUrl = ''
        })
      } else {
        this.$emit("editLink", {shortUri: this.shortUrl, destinationUrl: this.targetUrl, oldShort: this.short, caseSensitive: this.caseSensitiveUrl})
      }
    },
    deleteLink() {
      this.$emit("deleteLink", this.shortUrl)
    },
    copyToClipboard() {
      navigator.clipboard.writeText("mr-pine.de/" + this.shortUrl);
      this.copied = true
      setTimeout(() => this.copied = false, 3000)
  }
  },

  data() {
    return {
      shortUrl: this.short,
      targetUrl: this.target,
      caseSensitiveUrl: this.caseSensitive,
      copied: false,
      rules: {
        url: (value: string) => {
          return value.substring(0, 8).includes("://") || value.length <= 0 || "not a valid url"
        }
      }
    }
  },
})
