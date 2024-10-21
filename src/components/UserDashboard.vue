<template>
  <div class="dashboard-container">
    <header class="header">
      <h1>Welcome, {{ username }}</h1>
      <nav>
        <ul class="nav-links">
          <li><router-link to="/manage-events">Manage Events</router-link></li>
          <li><router-link to="/manage-tickets">Manage Tickets</router-link></li>
          <li><router-link to="/manage-organizers">Manage Organizers</router-link></li>
        </ul>
      </nav>
      <button @click="logout" class="logout-button">Logout</button>
    </header>

    <section class="content">
      <h2>Admin Dashboard</h2>
      <div class="summary-cards">
        <div class="card">
          <h3>Total Events</h3>
          <p>{{ eventCount }}</p>
        </div>
        <div class="card">
          <h3>Total Tickets</h3>
          <p>{{ ticketCount }}</p>
        </div>
        <div class="card">
          <h3>Total Organizers</h3>
          <p>{{ organizerCount }}</p>
        </div>
      </div>

      <div class="recent-activity">
        <h2>Recent Activities</h2>
        <ul>
          <li v-for="activity in recentActivities" :key="activity.id">
            {{ activity.description }} on {{ formatDate(activity.date) }}
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      eventCount: 0,
      ticketCount: 0,
      organizerCount: 0,
      recentActivities: [],
      user: null,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    username() {
      console.log(this.user)
      return this.user ? this.user.email : 'User';
    }
  },
  created() {
    if (!this.isAuthenticated) {
      this.$router.push('/login');
    } else {
      this.fetchMe();
      this.fetchData();
    }
  },
  methods: {
    async fetchMe() {
      try {
        const token = this.$store.state.token;
        const response = await axios.get('http://localhost:80/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.user = response.data;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    },
    async fetchData() {
      try {
        const token = this.$store.state.token;

        const eventsResponse = await axios.get('http://localhost:80/api/events', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.eventCount = eventsResponse.data.length;

        const ticketsResponse = await axios.get('http://localhost:80/api/tickets', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.ticketCount = ticketsResponse.data.length;

        const organizersResponse = await axios.get('http://localhost:80/api/organizers', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.organizerCount = organizersResponse.data.length;

        this.recentActivities = [
          ...eventsResponse.data.map(event => ({
            id: event.id,
            description: `Created event: ${event.name}`,
            date: event.createdAt
          })),
          ...organizersResponse.data.map(organizer => ({
            id: organizer.id,
            description: `Added organizer: ${organizer.name}`,
            date: organizer.createdAt
          }))
        ].slice(0, 5);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$store.commit('setToken', null);

      this.$router.push('/login');
    },
    formatDate(dateString) {
      const options = {year: 'numeric', month: 'long', day: 'numeric'};
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  max-width: 1200px;
  margin: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.nav-links {
  list-style: none;
  padding: 0;
}

.nav-links li {
  display: inline;
  margin: 0 15px;
}

.logout-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
}

.logout-button:hover {
  background-color: #d32f2f;
}

.summary-cards {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  flex: 1;
  margin: 0 10px;
  transition: transform 0.2s;
}

.card:hover {
  transform: scale(1.05);
}

.recent-activity {
  margin-top: 40px;
}

.recent-activity ul {
  list-style: none;
  padding: 0;
}

.recent-activity li {
  margin: 10px 0;
}
</style>
