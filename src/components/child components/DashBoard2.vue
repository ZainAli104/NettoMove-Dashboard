<template>
  <div class="dashboard">
    <v-subheader class="py-0 d-flex justify-space-between rounded-lg">
      <h3>Dashboard</h3>
      <v-btn color="success" @click="changeRouter"> Companies </v-btn>
    </v-subheader>
    <br />
    <v-row>
      <v-col lg="7" cols="12">
        <v-alert dense text type="success" v-if="showPopUp"> Login Successfully! </v-alert>
        <v-row>
          
          <v-col
            cols="12"
          >
            <v-card elevation="2" class="rounded-lg sub_container">
              <v-card-text class="d-flex justify-space-between align-center">
                <div>
                  <strong>Active Companies</strong> <br/>
                </div>
                <v-avatar
                  size="60"
                  color="cyan lighten-3"
                  style="border: 3px solid #444"
                >
                  <span style="color: white">{{ showActiveC }} +</span>
                </v-avatar>
              </v-card-text>
              <v-card-actions class="d-flex justify-space-between">
              </v-card-actions>
            </v-card>

            <v-card elevation="2" class="rounded-lg sub_container">
              <v-card-text class="d-flex justify-space-between align-center">
                <div>
                  <strong>Deactivated Companies</strong> <br/>
                </div>
                <v-avatar
                  size="60"
                  color="green darken-2"
                  style="border: 3px solid #444"
                >
                  <span style="color: white">{{ showDeActiveC }} +</span>
                </v-avatar>
              </v-card-text>
              <v-card-actions class="d-flex justify-space-between">
              </v-card-actions>
            </v-card>
            
            <v-card elevation="2" class="rounded-lg sub_container">
              <v-card-text class="d-flex justify-space-between align-center">
                <div>
                  <strong>Total Companies</strong> <br/>
                </div>
                <v-avatar
                  size="60"
                  color="blue-grey darken-1"
                  style="border: 3px solid #444"
                >
                  <span style="color: white">{{ showTotalCompanies }} +</span>
                </v-avatar>
              </v-card-text>
              <v-card-actions class="d-flex justify-space-between">
              </v-card-actions>
            </v-card>
          </v-col>

        </v-row>
      </v-col>
      <v-col cols="12" lg="5">
        <v-card>
          <v-card-title>Activities</v-card-title>
          <v-card-text class="py-0">
            <v-timeline align-top dense>
              <v-timeline-item color="indigo" small>
                <strong>5 Minuts ago</strong>
                <div class="text-caption">
                  You have added new company
                </div>
              </v-timeline-item>
              <v-timeline-item color="green" small>
                <strong>35 Minuts ago</strong>
                <div class="text-caption mb-2">A company has deleted!</div>
              </v-timeline-item>

              <v-timeline-item color="indigo" small>
                <strong>44 Minuts ago</strong>
                <div class="text-caption">
                  You have new order please check this out
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      activityLog: [
        {
          title: "Active Companies",
          amount: this.showActiveC,
          icon: "mdi-account",
          color: "cyan lighten-3",
        },
        {
          title: "Deactivated Companies",
          amount: 34,
          icon: "mdi-account-group-outline",
          color: "green darken-2",
        },
        {
          title: "Total Companies",
          amount: 34,
          icon: "mdi-account-group-outline",
          color: "blue-grey darken-1",
        },
        {
          title: "Pending Companies",
          amount: 3433,
          icon: "mdi-account-group-outline",
          color: "deep-orange darken-1",
        },
      ],
      headers: [
        {
          text: "Dessert (100g serving)",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Calories", value: "calories" },
        { text: "Fat (g)", value: "fat" },
        { text: "Carbs (g)", value: "carbs" },
        { text: "Protein (g)", value: "protein" },
        { text: "Iron (%)", value: "iron" },
        { text: "Actions", value: "action" },
      ],
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: "1%",
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: "1%",
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: "7%",
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: "8%",
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: "16%",
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: "0%",
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: "2%",
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: "45%",
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: "22%",
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: "6%",
        },
      ],
    };
  },
  mounted() {
    this.$store.dispatch("changeTitle", "Dashboard");
  },
  computed: {
    showPopUp() {
      return this.$store.getters.showLogInPopUp
    },
    showActiveC() {
      return this.$store.getters.showActiveCom
    },
    showDeActiveC() {
      return this.$store.getters.showDeActiveCom
    },
    showTotalCompanies() {
      return this.$store.getters.totalCompanies
    },
  },
  methods: {
    changeRouter() {
      this.$router.replace("/companies");
    },
    editItem(item) {
      console.log(item);
    },
    deleteItem(item) {
      this.showDialog = true;
      console.log(item);
    },
    disAgree() {
      this.showDialog = false;
    },
    agree() {
      this.showDialog = false;
    },
    addItem() {
      //add new item function
      console.log('ok')
    },
    refreshData() {
      console.log('ok')
    }
  },
};
</script>

<style scoped>
.overlap-icon {
  position: absolute;
  top: -33px;
  text-align: center;
  padding-top: 12px;
}
.sub_container {
  margin-bottom: 15px;
}
</style>