<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" width="247px" app>
      <div class="green lighten-2">
        <div class="text-center">
          <v-avatar class="mb-4 my-4" color="grey darken-1" size="64">
            <v-img
              aspect-ratio="30"
              :src="imgUrl"
            />
          </v-avatar>
          <h2 class="white--text">{{ main_title }}</h2>
        </div>
      </div>
      <v-divider></v-divider>
      <v-list class="rounded-xl">
        <v-list-item
          v-for="route in routes"
          :key="route.title"
          :to="route.to"
          dense
          link
          class="my-3 route_main"
          color="green"
        >
          <div class="route">
            <v-list-item-icon>
              <v-icon size="20">{{ route.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content class="ml-0">
              <v-list-item-title style="font-size: 13px">{{
                route.title
              }}</v-list-item-title>
            </v-list-item-content>
          </div>
        </v-list-item>
      </v-list>

      <!-- <v-menu nudge-right="250px">
        <template v-slot:activator="{ attrs, on }">
          <div class="route nav_user" v-bind="attrs" v-on="on">
            <v-badge dot bottom :color="$online? 'green':'red'" offset-y="10" offset-x="10">
              <v-avatar size="40" class="user_icon">
                <v-img :src="imgUrl" v-if="imgUrl" />
                <h3 class="avatar_popup_1" v-else>{{ resolveLetter }}</h3>
              </v-avatar>
            </v-badge>
            <span class="ml-3">{{ displayName() }}</span>
          </div>
        </template>
        <v-card class="py-0 d-flex justify-center flex-column align-center">
          <v-avatar class="margin_top">
            <h3 class="avatar_popup_1">{{ resolveLetter }}</h3>
          </v-avatar>
          <v-divider />
          <v-list-item-content class="user_dialog_title">
            <v-list-item-title>{{ displayName() }}</v-list-item-title>
            <v-list-item-subtitle>{{ displayEmail || 'Email' }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-card>
      </v-menu> -->
    </v-navigation-drawer>

    <!-- top bar -->
    <v-app-bar app elevate-on-scroll elevation="3" class="color_top">
      <v-app-bar-nav-icon @click="drawerEvent" dark></v-app-bar-nav-icon>
      <div class="text-center">
        <h2 class="white--text">{{ main_title }}</h2>
      </div>
      <v-spacer />

      <v-menu offset-y>
        <template v-slot:activator="{ attrs, on }">
          <span style="cursor: pointer" v-bind="attrs" v-on="on">
            <v-chip link>
              <v-badge dot bottom :color="$online? 'green':'red'" offset-y="10" offset-x="6">
                <v-avatar size="40">
                  <!-- <v-img
                    src="https://randomuser.me/api/portraits/women/81.jpg"
                  /> -->
                  <h3 class="avatar_popup">{{ resolveLetter }}</h3>
                </v-avatar>
              </v-badge>
              <span class="ml-3">{{ displayName() }}</span>
            </v-chip>
          </span>
        </template>
        <v-list width="250" class="py-0">
          <v-list-item two-line>
            <v-list-item-avatar>
              <!-- <img src="https://randomuser.me/api/portraits/women/81.jpg" /> -->
              <h4 class="avatar_popup" style="width: 40px; font-size: 20px">
                {{ resolveLetter }}
              </h4>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ displayName() }}</v-list-item-title>
              <v-list-item-subtitle>{{ displayEmail || 'Email' }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-list-item link v-for="(menu, i) in menus" :key="i" @click="logOut(menu.title)">
            <v-list-item-icon>
              <v-icon>{{ menu.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title> {{ menu.title }} </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main style="background: #f5f5f540">
      <v-container class="py-8 px-6" fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "Topbar",
  data() {
    return {
      showUserInfo: true,
      drawer: null,
      menus: [
        { title: "Profile", icon: "mdi-account" },
        { title: "Logout", icon: "mdi-logout" },
      ],
      user: {},
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    if (this.$store.getters.firstName === '') {
      const userInfo = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        imgUrl: this.user.imgUrl
      };
      this.$store.dispatch("changeInfo", userInfo);
    }
  },
  computed: {
    displayEmail() {
      return this.user.email;
    },
    firstName() {
      return this.$store.getters.firstName
    },
    lastName() {
      return this.$store.getters.lastName
    },
    main_title() {
      return this.$store.getters.title;
    },
    resolveLetter() {
      return this.$store.getters.resolveLetter
    },
    imgUrl() {
      return this.$store.getters.imgUrl
    },
    routes() {
      return [
        {
          to: "/",
          title: "Dashboard",
          icon: "mdi-microsoft-windows",
          isVisible: true,
        },
        {
          to: "/companies",
          title: "Companies",
          icon: "mdi-city",
          isVisible: true,
        },
        // {
        //   to: "/orders",
        //   title: "Orders",
        //   icon: "mdi-card-account-details-outline",
        //   isVisible: true,
        // },
        {
          to: "/profile",
          title: "User Profile",
          icon: "mdi-account",
          isVisible: true,
        },
        {
          to: "/setting",
          title: "System Setting",
          icon: "mdi-cog",
          isVisible: true,
        },
      ];
    },
  },
  methods: {
    drawerEvent() {
      this.drawer = !this.drawer;
    },
    showUserDialog() {
      console.log("ok");
    },
    displayName() {
      if (this.firstName === '') {
        return 'Name'
      } else {
        return this.firstName + " " + this.lastName
      }
    },
    logOut(p) {
      if ('Logout' === p) {
        localStorage.removeItem("user");
        this.$router.push("/auth");
      } else if ('Profile' === p) {
        this.$router.push('/profile')
      }
    },
  }
};
</script>

<style scoped>
.route_main {
  max-width: 90%;
  margin-left: 10px;
  border-radius: 8px;
}

.v-list-item--link:before {
  color: rgb(0, 46, 0);
  border-radius: 8px;
}

.route {
  display: flex;
  flex-direction: row;
}

.nav_user {
  background-color: rgb(158, 225, 158);
  margin-top: 7.5rem;
  cursor: pointer;
  max-width: 90%;
  margin-left: 10px;
  border-radius: 8px;
  max-height: 60px;
  padding: 4px;

  display: flex;
  flex-direction: row;
  align-items: center;
}

@media (max-width: 980px) {
  .nav_user {
    margin-top: 0;
  }
}

.user_icon {
  margin-left: 5px;
}

.user_dialog {
  margin-left: 272px;
  z-index: -999;
  padding-inline: 25px;
}

.user_dialog_title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.avatar_popup {
  background-color: rgb(109, 193, 109);
  padding: 10px;
  margin-left: 1px;
}

.avatar_popup_1 {
  background-color: rgb(109, 193, 109);
  padding: 25px;
  margin-left: 1px;
}

.avatar_img {
  margin: 10px;
  padding: 10px;
  background-color: rgb(109, 193, 109);
  border-radius: 50px;
  width: 10px;
}

.margin_top {
  margin-top: 3px;
}

.color_top {
  background: linear-gradient(to right, rgb(7, 152, 7), rgb(60, 195, 60));
}
</style>  