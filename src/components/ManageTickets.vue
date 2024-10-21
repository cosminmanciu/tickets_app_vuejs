<template>
  <div class="tickets-container">
    <h2 class="title">Manage Tickets</h2>


    <div class="ticket-list">
      <ul>
        <li v-for="ticket in tickets" :key="ticket.id" class="ticket-item">
          <div class="ticket-details">
            <h3>{{ ticket.name }} - Price: {{ ticket.price }}</h3>
            <p>Event: {{ ticket.event.name }}</p>
          </div>
          <div class="ticket-actions">
            <button class="edit-btn" @click="editTicket(ticket)">Edit</button>
            <button class="delete-btn" @click="deleteTicket(ticket.id)">Delete</button>
          </div>
        </li>
      </ul>
    </div>

    <form @submit.prevent="isEditing ? updateTicket() : createTicket()" class="ticket-form">
      <h3>{{ isEditing ? 'Edit Ticket' : 'Create Ticket' }}</h3>
      <input v-model="currentTicket.name" placeholder="Ticket Name" required />
      <input v-model="currentTicket.price" type="number" placeholder="Ticket Price" required />

      <select v-model="currentTicket.eventId" required>
        <option disabled value="">Select Event</option>
        <option v-for="event in events" :key="event.id" :value="event.id">
          {{ event.name }}
        </option>
      </select>

      <button type="submit">{{ isEditing ? 'Update Ticket' : 'Create Ticket' }}</button>
      <button v-if="isEditing" type="button" @click="cancelEdit">Cancel</button>
    </form>

    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      tickets: [],
      events: [],
      currentTicket: { name: '', price: '', eventId: '' },
      isEditing: false,
      editingTicketId: null,
      error: null
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    async fetchTickets() {
      try {
        const token = this.$store.state.token;
        const response = await axios.get('http://localhost:80/api/tickets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.tickets = response.data;
      } catch (error) {
        this.error = 'Failed to fetch tickets';
        console.error('Error fetching tickets:', error);
      }
    },
    async fetchEvents() {
      try {
        const token = this.$store.state.token;
        const response = await axios.get('http://localhost:80/api/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.events = response.data;
      } catch (error) {
        this.error = 'Failed to fetch events';
        console.error('Error fetching events:', error);
      }
    },
    async createTicket() {
      try {
        const token = this.$store.state.token;
        const response = await axios.post('http://localhost:80/api/tickets', this.currentTicket, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.tickets.push(response.data);
        this.resetForm();
      } catch (error) {
        this.error = 'Failed to create ticket';
        console.error('Error creating ticket:', error);
      }
    },
    async updateTicket() {
      try {
        const token = this.$store.state.token;
        await axios.put(`http://localhost:80/api/tickets/${this.editingTicketId}`, this.currentTicket, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const index = this.tickets.findIndex(ticket => ticket.id === this.editingTicketId);
        if (index !== -1) {
          this.tickets[index] = { ...this.tickets[index], ...this.currentTicket };
        }
        this.resetForm();
      } catch (error) {
        this.error = 'Failed to update ticket';
        console.error('Error updating ticket:', error);
      }
    },
    async deleteTicket(ticketId) {
      try {
        const token = this.$store.state.token;
        await axios.delete(`http://localhost:80/api/tickets/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.tickets = this.tickets.filter(ticket => ticket.id !== ticketId);
      } catch (error) {
        this.error = 'Failed to delete ticket';
        console.error('Error deleting ticket:', error);
      }
    },
    editTicket(ticket) {
      this.currentTicket = { name: ticket.name, price: ticket.price, eventId: ticket.event.id };
      this.isEditing = true;
      this.editingTicketId = ticket.id;
    },
    cancelEdit() {
      this.resetForm();
    },
    resetForm() {
      this.currentTicket = { name: '', price: '', eventId: '' };
      this.isEditing = false;
      this.editingTicketId = null;
      this.error = null;
    }
  },
  created() {
    if (this.isAuthenticated) {
      this.fetchTickets();
      this.fetchEvents();
    } else {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.tickets-container {
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

.ticket-list {
  margin-bottom: 30px;
}

.ticket-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-details {
  flex-grow: 1;
}

.ticket-actions {
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

.ticket-form {
  display: flex;
  flex-direction: column;
}

.ticket-form input,
.ticket-form select {
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.ticket-form button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #28a745;
  color: white;
  cursor: pointer;
  margin-top: 10px;
}

.ticket-form button:hover {
  background-color: #218838;
}

.error-message {
  color: red;
  text-align: center;
}
</style>
