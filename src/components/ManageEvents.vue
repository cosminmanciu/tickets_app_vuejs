<template>
  <div class="events-container">
    <h2 class="title">Manage Events</h2>

    <!-- Event List -->
    <div class="event-list">
      <ul>
        <li v-for="event in events" :key="event.id" class="event-item">
          <div class="event-details">
            <h3>{{ event.name }}</h3>
            <p>Date: {{ formatDate(event.date) }}</p>
            <p>Organizer: {{ event.organizer.name }}</p>
          </div>
          <div class="event-actions">
            <button class="edit-btn" @click="editEvent(event)">Edit</button>
            <button class="delete-btn" @click="deleteEvent(event.id)">Delete</button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Form for Creating/Updating Event -->
    <form @submit.prevent="isEditing ? updateEvent() : createEvent()" class="event-form">
      <h3>{{ isEditing ? 'Edit Event' : 'Create Event' }}</h3>
      <input v-model="currentEvent.name" placeholder="Event Name" required />
      <input v-model="currentEvent.date" type="date" required />
      <select v-model="currentEvent.organizerId" required>
        <option disabled value="">Select Organizer</option>
        <option v-for="organizer in organizers" :key="organizer.id" :value="organizer.id">
          {{ organizer.name }}
        </option>
      </select>
      <button type="submit">{{ isEditing ? 'Update Event' : 'Create Event' }}</button>
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
      events: [],
      organizers: [],
      currentEvent: {
        name: '',
        date: '',
        organizerId: ''
      },
      isEditing: false,
      editingEventId: null,
      error: null
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    async fetchEvents() {
      try {
        const token = this.$store.state.token;
        const response = await axios.get('http://localhost:80/api/events', {
          headers: {Authorization: `Bearer ${token}`}
        });
        this.events = response.data;
      } catch (error) {
        this.error = 'Failed to fetch events';
        console.error('Error fetching events:', error);
      }
    },
    async fetchOrganizers() {
      try {
        const token = this.$store.state.token;
        const response = await axios.get('http://localhost:80/api/organizers', {
          headers: {Authorization: `Bearer ${token}`}
        });
        this.organizers = response.data;
      } catch (error) {
        this.error = 'Failed to fetch organizers';
        console.error('Error fetching organizers:', error);
      }
    },
    async createEvent() {
      try {
        const token = this.$store.state.token;
        const response = await axios.post('http://localhost:80/api/events', this.currentEvent, {
          headers: {Authorization: `Bearer ${token}`}
        });
        this.events.push(response.data);
        this.resetForm();
      } catch (error) {
        this.error = 'Failed to create event';
        console.error('Error creating event:', error);
      }
    },
    async updateEvent() {
      try {
        const token = this.$store.state.token;
        await axios.put(`http://localhost:80/api/events/${this.editingEventId}`, this.currentEvent, {
          headers: {Authorization: `Bearer ${token}`}
        });
        const index = this.events.findIndex(event => event.id === this.editingEventId);
        if (index !== -1) {
          this.events[index] = {...this.currentEvent, id: this.editingEventId};
        }
        this.resetForm();
      } catch (error) {
        this.error = 'Failed to update event';
        console.error('Error updating event:', error);
      }
    },
    async deleteEvent(eventId) {
      try {
        const token = this.$store.state.token;
        await axios.delete(`http://localhost:80/api/events/${eventId}`, {
          headers: {Authorization: `Bearer ${token}`}
        });
        this.events = this.events.filter(event => event.id !== eventId);
      } catch (error) {
        this.error = 'Failed to delete event';
        console.error('Error deleting event:', error);
      }
    },
    editEvent(event) {
      this.currentEvent = {...event, organizerId: event.organizer.id};
      this.isEditing = true;
      this.editingEventId = event.id;
    },
    cancelEdit() {
      this.resetForm();
    },
    resetForm() {
      this.currentEvent = {name: '', date: '', organizerId: ''};
      this.isEditing = false;
      this.editingEventId = null;
      this.error = null;
    },
    formatDate(dateString) {
      const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  },
  created() {
    if (this.isAuthenticated) {
      this.fetchEvents();
      this.fetchOrganizers();
    } else {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.events-container {
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

.event-list {
  margin-bottom: 30px;
}

.event-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-details {
  flex-grow: 1;
}

.event-actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
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

.event-form {
  display: flex;
  flex-direction: column;
}

.event-form input,
.event-form select {
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.event-form button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #28a745;
  color: white;
  cursor: pointer;
  margin-top: 10px;
}

.event-form button:hover {
  background-color: #218838;
}

.error-message {
  color: red;
  text-align: center;
}
</style>
