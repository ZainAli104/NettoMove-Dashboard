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

    <v-card class="mx-auto pa-6" :loading="loading" max-width="700">
      <v-subheader class="py-0 mb-3 d-flex justify-space-between rounded-lg">
        <v-card-title style="color: green">Company Details</v-card-title>
        <v-btn color="success" @click="routerBack"> Back </v-btn>
      </v-subheader>
      <v-divider></v-divider>

      <v-col class="d-flex mt-5">
        <v-icon>mdi-account</v-icon>
        <v-card-text>Name</v-card-text>
        <v-card-text>{{ companyName }}</v-card-text>
      </v-col>
      <v-divider inset></v-divider>
      <v-col class="d-flex">
        <v-icon>mdi-email</v-icon>
        <v-card-text>Email</v-card-text>
        <v-card-text>{{ companyEmail }}</v-card-text>
      </v-col>
      <v-divider inset></v-divider>
      <v-col class="d-flex">
        <v-icon>mdi-phone</v-icon>
        <v-card-text>Phone</v-card-text>
        <v-card-text>{{ companyPhone }}</v-card-text>
      </v-col>
      <v-divider inset></v-divider>
      <v-col class="d-flex">
        <v-icon>mdi-map-marker</v-icon>
        <v-card-text>Address</v-card-text>
        <v-card-text>{{ city + ', ' + state + ', ' + country }}</v-card-text>
      </v-col>

      <v-subheader
        class="py-0 mb-3 mt-4 d-flex justify-space-between rounded-lg"
      >
        <v-card-title style="color: green">Contracts</v-card-title>
        <v-btn color="success" @click="contractDialog = !contractDialog">
          New
        </v-btn>
      </v-subheader>
      <v-divider></v-divider>
      <v-card>
        <v-data-table
          :items="items"
          :headers="headers"
          hide-default-footer
          disable-pagination
        >
          <template #item.start="{ item }">
            {{ formatDate(item.start_date) }}
          </template>
          <template #item.end="{ item }">
            {{ formatDate(item.end_date) }}
          </template>
        </v-data-table>
      </v-card>
    </v-card>

    <v-dialog max-width="600" v-model="contractDialog" persistent>
      <v-card style="padding: 20px">
        <v-form ref="contractForm">
          <v-row class="flex-column span-2" style="margin-top: 20px">
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
            </v-col>
            <v-col class="pa-0 ma-0">
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
            <v-col class="pa-0 ma-0">
              <v-col>
                <v-text-field
                  :rules="[required()]"
                  type="number"
                  label="Contract Amount"
                  v-model="contract.contract_amount"
                  required
                  outlined
                >
                </v-text-field>
              </v-col>
            </v-col>
            <v-col class="pa-0 ma-0">
              <v-col class="d-flex justify-end" style="gap: 15px">
                <v-btn
                  outlined
                  color="primary"
                  elevation="0"
                  @click="contractDialog = false"
                  >Cancel
                </v-btn>
                <v-btn dark color="primary" elevation="0" @click="addContract"
                  >Add
                </v-btn>
              </v-col>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>

    <ErrorDialog v-model="error" :error="errorVal" />
  </div>
</template>

<script>
import {
  required,
  startDateValidation,
  endDateValidation,
} from "@/utils/validators";
import dayjs from "dayjs";
import ErrorDialog from "../../components/UI/ErrorDialog.vue";
import {
  doc,
  getDoc,
  updateDoc,
} from "@firebase/firestore";
import { companies, db } from "../../firebase";

export default {
  data() {
    return {
      loading: false,
      headers: [
        {
          text: "Start Date",
          value: "start",
        },
        { text: "End Date", value: "end" },
        { text: "Amount", value: "contract_amount" },
      ],
      companyName: null,
      companyEmail: null,
      companyPhone: null,
      country: null,
      state: null,
      city: null,
      items: [],
      contract: {
        start_date: null,
        end_date: null,
        contract_amount: null,
      },
      company: null,
      error: false,
      errorVal: {},
      contractDialog: false,
      dataLoading: true,
    };
  },
  methods: {
    required,
    startDateValidation,
    endDateValidation,

    async addContract() {
      if (this.$refs.contractForm.validate()) {
        try {
          this.loading = true;
          this.contract.contract_amount = parseInt(
            this.contract.contract_amount
          );
          this.contract.start_date = new Date(this.contract.start_date);
          this.contract.end_date = new Date(this.contract.end_date);
          this.company.contracts.push(this.contract);

          let companiesRef = doc(companies, this.company.id);
          await updateDoc(companiesRef, {
            contracts: this.company.contracts,
          });
          this.loadData();
          this.loading = false;
          this.contractDialog = false;
        } catch (e) {
          this.loading = false;
          this.error = true;
          this.errorVal = {
            title: "Error adding new contract",
            description:
              e?.error || e?.message || "Some error occured. Try again later.",
          };
        }
      }
    },

    
    async loadData() {
      try {
        this.loading = true;
        const docRef = doc(db, "Companies", this.$route.query.id.toString());
        const company = await getDoc(docRef);
        if (company.exists()) {
          this.company = { id: company.id, ...company.data() };
          this.companyPhone = company.data().phone || "No Phone";
          this.companyName = company.data().name;
          this.companyEmail = company.data().email;
          this.country = company.data().country;
          this.state = company.data().state;
          this.city = company.data().city;
          this.items = company.data().contracts;
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.error = true;
        this.errorVal = {
          title: "Error adding new contract",
          description:
            e?.error || e?.message || "Some error occured. Try again later.",
        };
      }
      this.dataLoading = false;
    },

    formatDate(date) {
      return dayjs(date.seconds * 1000).format("DD/MMM/YYYY");
    },
    routerBack() {
      this.$router.push("/companies");
    },
  },
  mounted() {
    this.loadData()
  },
  components: { ErrorDialog },
};
</script>