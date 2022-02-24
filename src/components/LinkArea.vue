<template>
  <v-container class="pa-0">
    <v-col class="pa-0">
      <link-row
        v-for="(link) in links"
        v-bind:key="link.shortUri"
        :short="link.shortUri"
        :target="link.destinationUrl"
        :isNew="link.new"
        :caseSensitive="link.caseSensitive"
        @addLink="addLink"
        @deleteLink="deleteLink"
        @editLink="editLink"
      />
    </v-col>
  </v-container>
</template>

<script src="./LinkArea.ts"></script>
