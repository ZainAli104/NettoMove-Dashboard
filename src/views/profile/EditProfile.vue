<template>
  <div class="dashboard">
    <v-dialog v-model="isLoading" max-width="600" width="200" persistent>
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

    <v-card :loading="isLoading" class="mx-auto pa-6" max-width="700">
      <v-subheader class="py-0 mb-3 d-flex justify-space-between rounded-lg">
        <v-card-title style="color: green"
          >Change Personal Information</v-card-title
        >
        <v-btn color="success" @click="changeRouter"> Back </v-btn>
      </v-subheader>
      <v-divider></v-divider>

      <v-form @submit.prevent="update" class="mt-4">
        <v-col class="profile_main">
          <v-col class="profile_btn_flex">
            <v-btn
              raised
              class="green"
              v-if="!imgUrl_check"
              dark
              @click="onClickFile"
              >Upload Image</v-btn
            >
            <v-btn raised class="green" v-else dark @click="onClickFile"
              >Update Image</v-btn
            >
            <v-btn
              raised
              class="red"
              dark
              @click="deleteImage"
              v-if="imgUrl_check"
              >Delete Image</v-btn
            >
          </v-col>
          <input
            type="file"
            style="display: none"
            ref="inputFile"
            accept="image/*"
            @change="onFilePicked"
          />
          <v-avatar size="160" class="avatar_color">
            <v-img :src="imgUrl"
              ><v-icon size="150" v-if="!imgUrl" @click="onClickFile"
                >mdi-account</v-icon
              ></v-img
            >
          </v-avatar>
        </v-col>
        <v-col class="d-flex">
          <v-col>
            <v-text-field
              :rules="[required()]"
              color="green"
              outlined
              label="First Name"
              v-model="firstName"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              color="green"
              outlined
              label="Last Name"
              v-model="lastName"
            ></v-text-field>
          </v-col>
        </v-col>
        <v-col>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Birthday date"
                outlined
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              :active-picker.sync="activePicker"
              :max="
                new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                  .toISOString()
                  .substr(0, 10)
              "
              min="1950-01-01"
              @change="save"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col class="d-flex">
          <v-col>
            <vue-tel-input-vuetify
              :rules="[phone.valid]"
              type="number"
              color="green"
              outlined
              :preferred-countries="['id', 'gb', 'ua', 'us']"
              :valid-characters-only="true"
              select-label="Code"
              v-model.trim="phoneNumber"
              append-icon="mdi-chevron-down"
              @input="onInput"
            />
          </v-col>
          <v-col>
            <v-text-field
              color="green"
              outlined
              label="Address"
              v-model="address"
            ></v-text-field>
          </v-col>
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="bio" color="green" outlined>
            <template v-slot:label>
              <div>Bio <small>(optional)</small></div>
            </template>
          </v-textarea>
        </v-col>

        <v-col>
          <v-btn color="green" :disabled="!phone.valid" raised :dark="phone.valid" type="submit">Update</v-btn>
        </v-col>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import VueTelInputVuetify from "../../lib/vue-tel-input-vuetify.vue";
import { required } from "../../utils/validators.js";
import { db, users } from "../../firebase.js";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default {
  data() {
    return {
      user: {},
      firstName: null,
      lastName: null,
      phoneNumber: null,
      address: null,
      dateOfBirth: "",
      bio: null,
      imgUrl: "",
      imgUrl_check: "",
      image: null,
      isLoading: false,
      fileName: "",
      extName: "",
      activePicker: null,
      date: null,
      menu: false,
      phone: {
        number: '',
        valid: false,
        country: undefined,
      },
    };
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },
  components: {
    VueTelInputVuetify,
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
  },
  methods: {
    required,
    save(date) {
      this.$refs.menu.save(date);
    },

    onInput(formattedNumber, { number, valid, country }) {
      this.phone.number = number.international;
      this.phone.valid = valid;
      this.phone.country = country && country.name;
      this.phoneNumber = this.phone.number
    },
    changeRouter() {
      this.$router.push("/profile");
    },
    async deleteImage() {
      this.isLoading = true;
      const storage = getStorage();
      // Create a reference to the file to delete
      const desertRef = ref(storage, this.imgUrl_check);
      // Delete the file
      await deleteObject(desertRef)
        .then(() => {})
        .catch((error) => {
          console.log(error, "err");
        });
      this.imgUrl = "";
      this.image = null;
      this.saveUrlToFireStore("");
      this.isLoading = false;
    },
    async loadData() {
      try {
        this.isLoading = true;
        const id = this.user.userId;
        const docRef = doc(db, "Users", id);
        const snapShot = await getDoc(docRef);
        if (snapShot.exists()) {
          this.firstName = snapShot.data().firstName;
          this.lastName = snapShot.data().lastName;
          this.phoneNumber = snapShot.data().phoneNumber;
          this.address = snapShot.data().address;
          this.date = snapShot.data().dateOfBirth;
          this.bio = snapShot.data().bio;
          this.imgUrl = snapShot.data().imgUrl;
          this.imgUrl_check = snapShot.data().imgUrl;
          this.isLoading = false;
        } else {
          console.log("no doc");
        }
      } catch (err) {
        console.log(err.message, "error");
      }
    },
    async update() {
      try {
        if (this.firstName === "") {
          return;
        }
        this.isLoading = true;

        if (this.image) {
          if (this.imgUrl_check) {
            const storage = getStorage();
            // Create a reference to the file to delete
            const desertRef = ref(storage, this.imgUrl_check);
            // Delete the file
            await deleteObject(desertRef)
              .then(() => {})
              .catch((error) => {
                console.log(error, "err");
              });
          }

          try {
            const metaData = {
              contentType: this.image.type,
            };
            const storage = getStorage();
            const storageRef = ref(storage, "images/" + this.fileName);
            const uploadTask = uploadBytesResumable(
              storageRef,
              this.image,
              metaData
            );
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(progress);
              },
              (error) => {
                switch (error.code) {
                  case "storage/unauthorized":
                    break;
                  case "storage/canceled":
                  case "storage/unknown":
                    break;
                }
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  this.saveUrlToFireStore(downloadURL);
                });
              }
            );
          } catch (err) {
            console.log(err.message, "error");
          }
        } else if (this.imgUrl) {
          this.saveUrlToFireStore(this.imgUrl);
        } else {
          console.log("ok2");
          this.saveUrlToFireStore("");
        }
      } catch (err) {
        console.log(err, "err");
      }
    },
    async saveUrlToFireStore(url) {
      const id = this.user.userId;
      let userRef = doc(users, id);
      await updateDoc(userRef, {
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.phoneNumber,
        address: this.address,
        dateOfBirth: this.date,
        bio: this.bio,
        imgUrl: url,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.user.email,
          phoneNumber: this.phoneNumber,
          address: this.address,
          date: this.date,
          bio: this.bio,
          imgUrl: url,
          userId: this.user.userId,
        })
      );
      let userInfo = {
        firstName: this.firstName,
        lastName: this.lastName,
        imgUrl: url
      };
      this.$store.dispatch("changeInfo", userInfo);
      this.$router.push("/profile");
      this.isLoading = false;
    },
    onClickFile() {
      this.$refs.inputFile.click();
    },
    onFilePicked(event) {
      const files = event.target.files;
      let fileName = files[0].name;
      this.fileName = this.GetFileName(files[0]);
      this.extName = this.GetExtName(files[0]);
      if (fileName.lastIndexOf(".") <= 0) {
        return alert("Please add s valid file!");
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imgUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.image = files[0];
    },
    GetExtName(file) {
      var temp = file.name.split(".");
      var ext = temp.slice(temp.length - 1, temp.length);
      return "." + ext[0];
    },
    GetFileName(file) {
      var temp = file.name.split(".");
      var fname = temp.slice(0, -1).join(".");
      return fname;
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
.profile_btn_flex {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
}
.avatar_color {
  background-color: rgb(198, 198, 198);
}
</style>