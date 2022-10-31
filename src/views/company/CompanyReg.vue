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
      <v-form @submit.prevent="register" lazy-validation ref="form">
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
            >
            </v-autocomplete>
          </v-col>
        </v-col>

        <!-- FIRST CONTRACT -->
        <v-card-title class="justify-center" style="font-size: 28px"
          >First Contract</v-card-title
        >
        <v-col class="d-flex pa-0 ma-0">
          <v-col>
            <v-text-field
              :rules="[required(), startDateValidation()]"
              outlined
              label="Contract Start Date"
              type="date"
              v-model="contract.start_date"
            >
            </v-text-field>
          </v-col>

          <v-col>
            <v-text-field
              :rules="[
                required(),
                contract.start_date
                  ? endDateValidation(contract.start_date)
                  : true,
              ]"
              outlined
              label="Contract Last Date"
              type="date"
              v-model="contract.end_date"
            >
            </v-text-field>
          </v-col>
        </v-col>
        <v-col class="d-flex pa-0 ma-0">
          <v-col cols="6">
            <v-text-field
              :rules="[required()]"
              type="number"
              hide-spin-buttons
              label="Contract Amount"
              v-model="contract.contract_amount"
              outlined
            >
            </v-text-field>
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
            Register
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
import { companies } from '../../firebase';
import { addDoc } from "@firebase/firestore";
import axios from "axios";

export default {
  name: "CompanyReg",
  components: { ErrorDialog },

  data() {
    return {
      auth_uid: null,
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
      contract: {
        start_date: null,
        end_date: null,
        contract_amount: null,
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

    async register() {
        if (this.$refs.form.validate()) {
            try {
                this.loading = true;
                this.contract.contract_amount = parseInt(
                this.contract.contract_amount
                );
                this.contract.start_date = new Date(this.contract.start_date);
                this.contract.end_date = new Date(this.contract.end_date);
                this.company.contracts.push(this.contract);
                this.company.country = this.company.country.name;

                await addDoc(companies, this.company);
                this.loading = false;
                this.$router.push('/companies')
            } catch (e) {
                this.loading = false;
                this.error = true;
                this.errorVal = {
                    title: "Error while creating company",
                    description: e || e?.message || "Some error occured",
                };
                console.log(e);
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
      if (this.company && this.company.country)
        this.states = this.company.country.states;
      this.statesLoading = false;
    },

    async getCities() {
      if (this.hasLoadCities == true) this.company.city = null;
      try {
        this.citiesLoading = true;
        const data = {
          country: this.company.country.name,
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
    this.getCountries();
    this.hasLoadStates = true;
    this.hasLoadCities = true;
  },
};
</script>