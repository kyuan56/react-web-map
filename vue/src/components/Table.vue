<template>
  <div>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="place in paginatedPlaces" :key="place.name">
          <td>
            <input type="checkbox" v-model="selectedPlaces" :value="place.name" />
          </td>
          <td>{{ place.name }}</td>
          <!-- Add more table cells as needed -->
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
      <span>{{ currentPage }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
    <button @click="deleteSelected">Delete Selected</button>
  </div>
</template>

<script>
export default {
  props: {
    places: {
      type: Array,
      required: true,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      currentPage: 1,
      selectedPlaces: [],
    };
  },
  computed: {
    paginatedPlaces() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.places.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.places.length / this.pageSize);
    },
  },
  methods: {
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    deleteSelected() {
      // Emit the delete event with the selected places as payload
      this.$emit('delete', this.selectedPlaces);
      // Clear the selectedPlaces array
      this.selectedPlaces = [];
    },
  },
};
</script>