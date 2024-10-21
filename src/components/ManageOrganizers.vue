<template>
  <div class="organizers-container">
    <h2 class="title">Manage Organizers</h2>

    <div class="organizer-list">
      <ul>
        <li v-for="organizer in organizers" :key="organizer.id" class="organizer-item">
          <div class="organizer-details">
            <h3>{{ organizer.name }}</h3>
          </div>
          <div class="organizer-actions">
            <button class="edit-btn" @click="editOrganizer(organizer)">Edit</button>
            <button class="delete-btn" @click="deleteOrganizer(organizer.id)">Delete</button>
          </div>
        </li>
      </ul>
    </div>

    <form @submit.prevent="isEditing ? updateOrganizer() : createOrganizer()" class="organizer-form">
      <h3>{{ isEditing ? 'Edit Organizer' : 'Create Organizer' }}</h3>
      <input v-model="currentOrganizer.name" placeholder="Organizer Name" required />
      <button type="submit">{{ isEditing ? 'Update Organizer' : 'Create Organizer' }}</button>
      <button v-if="isEditing" type="button" @click="cancelEdit">Cancel</button>
    </form>

    <!-- Display error messages -->
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      organizers: [],
      currentOrganizer: { name: '' },
      isEditing: false,
      editingOrganizerId: null,
      error: null
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    async fetchOrganizers() {
      try {
        const token = this.$store.state.token;
        const response = await axios.get('http://localhost:80/api/organizers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data)
        this.organizers = response.data;
      } catch (error) {
        this.error = 'Failed to fetch organizers';
      }
    },
    async createOrganizer() {
      try {
        const token = this.$store.state.token;
        const response = await axios.post('http://localhost:80/api/organizers', this.currentOrganizer, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.organizers.push(response.data);
        this.resetForm();
      } catch (error) {
        this.error = 'Failed to create organizer';
        console.error('Error creating organizer:', error);
      }
    },
    async updateOrganizer() {
      try {
        const token = this.$store.state.token;
        await axios.put(`http://localhost:80/api/organizers/${this.editingOrganizerId}`, this.currentOrganizer, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const index = this.organizers.findIndex(org => org.id === this.editingOrganizerId);
        if (index !== -1) {
          this.organizers[index].name = this.currentOrganizer.name;
        }
        this.resetForm();
      } catch (error) {
        this.error = 'Failed to update organizer';
        console.error('Error updating organizer:', error);
      }
    },
    async deleteOrganizer(organizerId) {
      try {
        const token = this.$store.state.token;
        await axios.delete(`http://localhost:80/api/organizers/${organizerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.organizers = this.organizers.filter(organizer => organizer.id !== organizerId);
      } catch (error) {
        this.error = 'Failed to delete organizer';
        console.error('Error deleting organizer:', error);
      }
    },
    editOrganizer(organizer) {
      this.currentOrganizer.name = organizer.name;
      this.isEditing = true;
      this.editingOrganizerId = organizer.id;
    },
    cancelEdit() {
      this.resetForm();
    },
    resetForm() {
      this.currentOrganizer.name = '';
      this.isEditing = false;
      this.editingOrganizerId = null;
      this.error = null;
    }
  },
  created() {
    if (this.isAuthenticated) {
      this.fetchOrganizers();
    } else {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.organizers-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.organizer-list {
  margin-bottom: 30px;
}

.organizer-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.organizer-details {
  flex-grow: 1;
}

.organizer-actions {
  display: flex;
  gap: 10px;
}

.edit-btn,
.delete-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-btn {
  background-color: #007bff;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.organizer-form {
  display: flex;
  flex-direction: column;
}

.organizer-form input {
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.organizer-form button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #28a745;
  color: white;
  cursor: pointer;
  margin-top: 10px;
}

.organizer-form button:hover {
  background-color: #218838;
}

.error-message {
  color: red;
  text-align: center;
}
</style>
