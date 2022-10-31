<template>
  <div class="dashboard">
    <v-dialog v-model="loading" max-width="600" width="200" persistent>
      <v-card
        style="
          padding: 20px;
          text-align: left;
          display: flex;
          align-items: center;
        "
      >
        <v-progress-circular indeterminate color="green" />
        <p style="margin-left: 20px; margin-bottom: 0">Please wait</p>
      </v-card>
    </v-dialog>

    <!-- Company resgistration -->
    <v-card class="mx-auto pa-6" max-width="800">
      <v-col class="pa-0 ma-0">
        <v-col class="d-flex justify-end" style="gap: 15px">
          <router-link to="/companies">
            <v-btn dark color="primary" elevation="0">Back</v-btn>
          </router-link>
        </v-col>
      </v-col>
      <v-card-title class="justify-center" style="font-size: 28px"
        >Company Detail</v-card-title
      >
      <v-form @submit.prevent="update" lazy-validation ref="form">
        <v-col class="d-flex pa-0 ma-0">
          <v-col>
            <v-text-field
              :rules="[required()]"
              v-model="company.name"
              label="Company Name"
              outlined
            >
            </v-text-field>
          </v-col>

          <v-col>
            <v-text-field
              :rules="[required()]"
              hide-spin-buttons
              type="number"
              v-model="company.phone"
              label="Company Phone #"
              outlined
            >
            </v-text-field>
          </v-col>
        </v-col>

        <v-col class="d-flex pa-0 ma-0">
          <v-col>
            <v-text-field
              :rules="[required(), email()]"
              type="email"
              v-model="company.email"
              label="Company Email"
              outlined
            >
            </v-text-field>
          </v-col>

          <v-col cols="6">
            <v-autocomplete
              :rules="[required()]"
              v-model="company.country"
              aria-autocomplete="false"
              label="Country"
              :loading="countriesLoading"
              :items="countries"
              item-text="name"
              outlined
              @change="getStates"
              return-object
              :valueComparator="(a, b) => a === b"
            ></v-autocomplete>
          </v-col>
        </v-col>

        <v-col class="d-flex pa-0 ma-0">
          <v-col cols="6">
            <v-autocomplete
              :rules="[required()]"
              aria-autocomplete="false"
              v-model="company.state"
              :loading="statesLoading"
              label="State"
              :items="states"
              item-text="name"
              outlined
              @change="getCities"
              :valueComparator="(a, b) => a === b"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="6">
            <v-autocomplete
              :rules="[required()]"
              aria-autocomplete="false"
              v-model="company.city"
              :loading="citiesLoading"
              label="City"
              :items="cities"
              item-text="name"
              outlined
              :valueComparator="(a, b) => a === b"
            >
            </v-autocomplete>
          </v-col>
        </v-col>

        <v-col>
          <v-btn
            v-if="required"
            :disabled="countriesLoading || statesLoading || citiesLoading"
            type="submit"
            color="primary"
            dark
          >
            Update
          </v-btn>
        </v-col>
      </v-form>
    </v-card>

    <ErrorDialog v-model="error" :error="errorVal"></ErrorDialog>
  </div>
</template>
  
<script>
import {
  required,
  email,
  startDateValidation,
  endDateValidation,
} from "@/utils/validators";
import ErrorDialog from "../../components/UI/ErrorDialog.vue";
import { companies, db } from "../../firebase";
import { updateDoc, doc, getDoc } from "@firebase/firestore";
import axios from "axios";
import dayjs from "dayjs";

export default {
  name: "CompanyReg",
  components: { ErrorDialog },

  data() {
    return {
      valid: true,
      loading: false,
      menu: false,
      emenu: false,
      error: false,
      errorVal: {},
      company: {
        isActive: true,
        name: null,
        email: null,
        phone: null,
        contracts: [],
        country: null,
        state: null,
        city: null,
      },
      countries: [],
      states: [],
      cities: [],
      countriesLoading: false,
      statesLoading: false,
      citiesLoading: false,
      hasLoadStates: false,
      hasLoadCities: false,
    };
  },

  methods: {
    email,
    required,
    startDateValidation,
    endDateValidation,
    formatDate(date) {
      return dayjs(date.seconds).format("DD/MM/YYYY");
    },

    async loadData() {
      try {
        const id = this.$route.query.id;
        const docRef = doc(db, "Companies", id.toString());
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          this.company.phone = snapshot.data().phone;
          this.company.name = snapshot.data().name;
          this.company.email = snapshot.data().email;
          this.items = snapshot.data().contracts;

          this.company.country = snapshot.data().country;
          this.company.state = snapshot.data().state;
          this.company.city = snapshot.data().city;
        } else {
          console.log("no doc");
        }
      } catch (e) {
        console.log(e);
      }
    },

    async update() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true;
          const id = this.$route.query.id;
          let schoolsRef = doc(companies, id);
          await updateDoc(schoolsRef, {
            name: this.company.name,
            phone: this.company.phone,
            email: this.company.email,
            country:
              typeof this.company.country === "object"
                ? this.company.country.name
                : this.company.country,
            state: this.company.state,
            city: this.company.city,
          });
          this.$router.push('/companies')
          this.loading = false;
        } catch (e) {
            console.log(e);
            this.loading = false;
        }
      }
    },

    async getCountries() {
      try {
        this.countriesLoading = true;
        const countries = await axios.get(
          "https://countriesnow.space/api/v0.1/countries/states"
        );
        this.countries = countries.data.data;
        this.countriesLoading = false;
      } catch (e) {
        console.log(e);
      }
      this.countriesLoading = false;
    },

    getStates() {
      this.statesLoading = true;
      if (this.hasLoadStates == true)
        (this.company.state = null), (this.company.city = null);
      if (
        this.company &&
        this.company.country &&
        typeof this.company.country === "object"
      ) {
        this.states = this.company.country.states;
      } else if (typeof this.company.country !== "object") {
        this.states = this.countries.find(
          (o) => o.name === this.company.country
        ).states;
      }
      this.statesLoading = false;
    },

    async getCities() {
      if (this.hasLoadCities == true) this.company.city = null;
      try {
        this.citiesLoading = true;
        const data = {
          country:
            typeof this.company.country === "object"
              ? this.company.country.name
              : this.company.country,
          state: this.company.state,
        };
        const cities = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          data
        );
        this.cities = cities.data.data;
        this.citiesLoading = false;
      } catch (e) {
        console.log(e);
        this.citiesLoading = false;
      }
    },
  },
  mounted() {
    this.loadData().then(() => {
      this.getCountries().then(() => {
        this.getStates();
        this.getCities();
        this.hasLoadStates = true;
        this.hasLoadCities = true;
      });
    });
  },
};
</script>