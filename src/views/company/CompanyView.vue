<template>
  <v-col>
    <v-card>
      <v-tabs v-model="tab">
        <v-tab @change="changeTabs()" v-for="item in items" :key="item.id">
          {{ item.tab }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in items" :key="item.id">
          <DataTable
            :headers="headers"
            :title="item.title"
            :allow-add="allowAdd"
            @add-new="add"
            :edit-handler="edit"
            :view-handler="view"
            :delete-handler="del"
            :loader="loadData"
          >
          </DataTable>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-col>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import { deleteDoc, doc, getDocs } from "@firebase/firestore";
import { companies } from "../../firebase";
import dayjs from "dayjs";

export default {
  name: "Companies",
  data() {
    return {
      allowAdd: true,
      tab: 0,
      items: [
        {
          id: "1",
          tab: "Activated Companies",
          title: "Activated Companies",
        },
        {
          id: "2",
          tab: "Deactivated Companies",
          title: "Deactivated Companies",
        },
      ],
      headers: [
        { text: "Company Name ", value: "name" },
        { text: "Company Email", value: "email" },
        { text: "Company City", value: "city" },
      ],
    };
  },
  methods: {
    formatDate(date) {
      return dayjs(date.seconds).format("DD/MM/YYYY");
    },
    edit(item) {
      this.$router.push('/companyEdit?id=' + item.id);
    },
    view(item) {
      this.$router.push('/companyDetail?id=' + item.id);
    },
    async del(item) {
      let companyRef = doc(companies, item.id)
      await deleteDoc(companyRef)

      this.loadData()
    },
    add() {
      this.$router.push("/company");
    },
    async loadData() {
      var isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
      dayjs.extend(isSameOrBefore);

      try {
        const snapshot = await getDocs(companies);
        const data = [];
        snapshot.docs.map((e) => {
          data.push({ id: e.id, ...e.data() });
        });

        if (this.tab == 0) {
          const filterData = data.filter((school) => {
            const date = new Date(1970, 0, 1);
            date.setSeconds(
              school.contracts[school.contracts.length - 1].end_date.seconds
            );
            const current = new Date();
            current.setHours(0, 0, 0, 0);
            return dayjs(current).isSameOrBefore(dayjs(date));
          });

          return filterData;
        } else {
          const filterData = data.filter((school) => {
            const date = new Date(1970, 0, 1);
            date.setSeconds(
              school.contracts[school.contracts.length - 1].end_date.seconds
            );
            const current = new Date();
            current.setHours(0, 0, 0, 0);
            return dayjs(current).isAfter(dayjs(date));
          });

          return filterData;
        }
      } catch (e) {
        console.log(e);
      }
    },
    changeTabs() {
      if (this.tab == 0) {
        this.allowAdd = false;
      } else {
        this.allowAdd = true;
      }
    },
  },
  mounted() {
    this.$store.dispatch("changeTitle", "Companies");
  },
  components: {
    DataTable,
  },
};
</script>
