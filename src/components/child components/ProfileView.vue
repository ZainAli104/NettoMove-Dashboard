<template>
  <div class="dashboard">
    <v-dialog v-model="isLoading" max-width="600" width="200" persistent>
          <v-card style="padding: 20px; text-align: left; display: flex; align-items: center">
              <v-progress-circular indeterminate color="green" />
              <p style="margin-left: 20px; margin-bottom: 0;"> Please wait</p>
          </v-card>
    </v-dialog>

    <v-card class="mx-auto pa-6" :loading="isLoading" max-width="700">
      <v-subheader class="py-0 mb-3 d-flex justify-space-between rounded-lg">
        <v-card-title style="color: green">Personal Information</v-card-title>
        <v-btn color="success" @click="changeRouter"> Edit Profile </v-btn>
      </v-subheader>
      <v-divider></v-divider>

      <v-col class="profile_main">
        <v-avatar size="160" class="avatar_color">
          <v-img id="myimg" :src="imgUrl" ><v-icon size="150" v-if="!imgUrl">mdi-account</v-icon></v-img>
        </v-avatar>
      </v-col>
      <v-divider></v-divider>
      <v-col class="d-flex mt-5">
        <v-icon>mdi-account</v-icon>
        <v-card-text>Name</v-card-text>
        <v-card-text>{{ displayName() }}</v-card-text>
      </v-col>
      <v-divider inset></v-divider>
      <v-col class="d-flex">
        <v-icon>mdi-email</v-icon>
        <v-card-text>Email</v-card-text>
        <v-card-text>{{ userEmail }}</v-card-text>
      </v-col>
      <v-divider inset></v-divider>
      <v-col class="d-flex">
        <v-icon>mdi-calendar-blank</v-icon>
        <v-card-text>Date of birth</v-card-text>
        <v-card-text>{{ date || 'Null' }}</v-card-text>
      </v-col>
      <v-divider inset></v-divider>
      <v-col class="d-flex">
        <v-icon>mdi-phone</v-icon>
        <v-card-text>Phone</v-card-text>
        <v-card-text>{{ phoneNumber || "Null" }}</v-card-text>
      </v-col>
      <v-divider inset></v-divider>
      <v-col class="d-flex">
        <v-icon>mdi-map-marker</v-icon>
        <v-card-text>Address</v-card-text>
        <v-card-text>{{ address || "Null" }}</v-card-text>
      </v-col>
      <v-divider inset></v-divider>
      <v-col class="d-flex">
        <v-icon>mdi-message-text</v-icon>
        <v-card-text>Bio</v-card-text>
        <v-card-text>{{ bio || "Null" }}</v-card-text>
      </v-col>
    </v-card>
  </div>
</template>

<script>
import { db } from '../../firebase.js';
import { doc, getDoc } from '@firebase/firestore';

export default {
  data() {
    return {
      user: {},
      firstName: null,
      lastName: null,
      phoneNumber: null,
      address: null,
      date: null,
      bio: null,
      imgUrl: null,
      isLoading: false
    };
  },
  mounted() {
    this.$store.dispatch("changeTitle", "Profile");
    this.user = JSON.parse(localStorage.getItem("user"));
    this.loadData();
  },
  computed: {
    userEmail() {
      return this.user.email;
    },
    firstName_1() {
      return this.firstName
    },
    lastName_1() {
      return this.lastName
    },
  },
  methods: {
    displayName() {
      if (this.firstName === '') {
        return '__'
      } else {
        return this.firstName_1 + " " + this.lastName_1
      }
    },
    changeRouter() {
      this.$router.push("/profile/edit");
    },
    async loadData() {
      try {
        this.isLoading = true
        const id = this.user.userId;
        const docRef = doc(db, 'Users', id);
        const snapShot = await getDoc(docRef);
        if (snapShot.exists()) {
          this.firstName = snapShot.data().firstName
          this.lastName = snapShot.data().lastName
          this.phoneNumber = snapShot.data().phoneNumber
          this.address = snapShot.data().address
          this.date = snapShot.data().dateOfBirth
          this.bio = snapShot.data().bio
          this.imgUrl = snapShot.data().imgUrl
          this.isLoading = false
        }
        else {
          console.log('no doc')
        }
      }
      catch (err) {
        console.log(err.message, 'error')
      }
    },
  },
};
</script>

<style scoped>
.profile_main {
  display: flex;
  flex-direction: column-reverse;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}
.avatar_color {
  background-color: rgb(198, 198, 198);
}
</style>